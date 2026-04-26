/* Final polished version:
 - Autocomplete suggestions (Nominatim) for A and B
 - Reverse-geocode midpoint name
 - Progressive Overpass search for restaurants/cafes/bars/hotels/parks
 - Return top-5 closest venues (sorted)
 - Category SVG icons + colored badges + colored markers
 - Get Directions button uses Google Maps (origin A if available)
 - Fallback to nearest major city if midpoint sparse
*/

// ---------- Config ----------
const SEARCH_RADII = [5000, 10000, 20000]; // meters
const MAX_RESULTS = 30; // cap we fetch; we'll display top 5
const MAJOR_CITIES = [
  { name: "New Delhi", lat: 28.6139391, lon: 77.2090212 },
  { name: "Mumbai", lat: 19.0759837, lon: 72.8776559 },
  { name: "Bengaluru", lat: 12.9715987, lon: 77.5945627 },
  { name: "Hyderabad", lat: 17.385044, lon: 78.486671 },
  { name: "Chennai", lat: 13.0826802, lon: 80.2707184 },
  { name: "Kolkata", lat: 22.572646, lon: 88.363895 }
];

// category meta
const CATEGORY_META = {
  restaurant: { badge: 'badge-restaurant', label: 'Restaurant', color:'#fb923c', icon:'#ic-restaurant' },
  cafe:       { badge: 'badge-cafe', label: 'Cafe', color:'#f59e0b', icon:'#ic-cafe' },
  bar:        { badge: 'badge-bar', label: 'Bar', color:'#ef4444', icon:'#ic-bar' },
  hotel:      { badge: 'badge-hotel', label: 'Hotel', color:'#06b6d4', icon:'#ic-hotel' },
  park:       { badge: 'badge-park', label: 'Park', color:'#10b981', icon:'#ic-park' }
};

// ---------- DOM ----------
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
const shareBtn = document.getElementById('shareBtn');

// store selected coords when user picks a suggestion
let selectedA = null; // {lat, lon, display}
let selectedB = null;

