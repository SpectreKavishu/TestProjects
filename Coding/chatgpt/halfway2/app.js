/* Final fixed & enhanced app.js
 - Fix: Find now works (clean, single listener + no overwritten functions)
 - Autocomplete for both inputs (Nominatim) with debounce + clickable suggestions
 - Midpoint reverse geocode
 - Progressive Overpass search (restaurants, cafes, bars, hotels, parks)
 - Filters AC & Parking applied only to final top picks (if requested)
 - Ranking preference: balanced / favor A / favor B (distance-based bias)
 - Top 5 closest results shown, markers use SVG icons
 - Theme toggle, rate limiting, sanitization
*/

const SEARCH_RADII = [5000, 10000, 20000]; // meters
const MAX_RESULTS = 80;
const TOP_N = 5;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

const MAJOR_CITIES = [
  { name: "New Delhi", lat: 28.6139391, lon: 77.2090212 },
  { name: "Mumbai", lat: 19.0759837, lon: 72.8776559 },
  { name: "Bengaluru", lat: 12.9715987, lon: 77.5945627 },
  { name: "Hyderabad", lat: 17.385044, lon: 78.486671 },
  { name: "Chennai", lat: 13.0826802, lon: 80.2707184 },
  { name: "Kolkata", lat: 22.572646, lon: 88.363895 }
];

const CATEGORY_META = {
  restaurant: { badge: 'badge-restaurant', label: 'Restaurant', color:'#fb923c', icon:'#ic-restaurant' },
  cafe:       { badge: 'badge-cafe', label: 'Cafe', color:'#f59e0b', icon:'#ic-cafe' },
  bar:        { badge: 'badge-bar', label: 'Bar', color:'#ef4444', icon:'#ic-bar' },
  hotel:      { badge: 'badge-hotel', label: 'Hotel', color:'#06b6d4', icon:'#ic-hotel' },
  park:       { badge: 'badge-park', label: 'Park', color:'#10b981', icon:'#ic-park' }
};

// DOM
const aInput = document.getElementById('aInput');
const bInput = document.getElementById('bInput');
const aSuggestions = document.getElementById('aSuggestions');
const bSuggestions = document.getElementById('bSuggestions');
const typeSelect = document.getElementById('typeSelect');
const goBtn = document.getElementById('goBtn');
const swapBtn = document.getElementById('swapBtn');
const useMyLocBtn = document.getElementById('useMyLoc');
const resultsGrid = document.getElementById('resultsGrid');
const resultsCount = document.getElementById('resultsCount');
const midplace = document.getElementById('midplace');
const distanceInfo = document.getElementById('distanceInfo');
const radiusInfo = document.getElementById('radiusInfo');
const fallbackNote = document.getElementById('fallbackNote');
const themeToggle = document.getElementById('themeToggle');
const filterAC = document.getElementById('filterAC');
const filterParking = document.getElementById('filterParking');
const rankPref = document.getElementById('rankPref');
const shareBtn = document.getElementById('shareBtn');

let selectedA = null;
let selectedB = null;
let rateTimestamps = [];

// Theme handling
(function initTheme(){
  const saved = localStorage.getItem('mitm_theme') || 'dark';
  document.body.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
})();
themeToggle.addEventListener('click', ()=>{
  const cur = document.body.getAttribute('data-theme') || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', next);
  localStorage.setItem('mitm_theme', next);
  updateThemeIcon(next);
});
function updateThemeIcon(theme){
  themeToggle.innerHTML = theme === 'light'
    ? `<svg width="18" height="18"><use href="#ic-moon"></use></svg>`
    : `<svg width="18" height="18"><use href="#ic-sun"></use></svg>`;
}

// Rate limiter
function allowSearch(){
  const now = Date.now();
  rateTimestamps = rateTimestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if(rateTimestamps.length >= RATE_LIMIT_MAX) return false;
  rateTimestamps.push(now);
  return true;
}

