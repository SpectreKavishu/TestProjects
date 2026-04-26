// Indian Cities and Venues Data
const indianCitiesData = [
  {
    "name": "Mumbai",
    "state": "Maharashtra",
    "coordinates": [19.0760, 72.8777],
    "landmarks": ["Gateway of India", "Marine Drive", "Bandra-Kurla Complex"]
  },
  {
    "name": "Delhi",
    "state": "Delhi",
    "coordinates": [28.6139, 77.2090],
    "landmarks": ["India Gate", "Connaught Place", "Red Fort"]
  },
  {
    "name": "Bangalore",
    "state": "Karnataka", 
    "coordinates": [12.9716, 77.5946],
    "landmarks": ["Cubbon Park", "MG Road", "Brigade Road"]
  },
  {
    "name": "Chennai",
    "state": "Tamil Nadu",
    "coordinates": [13.0827, 80.2707],
    "landmarks": ["Marina Beach", "Express Avenue", "T Nagar"]
  },
  {
    "name": "Kolkata",
    "state": "West Bengal",
    "coordinates": [22.5726, 88.3639],
    "landmarks": ["Victoria Memorial", "Park Street", "Salt Lake"]
  },
  {
    "name": "Hyderabad",
    "state": "Telangana",
    "coordinates": [17.3850, 78.4867],
    "landmarks": ["Charminar", "HITEC City", "Tank Bund"]
  },
  {
    "name": "Pune",
    "state": "Maharashtra",
    "coordinates": [18.5204, 73.8567],
    "landmarks": ["Koregaon Park", "FC Road", "Hinjewadi"]
  },
  {
    "name": "Ahmedabad",
    "state": "Gujarat",
    "coordinates": [23.0225, 72.5714],
    "landmarks": ["Sabarmati Ashram", "Law Garden", "Maninagar"]
  },
  {
    "name": "Jaipur",
    "state": "Rajasthan",
    "coordinates": [26.9124, 75.7873],
    "landmarks": ["Hawa Mahal", "City Palace", "Pink City"]
  },
  {
    "name": "Lucknow",
    "state": "Uttar Pradesh",
    "coordinates": [26.8467, 80.9462],
    "landmarks": ["Bara Imambara", "Hazratganj", "Gomti Nagar"]
  }
];

