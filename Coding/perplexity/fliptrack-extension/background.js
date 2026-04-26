// Service worker for FlipTrack Pro
// This runs in the background to sync data and manage alarms

console.log('[FlipTrack] Background service worker loaded');

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('[FlipTrack] Extension installed');
  chrome.storage.local.set({
    trackedProducts: [],
    alerts: [],
    userSettings: {
      emailAlerts: true,
      priceCheckInterval: 30
    }
  });
});

// Message handler for adding/removing products
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'addProduct') {
    addTrackedProduct(request.data).then(result => {
      sendResponse({ success: true, message: 'Product added to tracking', data: result });
    }).catch(error => {
      sendResponse({ success: false, message: error.message });
    });
    return true;
  }

  if (request.action === 'removeProduct') {
    removeTrackedProduct(request.productId).then(() => {
      sendResponse({ success: true, message: 'Product removed from tracking' });
    }).catch(error => {
      sendResponse({ success: false, message: error.message });
    });
    return true;
  }

  if (request.action === 'getTrackedProducts') {
    chrome.storage.local.get('trackedProducts', (data) => {
      sendResponse({ success: true, products: data.trackedProducts || [] });
    });
    return true;
  }
});

// Add a product to tracking
async function addTrackedProduct(productData) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('trackedProducts', (data) => {
      const products = data.trackedProducts || [];

      const newProduct = {
        id: generateId(),
        url: productData.url,
        name: productData.name || 'Unknown Product',
        originalPrice: productData.price || null,
        currentPrice: productData.price || null,
        priceHistory: [{
          price: productData.price,
          date: new Date().toISOString()
        }],
        alerts: [],
        addedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      products.push(newProduct);
      chrome.storage.local.set({ trackedProducts: products }, () => {
        console.log('[FlipTrack] Product added:', newProduct.name);
        resolve(newProduct);
      });
    });
  });
}

// Remove a product from tracking
async function removeTrackedProduct(productId) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('trackedProducts', (data) => {
      const products = data.trackedProducts || [];
      const filtered = products.filter(p => p.id !== productId);
      chrome.storage.local.set({ trackedProducts: filtered }, () => {
        console.log('[FlipTrack] Product removed:', productId);
        resolve();
      });
    });
  });
}

// Generate unique ID
function generateId() {
  return 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Periodic price check (every 30 minutes)
chrome.alarms.create('priceCheck', { periodInMinutes: 30 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'priceCheck') {
    console.log('[FlipTrack] Running scheduled price check');
    checkPrices();
  }
});

// Check prices of all tracked products
async function checkPrices() {
  chrome.storage.local.get('trackedProducts', (data) => {
    const products = data.trackedProducts || [];
    console.log('[FlipTrack] Checking prices for', products.length, 'products');
  });
}

console.log('[FlipTrack] Background initialization complete');
