/* app.js — fixed hotel-search breadth (find hotel|motel|guest_house|hostel|resort|guesthouse|homestay)
   - Leaflet + Nominatim + Overpass
   - Keeps: prefer name:en, skip unnamed hotels, robust category detection (dhaba -> Restaurant)
   - Appends a named hotel for journeys > 500 km (search up to 20 km)
*/

const SEARCH_RADII = [5000, 10000, 20000, 50000, 100000]; // meters
const HOTEL_SEARCH_RADII = [5000, 10000, 15000, 20000]; // meters (up to 20 km)
const ACCEPTABLE_DISTANCE_KM = 50;
const TOP_N = 5;

// DOM
const aInput = document.getElementById('aInput');
const bInput = document.getElementById('bInput');
const aSuggestions = document.getElementById('aSuggestions');
const bSuggestions = document.getElementById('bSuggestions');
const goBtn = document.getElementById('goBtn');
const swapBtn = document.getElementById('swapBtn');
const useMyLocBtn = document.getElementById('useMyLoc');
const resultsGrid = document.getElementById('resultsGrid');
const resultsCount = document.getElementById('resultsCount');
const midplace = document.getElementById('midplace');
const distanceInfo = document.getElementById('distanceInfo');
const radiusInfo = document.getElementById('radiusInfo');
const typeSelect = document.getElementById('typeSelect');
const themeToggle = document.getElementById('themeToggle');
const fallbackNote = document.getElementById('fallbackNote');
const shareBtn = document.getElementById('shareBtn');
const rankPref = document.getElementById('rankPref');

let selectedA = null, selectedB = null;
let map, markerA, markerB, markerMid;
let currentMarkers = [];
let currentTopList = [];
let isSearching = false;

// init map
function initMap(){
  map = L.map('map', { preferCanvas:true }).setView([22.3511148,78.6677428],5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19, attribution:'© OpenStreetMap contributors' }).addTo(map);
}
initMap();

// theme
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
  themeToggle.innerHTML = theme === 'light' ? `<svg width="18" height="18"><use href="#ic-moon"></use></svg>` : `<svg width="18" height="18"><use href="#ic-sun"></use></svg>`;
}