const indianVenuesData = [
  {
    "id": 1,
    "name": "Café Coffee Day - Central",
    "type": "Café",
    "rating": 4.2,
    "distance": "0.3 km",
    "description": "Popular Indian coffee chain with comfortable seating and WiFi",
    "address": "Main Market, Central District",
    "phone": "+91-9876543210",
    "hours": "7:00 AM - 11:00 PM",
    "priceRange": "₹₹",
    "amenities": ["WiFi", "AC", "Parking"],
    "suitableFor": ["Business meetings", "Casual meetups"]
  },
  {
    "id": 2,
    "name": "Saravana Bhavan",
    "type": "Restaurant",
    "rating": 4.5,
    "distance": "0.2 km", 
    "description": "Authentic South Indian vegetarian restaurant chain",
    "address": "Gandhi Nagar, Main Road",
    "phone": "+91-9876543211",
    "hours": "6:00 AM - 11:00 PM",
    "priceRange": "₹₹",
    "amenities": ["AC", "Family seating", "Pure Veg"],
    "suitableFor": ["Family meetups", "Casual dining"]
  },
  {
    "id": 3,
    "name": "Central Park",
    "type": "Park",
    "rating": 4.3,
    "distance": "0.4 km",
    "description": "Well-maintained public park with benches and walking paths",
    "address": "Central Avenue, City Center",
    "phone": null,
    "hours": "5:00 AM - 10:00 PM",
    "priceRange": "Free",
    "amenities": ["Open air", "Benches", "Walking tracks"],
    "suitableFor": ["Casual meetups", "Morning meetings"]
  },
  {
    "id": 4,
    "name": "Phoenix Mall Food Court",
    "type": "Mall",
    "rating": 4.4,
    "distance": "0.5 km",
    "description": "Large shopping mall with diverse food court options",
    "address": "Mall Road, Shopping District",
    "phone": "+91-9876543212",
    "hours": "10:00 AM - 10:00 PM",
    "priceRange": "₹₹",
    "amenities": ["AC", "Parking", "Multiple cuisines"],
    "suitableFor": ["Group meetings", "Shopping & dining"]
  },
  {
    "id": 5,
    "name": "WeWork Business Center",
    "type": "Co-working",
    "rating": 4.6,
    "distance": "0.3 km",
    "description": "Professional co-working space with meeting rooms",
    "address": "Business Park, IT Sector",
    "phone": "+91-9876543213",
    "hours": "24/7",
    "priceRange": "₹₹₹",
    "amenities": ["WiFi", "Meeting rooms", "Parking", "Reception"],
    "suitableFor": ["Business meetings", "Professional meetups"]
  },
  {
    "id": 6,
    "name": "State Central Library",
    "type": "Library",
    "rating": 4.1,
    "distance": "0.6 km",
    "description": "Public library with reading rooms and discussion areas",
    "address": "Library Road, Government Quarter",
    "phone": "+91-9876543214",
    "hours": "9:00 AM - 8:00 PM",
    "priceRange": "Free",
    "amenities": ["Reading rooms", "WiFi", "Quiet zones"],
    "suitableFor": ["Study groups", "Quiet meetings"]
  },
  {
    "id": 7,
    "name": "Haldiram's Restaurant",
    "type": "Restaurant",
    "rating": 4.3,
    "distance": "0.2 km",
    "description": "Popular Indian vegetarian restaurant and sweets shop",
    "address": "Market Street, Commercial Area",
    "phone": "+91-9876543215",
    "hours": "8:00 AM - 11:00 PM",
    "priceRange": "₹₹",
    "amenities": ["AC", "Pure Veg", "Sweets counter"],
    "suitableFor": ["Family meetings", "Traditional dining"]
  },
  {
    "id": 8,
    "name": "Third Wave Coffee Roasters",
    "type": "Café",
    "rating": 4.7,
    "distance": "0.3 km",
    "description": "Premium coffee roasters with artisanal beverages",
    "address": "Hip Street, Creative Quarter",
    "phone": "+91-9876543216",
    "hours": "7:30 AM - 10:00 PM",
    "priceRange": "₹₹₹",
    "amenities": ["WiFi", "Specialty coffee", "Quiet ambiance"],
    "suitableFor": ["Business meetings", "Creative discussions"]
  },
  {
    "id": 9,
    "name": "Hotel Taj - Lobby Lounge",
    "type": "Hotel Lounge",
    "rating": 4.8,
    "distance": "0.4 km",
    "description": "Luxury hotel lobby with comfortable seating",
    "address": "Palace Road, Hotel District",
    "phone": "+91-9876543217",
    "hours": "24/7",
    "priceRange": "₹₹₹₹",
    "amenities": ["Luxury setting", "Professional service", "Valet parking"],
    "suitableFor": ["Executive meetings", "Business deals"]
  },
  {
    "id": 10,
    "name": "McDonald's",
    "type": "Fast Food",
    "rating": 4.0,
    "distance": "0.2 km",
    "description": "International fast food chain with consistent service",
    "address": "Highway Plaza, Fast Food Corner",
    "phone": "+91-9876543218",
    "hours": "9:00 AM - 11:00 PM",
    "priceRange": "₹₹",
    "amenities": ["WiFi", "AC", "Quick service"],
    "suitableFor": ["Quick meetings", "Casual meetups"]
  },
  {
    "id": 11,
    "name": "Botanical Garden Café",
    "type": "Garden Café",
    "rating": 4.4,
    "distance": "0.7 km",
    "description": "Peaceful café inside botanical gardens",
    "address": "Botanical Garden, Green Zone",
    "phone": "+91-9876543219",
    "hours": "8:00 AM - 6:00 PM",
    "priceRange": "₹₹",
    "amenities": ["Garden view", "Fresh air", "Photography spots"],
    "suitableFor": ["Relaxed meetings", "Nature lovers"]
  },
  {
    "id": 12,
    "name": "Awfis Co-working Hub",
    "type": "Co-working",
    "rating": 4.5,
    "distance": "0.4 km",
    "description": "Modern co-working space with flexible meeting rooms",
    "address": "Tech Park, Business Zone",
    "phone": "+91-9876543220",
    "hours": "24/7",
    "priceRange": "₹₹₹",
    "amenities": ["High-speed WiFi", "Meeting pods", "Printing"],
    "suitableFor": ["Startup meetings", "Team collaborations"]
  }
];

