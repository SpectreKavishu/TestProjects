# Hindu Calendar API Integration Guide

## Available API Providers

### 1. Free Astrology API (Recommended for Beginners)
**Website**: https://freeastrologyapi.com/  
**Pricing**: Free tier available  
**Best for**: Getting started, basic Panchang data

#### Setup
```javascript
const API_KEY = 'your_api_key_here';
const API_ENDPOINT = 'https://json.freeastrologyapi.com/complete-panchang';

const fetchPanchang = async (lat, lon, date) => {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    },
    body: JSON.stringify({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: date.getDate(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: 0,
      latitude: lat,
      longitude: lon,
      timezone: 5.5,
      config: {
        observation_point: 'topocentric',
        ayanamsha: 'lahiri'
      }
    })
  });
  
  return await response.json();
};
```

#### Response Format
```json
{
  "day": "Sunday",
  "sunrise": "06:42:15",
  "sunset": "18:15:30",
  "moonrise": "15:30:20",
  "moonset": "04:45:10",
  "tithi": {
    "details": {
      "tithi_name": "Dashami",
      "tithi_number": 10
    },
    "end_time": {
      "hour": 14,
      "minute": 23,
      "second": 0
    }
  },
  "paksha": "Shukla Paksha",
  "nakshatra": {
    "details": {
      "nak_name": "Uttara Phalguni",
      "deity": "Aryaman"
    }
  },
  "yog": {
    "details": {
      "yog_name": "Shiva"
    }
  },
  "karan": {
    "details": {
      "karan_name": "Baalava"
    }
  },
  "rahukaal": {
    "start": "16:30:00",
    "end": "18:00:00"
  },
  "abhijit_muhurta": {
    "start": "12:15",
    "end": "13:03"
  }
}
```

---

### 2. Panchang.click
**Website**: https://panchang.click/panchang-api  
**Pricing**: Free basic plan, Premium plans available  
**Best for**: Simple integration with basic Panchang elements

#### Setup
```javascript
const API_ENDPOINT = 'https://api.panchang.click/api/v1/panchang';

const fetchPanchang = async (lat, lon) => {
  const url = `${API_ENDPOINT}?lat=${lat}&lon=${lon}&date=${new Date().toISOString().split('T')[0]}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
};
```

---

### 3. AstrologyAPI.com
**Website**: https://astrologyapi.com/  
**Pricing**: Paid ($9-$49/month)  
**Best for**: Professional apps, comprehensive data

#### Setup
```javascript
const USER_ID = 'your_user_id';
const API_KEY = 'your_api_key';
const API_ENDPOINT = 'https://json.astrologyapi.com/v1/advanced_panchang';

const fetchPanchang = async (lat, lon, date) => {
  const auth = 'Basic ' + btoa(`${USER_ID}:${API_KEY}`);
  
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      hour: date.getHours(),
      min: date.getMinutes(),
      lat: lat,
      lon: lon,
      tzone: 5.5
    })
  });
  
  return await response.json();
};
```

---

### 4. DivineAPI
**Website**: https://divineapi.com/  
**Pricing**: 7-day free trial, then $0.24/1000 calls  
**Best for**: Scalable production apps

#### Setup
```javascript
const API_KEY = 'your_api_key';
const API_ENDPOINT = 'https://divineapi.com/api/1.0/panchang';

const fetchPanchang = async (lat, lon, date) => {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      api_key: API_KEY,
      date: date.toISOString().split('T')[0],
      lat: lat,
      lon: lon,
      tz: 5.5,
      lang: 'en'
    })
  });
  
  return await response.json();
};
```

---

## Festival Data APIs

### Using ProKerala API for Festivals
**Website**: https://api.prokerala.com/  
**Best for**: Hindu festival calendar

```javascript
const PROKERALA_API_KEY = 'your_api_key';