// helpers
function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function sanitizeInput(s){ if(!s) return ''; return String(s).slice(0,300).replace(/[<>]/g,'').replace(/[\u0000-\u001f\u007f-\u009f]/g,'').trim(); }
function haversineKM(lat1,lon1,lat2,lon2){
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI/180;
  const dLon = (lon2 - lon1) * Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
function sphericalMidpoint(lat1,lon1,lat2,lon2){
  const toRad=d=>d*Math.PI/180, toDeg=r=>r*180/Math.PI;
  const φ1=toRad(lat1), λ1=toRad(lon1), φ2=toRad(lat2), λ2=toRad(lon2);
  const Δλ = λ2 - λ1; const Bx = Math.cos(φ2)*Math.cos(Δλ); const By = Math.cos(φ2)*Math.sin(Δλ);
  const φm = Math.atan2(Math.sin(φ1)+Math.sin(φ2), Math.sqrt((Math.cos(φ1)+Bx)**2 + By**2));
  const λm = λ1 + Math.atan2(By, Math.cos(φ1) + Bx);
  const lon = ((toDeg(λm)+540)%360)-180;
  return { lat: toDeg(φm), lon };
}
function isGoodName(n){
  if(!n) return false;
  const s = n.trim();
  if(s.length < 2) return false;
  if(/unnamed|unknown|km|mile|residential|service road/i.test(s)) return false;
  return true;
}

// AUTOCOMPLETE (Nominatim) - Accept-Language=en
let acTimerA=null, acTimerB=null;
aInput.addEventListener('input', ()=>debouncedAC(aInput, aSuggestions, 'A'));
bInput.addEventListener('input', ()=>debouncedAC(bInput, bSuggestions, 'B'));
aInput.addEventListener('blur', ()=>setTimeout(()=>aSuggestions.classList.remove('show'),180));
bInput.addEventListener('blur', ()=>setTimeout(()=>bSuggestions.classList.remove('show'),180));

async function fetchNominatim(q,limit=6){
  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=${limit}&countrycodes=IN&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers:{ 'Accept-Language':'en' }});
  if(!res.ok) throw new Error('Nominatim error');
  return res.json();
}
function debouncedAC(inputEl, dropEl, which){
  if(which === 'A') selectedA = null; else selectedB = null;
  const q = sanitizeInput(inputEl.value);
  if(!q){ dropEl.classList.remove('show'); return; }
  const timerName = which === 'A' ? 'acTimerA' : 'acTimerB';
  if(window[timerName]) clearTimeout(window[timerName]);
  window[timerName] = setTimeout(async ()=>{
    try{
      const arr = await fetchNominatim(q);
      renderSuggestions(arr, dropEl, inputEl, which);
    } catch(e){ dropEl.classList.remove('show'); }
  }, 260);
}
function renderSuggestions(items, dropEl, inputEl, which){
  dropEl.innerHTML = '';
  if(!items || items.length === 0){ dropEl.classList.remove('show'); return; }
  items.forEach(it=>{
    if(!it || !it.lat || !it.lon || !it.display_name) return;
    const li = document.createElement('li');
    li.dataset.lat = it.lat; li.dataset.lon = it.lon; li.dataset.display = it.display_name;
    li.innerHTML = `<div class="s-title">${escapeHtml(it.display_name.split(',')[0])}</div><div class="s-sub muted">${escapeHtml(it.display_name)}</div>`;
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

// click outside suggestions behavior (also triggers Find if click is on Find)
document.addEventListener('pointerdown', (e)=>{
  const aShown = aSuggestions.classList.contains('show'), bShown = bSuggestions.classList.contains('show');
  if(aShown || bShown){
    const target = e.target;
    const clickedInsideA = target.closest && target.closest('#aSuggestions');
    const clickedInsideB = target.closest && target.closest('#bSuggestions');
    const clickedAInput = target === aInput || (target.closest && target.closest('#aInput'));
    const clickedBInput = target === bInput || (target.closest && target.closest('#bInput'));
    if(!clickedInsideA && !clickedInsideB && !clickedAInput && !clickedBInput){
      aSuggestions.classList.remove('show'); bSuggestions.classList.remove('show');
      try{
        const rect = goBtn.getBoundingClientRect();
        const x = e.clientX, y = e.clientY;
        if(x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom){
          e.preventDefault();
          mainSearch();
        }
      } catch(e){}
    }
  }
});

// Enter triggers
[aInput,bInput].forEach(inp=> inp.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); mainSearch(); }}));

// Swap / use my location / share
swapBtn.addEventListener('click', ()=>{ const tmp=aInput.value; aInput.value=bInput.value; bInput.value=tmp; const sa=selectedA; selectedA=selectedB; selectedB=sa; });
useMyLocBtn.addEventListener('click', ()=>{
  if(!navigator.geolocation){ alert('Geolocation not supported'); return; }
  useMyLocBtn.textContent = 'Detecting…';
  navigator.geolocation.getCurrentPosition(async pos=>{
    const lat = pos.coords.latitude, lon = pos.coords.longitude;
    try{ const display = await reverseGeocode(lat, lon); aInput.value = display || `${lat.toFixed(4)},${lon.toFixed(4)}`; selectedA = { lat, lon, display }; }
    catch(e){ aInput.value = `${lat.toFixed(4)},${lon.toFixed(4)}`; selectedA = { lat, lon, display: aInput.value }; }
    finally{ useMyLocBtn.textContent = 'Use my location'; }
  }, err=>{ console.error(err); alert('Could not get location'); useMyLocBtn.textContent = 'Use my location'; });
});
shareBtn.addEventListener('click', ()=>{
  const a=encodeURIComponent(aInput.value||''), b=encodeURIComponent(bInput.value||''), t=encodeURIComponent(typeSelect.value||'');
  const url = `${location.origin}${location.pathname}?a=${a}&b=${b}&t=${t}`;
  navigator.clipboard.writeText(url).then(()=>{ shareBtn.textContent='Copied ✓'; setTimeout(()=>shareBtn.textContent='Share',1200); });
});

// Geocode / Reverse (Nominatim, prefer English)
async function geocodeIN(q){
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=IN&q=${encodeURIComponent(q)}`;
  try{ const res = await fetch(url, { headers:{ 'Accept-Language':'en' } }); if(!res.ok) return null; const j = await res.json(); if(!j||!j[0]) return null; return { lat: parseFloat(j[0].lat), lon: parseFloat(j[0].lon), display: j[0].display_name }; } catch(e){ console.warn('geocode error', e); return null; }
}
async function reverseGeocode(lat, lon){
  try{ const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`); const j = await res.json(); return j.display_name || `${lat.toFixed(3)},${lon.toFixed(3)}`; } catch(e){ return `${lat.toFixed(3)},${lon.toFixed(3)}`; }
}