// Map init
const map = L.map('map', { preferCanvas:true }).setView([22.3511148, 78.6677428], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap contributors' }).addTo(map);

let markerA = null, markerB = null, markerMid = null;
let venueMarkers = [];

// Autocomplete (debounced)
let acTimerA = null, acTimerB = null;
aInput.addEventListener('input', () => debouncedAC(aInput, aSuggestions, 'A'));
bInput.addEventListener('input', () => debouncedAC(bInput, bSuggestions, 'B'));
aInput.addEventListener('blur', () => setTimeout(()=> aSuggestions.classList.remove('show'), 180));
bInput.addEventListener('blur', () => setTimeout(()=> bSuggestions.classList.remove('show'), 180));

function sanitizeInput(text){
  if(!text) return '';
  let t = String(text).slice(0, 200);
  t = t.replace(/<|>/g, '');
  t = t.replace(/[\u0000-\u001f\u007f-\u009f]/g, '');
  return t.trim();
}

function debouncedAC(inputEl, dropEl, which){
  if(which === 'A') selectedA = null; else selectedB = null;
  const q = sanitizeInput(inputEl.value);
  if(!q){ dropEl.classList.remove('show'); return; }
  const timerName = which === 'A' ? 'acTimerA' : 'acTimerB';
  if(window[timerName]) clearTimeout(window[timerName]);
  window[timerName] = setTimeout(()=> fetchSuggestions(q, dropEl, which, inputEl), 260);
}

async function fetchSuggestions(q, dropEl, which, inputEl){
  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&countrycodes=IN&q=${encodeURIComponent(q)}`;
  try{
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    if(!res.ok){ dropEl.classList.remove('show'); return; }
    const arr = await res.json();
    renderSuggestions(arr, dropEl);
  } catch(e){
    console.warn('Nominatim error', e);
    dropEl.classList.remove('show');
  }
}

function renderSuggestions(items, dropEl){
  dropEl.innerHTML = '';
  if(!items || items.length === 0){ dropEl.classList.remove('show'); return; }
  items.forEach(it=>{
    if(!it || !it.lat || !it.lon || !it.display_name) return;
    const li = document.createElement('li');
    li.dataset.lat = it.lat;
    li.dataset.lon = it.lon;
    li.dataset.display = it.display_name;
    const title = escapeHtml(it.display_name.split(',')[0]);
    const sub = escapeHtml(it.display_name);
    li.innerHTML = `<div class="s-title">${title}</div><div class="s-sub muted">${sub}</div>`;
    dropEl.appendChild(li);
  });
  dropEl.classList.add('show');
}

function attachSuggestionClicks(listEl, inputEl, which){
  listEl.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if(!li) return;
    const lat = parseFloat(li.dataset.lat), lon = parseFloat(li.dataset.lon), disp = li.dataset.display;
    inputEl.value = disp;
    if(which === 'A') selectedA = { lat, lon, display: disp };
    else selectedB = { lat, lon, display: disp };
    listEl.classList.remove('show');
  });
}
attachSuggestionClicks(aSuggestions, aInput, 'A');
attachSuggestionClicks(bSuggestions, bInput, 'B');

// Swap & use my location
swapBtn.addEventListener('click', ()=> {
  const tmp = aInput.value; aInput.value = bInput.value; bInput.value = tmp;
  const sa = selectedA; selectedA = selectedB; selectedB = sa;
});
useMyLocBtn.addEventListener('click', ()=>{
  if(!navigator.geolocation){ alert('Geolocation not supported'); return; }
  useMyLocBtn.textContent = 'Detecting…';
  navigator.geolocation.getCurrentPosition(async pos=>{
    const lat = pos.coords.latitude, lon = pos.coords.longitude;
    try{
      const display = await reverseGeocode(lat, lon);
      aInput.value = display || `${lat.toFixed(4)},${lon.toFixed(4)}`;
      selectedA = { lat, lon, display };
    } catch(e){
      aInput.value = `${lat.toFixed(4)},${lon.toFixed(4)}`; selectedA = { lat, lon, display: aInput.value };
    } finally { useMyLocBtn.textContent = 'Use my location'; }
  }, err => { console.error(err); alert('Could not get location'); useMyLocBtn.textContent = 'Use my location';});
});

// Share link
shareBtn.addEventListener('click', ()=>{
  const a = encodeURIComponent(aInput.value||''); const b = encodeURIComponent(bInput.value||'');
  const t = encodeURIComponent(typeSelect.value||'');
  const url = `${location.origin}${location.pathname}?a=${a}&b=${b}&t=${t}`;
  navigator.clipboard.writeText(url).then(()=> {
    shareBtn.textContent = 'Copied ✓';
    setTimeout(()=> shareBtn.textContent = 'Share', 1200);
  });
});

// load from URL on start
(function loadFromURL(){
  const p = new URLSearchParams(location.search);
  if(p.get('a')) aInput.value = decodeURIComponent(p.get('a'));
  if(p.get('b')) bInput.value = decodeURIComponent(p.get('b'));
  if(p.get('t')) typeSelect.value = decodeURIComponent(p.get('t'));
})();

// MAIN: Find
goBtn.addEventListener('click', async () => {
  if(!allowSearch()){
    alert(`Rate limit: max ${RATE_LIMIT_MAX} searches / ${RATE_LIMIT_WINDOW_MS/1000}s. Please wait.`);
    return;
  }

  clearAllUI();
  const aText = sanitizeInput(aInput.value);
  const bText = sanitizeInput(bInput.value);
  const prefType = sanitizeInput(typeSelect.value || 'any');
  const wantAC = filterAC.checked;
  const wantParking = filterParking.checked;
  const rankingPref = rankPref.value || 'balanced';

  if(!aText || !bText){ alert('Please enter both locations'); return; }

  try{
    goBtn.disabled = true; goBtn.textContent = 'Searching…';

    // geocode or use selected coords
    const pA = (selectedA && selectedA.display === aText) ? Promise.resolve(selectedA) : geocodeIN(aText);
    const pB = (selectedB && selectedB.display === bText) ? Promise.resolve(selectedB) : geocodeIN(bText);
    const [ga, gb] = await Promise.all([pA, pB]);
    if(!ga || !gb) throw new Error('Could not resolve one or both locations.');

    // place markers
    markerA = L.circleMarker([ga.lat, ga.lon], { radius:8, color:'#3b82f6', weight:2 }).addTo(map).bindPopup(`A: ${escapeHtml(aText)}`);
    markerB = L.circleMarker([gb.lat, gb.lon], { radius:8, color:'#ef4444', weight:2 }).addTo(map).bindPopup(`B: ${escapeHtml(bText)}`);

    // midpoint
    const mid = sphericalMidpoint(ga.lat, ga.lon, gb.lat, gb.lon);
    markerMid = L.circleMarker([mid.lat, mid.lon], { radius:9, color:'#a78bfa', weight:3 }).addTo(map).bindPopup('Midpoint');

    // reverse geocode midpoint
    try{ const name = await reverseGeocode(mid.lat, mid.lon); midplace.textContent = `Midpoint place: ${name}`; } catch(e){ midplace.textContent = 'Midpoint place: —'; }

    const totalKM = haversineKM(ga.lat, ga.lon, gb.lat, gb.lon);
    distanceInfo.textContent = `Total distance: ${totalKM.toFixed(2)} km`;

    // progressive search (no AC/Parking filters applied here — those are applied at final stage)
    let found = [], usedRadius = 0;
    for(const r of SEARCH_RADII){
      const els = await overpassQuery(mid.lat, mid.lon, prefType, r);
      const normalized = normalizeElements(els);
      const enriched = normalized.map(it => { it.category = detectCategory(it.tags); return it; }).filter(it => it.category && isGoodName(it.name));
      if(enriched.length > 0){ found = enriched; usedRadius = r; break; }
    }

    // fallback to nearest major city if none found
    if(found.length === 0){
      const nearest = findNearestCity(mid.lat, mid.lon);
      const els = await overpassQuery(nearest.lat, nearest.lon, prefType, 20000);
      const normalized = normalizeElements(els);
      const enriched = normalized.map(it => { it.category = detectCategory(it.tags); return it; }).filter(it => it.category && isGoodName(it.name));
      found = enriched;
      usedRadius = 20000;
      fallbackNote.textContent = `No venues near the exact midpoint — showing results near ${nearest.name}.`;
      fallbackNote.classList.remove('hidden');
    } else {
      fallbackNote.classList.add('hidden');
    }

    radiusInfo.textContent = `Radius used: ${(usedRadius/1000).toFixed(1)} km`;

    // compute distances to midpoint and to A/B
    found.forEach(v => {
      v.distance = haversineKM(mid.lat, mid.lon, v.lat, v.lon);
      v.distToA = haversineKM(ga.lat, ga.lon, v.lat, v.lon);
      v.distToB = haversineKM(gb.lat, gb.lon, v.lat, v.lon);
    });

    // Apply AC / Parking filters ONLY at final selection stage (per your request)
    let filteredFinal = found.slice();
    if(wantAC){
      filteredFinal = filteredFinal.filter(v => {
        const t = v.tags || {};
        return t.air_conditioning === 'yes' || t['air_conditioning'] === 'yes' || t.climate_control === 'yes' || t.indoor === 'yes';
      });
    }
    if(wantParking){
      filteredFinal = filteredFinal.filter(v => {
        const t = v.tags || {};
        // accept explicit parking tags (yes/number/structured) - OSM is inconsistent
        return ('parking' in t && t.parking !== 'no') || ('parking:lane' in t) || ('parking:surface' in t);
      });
    }

    // If user requested filters but none matched, fall back to unfiltered 'found' and notify user
    if((wantAC || wantParking) && filteredFinal.length === 0){
      fallbackNote.textContent = `No venues with selected facilities (AC/Parking) near midpoint; showing best matches without those filters.`;
      fallbackNote.classList.remove('hidden');
      filteredFinal = found.slice();
    } else {
      // if filters matched or user didn't ask, keep as is
      if(!fallbackNote.classList.contains('hidden') && !(wantAC || wantParking)) fallbackNote.classList.add('hidden');
    }

    // Ranking with optional bias
    let bias = 0;
    if(rankPref.value === 'favorA') bias = 0.6;
    if(rankPref.value === 'favorB') bias = -0.6;
    filteredFinal.forEach(v => v.score = v.distance + bias * (v.distToA - v.distToB));
    filteredFinal.sort((a,b) => a.score - b.score);

    const top5 = filteredFinal.slice(0, TOP_N);
    resultsCount.textContent = String(top5.length);
    renderResults(top5, mid, ga);

    // fit bounds
    const pts = [[ga.lat,ga.lon],[gb.lat,gb.lon],[mid.lat,mid.lon], ...top5.map(v=>[v.lat,v.lon])];
    map.fitBounds(L.latLngBounds(pts).pad(0.25));
  } catch(err){
    console.error(err);
    alert(err.message || 'Search failed. Try again.');
  } finally {
    goBtn.disabled = false;
    goBtn.textContent = 'Find';
  }
});

// ---------- Overpass ----------
function buildOverpass(lat, lon, type, radius){
  const blocks = [];
  if(type === 'restaurant'){
    blocks.push(`node(around:${radius},${lat},${lon})[amenity~"^(restaurant|fast_food|food_court)$"];`);
    blocks.push(`way(around:${radius},${lat},${lon})[amenity~"^(restaurant|fast_food|food_court)$"];`);
    blocks.push(`relation(around:${radius},${lat},${lon})[amenity~"^(restaurant|fast_food|food_court)$"];`);
  } else if(type === 'cafe'){
    blocks.push(`node(around:${radius},${lat},${lon})[amenity~"^(cafe|tea_room)$"];`);
    blocks.push(`way(around:${radius},${lat},${lon})[amenity~"^(cafe|tea_room)$"];`);
    blocks.push(`relation(around:${radius},${lat},${lon})[amenity~"^(cafe|tea_room)$"];`);
  } else if(type === 'bar'){
    blocks.push(`node(around:${radius},${lat},${lon})[amenity~"^(bar|pub)$"];`);
    blocks.push(`way(around:${radius},${lat},${lon})[amenity~"^(bar|pub)$"];`);
    blocks.push(`relation(around:${radius},${lat},${lon})[amenity~"^(bar|pub)$"];`);
  } else if(type === 'hotel'){
    blocks.push(`node(around:${radius},${lat},${lon})[tourism~"^(hotel|motel|guest_house)$"];`);
    blocks.push(`way(around:${radius},${lat},${lon})[tourism~"^(hotel|motel|guest_house)$"];`);
    blocks.push(`relation(around:${radius},${lat},${lon})[tourism~"^(hotel|motel|guest_house)$"];`);
  } else if(type === 'park'){
    blocks.push(`node(around:${radius},${lat},${lon})[leisure~"^(park|garden)$"];`);
    blocks.push(`way(around:${radius},${lat},${lon})[leisure~"^(park|garden)$"];`);
    blocks.push(`relation(around:${radius},${lat},${lon})[leisure~"^(park|garden)$"];`);
  } else {
    // all five categories
    blocks.push(`node(around:${radius},${lat},${lon})[amenity~"^(restaurant|fast_food|food_court|cafe|tea_room|bar|pub)$"];`);
    blocks.push(`node(around:${radius},${lat},${lon})[tourism~"^(hotel)$"];`);
    blocks.push(`node(around:${radius},${lat},${lon})[leisure~"^(park|garden)$"];`);

    ['way','relation'].forEach(t => {
      blocks.push(`${t}(around:${radius},${lat},${lon})[amenity~"^(restaurant|fast_food|food_court|cafe|tea_room|bar|pub)$"];`);
      blocks.push(`${t}(around:${radius},${lat},${lon})[tourism~"^(hotel)$"];`);
      blocks.push(`${t}(around:${radius},${lat},${lon})[leisure~"^(park|garden)$"];`);
    });
  }
  return `[out:json][timeout:25];(${blocks.join('\n')});out center ${MAX_RESULTS};`;
}

async function overpassQuery(lat, lon, type, radius){
  const q = buildOverpass(lat, lon, type, radius);
  try{
    const res = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: q });
    if(!res.ok) throw new Error('Overpass failed');
    const json = await res.json();
    return json.elements || [];
  } catch(e){
    // fallback
    try{
      const res2 = await fetch('https://overpass.kumi.systems/api/interpreter', { method:'POST', body: q });
      if(!res2.ok) return [];
      const json2 = await res2.json();
      return json2.elements || [];
    } catch(e2){
      console.warn('Overpass endpoints failed', e2);
      return [];
    }
  }
}

// ---------- normalize & heuristics ----------
function normalizeElements(elements){
  return (elements||[]).map(el=>{
    let lat=null, lon=null;
    if(el.type === 'node'){ lat = el.lat; lon = el.lon; }
    else if(el.center){ lat = el.center.lat; lon = el.center.lon; }
    else if(el.bounds){ lat = (el.bounds.minlat + el.bounds.maxlat)/2; lon = (el.bounds.minlon + el.bounds.maxlon)/2; }
    if(lat == null) return null;
    return { id: `${el.type}/${el.id}`, lat, lon, name: el.tags?.name || '', tags: el.tags || {} };
  }).filter(Boolean);
}

function isGoodName(name){
  if(!name) return false;
  const n = name.trim();
  if(n.length < 2) return false;
  if(/unnamed|unknown|km|mile|residential|service road/i.test(n)) return false;
  return true;
}

function detectCategory(tags){
  if(!tags) return null;
  const amen = (tags.amenity||'').toLowerCase();
  if(/restaurant|fast_food|food_court/.test(amen)) return 'restaurant';
  if(/cafe|tea_room/.test(amen)) return 'cafe';
  if(/bar|pub/.test(amen)) return 'bar';
  const tour = (tags.tourism||'').toLowerCase();
  if(/hotel|motel|guest_house/.test(tour)) return 'hotel';
  const leis = (tags.leisure||'').toLowerCase();
  if(/park|garden/.test(leis)) return 'park';
  return null;
}

function findNearestCity(lat, lon){
  let best = null, dmin = Infinity;
  for(const c of MAJOR_CITIES){
    const d = haversineKM(lat, lon, c.lat, c.lon);
    if(d < dmin){ dmin = d; best = c; }
  }
  return best;
}

// ---------- render results + markers (with svg icons) ----------
function renderResults(list, mid, aCoords){
  // clear previous
  venueMarkers.forEach(m => map.removeLayer(m));
  venueMarkers = [];
  resultsGrid.innerHTML = '';

  list.forEach(v => {
    const cat = v.category || detectCategory(v.tags) || 'restaurant';
    const meta = CATEGORY_META[cat] || { badge:'', label:cat, color:'#60a5fa', icon:'#ic-restaurant' };

    // marker icon as divIcon with inline SVG <use>
    const svgHtml = `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><use href="${meta.icon}"></use></svg>`;
    const iconHtml = `<div class="custom-marker" style="background:${meta.color};">${svgHtml}</div>`;
    const icon = L.divIcon({ html: iconHtml, className: '', iconSize: [36,36], iconAnchor: [18,36] });

    const marker = L.marker([v.lat, v.lon], { icon }).addTo(map)
      .bindPopup(`<b>${escapeHtml(v.name)}</b><br>${escapeHtml(meta.label)} • ${v.distance.toFixed(2)} km`);
    venueMarkers.push(marker);

    // card
    const card = document.createElement('div'); card.className = 'card';
    const h = document.createElement('h3');
    h.innerHTML = `<svg width="18" height="18"><use href="${meta.icon}"></use></svg> ${escapeHtml(v.name)}`;
    card.appendChild(h);

    const metaDiv = document.createElement('div'); metaDiv.className = 'meta';
    metaDiv.textContent = `${meta.label} • ${v.distance.toFixed(2)} km from midpoint`;
    card.appendChild(metaDiv);

    const actions = document.createElement('div'); actions.className = 'actions';
    const visitBtn = document.createElement('button'); visitBtn.className='btn-visit'; visitBtn.textContent = 'Get Directions';
    const focusBtn = document.createElement('button'); focusBtn.className='btn-focus'; focusBtn.textContent = 'Focus';
    const spacer = document.createElement('span'); spacer.style.flex='1';
    const badge = document.createElement('span'); badge.className = `category-badge ${meta.badge}`; badge.textContent = meta.label;
    actions.appendChild(visitBtn); actions.appendChild(focusBtn); actions.appendChild(spacer); actions.appendChild(badge);
    card.appendChild(actions);

    resultsGrid.appendChild(card);

    focusBtn.addEventListener('click', ()=>{ map.setView([v.lat, v.lon], 16); marker.openPopup(); });
    visitBtn.addEventListener('click', ()=>{
      if(aCoords){ const origin = `${aCoords.lat},${aCoords.lon}`; const dest = `${v.lat},${v.lon}`; window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`, '_blank'); }
      else { window.open(`https://www.google.com/maps/search/?api=1&query=${v.lat},${v.lon}`, '_blank'); }
    });
  });
}