// Application State
let currentSearch = null;
let filteredVenues = [];
let recentSearches = [];
let selectedLocationA = null;
let selectedLocationB = null;
let currentMidpoint = null;
let mapScale = 1;

// DOM Elements
const locationAInput = document.getElementById('location-a');
const locationBInput = document.getElementById('location-b');
const findSpotsBtn = document.getElementById('find-spots-btn');
const cityButtons = document.getElementById('city-buttons');
const recentSearchesList = document.getElementById('recent-searches-list');
const resultsSection = document.getElementById('results-section');
const mapInfo = document.getElementById('map-info');
const venuesList = document.getElementById('venues-list');
const venuesCount = document.getElementById('venues-count');
const venueModal = document.getElementById('venue-modal');
const shareModal = document.getElementById('share-modal');

// Filter elements
const venueTypeFilter = document.getElementById('venue-type-filter');
const priceFilter = document.getElementById('price-filter');
const amenityFilters = document.getElementById('amenity-filters');
const clearFiltersBtn = document.getElementById('clear-filters-btn');

// Map elements
const markerA = document.getElementById('marker-a');
const markerB = document.getElementById('marker-b');
const markerMid = document.getElementById('marker-mid');

// Autocomplete elements
const dropdownA = document.getElementById('dropdown-a');
const dropdownB = document.getElementById('dropdown-b');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadRecentSearches();
    setupEventListeners();
    validateInputs();
    console.log('MeetHalfway India App Initialized! 🇮🇳');
}

function setupEventListeners() {
    // Location inputs with proper autocomplete
    locationAInput.addEventListener('input', function() {
        showAutocompleteResults(locationAInput, dropdownA);
        validateInputs();
    });
    
    locationBInput.addEventListener('input', function() {
        showAutocompleteResults(locationBInput, dropdownB);
        validateInputs();
    });
    
    locationAInput.addEventListener('focus', function() {
        if (locationAInput.value.trim()) {
            showAutocompleteResults(locationAInput, dropdownA);
        }
    });
    
    locationBInput.addEventListener('focus', function() {
        if (locationBInput.value.trim()) {
            showAutocompleteResults(locationBInput, dropdownB);
        }
    });
    
    // Hide dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (!locationAInput.contains(event.target) && !dropdownA.contains(event.target)) {
            dropdownA.classList.remove('show');
        }
        if (!locationBInput.contains(event.target) && !dropdownB.contains(event.target)) {
            dropdownB.classList.remove('show');
        }
    });

    // Use location buttons
    document.querySelectorAll('.use-location-btn').forEach(btn => {
        btn.addEventListener('click', handleUseLocation);
    });

    // Find spots button
    findSpotsBtn.addEventListener('click', handleFindSpots);

    // City quick select buttons
    cityButtons.addEventListener('click', handleCitySelection);

    // Filter controls
    venueTypeFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('change', applyFilters);
    amenityFilters.addEventListener('change', applyFilters);
    clearFiltersBtn.addEventListener('click', clearFilters);

    // Map controls
    document.getElementById('zoom-in').addEventListener('click', () => zoomMap(0.2));
    document.getElementById('zoom-out').addEventListener('click', () => zoomMap(-0.2));
    document.getElementById('center-map').addEventListener('click', centerMap);

    // Modal controls
    document.getElementById('close-modal').addEventListener('click', closeVenueModal);
    document.getElementById('get-directions').addEventListener('click', handleGetDirections);
    document.getElementById('share-venue').addEventListener('click', handleShareVenue);
    document.getElementById('save-venue').addEventListener('click', handleSaveVenue);

    // Click outside modal to close
    venueModal.addEventListener('click', (e) => {
        if (e.target === venueModal) closeVenueModal();
    });

    shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) closeShareModal();
    });

    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!venueModal.classList.contains('hidden')) closeVenueModal();
            if (!shareModal.classList.contains('hidden')) closeShareModal();
        }
    });
}