const fetchFestivals = async (year, month) => {
  const response = await fetch(
    `https://api.prokerala.com/v2/astrology/hindu-calendar?ayanamsa=1&year=${year}&month=${month}`,
    {
      headers: {
        'Authorization': `Bearer ${PROKERALA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return await response.json();
};
```

---

## Environment Variables Setup

### For React App
Create a `.env` file in your project root:

```env
REACT_APP_PANCHANG_API_KEY=your_api_key_here
REACT_APP_PANCHANG_API_ENDPOINT=https://json.freeastrologyapi.com/complete-panchang
```

Then use in your code:
```javascript
const API_KEY = process.env.REACT_APP_PANCHANG_API_KEY;
const API_ENDPOINT = process.env.REACT_APP_PANCHANG_API_ENDPOINT;
```

### For React Native
Install react-native-config:
```bash
npm install react-native-config
```

Create `.env`:
```env
PANCHANG_API_KEY=your_api_key_here
PANCHANG_API_ENDPOINT=https://json.freeastrologyapi.com/complete-panchang
```

Use in code:
```javascript
import Config from 'react-native-config';

const API_KEY = Config.PANCHANG_API_KEY;
const API_ENDPOINT = Config.PANCHANG_API_ENDPOINT;
```

---

## Error Handling

### Robust API Call with Error Handling

```javascript
const fetchPanchangData = async (lat, lon) => {
  try {
    const now = new Date();
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        date: now.getDate(),
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: 0,
        latitude: lat,
        longitude: lon,
        timezone: 5.5,
        config: {
          observation_point: 'topocentric',
          ayanamsha: 'lahiri'
        }
      })
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your credentials.');
      } else if (response.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      } else if (response.status === 500) {
        throw new Error('API server error. Please try again later.');
      } else {
        throw new Error(`API error: ${response.status}`);
      }
    }

    const data = await response.json();
    
    // Validate response data
    if (!data || !data.tithi) {
      throw new Error('Invalid response from API');
    }
    
    return data;
    
  } catch (error) {
    console.error('Error fetching Panchang data:', error);
    
    // Return cached data if available
    const cachedData = localStorage.getItem('lastPanchangData');
    if (cachedData) {
      console.log('Using cached data');
      return JSON.parse(cachedData);
    }
    
    // Throw error to be handled by component
    throw error;
  }
};
```

---

## Caching Strategy

### Local Storage Caching

```javascript
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

const getCachedPanchang = () => {
  const cached = localStorage.getItem('panchangData');
  if (!cached) return null;
  
  const { data, timestamp } = JSON.parse(cached);
  const now = Date.now();
  
  // Return cached data if less than 1 hour old
  if (now - timestamp < CACHE_DURATION) {
    return data;
  }
  
  return null;
};

const cachePanchang = (data) => {
  localStorage.setItem('panchangData', JSON.stringify({
    data,
    timestamp: Date.now()
  }));
};

const fetchPanchangData = async (lat, lon) => {
  // Try cache first
  const cached = getCachedPanchang();
  if (cached) {
    console.log('Using cached data');
    return cached;
  }
  
  // Fetch from API
  const data = await fetchFromAPI(lat, lon);
  
  // Cache the result
  cachePanchang(data);
  
  return data;
};
```

---

## Rate Limiting

### Implementing Request Throttling

```javascript
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 5000; // 5 seconds

const fetchPanchangWithThrottle = async (lat, lon) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    // Return cached data if available
    const cached = getCachedPanchang();
    if (cached) return cached;
    
    // Wait for remaining time
    await new Promise(resolve => 
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }
  
  lastRequestTime = Date.now();
  return await fetchPanchangData(lat, lon);
};
```

---

## Testing APIs

### Using Postman or cURL

#### cURL Example
```bash
curl -X POST https://json.freeastrologyapi.com/complete-panchang \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "year": 2026,
    "month": 2,
    "date": 8,
    "hours": 12,
    "minutes": 0,
    "seconds": 0,
    "latitude": 28.6139,
    "longitude": 77.2090,
    "timezone": 5.5,
    "config": {
      "observation_point": "topocentric",
      "ayanamsha": "lahiri"
    }
  }'
```

---

## Location Services

### Getting User's Location

```javascript
const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        console.error('Location error:', error);
        // Return default location (Delhi)
        resolve({
          lat: 28.6139,
          lon: 77.2090,
          name: 'New Delhi'
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};
```

---

## Major Indian Cities Coordinates

For testing or allowing users to select cities:

```javascript
const INDIAN_CITIES = {
  'New Delhi': { lat: 28.6139, lon: 77.2090 },
  'Mumbai': { lat: 19.0760, lon: 72.8777 },
  'Bangalore': { lat: 12.9716, lon: 77.5946 },
  'Kolkata': { lat: 22.5726, lon: 88.3639 },
  'Chennai': { lat: 13.0827, lon: 80.2707 },
  'Hyderabad': { lat: 17.3850, lon: 78.4867 },
  'Pune': { lat: 18.5204, lon: 73.8567 },
  'Ahmedabad': { lat: 23.0225, lon: 72.5714 },
  'Jaipur': { lat: 26.9124, lon: 75.7873 },
  'Varanasi': { lat: 25.3176, lon: 82.9739 },
  'Ayodhya': { lat: 26.7922, lon: 82.1998 },
  'Mathura': { lat: 27.4924, lon: 77.6737 },
  'Haridwar': { lat: 29.9457, lon: 78.1642 },
  'Ujjain': { lat: 23.1765, lon: 75.7885 },
  'Tirupati': { lat: 13.6288, lon: 79.4192 }
};
```

---

## API Cost Calculator

Estimate your monthly API costs:

```javascript
const calculateMonthlyCost = (dailyActiveUsers, avgRequestsPerUser, costPer1000) => {
  const monthlyRequests = dailyActiveUsers * avgRequestsPerUser * 30;
  const monthlyCost = (monthlyRequests / 1000) * costPer1000;
  
  return {
    monthlyRequests,
    monthlyCost: monthlyCost.toFixed(2),
    yearlyEstimate: (monthlyCost * 12).toFixed(2)
  };
};

// Example
console.log(calculateMonthlyCost(1000, 2, 0.24));
// Output: 
// {
//   monthlyRequests: 60000,
//   monthlyCost: "14.40",
//   yearlyEstimate: "172.80"
// }
```

---

## Recommended Approach

### For Development/Testing
- Use **Free Astrology API** or **Panchang.click**
- Free tier is usually sufficient
- Easy to set up

### For Production (Small Scale)
- **Free Astrology API** with caching
- Monitor usage carefully
- Consider upgrading if you exceed limits

### For Production (Medium/Large Scale)
- **DivineAPI** or **AstrologyAPI.com**
- More reliable and scalable
- Better support and documentation
- Worth the cost for serious apps

---

## Security Best Practices

1. **Never commit API keys to version control**
   - Use `.env` files
   - Add `.env` to `.gitignore`

2. **Use environment variables**
   - Different keys for development/production

3. **Implement rate limiting**
   - Prevent abuse
   - Cache aggressively

4. **Validate API responses**
   - Don't assume API always returns valid data
   - Have fallback mechanisms

5. **Monitor API usage**
   - Set up alerts for unusual activity
   - Track costs

---

## Next Steps

1. **Sign up for an API**: Choose one from the providers above
2. **Get your API key**: Follow their registration process
3. **Test the API**: Use cURL or Postman to verify it works
4. **Integrate into app**: Add the code to your React component
5. **Test thoroughly**: Make sure all data displays correctly
6. **Add error handling**: Gracefully handle API failures
7. **Implement caching**: Reduce API calls and costs

Good luck! 🙏