// Overpass helpers
function buildOverpass(lat, lon, type, radius){
  const blocks = [];
  if(type === 'hotel'){
    // BROADENED: include common tourism stay tags (hotel, motel, guest_house, hostel, resort, guesthouse, homestay)
    blocks.push(`node(around:${radius},${lat},${lon})[tourism~"^(hotel|motel|guest_house|hostel|resort|guesthouse|homestay)$"];`);
    blocks.push(`way(around:${radius},${lat},${lon})[tourism~"^(hotel|motel|guest_house|hostel|resort|guesthouse|homestay)$"];`);
    blocks.push(`relation(around:${radius},${lat},${lon})[tourism~"^(hotel|motel|guest_house|hostel|resort|guesthouse|homestay)$"];`);
  } else {
    // combined useful kinds; amenity prioritized
    blocks.push(`node(around:${radius},${lat},${lon})[amenity~"^(restaurant|fast_food|cafe|bar|pub)$"];`);
    blocks.push(`node(around:${radius},${lat},${lon})[tourism~"^(hotel|motel|guest_house|hostel|resort|guesthouse|homestay)$"];`);
    blocks.push(`node(around:${radius},${lat},${lon})[leisure~"^(park|garden)$"];`);
    ['way','relation'].forEach(t => {
      blocks.push(`${t}(around:${radius},${lat},${lon})[amenity~"^(restaurant|fast_food|cafe|bar|pub)$"];`);
      blocks.push(`${t}(around:${radius},${lat},${lon})[tourism~"^(hotel|motel|guest_house|hostel|resort|guesthouse|homestay)$"];`);
      blocks.push(`${t}(around:${radius},${lat},${lon})[leisure~"^(park|garden)$"];`);
    });
  }
  return `[out:json][timeout:25];(${blocks.join('\n')});out center 200;`;
}

async function overpassQuery(lat, lon, type, radius){
  const q = buildOverpass(lat, lon, type, radius);
  try{
    const res = await fetch('https://overpass-api.de/api/interpreter', { method:'POST', body: q });
    if(!res.ok) throw new Error('Overpass failed');
    const json = await res.json();
    return json.elements || [];
  } catch(e){
    console.warn('Overpass primary failed, trying fallback...', e);
    try{
      const res2 = await fetch('https://overpass.kumi.systems/api/interpreter', { method:'POST', body: q });
      if(!res2.ok) return [];
      const j2 = await res2.json();
      return j2.elements || [];
    } catch(e2){
      console.warn('Overpass fallback failed', e2);
      return [];
    }
  }
}

// Normalize elements & prefer name:en
function normalizeElements(elements){
  return (elements||[]).map(el=>{
    let lat=null, lon=null;
    if(el.type === 'node'){ lat = el.lat; lon = el.lon; }
    else if(el.center){ lat = el.center.lat; lon = el.center.lon; }
    else if(el.bounds){ lat = (el.bounds.minlat + el.bounds.maxlat)/2; lon = (el.bounds.minlon + el.bounds.maxlon)/2; }
    if(lat == null) return null;
    const tags = el.tags || {};
    const name = (tags['name:en'] || tags['name:en:latin'] || tags['name'] || tags['int_name'] || tags['official_name'] || '').trim();
    return { id: `${el.type}/${el.id}`, lat, lon, name, tags };
  }).filter(Boolean);
}