function validateInputs() {
    const locationA = locationAInput.value.trim();
    const locationB = locationBInput.value.trim();
    
    if (locationA && locationB && locationA !== locationB) {
        findSpotsBtn.disabled = false;
        findSpotsBtn.textContent = 'Find Meeting Spots';
    } else {
        findSpotsBtn.disabled = true;
        if (locationA === locationB && locationA) {
            findSpotsBtn.textContent = 'Please select different locations';
        } else {
            findSpotsBtn.textContent = 'Enter both locations';
        }
    }
}

function showAutocompleteResults(input, dropdown) {
    const query = input.value.trim().toLowerCase();
    dropdown.innerHTML = '';
    
    if (query.length < 1) {
        dropdown.classList.remove('show');
        return;
    }

    const matches = indianCitiesData.filter(city => 
        city.name.toLowerCase().includes(query) || 
        city.state.toLowerCase().includes(query) ||
        city.landmarks.some(landmark => landmark.toLowerCase().includes(query))
    );

    if (matches.length > 0) {
        matches.slice(0, 5).forEach(city => { // Limit to 5 results
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.innerHTML = `
                <div>
                    <strong>${city.name}</strong>, ${city.state}
                    <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px;">
                        ${city.landmarks.slice(0, 2).join(', ')}
                    </div>
                </div>
            `;
            item.addEventListener('mousedown', function(e) {
                e.preventDefault(); // Prevent input blur
                selectCity(input, city);
            });
            dropdown.appendChild(item);
        });
        dropdown.classList.add('show');
    } else {
        dropdown.classList.remove('show');
    }
}

function selectCity(input, city) {
    input.value = `${city.name}, ${city.state}`;
    dropdownA.classList.remove('show');
    dropdownB.classList.remove('show');
    
    if (input === locationAInput) {
        selectedLocationA = city;
        updateCityButtonStates();
    } else {
        selectedLocationB = city;
        updateCityButtonStates();
    }
    
    validateInputs();
}

function handleUseLocation(event) {
    const targetInput = event.target.dataset.target === 'location-a' ? locationAInput : locationBInput;
    const btn = event.target;
    
    // Show loading state
    const originalText = btn.textContent;
    btn.textContent = '📍';
    btn.disabled = true;
    
    // Simulate getting current location with a random city
    setTimeout(() => {
        const randomCity = indianCitiesData[Math.floor(Math.random() * indianCitiesData.length)];
        selectCity(targetInput, randomCity);
        
        // Reset button
        btn.textContent = originalText;
        btn.disabled = false;
        
        // Visual feedback
        targetInput.style.borderColor = 'var(--color-success)';
        setTimeout(() => {
            targetInput.style.borderColor = 'var(--color-border)';
        }, 1000);
    }, 1000);
}

function handleCitySelection(event) {
    if (!event.target.classList.contains('city-btn')) return;
    
    const cityName = event.target.dataset.city;
    const city = indianCitiesData.find(c => c.name === cityName);
    
    if (!city) return;

    // Determine which input to fill
    if (!selectedLocationA) {
        selectCity(locationAInput, city);
    } else if (!selectedLocationB) {
        selectCity(locationBInput, city);
    } else {
        // Both filled, replace location A
        selectCity(locationAInput, city);
    }
}

function updateCityButtonStates() {
    document.querySelectorAll('.city-btn').forEach(btn => {
        btn.classList.remove('selected-a', 'selected-b');
        
        if (selectedLocationA && btn.dataset.city === selectedLocationA.name) {
            btn.classList.add('selected-a');
        }
        if (selectedLocationB && btn.dataset.city === selectedLocationB.name) {
            btn.classList.add('selected-b');
        }
    });
}

