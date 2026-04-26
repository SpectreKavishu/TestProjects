const fs = require('fs');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'replace_me_in_production';
const INITIAL_FREE_CREDITS = Number(process.env.INITIAL_FREE_CREDITS || 5);
const STRIPE_PAYMENT_LINK = process.env.STRIPE_PAYMENT_LINK || '';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const projectRoot = path.join(__dirname, '..');
const dataPath = path.join(projectRoot, 'data', 'store.json');

ensureDataFile();

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(express.static(path.join(projectRoot, 'public')));

function ensureDataFile() {
  const dir = path.dirname(dataPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (!fs.existsSync(dataPath)) {
    const empty = {
      users: [],
      generations: [],
      payments: []
    };
    fs.writeFileSync(dataPath, JSON.stringify(empty, null, 2));
  }
}

function readDb() {
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

function writeDb(db) {
  fs.writeFileSync(dataPath, JSON.stringify(db, null, 2));
}

function authMiddleware(req, res, next) {
  const token = req.cookies.token || (req.headers.authorization || '').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid auth token' });
  }
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    credits: user.credits,
    createdAt: user.createdAt
  };
}

function issueAuthCookie(res, userId) {
  const token = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '14d' });
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: IS_PRODUCTION,
    maxAge: 14 * 24 * 60 * 60 * 1000
  });
}

function aspectToSize(aspect) {
  if (aspect === '9:16') return { width: 1080, height: 1920 };
  if (aspect === '1:1') return { width: 1440, height: 1440 };
  return { width: 1920, height: 1080 };
}

function buildPrompt(basePrompt, style) {
  const styleMap = {
    cinematic: 'cinematic lighting, photorealistic, epic atmosphere, ultra-detailed, 8k, realistic textures',
    nocturnal: 'night scene, realistic stars, glowing bioluminescent flora, photorealistic, atmospheric haze',
    sunrise: 'sunrise lighting, volumetric clouds, realistic terrain details, cinematic depth, photorealistic',
    storm: 'electrical storm, dramatic weather, realistic alien geology, moody cinematic lighting, photorealistic'
  };

  const styleBlock = styleMap[style] || styleMap.cinematic;

  return [
    'A hyper-realistic desktop wallpaper of an alien planet landscape.',
    basePrompt,
    styleBlock,
    'No text, no logos, no watermark, no humans, clean composition suitable for wallpaper.'
  ].join(' ');
}

function buildImageUrl(prompt, aspect) {
  const { width, height } = aspectToSize(aspect);
  const seed = Math.floor(Math.random() * 1_000_000_000);
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&model=flux&seed=${seed}&nologo=true`;
}

function buildPicsumFallback(aspect) {
  const { width, height } = aspectToSize(aspect);
  const seed = Math.floor(Math.random() * 1_000_000_000);
  return `https://picsum.photos/seed/space-${seed}/${width}/${height}`;
}

async function getNasaFallbackUrl(prompt) {
  const search = encodeURIComponent(`${prompt} planet space`);
  const url = `https://images-api.nasa.gov/search?q=${search}&media_type=image`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const items = data?.collection?.items || [];
    for (const item of items) {
      const href = item?.links?.[0]?.href;
      if (href && href.startsWith('http')) {
        return href;
      }
    }
    return null;
  } catch (_err) {
    return null;
  }
}

async function resolveImageUrl(userPrompt, fullPrompt, aspect) {
  const primary = buildImageUrl(fullPrompt, aspect);

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(primary, { method: 'GET', signal: controller.signal }).finally(() =>
      clearTimeout(timer)
    );

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.startsWith('image/')) {
      return { imageUrl: primary, source: 'pollinations' };
    }
  } catch (_err) {
    // Ignore and continue to fallbacks.
  }

  const nasaUrl = await getNasaFallbackUrl(userPrompt);
  if (nasaUrl) {
    return { imageUrl: nasaUrl, source: 'nasa-fallback' };
  }

  return { imageUrl: buildPicsumFallback(aspect), source: 'picsum-fallback' };
}

app.post('/api/auth/signup', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const db = readDb();
  const exists = db.users.some((u) => u.email === email);
  if (exists) {
    return res.status(409).json({ error: 'Account already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    email,
    passwordHash,
    credits: INITIAL_FREE_CREDITS,
    createdAt: new Date().toISOString()
  };

  db.users.push(user);
  writeDb(db);
  issueAuthCookie(res, user.id);

  return res.status(201).json({ user: publicUser(user) });
});

app.post('/api/auth/login', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  const db = readDb();
  const user = db.users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  issueAuthCookie(res, user.id);
  return res.json({ user: publicUser(user) });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

app.get('/api/me', authMiddleware, (req, res) => {
  const db = readDb();
  const user = db.users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const recent = db.generations
    .filter((g) => g.userId === user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 24);

  return res.json({ user: publicUser(user), generations: recent });
});

app.post('/api/generate', authMiddleware, async (req, res) => {
  const userPrompt = (req.body.prompt || '').trim();
  const style = (req.body.style || 'cinematic').trim();
  const aspect = (req.body.aspect || '16:9').trim();

  if (!userPrompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const db = readDb();
  const user = db.users.find((u) => u.id === req.userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.credits <= 0) {
    return res.status(402).json({
      error: 'No credits left. Buy more to keep generating.',
      checkoutUrl: STRIPE_PAYMENT_LINK || null
    });
  }

  const fullPrompt = buildPrompt(userPrompt, style);
  const { imageUrl, source } = await resolveImageUrl(userPrompt, fullPrompt, aspect);

  user.credits -= 1;

  const generation = {
    id: uuidv4(),
    userId: user.id,
    prompt: userPrompt,
    fullPrompt,
    style,
    aspect,
    source,
    imageUrl,
    createdAt: new Date().toISOString()
  };

  db.generations.push(generation);
  writeDb(db);

  return res.status(201).json({
    generation,
    credits: user.credits
  });
});

app.post('/api/payments/checkout', authMiddleware, (req, res) => {
  if (!STRIPE_PAYMENT_LINK) {
    return res.status(400).json({
      error: 'Stripe payment link is not set. Add STRIPE_PAYMENT_LINK in .env.',
      setupRequired: true
    });
  }

  return res.json({ checkoutUrl: STRIPE_PAYMENT_LINK });
});

app.post('/api/payments/webhook/dev-credit', (req, res) => {
  const secret = req.headers['x-dev-secret'];
  if (!secret || secret !== process.env.DEV_WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized webhook' });
  }

  const { email, credits } = req.body;
  const db = readDb();
  const user = db.users.find((u) => u.email === (email || '').toLowerCase());

  if (!user) return res.status(404).json({ error: 'User not found' });

  const add = Number(credits || 0);
  if (!add || add < 1) return res.status(400).json({ error: 'Invalid credits' });

  user.credits += add;
  db.payments.push({
    id: uuidv4(),
    userId: user.id,
    credits: add,
    source: 'dev-webhook',
    createdAt: new Date().toISOString()
  });
  writeDb(db);

  return res.json({ ok: true, credits: user.credits });
});

app.get('/api/public/config', (_req, res) => {
  res.json({
    initialFreeCredits: INITIAL_FREE_CREDITS,
    hasCheckout: Boolean(STRIPE_PAYMENT_LINK)
  });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(projectRoot, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Alien Wallpaper Studio running on http://localhost:${PORT}`);
});