// Improved detectCategory(tags, name) — amenity/leisure/name heuristics then tourism
function detectCategory(tags, name){
  if(!tags && !name) return null;
  const nm = (name || '').toLowerCase();

  const amen = (tags?.amenity || '').toLowerCase();
  if(amen){
    if(/restaurant|fast_food|food_court|dhaba|bhojanalaya|bhojnalaya|dining|canteen|mess/.test(amen) || /dhaba|bhojanalaya|bhojnalaya/.test(nm)) return 'Restaurant';
    if(/cafe|coffee_shop|tea_room|tearoom/.test(amen) || /cafe|café|coffee|chai|tea/.test(nm)) return 'Cafe';
    if(/bar|pub/.test(amen) || /bar|pub/.test(nm)) return 'Bar';
  }

  const leis = (tags?.leisure || '').toLowerCase();
  if(leis){
    if(/park|garden|playground/.test(leis)) return 'Park';
  }

  if(nm){
    if(/dhaba|dhabha|bhojanalaya|bhojnalaya|restaurant|diner|bistro|canteen|mess|tiffin|thali|kitchen|भोजनालय/i.test(nm)) return 'Restaurant';
    if(/cafe|café|coffee|chai|tea|bakery|espresso/i.test(nm)) return 'Cafe';
    if(/bar|pub|lounge|taproom/i.test(nm)) return 'Bar';
    if(/hotel|motel|resort|lodge|guest ?house|guesthouse|inn|homestay|hostel/i.test(nm)) return 'Hotel';
  }

  const tour = (tags?.tourism || '').toLowerCase();
  if(tour){
    if(/hotel|motel|guest_house|hostel|resort|guesthouse|homestay/.test(tour)) return 'Hotel';
  }

  const building = (tags?.building || '').toLowerCase();
  if(building && /hotel|hostel|motel/.test(building)) return 'Hotel';

  return null;
}

// main search
async function mainSearch(){
  if(isSearching) return;
  isSearching = true;
  clearAllUI();
  const aText = sanitizeInput(aInput.value), bText = sanitizeInput(bInput.value);
  const prefType = sanitizeInput(typeSelect.value || 'any');

  if(!aText || !bText){ alert('Please enter both locations'); isSearching=false; return; }

  try{
    goBtn.disabled = true; goBtn.textContent = 'Searching…';

    const pA = (selectedA && selectedA.display === aText) ? Promise.resolve(selectedA) : geocodeIN(aText);
    const pB = (selectedB && selectedB.display === bText) ? Promise.resolve(selectedB) : geocodeIN(bText);
    const [ga, gb] = await Promise.all([pA, pB]);
    if(!ga || !gb) throw new Error('Could not resolve one or both locations.');

    if(markerA) map.removeLayer(markerA);
    if(markerB) map.removeLayer(markerB);
    markerA = L.circleMarker([ga.lat, ga.lon], { radius:8, color:'#3b82f6', weight:2 }).addTo(map).bindPopup(`A: ${escapeHtml(aText)}`);
    markerB = L.circleMarker([gb.lat, gb.lon], { radius:8, color:'#ef4444', weight:2 }).addTo(map).bindPopup(`B: ${escapeHtml(bText)}`);

    const mid = sphericalMidpoint(ga.lat, ga.lon, gb.lat, gb.lon);
    if(markerMid) map.removeLayer(markerMid);
    markerMid = L.circleMarker([mid.lat, mid.lon], { radius:9, color:'#a78bfa', weight:3 }).addTo(map).bindPopup('Midpoint');
    try{ midplace.textContent = `Midpoint place: ${await reverseGeocode(mid.lat, mid.lon)}`; } catch(e){ midplace.textContent = 'Midpoint place: —'; }

    const totalKM = haversineKM(ga.lat, ga.lon, gb.lat, gb.lon);
    distanceInfo.textContent = `Total distance: ${totalKM.toFixed(2)} km`;

    // progressive search for venues
    let venues = [];
    let usedRadius = 0;
    for(const r of SEARCH_RADII){
      const els = await overpassQuery(mid.lat, mid.lon, 'any', r);
      const normalized = normalizeElements(els);
      const enriched = normalized.map(it => { it.category = detectCategory(it.tags, it.name); return it; }).filter(it => it.category && isGoodName(it.name));
      if(enriched.length > 0){ venues = enriched; usedRadius = r; break; }
    }

    if(venues.length === 0){
      const nearest = findNearestCity(mid.lat, mid.lon);
      const els = await overpassQuery(nearest.lat, nearest.lon, 'any', 20000);
      const normalized = normalizeElements(els);
      const enriched = normalized.map(it => { it.category = detectCategory(it.tags, it.name); return it; }).filter(it => it.category && isGoodName(it.name));
      venues = enriched; usedRadius = 20000;
      fallbackNote.textContent = `No venues near midpoint — showing places near ${nearest.name}.`;
      fallbackNote.classList.remove('hidden');
    } else {
      fallbackNote.classList.add('hidden');
    }

    radiusInfo.textContent = `Search radius: ${(usedRadius/1000).toFixed(0)} km`;

    venues.forEach(v => {
      v.distance = haversineKM(mid.lat, mid.lon, v.lat, v.lon);
      v.distToA = haversineKM(ga.lat, ga.lon, v.lat, v.lon);
      v.distToB = haversineKM(gb.lat, gb.lon, v.lat, v.lon);
      v.recommendedStay = false;
    });

    // prefer nearby if available
    const nearby = venues.filter(v => v.distance <= ACCEPTABLE_DISTANCE_KM);
    if(nearby.length > 0) venues = nearby;

    // ranking bias
    const pref = rankPref?.value || 'balanced';
    if(pref !== 'balanced'){
      const bias = pref === 'favorA' ? 0.6 : -0.6;
      venues.forEach(v => v.score = (v.distance||0) + bias * ((v.distToA||0) - (v.distToB||0)));
      venues.sort((a,b) => (a.score||a.distance) - (b.score||b.distance));
    } else {
      venues.sort((a,b) => (a.distance||0) - (b.distance||0));
    }

    currentTopList = venues.slice(0, Math.max(TOP_N, 18));

    // hotel append for long trips (>500 km)
    let appendedHotel = null;
    if(totalKM > 500){
      const hasHotel = currentTopList.some(v => v.category === 'Hotel' && isGoodName(v.name));
      if(!hasHotel){
        for(const hr of HOTEL_SEARCH_RADII){
          const els = await overpassQuery(mid.lat, mid.lon, 'hotel', hr);
          const normalized = normalizeElements(els).map(it => { it.category = detectCategory(it.tags, it.name); return it; }).filter(it => it.category === 'Hotel' && isGoodName(it.name));
          if(normalized.length > 0){
            normalized.forEach(h => h.distance = haversineKM(mid.lat, mid.lon, h.lat, h.lon));
            normalized.sort((a,b) => a.distance - b.distance);
            appendedHotel = normalized[0];
            appendedHotel.recommendedStay = true;
            appendedHotel._hotelSearchRadius = hr;
            break;
          }
        }
        if(!appendedHotel){
          fallbackNote.textContent = `No named hotel found within ${HOTEL_SEARCH_RADII[HOTEL_SEARCH_RADII.length-1]/1000} km of midpoint.`;
          fallbackNote.classList.remove('hidden');
        }
      }
    }

    const toRender = currentTopList.slice(0, TOP_N);
    if(appendedHotel){
      const dup = toRender.find(v => v.name === appendedHotel.name && Math.abs(v.lat - appendedHotel.lat) < 0.0005 && Math.abs(v.lon - appendedHotel.lon) < 0.0005);
      if(!dup) toRender.push(appendedHotel);
    }

    renderResults(toRender, ga);
    resultsCount.textContent = String(Math.min(currentTopList.length, TOP_N) + (appendedHotel ? 1 : 0));

    const pts = [[ga.lat,ga.lon],[gb.lat,gb.lon],[mid.lat,mid.lon], ...toRender.slice(0,6).map(v=>[v.lat,v.lon])];
    map.fitBounds(L.latLngBounds(pts).pad(0.25));

  } catch(err){
    console.error(err);
    alert(err.message || 'Search failed — check console.');
  } finally {
    goBtn.disabled = false; goBtn.textContent = 'Find';
    isSearching = false;
  }
}