function handleFindSpots() {
    if (!selectedLocationA || !selectedLocationB) {
        alert('Please select valid locations from the suggestions');
        return;
    }

    // Show loading state
    findSpotsBtn.disabled = true;
    findSpotsBtn.textContent = 'Finding spots...';
    
    currentSearch = {
        locationA: selectedLocationA,
        locationB: selectedLocationB,
        timestamp: Date.now()
    };
    
    // Calculate midpoint
    calculateMidpoint();
    
    // Save to recent searches
    saveRecentSearch(currentSearch);
    
    // Show results
    setTimeout(() => {
        displayResults();
        findSpotsBtn.disabled = false;
        findSpotsBtn.textContent = 'Find Meeting Spots';
    }, 1500);
}

function calculateMidpoint() {
    const lat1 = selectedLocationA.coordinates[0];
    const lon1 = selectedLocationA.coordinates[1];
    const lat2 = selectedLocationB.coordinates[0];
    const lon2 = selectedLocationB.coordinates[1];
    
    const midLat = (lat1 + lat2) / 2;
    const midLon = (lon1 + lon2) / 2;
    
    // Calculate distance between points
    const distance = calculateDistance(lat1, lon1, lat2, lon2);
    
    currentMidpoint = {
        coordinates: [midLat, midLon],
        distance: distance,
        nearestCity: findNearestCity(midLat, midLon)
    };
    
    updateMapInfo();
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
}

function findNearestCity(lat, lon) {
    let nearestCity = null;
    let minDistance = Infinity;
    
    indianCitiesData.forEach(city => {
        const distance = calculateDistance(lat, lon, city.coordinates[0], city.coordinates[1]);
        if (distance < minDistance) {
            minDistance = distance;
            nearestCity = city;
        }
    });
    
    return nearestCity;
}

function updateMapInfo() {
    const midpointText = currentMidpoint.nearestCity ? 
        `Meeting point near ${currentMidpoint.nearestCity.name}, ${currentMidpoint.nearestCity.state}` :
        `Midpoint: ${currentMidpoint.coordinates[0].toFixed(4)}, ${currentMidpoint.coordinates[1].toFixed(4)}`;
    
    mapInfo.innerHTML = `
        <span class="midpoint-info">${midpointText}</span>
        <br>
        <small style="color: var(--color-text-secondary);">
            Distance: ${currentMidpoint.distance} km between locations
        </small>
    `;
}