// ---------- Map ----------
const map = L.map('map', { preferCanvas:true }).setView([22.3511148, 78.6677428], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let markerA = null, markerB = null, markerMid = null;
let venueMarkers = [];

// ---------- Autocomplete (Nominatim suggestions) ----------
let acTimerA = null, acTimerB = null;
aInput.addEventListener('input', () => handleAutocomplete(aInput, aSuggestions, 'A'));
bInput.addEventListener('input', () => handleAutocomplete(bInput, bSuggestions, 'B'));

aInput.addEventListener('blur', () => setTimeout(()=> aSuggestions.classList.remove('show'), 180));
bInput.addEventListener('blur', () => setTimeout(()=> bSuggestions.classList.remove('show'), 180));

function handleAutocomplete(inputEl, dropEl, which){
  // clear selection if user types after selecting
  if(which === 'A') selectedA = null;
  else selectedB = null;

  const q = inputEl.value.trim();
  if(!q){ dropEl.classList.remove('show'); return; }

  // debounce
  const timerName = which === 'A' ? 'acTimerA' : 'acTimerB';
  if(window[timerName]) clearTimeout(window[timerName]);
  window[timerName] = setTimeout(async ()=>{
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&countrycodes=IN&q=${encodeURIComponent(q)}`;
    try{
      const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
      const arr = await res.json();
      renderSuggestions(arr, dropEl, which, inputEl);
    } catch(e){
      console.warn('Nominatim fail', e);
      dropEl.classList.remove('show');
    }
  }, 300);
}

function renderSuggestions(items, dropEl, which, inputEl){
  dropEl.innerHTML = '';
  if(!items || items.length === 0){ dropEl.classList.remove('show'); return; }
  items.forEach(it=>{
    const li = document.createElement('li');
    li.innerHTML = `<div class="s-title">${escapeHtml(it.display_name.split(',')[0])}</div>
                    <div class="s-sub muted">${escapeHtml(it.display_name)}</div>`;
    li.addEventListener('click', ()=>{
      inputEl.value = it.display_name;
      if(which === 'A') selectedA = { lat: parseFloat(it.lat), lon: parseFloat(it.lon), display: it.display_name };
      else selectedB = { lat: parseFloat(it.lat), lon: parseFloat(it.lon), display: it.display_name };
      dropEl.classList.remove('show');
    });
    dropEl.appendChild(li);
  });
  dropEl.classList.add('show');
}

// ---------- swap & my location ----------
swapBtn.addEventListener('click', ()=>{
  const ta = aInput.value, tb = bInput.value;
  aInput.value = tb; bInput.value = ta;
  const sa = selectedA; selectedA = selectedB; selectedB = sa;
});

useMyLocBtn.addEventListener('click', ()=>{
  if(!navigator.geolocation){ alert('Geolocation not supported'); return; }
  useMyLocBtn.textContent = 'Detecting…';
  navigator.geolocation.getCurrentPosition(async pos=>{
    const lat = pos.coords.latitude, lon = pos.coords.longitude;
    const display = await reverseGeocode(lat, lon);
    aInput.value = display || `${lat.toFixed(4)},${lon.toFixed(4)}`;
    selectedA = { lat, lon, display };
    useMyLocBtn.textContent = 'Use my location';
  }, err=>{
    console.error(err); alert('Could not get your location'); useMyLocBtn.textContent = 'Use my location';
  });
});

// share link
shareBtn.addEventListener('click', ()=>{
  const a = encodeURIComponent(aInput.value||''); const b = encodeURIComponent(bInput.value||'');
  const t = encodeURIComponent(typeSelect.value||'');
  const url = `${location.origin}${location.pathname}?a=${a}&b=${b}&t=${t}`;
  navigator.clipboard.writeText(url).then(()=> {
    shareBtn.textContent = 'Copied ✓';
    setTimeout(()=> shareBtn.textContent = 'Share', 1300);
  });
});

// load from url
(function initFromURL(){
  const p = new URLSearchParams(location.search);
  if(p.get('a')) aInput.value = decodeURIComponent(p.get('a'));
  if(p.get('b')) bInput.value = decodeURIComponent(p.get('b'));
  if(p.get('t')) typeSelect.value = decodeURIComponent(p.get('t'));
})();

// ---------- Search flow ----------
goBtn.addEventListener('click', async ()=>{
  clearAll();
  const aText = aInput.value.trim(), bText = bInput.value.trim();
  const pref = typeSelect.value || 'any';
  if(!aText || !bText){ alert('Please enter both locations'); return; }

  try{
    goBtn.disabled = true; goBtn.textContent = 'Searching…';

    // geocode if not selected from suggestions
    const geocodePromises = [];
    if(selectedA && selectedA.display === aText) geocodePromises.push(Promise.resolve(selectedA));
    else geocodePromises.push(geocodeIN(aText));
    if(selectedB && selectedB.display === bText) geocodePromises.push(Promise.resolve(selectedB));
    else geocodePromises.push(geocodeIN(bText));

    const [ga, gb] = await Promise.all(geocodePromises);
    if(!ga || !gb) throw new Error('Could not resolve one or both locations.');

    // place A/B markers
    markerA = L.circleMarker([ga.lat, ga.lon], { radius:8, color:'#3b82f6', weight:2 }).addTo(map).bindPopup(`A: ${escapeHtml(aText)}`);
    markerB = L.circleMarker([gb.lat, gb.lon], { radius:8, color:'#ef4444', weight:2 }).addTo(map).bindPopup(`B: ${escapeHtml(bText)}`);

    // midpoint (spherical)
    const mid = sphericalMidpoint(ga.lat, ga.lon, gb.lat, gb.lon);
    markerMid = L.circleMarker([mid.lat, mid.lon], { radius:9, color:'#a78bfa', weight:3 }).addTo(map).bindPopup('Midpoint');

    // reverse geocode midpoint for place/city
    try {
      const midPlace = await reverseGeocode(mid.lat, mid.lon);
      midplace.textContent = `Midpoint place: ${midPlace}`;
    } catch (_) { midplace.textContent = 'Midpoint place: —'; }

    // total distance
    const totalKM = haversineKM(ga.lat, ga.lon, gb.lat, gb.lon);
    distanceInfo.textContent = `Total distance: ${totalKM.toFixed(2)} km`;

    // progressive Overpass search
    let found = [], usedRadius = 0;
    for(const r of SEARCH_RADII){
      const els = await overpassQuery(mid.lat, mid.lon, pref, r);
      const norm = normalizeElements(els);
      const filtered = norm.map(it => {
        it.category = detectCategory(it.tags);
        return it;
      }).filter(it => it.category && isGoodName(it.name));
      if(filtered.length > 0){
        found = filtered;
        usedRadius = r;
        break;
      }
    }

    // fallback to nearest major city if nothing found
    if(found.length === 0){
      const nearest = findNearestCity(mid.lat, mid.lon);
      const els = await overpassQuery(nearest.lat, nearest.lon, pref, 20000);
      const norm = normalizeElements(els);
      const filtered = norm.map(it => { it.category = detectCategory(it.tags); return it; }).filter(it => it.category && isGoodName(it.name));
      found = filtered;
      usedRadius = 20000;
      fallbackNote.textContent = `No places near midpoint; showing results near ${nearest.name}`;
      fallbackNote.classList.remove('hidden');
    } else {
      fallbackNote.classList.add('hidden');
    }

    radiusInfo.textContent = `Radius used: ${(usedRadius/1000).toFixed(1)} km`;

    // compute distance from midpoint and sort ascending
    found.forEach(v => v.distance = haversineKM(mid.lat, mid.lon, v.lat, v.lon));
    found.sort((a,b)=> a.distance - b.distance);

    // show top 5 closest
    const top5 = found.slice(0,5);
    renderResults(top5, mid, ga);
    resultsCount.textContent = String(top5.length);

    // fit map bounds to include A,B,mid and top markers
    const pts = [[ga.lat,ga.lon],[gb.lat,gb.lon],[mid.lat,mid.lon], ...top5.map(v=>[v.lat,v.lon])];
    map.fitBounds(L.latLngBounds(pts).pad(0.25));
  } catch(err){
    console.error(err);
    alert(err.message || 'Search failed');
  } finally {
    goBtn.disabled = false; goBtn.textContent = 'Find';
  }
});

// ---------- Nominatim geocode / reverse ----------
async function geocodeIN(q){
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=IN&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  if(!res.ok) return null;
  const arr = await res.json();
  if(!arr || !arr[0]) return null;
  return { lat: parseFloat(arr[0].lat), lon: parseFloat(arr[0].lon), display: arr[0].display_name };
}
async function reverseGeocode(lat, lon){
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  const res = await fetch(url);
  if(!res.ok) throw new Error('Reverse geocode failed');
  const j = await res.json();
  return j.display_name;
}

// ---------- Overpass query (focused tags) ----------
function buildOverpass(midLat, midLon, type, radius){
  const blocks = [];
  if(type === 'restaurant'){
    blocks.push(`node(around:${radius},${midLat},${midLon})[amenity~"^(restaurant|fast_food|food_court)$"];`);
    blocks.push(`way(around:${radius},${midLat},${midLon})[amenity~"^(restaurant|fast_food|food_court)$"];`);
    blocks.push(`relation(around:${radius},${midLat},${midLon})[amenity~"^(restaurant|fast_food|food_court)$"];`);
  } else if(type === 'cafe'){
    blocks.push(`node(around:${radius},${midLat},${midLon})[amenity~"^(cafe|tea_room)$"];`);
    blocks.push(`way(around:${radius},${midLat},${midLon})[amenity~"^(cafe|tea_room)$"];`);
    blocks.push(`relation(around:${radius},${midLat},${midLon})[amenity~"^(cafe|tea_room)$"];`);
  } else if(type === 'bar'){
    blocks.push(`node(around:${radius},${midLat},${midLon})[amenity~"^(bar|pub)$"];`);
    blocks.push(`way(around:${radius},${midLat},${midLon})[amenity~"^(bar|pub)$"];`);
    blocks.push(`relation(around:${radius},${midLat},${midLon})[amenity~"^(bar|pub)$"];`);
  } else if(type === 'hotel'){
    blocks.push(`node(around:${radius},${midLat},${midLon})[tourism~"^(hotel|motel|guest_house)$"];`);
    blocks.push(`way(around:${radius},${midLat},${midLon})[tourism~"^(hotel|motel|guest_house)$"];`);
    blocks.push(`relation(around:${radius},${midLat},${midLon})[tourism~"^(hotel|motel|guest_house)$"];`);
  } else if(type === 'park'){
    blocks.push(`node(around:${radius},${midLat},${midLon})[leisure~"^(park|garden)$"];`);
    blocks.push(`way(around:${radius},${midLat},${midLon})[leisure~"^(park|garden)$"];`);
    blocks.push(`relation(around:${radius},${midLat},${midLon})[leisure~"^(park|garden)$"];`);
  } else {
    // any of the five categories
    blocks.push(`node(around:${radius},${midLat},${midLon})[amenity~"^(restaurant|fast_food|food_court|cafe|tea_room|bar|pub)$"];`);
    blocks.push(`node(around:${radius},${midLat},${midLon})[tourism~"^(hotel)$"];`);
    blocks.push(`node(around:${radius},${midLat},${midLon})[leisure~"^(park|garden)$"];`);

    blocks.push(`way(around:${radius},${midLat},${midLon})[amenity~"^(restaurant|fast_food|food_court|cafe|tea_room|bar|pub)$"];`);
    blocks.push(`way(around:${radius},${midLat},${midLon})[tourism~"^(hotel)$"];`);
    blocks.push(`way(around:${radius},${midLat},${midLon})[leisure~"^(park|garden)$"];`);

    blocks.push(`relation(around:${radius},${midLat},${midLon})[amenity~"^(restaurant|fast_food|food_court|cafe|tea_room|bar|pub)$"];`);
    blocks.push(`relation(around:${radius},${midLat},${midLon})[tourism~"^(hotel)$"];`);
    blocks.push(`relation(around:${radius},${midLat},${midLon})[leisure~"^(park|garden)$"];`);
  }

  return `[out:json][timeout:25];(${blocks.join('\n')});out center ${MAX_RESULTS};`;
}

async function overpassQuery(lat, lon, type, radius){
  const q = buildOverpass(lat, lon, type, radius);
  try{
    const res = await fetch('https://overpass-api.de/api/interpreter', { method:'POST', body: q });
    if(!res.ok) throw new Error('Overpass failed');
    const data = await res.json();
    return data.elements || [];
  }catch(e){
    try{
      const res2 = await fetch('https://overpass.kumi.systems/api/interpreter', { method:'POST', body: q });
      if(!res2.ok) return [];
      const data2 = await res2.json();
      return data2.elements || [];
    }catch(e2){
      console.warn('All Overpass endpoints failed', e2);
      return [];
    }
  }
}

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

// ---------- heuristics ----------
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
  let best=null, dmin=1e9;
  for(const c of MAJOR_CITIES){
    const d = haversineKM(lat, lon, c.lat, c.lon);
    if(d < dmin){ dmin = d; best = c; }
  }
  return best;
}

// ---------- render results ----------
function renderResults(list, mid, aCoords){
  // clear previous markers/cards
  venueMarkers.forEach(m => map.removeLayer(m));
  venueMarkers = [];
  resultsGrid.innerHTML = '';

  list.forEach(v=>{
    const cat = v.category || detectCategory(v.tags) || 'restaurant';
    const meta = CATEGORY_META[cat] || { badge:'', label:cat, color:'#60a5fa', icon:'#ic-restaurant' };

    // marker
    const marker = L.circleMarker([v.lat, v.lon], { radius:8, color: meta.color, fillColor: meta.color, fillOpacity: 0.9 }).addTo(map)
      .bindPopup(`<b>${escapeHtml(v.name)}</b><br>${escapeHtml(meta.label)} • ${v.distance.toFixed(2)} km`);
    venueMarkers.push(marker);

    // card
    const card = document.createElement('div'); card.className = 'card';
    const svgIcon = `<svg width="18" height="18" viewBox="0 0 24 24"><use href="${meta.icon}" /></svg>`;
    card.innerHTML = `
      <h3>${svgIcon} ${escapeHtml(v.name)}</h3>
      <div class="meta">${escapeHtml(meta.label)} • ${v.distance.toFixed(2)} km from midpoint</div>
      <div class="actions">
        <button class="btn-visit">Get Directions</button>
        <button class="btn-focus">Focus</button>
        <span style="flex:1"></span>
        <span class="category-badge ${meta.badge}">${escapeHtml(meta.label)}</span>
      </div>
    `;
    resultsGrid.appendChild(card);

    // handlers
    card.querySelector('.btn-focus').addEventListener('click', ()=>{
      map.setView([v.lat, v.lon], 16);
      marker.openPopup();
    });
    card.querySelector('.btn-visit').addEventListener('click', ()=>{
      if(aCoords){
        const origin = `${aCoords.lat},${aCoords.lon}`; const dest = `${v.lat},${v.lon}`;
        window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`, '_blank');
      } else {
        window.open(`https://www.google.com/maps/search/?api=1&query=${v.lat},${v.lon}`, '_blank');
      }
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
  const φ1 = toRad(lat1), λ1 = toRad(lon1);
  const φ2 = toRad(lat2), λ2 = toRad(lon2);
  const Δλ = λ2 - λ1;
  const Bx = Math.cos(φ2) * Math.cos(Δλ);
  const By = Math.cos(φ2) * Math.sin(Δλ);
  const φm = Math.atan2(Math.sin(φ1) + Math.sin(φ2), Math.sqrt((Math.cos(φ1)+Bx)**2 + By**2));
  const λm = λ1 + Math.atan2(By, Math.cos(φ1) + Bx);
  const lon = ((toDeg(λm) + 540) % 360) - 180;
  return { lat: toDeg(φm), lon };
}

// ---------- helpers & utils ----------
function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
async function reverseGeocode(lat, lon){ const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`); const j=await res.json(); return j.display_name || `${lat.toFixed(4)},${lon.toFixed(4)}`; }

// normalize elements (reuse)
function normalizeElements(elements){
  return (elements||[]).map(el=>{
    let lat=null, lon=null;
    if(el.type==='node'){ lat=el.lat; lon=el.lon; }
    else if(el.center){ lat=el.center.lat; lon=el.center.lon; }
    else if(el.bounds){ lat=(el.bounds.minlat+el.bounds.maxlat)/2; lon=(el.bounds.minlon+el.bounds.maxlon)/2; }
    if(lat==null) return null;
    return { id:`${el.type}/${el.id}`, lat, lon, name: el.tags?.name || '', tags: el.tags || {} };
  }).filter(Boolean);
}

// find nearest major city
function findNearestCity(lat, lon){
  let best=null, dmin=1e9;
  MAJOR_CITIES.forEach(c => {
    const d = haversineKM(lat, lon, c.lat, c.lon);
    if(d < dmin){ dmin = d; best = c; }
  });
  return best;
}

// clear UI
function clearAll(){
  if(markerA) map.removeLayer(markerA);
  if(markerB) map.removeLayer(markerB);
  if(markerMid) map.removeLayer(markerMid);
  venueMarkers.forEach(m => map.removeLayer(m));
  venueMarkers = [];
  resultsGrid.innerHTML = '';
  resultsCount.textContent = '0';
  midplace.textContent = 'Midpoint place: —';
  distanceInfo.textContent = 'Total distance: —';
  radiusInfo.textContent = 'Radius used: —';
  fallbackNote.classList.add('hidden');
}

// ---------- small UX: clicking suggestion fills inputs ----------
function attachSuggestionClicks(listEl, inputEl, which){
  listEl.addEventListener('click', (e)=>{
    const li = e.target.closest('li');
    if(!li) return;
    const lat = li.dataset.lat, lon = li.dataset.lon, disp = li.dataset.display;
    inputEl.value = disp;
    if(which==='A') selectedA = { lat: parseFloat(lat), lon: parseFloat(lon), display: disp };
    else selectedB = { lat: parseFloat(lat), lon: parseFloat(lon), display: disp };
    listEl.classList.remove('show');
  });
}
attachSuggestionClicks(aSuggestions, aInput, 'A');
attachSuggestionClicks(bSuggestions, bInput, 'B');

// Update suggestions rendering to include data attributes
function renderSuggestions(items, dropEl, which, inputEl){
  dropEl.innerHTML = '';
  if(!items || items.length === 0){ dropEl.classList.remove('show'); return; }
  items.forEach(it=>{
    const li = document.createElement('li');
    li.dataset.lat = it.lat; li.dataset.lon = it.lon; li.dataset.display = it.display_name;
    li.innerHTML = `<div class="s-title">${escapeHtml(it.display_name.split(',')[0])}</div>
                    <div class="s-sub muted">${escapeHtml(it.display_name)}</div>`;
    dropEl.appendChild(li);
  });
  dropEl.classList.add('show');
}

// Rebind to override earlier renderSuggestions (since function defined earlier)
window.renderSuggestions = renderSuggestions;

// ----- End of file -----