// wire Find (pointerdown)
goBtn.removeEventListener?.('pointerdown', mainSearch);
goBtn.addEventListener('pointerdown', (e)=>{ e.preventDefault(); aSuggestions.classList.remove('show'); bSuggestions.classList.remove('show'); mainSearch(); });

// render results
function renderResults(list, originA){
  currentMarkers.forEach(m=>map.removeLayer(m)); currentMarkers = [];
  resultsGrid.innerHTML = '';

  if(!list || list.length === 0){
    resultsGrid.innerHTML = `<div class="small muted centered">No results found</div>`;
    return;
  }

  list.forEach(v=>{
    const meta = metaForCategory(v.category);
    const svgHtml = `<svg width="20" height="20" viewBox="0 0 24 24"><use href="${meta.icon}"></use></svg>`;
    const markerHtml = v.recommendedStay ? `<div class="custom-marker" style="background:#d97706;border:3px solid #fff">${svgHtml}</div>` : `<div class="custom-marker" style="background:${meta.color};">${svgHtml}</div>`;
    const icon = L.divIcon({ html: markerHtml, className:'', iconSize:[40,40], iconAnchor:[20,40] });
    const marker = L.marker([v.lat, v.lon], { icon }).addTo(map).bindPopup(`<b>${escapeHtml(v.name)}</b><br>${escapeHtml(v.category)}${v.recommendedStay ? ' • Recommended Stay' : ''}`);
    currentMarkers.push(marker);

    const card = document.createElement('div'); card.className='card';
    const h = document.createElement('h3');
    h.innerHTML = `<svg width="18" height="18"><use href="${meta.icon}"></use></svg> ${escapeHtml(v.name)}`;
    card.appendChild(h);

    const metaDiv = document.createElement('div'); metaDiv.className='meta';
    const desc = [`${v.category}`];
    if(v.distance !== undefined) desc.push(`${(v.distance).toFixed(2)} km from midpoint`);
    if(v.recommendedStay) desc.push('Recommended Stay');
    metaDiv.textContent = desc.join(' • ');
    card.appendChild(metaDiv);

    const actions = document.createElement('div'); actions.className='actions';
    const btnDir = document.createElement('button'); btnDir.className='btn-visit'; btnDir.textContent='Get Directions';
    const btnView = document.createElement('button'); btnView.className='btn-view'; btnView.textContent='View on Map';
    const badge = document.createElement('div'); badge.className = `category-badge ${meta.badge}`; badge.textContent = v.category;
    actions.appendChild(btnDir); actions.appendChild(btnView); actions.appendChild(badge);
    card.appendChild(actions);
    resultsGrid.appendChild(card);

    btnView.addEventListener('click', ()=> window.open(`https://www.google.com/maps?q=${v.lat},${v.lon}`,'_blank'));
    btnDir.addEventListener('click', ()=> {
      if(originA && markerA){
        const latlng = markerA.getLatLng();
        const origin = `${latlng.lat},${latlng.lng}`;
        window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${v.lat},${v.lon}`,'_blank');
      } else {
        window.open(`https://www.google.com/maps/search/?api=1&query=${v.lat},${v.lon}`,'_blank');
      }
    });

    card.addEventListener('click', (e)=>{
      if(e.target.tagName.toLowerCase()==='button' || e.target.closest('button')) return;
      map.setView([v.lat, v.lon], 16);
      marker.openPopup();
    });
  });
}