function displayResults() {
    // Update map markers
    updateMapMarkers();
    
    // Generate venues based on midpoint
    generateVenuesForLocation();
    
    // Apply initial filters
    applyFilters();
    
    // Show results section with animation
    resultsSection.style.display = 'flex';
    resultsSection.classList.add('animate-fade-in');
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateMapMarkers() {
    // Calculate relative positions on the map
    const bounds = getMapBounds();
    
    // Position marker A
    const posA = convertCoordinatesToMapPosition(selectedLocationA.coordinates, bounds);
    markerA.style.left = `${posA.x}%`;
    markerA.style.top = `${posA.y}%`;
    markerA.style.opacity = '0';
    
    // Position marker B
    const posB = convertCoordinatesToMapPosition(selectedLocationB.coordinates, bounds);
    markerB.style.left = `${posB.x}%`;
    markerB.style.top = `${posB.y}%`;
    markerB.style.opacity = '0';
    
    // Position midpoint marker
    const posMid = convertCoordinatesToMapPosition(currentMidpoint.coordinates, bounds);
    markerMid.style.left = `${posMid.x}%`;
    markerMid.style.top = `${posMid.y}%`;
    markerMid.style.opacity = '0';
    
    // Animate markers appearing
    setTimeout(() => markerA.style.opacity = '1', 300);
    setTimeout(() => markerB.style.opacity = '1', 600);
    setTimeout(() => markerMid.style.opacity = '1', 900);
}

function getMapBounds() {
    const allCoords = [
        selectedLocationA.coordinates,
        selectedLocationB.coordinates,
        currentMidpoint.coordinates
    ];
    
    const lats = allCoords.map(coord => coord[0]);
    const lons = allCoords.map(coord => coord[1]);
    
    return {
        minLat: Math.min(...lats),
        maxLat: Math.max(...lats),
        minLon: Math.min(...lons),
        maxLon: Math.max(...lons)
    };
}

function convertCoordinatesToMapPosition(coordinates, bounds) {
    const [lat, lon] = coordinates;
    const latRange = bounds.maxLat - bounds.minLat || 1;
    const lonRange = bounds.maxLon - bounds.minLon || 1;
    
    const x = ((lon - bounds.minLon) / lonRange) * 80 + 10; // 10% margin on each side
    const y = 90 - (((lat - bounds.minLat) / latRange) * 80 + 10); // Invert Y axis, 10% margin
    
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
}

function generateVenuesForLocation() {
    // Use all venues but adjust their distances based on midpoint
    filteredVenues = indianVenuesData.map(venue => ({
        ...venue,
        distance: `${(Math.random() * 2 + 0.1).toFixed(1)} km`,
        id: venue.id + Math.random() // Ensure unique IDs
    }));
    
    // Shuffle venues
    filteredVenues = filteredVenues.sort(() => Math.random() - 0.5);
}

function applyFilters() {
    let venues = [...indianVenuesData];
    
    // Venue type filter
    const typeFilter = venueTypeFilter.value;
    if (typeFilter !== 'All Venues') {
        venues = venues.filter(venue => venue.type === typeFilter);
    }
    
    // Price filter
    const priceFilterValue = priceFilter.value;
    if (priceFilterValue !== 'All Prices') {
        venues = venues.filter(venue => venue.priceRange === priceFilterValue);
    }
    
    // Amenity filters
    const selectedAmenities = Array.from(amenityFilters.querySelectorAll('input:checked'))
        .map(input => input.value);
    
    if (selectedAmenities.length > 0) {
        venues = venues.filter(venue => 
            selectedAmenities.every(amenity => venue.amenities.includes(amenity))
        );
    }
    
    filteredVenues = venues;
    displayVenues();
}

function clearFilters() {
    venueTypeFilter.value = 'All Venues';
    priceFilter.value = 'All Prices';
    amenityFilters.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    applyFilters();
}

function displayVenues() {
    venuesCount.textContent = `${filteredVenues.length} venues found`;
    
    if (filteredVenues.length === 0) {
        venuesList.innerHTML = `
            <div class="loading-state">
                <p>No venues match your current filters</p>
                <button onclick="clearFilters()" class="btn btn--secondary">Clear Filters</button>
            </div>
        `;
        return;
    }
    
    venuesList.innerHTML = '';
    filteredVenues.forEach((venue, index) => {
        const venueCard = createVenueCard(venue);
        venueCard.style.opacity = '0';
        venueCard.style.transform = 'translateY(20px)';
        venuesList.appendChild(venueCard);
        
        // Animate cards appearing
        setTimeout(() => {
            venueCard.style.transition = 'all 0.3s ease';
            venueCard.style.opacity = '1';
            venueCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function createVenueCard(venue) {
    const card = document.createElement('div');
    card.className = 'venue-card';
    card.addEventListener('click', () => openVenueModal(venue));
    
    const stars = generateStarRating(venue.rating);
    
    card.innerHTML = `
        <div class="venue-header">
            <div class="venue-title">
                <div class="venue-name">${venue.name}</div>
                <span class="venue-type">${venue.type}</span>
            </div>
            <div class="venue-rating">
                <span class="rating-stars">${stars}</span>
                <span class="rating-number">${venue.rating}</span>
            </div>
        </div>
        
        <div class="venue-details">
            <div class="venue-detail">
                <span class="venue-detail-label">Distance</span>
                <span class="venue-detail-value">${venue.distance}</span>
            </div>
            <div class="venue-detail">
                <span class="venue-detail-label">Price</span>
                <span class="venue-detail-value">${venue.priceRange}</span>
            </div>
            <div class="venue-detail">
                <span class="venue-detail-label">Hours</span>
                <span class="venue-detail-value">${venue.hours}</span>
            </div>
        </div>
        
        <div class="venue-description">${venue.description}</div>
        
        <div class="venue-amenities">
            ${venue.amenities.map(amenity => `<span class="amenity-tag">${amenity}</span>`).join('')}
        </div>
    `;
    
    return card;
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
}

function openVenueModal(venue) {
    // Populate modal with venue data
    document.getElementById('modal-venue-name').textContent = venue.name;
    document.getElementById('modal-type').textContent = venue.type;
    document.getElementById('modal-distance').textContent = venue.distance;
    document.getElementById('modal-price').textContent = venue.priceRange;
    document.getElementById('modal-address').textContent = venue.address;
    document.getElementById('modal-hours').textContent = venue.hours;
    document.getElementById('modal-description').textContent = venue.description;
    
    // Handle phone number
    const phoneItem = document.getElementById('modal-phone-item');
    if (venue.phone) {
        document.getElementById('modal-phone').textContent = venue.phone;
        phoneItem.style.display = 'flex';
    } else {
        phoneItem.style.display = 'none';
    }
    
    // Rating
    const stars = generateStarRating(venue.rating);
    document.getElementById('modal-rating').innerHTML = `
        <span class="rating-stars">${stars}</span>
        <span class="rating-number">${venue.rating}/5</span>
    `;
    
    // Amenities
    const amenitiesSection = document.getElementById('modal-amenities-section');
    if (venue.amenities && venue.amenities.length > 0) {
        document.getElementById('modal-amenities').innerHTML = 
            venue.amenities.map(amenity => `<span class="amenity-tag">${amenity}</span>`).join('');
        amenitiesSection.style.display = 'block';
    } else {
        amenitiesSection.style.display = 'none';
    }
    
    // Suitable for
    const suitableSection = document.getElementById('modal-suitable-section');
    if (venue.suitableFor && venue.suitableFor.length > 0) {
        document.getElementById('modal-suitable').innerHTML = 
            venue.suitableFor.map(suitable => `<span class="amenity-tag">${suitable}</span>`).join('');
        suitableSection.style.display = 'block';
    } else {
        suitableSection.style.display = 'none';
    }
    
    // Image placeholder with gradient
    const imageEl = document.getElementById('modal-image');
    imageEl.textContent = `📍 ${venue.name}`;
    imageEl.style.background = getRandomGradient();
    
    // Store current venue for actions
    venueModal.currentVenue = venue;
    
    // Show modal
    venueModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeVenueModal() {
    venueModal.classList.add('hidden');
    document.body.style.overflow = '';
}

function getRandomGradient() {
    const gradients = [
        'linear-gradient(135deg, var(--color-primary) 0%, var(--color-saffron) 100%)',
        'linear-gradient(135deg, var(--color-saffron) 0%, var(--color-indian-green) 100%)',
        'linear-gradient(135deg, var(--color-indian-green) 0%, var(--color-primary) 100%)',
        'linear-gradient(135deg, var(--color-primary) 0%, var(--color-teal-400) 100%)',
        'linear-gradient(135deg, var(--color-saffron) 0%, var(--color-orange-400) 100%)'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
}

function handleGetDirections() {
    const venue = venueModal.currentVenue;
    if (venue) {
        // Create Google Maps URL
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address)}`;
        window.open(mapsUrl, '_blank');
        closeVenueModal();
    }
}

function handleShareVenue() {
    openShareModal();
}

function handleSaveVenue() {
    const venue = venueModal.currentVenue;
    if (venue) {
        // Visual feedback
        const btn = document.getElementById('save-venue');
        const originalText = btn.textContent;
        btn.textContent = 'Saved!';
        btn.style.background = 'var(--color-success)';
        btn.style.color = 'white';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
        }, 2000);
    }
}

function openShareModal() {
    shareModal.classList.remove('hidden');
}

function closeShareModal() {
    shareModal.classList.add('hidden');
}

function copyToClipboard() {
    const venue = venueModal.currentVenue;
    const text = venue ? 
        `Check out ${venue.name} for our meeting!\n📍 ${venue.address}\n⭐ ${venue.rating}/5 rating\n${venue.description}` :
        `Meeting spot suggestion: ${currentSearch?.locationA.name} to ${currentSearch?.locationB.name}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showShareSuccess('Details copied to clipboard!');
        }).catch(() => {
            showShareSuccess('Details copied!');
        });
    } else {
        showShareSuccess('Details copied!');
    }
}

function shareViaWhatsApp() {
    const venue = venueModal.currentVenue;
    const message = venue ? 
        `Let's meet at ${venue.name}! 📍 ${venue.address} ⭐ ${venue.rating}/5` :
        `Meeting location found between ${currentSearch?.locationA.name} and ${currentSearch?.locationB.name}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    closeShareModal();
    if (venue) closeVenueModal();
}

function shareViaEmail() {
    const venue = venueModal.currentVenue;
    const subject = venue ? `Meeting at ${venue.name}` : 'Meeting Location Suggestion';
    const body = venue ?
        `Hi! Let's meet at ${venue.name}.\n\nAddress: ${venue.address}\nRating: ${venue.rating}/5 stars\nHours: ${venue.hours}\n\n${venue.description}` :
        `I found a great meeting location between ${currentSearch?.locationA.name} and ${currentSearch?.locationB.name}`;
    
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    closeShareModal();
    if (venue) closeVenueModal();
}

function shareViaSMS() {
    const venue = venueModal.currentVenue;
    const message = venue ? 
        `Meeting at ${venue.name}, ${venue.address}. ${venue.rating}/5 stars!` :
        `Meeting location: ${currentSearch?.locationA.name} to ${currentSearch?.locationB.name}`;
    
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
    closeShareModal();
    if (venue) closeVenueModal();
}

function showShareSuccess(message) {
    // Create a temporary success message
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-success);
        color: white;
        padding: 12px 20px;
        border-radius: var(--radius-base);
        z-index: 10000;
        font-weight: 500;
        box-shadow: var(--shadow-lg);
    `;
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
    
    closeShareModal();
    if (venueModal.currentVenue) closeVenueModal();
}

function zoomMap(delta) {
    mapScale = Math.max(0.5, Math.min(3, mapScale + delta));
    const map = document.getElementById('map');
    map.style.transform = `scale(${mapScale})`;
    map.style.transition = 'transform 0.3s ease';
}

function centerMap() {
    mapScale = 1;
    const map = document.getElementById('map');
    map.style.transform = 'scale(1)';
    map.style.transition = 'transform 0.3s ease';
}

function saveRecentSearch(search) {
    // Remove if already exists
    recentSearches = recentSearches.filter(s => 
        !(s.locationA.name === search.locationA.name && s.locationB.name === search.locationB.name)
    );
    
    // Add to beginning
    recentSearches.unshift(search);
    
    // Limit to 5 searches
    recentSearches = recentSearches.slice(0, 5);
    
    // Update display
    loadRecentSearches();
}

function loadRecentSearches() {
    if (recentSearches.length === 0) {
        recentSearchesList.innerHTML = '<p class="text-secondary">No recent searches</p>';
        return;
    }
    
    recentSearchesList.innerHTML = recentSearches.map(search => {
        const date = new Date(search.timestamp).toLocaleDateString('en-IN');
        return `
            <div class="recent-search-item" onclick="loadRecentSearch('${search.locationA.name}', '${search.locationB.name}')">
                <div class="recent-search-text">${search.locationA.name} ↔ ${search.locationB.name}</div>
                <div class="recent-search-date">${date}</div>
            </div>
        `;
    }).join('');
}

function loadRecentSearch(locationAName, locationBName) {
    const cityA = indianCitiesData.find(c => c.name === locationAName);
    const cityB = indianCitiesData.find(c => c.name === locationBName);
    
    if (cityA && cityB) {
        selectCity(locationAInput, cityA);
        selectCity(locationBInput, cityB);
        
        // Visual feedback
        [locationAInput, locationBInput].forEach((input, index) => {
            setTimeout(() => {
                input.style.borderColor = 'var(--color-success)';
                setTimeout(() => {
                    input.style.borderColor = 'var(--color-border)';
                }, 1000);
            }, index * 100);
        });
    }
}

// Make functions available globally for onclick handlers
window.clearFilters = clearFilters;
window.loadRecentSearch = loadRecentSearch;
window.copyToClipboard = copyToClipboard;
window.shareViaWhatsApp = shareViaWhatsApp;
window.shareViaEmail = shareViaEmail;
window.shareViaSMS = shareViaSMS;
window.closeShareModal = closeShareModal;

console.log('🇮🇳 MeetHalfway India - Ready to connect people across the nation!');