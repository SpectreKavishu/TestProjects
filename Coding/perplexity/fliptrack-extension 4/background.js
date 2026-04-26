// Service worker for FlipTrack Pro
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

// Message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[FlipTrack] Message received:', request.action);

  if (request.action === 'addProduct') {
    addTrackedProduct(request.data).then(result => {
      console.log('[FlipTrack] Product added successfully');
      sendResponse({ success: true, message: 'Product added to tracking', data: result });
    }).catch(error => {
      console.error('[FlipTrack] Error adding product:', error);
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

// Add product
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

// Remove product
async function removeTrackedProduct(productId) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('trackedProducts', (data) => {
      const products = data.trackedProducts || [];
      const filtered = products.filter(p => p.id !== productId);
      chrome.storage.local.set({ trackedProducts: filtered }, () => {
        console.log('[FlipTrack] Product removed');
        resolve();
      });
    });
  });
}

function generateId() {
  return 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

chrome.alarms.create('priceCheck', { periodInMinutes: 30 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'priceCheck') {
    console.log('[FlipTrack] Price check running');
    checkPrices();
  }
});

async function checkPrices() {
  chrome.storage.local.get('trackedProducts', async (data) => {
    const products = data.trackedProducts || [];

    for (const product of products) {
      try {
        const currentPrice = await fetchProductPrice(product.url);
        if (currentPrice && currentPrice !== product.currentPrice) {
          updateProductPrice(product, currentPrice);
        }
      } catch (error) {
        console.error(`[FlipTrack] Error checking price for ${product.name}:`, error);
      }
    }
  });
}

async function fetchProductPrice(url) {
  try {
    const response = await fetch(url);
    const text = await response.text();

    // Regex to find price in Flipkart's HTML
    // Looking for <div class="_30jeq3 ...">₹51,999</div>
    // or similar patterns.
    // Note: This is a simple regex and might need adjustment if Flipkart changes structure significantly.
    const priceRegex = /<div[^>]*class="[^"]*?_30jeq3[^"]*?"[^>]*>([^<]+)<\/div>/;
    const match = text.match(priceRegex);

    if (match && match[1]) {
      const priceText = match[1];
      const price = parseInt(priceText.replace(/[^0-9]/g, ''));
      return isNaN(price) ? null : price;
    }

    return null;
  } catch (error) {
    console.error('[FlipTrack] Fetch error:', error);
    return null;
  }
}

function updateProductPrice(product, newPrice) {
  chrome.storage.local.get('trackedProducts', (data) => {
    const products = data.trackedProducts || [];
    const index = products.findIndex(p => p.id === product.id);

    if (index !== -1) {
      const oldPrice = products[index].currentPrice;
      products[index].currentPrice = newPrice;
      products[index].lastUpdated = new Date().toISOString();
      products[index].priceHistory.push({
        price: newPrice,
        date: new Date().toISOString()
      });

      chrome.storage.local.set({ trackedProducts: products }, () => {
        console.log(`[FlipTrack] Updated price for ${product.name}: ${oldPrice} -> ${newPrice}`);

        if (newPrice < oldPrice) {
          sendPriceDropNotification(product, newPrice, oldPrice);
        }
      });
    }
  });
}

function sendPriceDropNotification(product, newPrice, oldPrice) {
  if (Notification.permission === 'granted') {
    const drop = oldPrice - newPrice;
    new Notification('Price Drop Alert!', {
      body: `${product.name} is now ₹${newPrice} (Dropped by ₹${drop})`,
      icon: chrome.runtime.getURL('icons/icon_48.png')
    });
  }
}