function metaForCategory(cat){
  if(cat === 'Restaurant') return { color:'#fb923c', icon:'#ic-restaurant', badge:'badge-restaurant' };
  if(cat === 'Cafe') return { color:'#f59e0b', icon:'#ic-cafe', badge:'badge-cafe' };
  if(cat === 'Bar') return { color:'#ef4444', icon:'#ic-bar', badge:'badge-bar' };
  if(cat === 'Hotel') return { color:'#06b6d4', icon:'#ic-hotel', badge:'badge-hotel' };
  if(cat === 'Park') return { color:'#10b981', icon:'#ic-park', badge:'badge-park' };
  return { color:'#6ea8ff', icon:'#ic-restaurant', badge:'badge-restaurant' };
}

// nearest major city fallback
const MAJOR_CITIES = [
  { name: "New Delhi", lat: 28.6139391, lon: 77.2090212 },
  { name: "Mumbai", lat: 19.0759837, lon: 72.8776559 },
  { name: "Bengaluru", lat: 12.9715987, lon: 77.5945627 },
  { name: "Hyderabad", lat: 17.385044, lon: 78.486671 },
  { name: "Chennai", lat: 13.0826802, lon: 80.2707184 },
  { name: "Kolkata", lat: 22.572646, lon: 88.363895 }
];
function findNearestCity(lat, lon){
  let best = null, dmin = Infinity;
  for(const c of MAJOR_CITIES){ const d = haversineKM(lat, lon, c.lat, c.lon); if(d < dmin){ dmin = d; best = c; } }
  return best;
}

function clearAllUI(){
  if(markerA) map.removeLayer(markerA); if(markerB) map.removeLayer(markerB); if(markerMid) map.removeLayer(markerMid);
  currentMarkers.forEach(m=>map.removeLayer(m)); currentMarkers = [];
  resultsGrid.innerHTML = ''; resultsCount.textContent='0';
  midplace.textContent='Midpoint place: —'; distanceInfo.textContent='Total distance: —'; radiusInfo.textContent='Search radius: —'; fallbackNote.classList.add('hidden');
}

// expose mainSearch for debugging
window.mitm = { mainSearch };