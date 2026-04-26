const authStatus = document.getElementById('authStatus');
const genStatus = document.getElementById('genStatus');
const generatorSection = document.getElementById('generator');
const gallery = document.getElementById('gallery');
const creditCount = document.getElementById('creditCount');
const payBox = document.getElementById('payBox');
const freeCreditsText = document.getElementById('freeCreditsText');

const signupBtn = document.getElementById('signupBtn');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const buyCreditsBtn = document.getElementById('buyCreditsBtn');

const emailEl = document.getElementById('email');
const passwordEl = document.getElementById('password');

const generateForm = document.getElementById('generateForm');
const promptEl = document.getElementById('prompt');
const styleEl = document.getElementById('style');
const aspectEl = document.getElementById('aspect');

let currentUser = null;

async function api(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  let data = {};
  try {
    data = await res.json();
  } catch (_err) {
    data = {};
  }

  if (!res.ok) {
    const err = new Error(data.error || 'Request failed');
    err.data = data;
    throw err;
  }

  return data;
}

function setAuthUI(loggedIn) {
  generatorSection.classList.toggle('hidden', !loggedIn);
  logoutBtn.classList.toggle('hidden', !loggedIn);
  signupBtn.classList.toggle('hidden', loggedIn);
  loginBtn.classList.toggle('hidden', loggedIn);
}

function setCredits(value) {
  creditCount.textContent = String(value ?? 0);
  payBox.classList.toggle('hidden', (value ?? 0) > 0);
}

function renderGallery(items = []) {
  gallery.innerHTML = '';

  if (!items.length) {
    gallery.innerHTML = '<p class="status">Your generated wallpapers will appear here.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <a href="${item.imageUrl}" target="_blank" rel="noopener noreferrer">
        <img src="${item.imageUrl}" alt="Generated alien wallpaper" loading="lazy" />
      </a>
      <div class="meta">${new Date(item.createdAt).toLocaleString()} · ${item.style} · ${item.aspect} · ${item.source || 'unknown-source'}</div>
    `;
    fragment.appendChild(card);
  });

  gallery.appendChild(fragment);
}

async function loadConfig() {
  try {
    const data = await api('/api/public/config');
    freeCreditsText.textContent = `Each new user starts with ${data.initialFreeCredits} free credits.`;
  } catch (_err) {
    freeCreditsText.textContent = 'Create an account to start generating.';
  }
}

async function loadMe() {
  try {
    const data = await api('/api/me');
    currentUser = data.user;
    setAuthUI(true);
    setCredits(currentUser.credits);
    renderGallery(data.generations || []);
    authStatus.textContent = `Logged in as ${currentUser.email}`;
  } catch (_err) {
    currentUser = null;
    setAuthUI(false);
    setCredits(0);
    renderGallery([]);
  }
}

signupBtn.addEventListener('click', async () => {
  try {
    authStatus.textContent = 'Creating account...';
    const data = await api('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: emailEl.value.trim(),
        password: passwordEl.value
      })
    });

    currentUser = data.user;
    authStatus.textContent = `Account created: ${currentUser.email}`;
    setAuthUI(true);
    setCredits(currentUser.credits);
    renderGallery([]);
  } catch (err) {
    authStatus.textContent = err.message;
  }
});

loginBtn.addEventListener('click', async () => {
  try {
    authStatus.textContent = 'Logging in...';
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: emailEl.value.trim(),
        password: passwordEl.value
      })
    });

    currentUser = data.user;
    authStatus.textContent = `Welcome back, ${currentUser.email}`;
    await loadMe();
  } catch (err) {
    authStatus.textContent = err.message;
  }
});

logoutBtn.addEventListener('click', async () => {
  try {
    await api('/api/auth/logout', { method: 'POST' });
  } catch (_err) {
    // no-op
  }
  currentUser = null;
  authStatus.textContent = 'Logged out';
  setAuthUI(false);
  setCredits(0);
  renderGallery([]);
});

generateForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!currentUser) {
    genStatus.textContent = 'Please login first.';
    return;
  }

  try {
    genStatus.textContent = 'Generating wallpaper...';
    const data = await api('/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt: promptEl.value.trim(),
        style: styleEl.value,
        aspect: aspectEl.value
      })
    });

    const source = data.generation?.source || '';
    if (source.includes('fallback')) {
      genStatus.textContent =
        'Generated with fallback image source (free mode). Add a paid AI key later for true prompt-accurate outputs.';
    } else {
      genStatus.textContent = 'Generated successfully. Open image to download.';
    }
    setCredits(data.credits);
    await loadMe();
  } catch (err) {
    genStatus.textContent = err.message;
    if (err.data?.checkoutUrl || err.message.toLowerCase().includes('credits')) {
      payBox.classList.remove('hidden');
    }
  }
});

buyCreditsBtn.addEventListener('click', async () => {
  try {
    const data = await api('/api/payments/checkout', { method: 'POST' });
    if (data.checkoutUrl) {
      window.open(data.checkoutUrl, '_blank', 'noopener');
      return;
    }
    genStatus.textContent = 'Checkout is not configured yet.';
  } catch (err) {
    genStatus.textContent = err.message;
  }
});

loadConfig();
loadMe();