// ---------- geo helpers ----------
function haversineKM(lat1, lon1, lat2, lon2){
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI/180;
  const dLon = (lon2 - lon1) * Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
function sphericalMidpoint(lat1, lon1, lat2, lon2){
  const toRad = d => d*Math.PI/180, toDeg = r => r*180/Math.PI;
  const φ1 = toRad(lat1), λ1 = toRad(lon1), φ2 = toRad(lat2), λ2 = toRad(lon2);
  const Δλ = λ2 - λ1;
  const Bx = Math.cos(φ2) * Math.cos(Δλ);
  const By = Math.cos(φ2) * Math.sin(Δλ);
  const φm = Math.atan2(Math.sin(φ1) + Math.sin(φ2), Math.sqrt((Math.cos(φ1) + Bx)**2 + By**2));
  const λm = λ1 + Math.atan2(By, Math.cos(φ1) + Bx);
  const lon = ((toDeg(λm) + 540) % 360) - 180;
  return { lat: toDeg(φm), lon };
}

// ---------- Nominatim helpers ----------
async function geocodeIN(q){
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=IN&q=${encodeURIComponent(q)}`;
  try{
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    if(!res.ok) return null;
    const arr = await res.json();
    if(!arr || !arr[0]) return null;
    return { lat: parseFloat(arr[0].lat), lon: parseFloat(arr[0].lon), display: arr[0].display_name };
  } catch(e){ console.warn('geocode error', e); return null; }
}
async function reverseGeocode(lat, lon){
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
  if(!res.ok) throw new Error('Reverse geocode failed');
  const j = await res.json();
  return j.display_name;
}

// ---------- utils ----------
function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function clearAllUI(){
  if(markerA) map.removeLayer(markerA);
  if(markerB) map.removeLayer(markerB);
  if(markerMid) map.removeLayer(markerMid);
  venueMarkers.forEach(m => map.removeLayer(m)); venueMarkers = [];
  resultsGrid.innerHTML = '';
  resultsCount.textContent = '0';
  midplace.textContent = 'Midpoint place: —';
  distanceInfo.textContent = 'Total distance: —';
  radiusInfo.textContent = 'Radius used: —';
  fallbackNote.classList.add('hidden');
}
function sanitizeInputPublic(s){ return sanitizeInput(s); } // exposed if needed

// expose small helpers to console for debugging if needed
window.mitm = { sanitizeInput: sanitizeInputPublic };

// done