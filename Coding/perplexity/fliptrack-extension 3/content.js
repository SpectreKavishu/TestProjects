console.log('[FlipTrack] Content script loaded on', window.location.hostname);

// Wait for page to fully load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTracker);
} else {
  initTracker();
}

function initTracker() {
  console.log('[FlipTrack] Initializing tracker');

  // Get product info from page
  const productTitle = getProductTitle();
  const productPrice = getProductPrice();

  console.log('[FlipTrack] Found title:', productTitle);
  console.log('[FlipTrack] Found price:', productPrice);

  if (productTitle || productPrice) {
    addTrackingButton(productTitle, productPrice);
  } else {
    console.log('[FlipTrack] Could not find product info');
  }
}

function getProductTitle() {
  // Try multiple selectors for Flipkart
  const selectors = [
    'h1',
    '[class*="title"]',
    '[class*="Title"]',
    '[class*="headline"]',
    'span[class*="ProductTitle"]',
    '.Nx9bqd',
    '._6BADH8',
    'div[data-qa="plp-title"]'
  ];

  for (let selector of selectors) {
    const elem = document.querySelector(selector);
    if (elem && elem.textContent.trim().length > 0) {
      return elem.textContent.trim().substring(0, 100);
    }
  }

  return null;
}

function getProductPrice() {
  // Try multiple selectors for Flipkart prices
  const selectors = [
    '[class*="price"]',
    '[class*="Price"]',
    '._30jeq3',
    '[data-qa="price"]',
    '.Nx9bqd',
    'span[class*="rupee"]'
  ];

  for (let selector of selectors) {
    const elem = document.querySelector(selector);
    if (elem) {
      const priceText = elem.textContent || elem.innerText;
      const price = parseInt(priceText.replace(/[^0-9]/g, ''));
      if (!isNaN(price) && price > 0) {
        return price;
      }
    }
  }

  return null;
}

function addTrackingButton(productTitle, productPrice) {
  // Don't add multiple buttons
  if (document.getElementById('fliptrack-track-btn')) {
    console.log('[FlipTrack] Button already exists');
    return;
  }

  const button = document.createElement('button');
  button.id = 'fliptrack-track-btn';
  button.textContent = '📌 Track Price with FlipTrack';
  button.setAttribute('type', 'button');
  button.style.cssText = `
    padding: 12px 20px;
    background: linear-gradient(135deg, #6750a4 0%, #5a4080 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin: 12px 0;
    box-shadow: 0 2px 8px rgba(103, 80, 164, 0.3);
    transition: all 0.3s ease;
    display: block;
    width: 100%;
    z-index: 9999;
  `;

  button.addEventListener('mouseover', () => {
    button.style.transform = 'translateY(-2px)';
    button.style.boxShadow = '0 4px 12px rgba(103, 80, 164, 0.4)';
  });

  button.addEventListener('mouseout', () => {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 2px 8px rgba(103, 80, 164, 0.3)';
  });

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    trackProduct(productTitle, productPrice, button);
  });

  // Insert button at top of page
  const topContainer = document.body.firstChild;
  if (topContainer) {
    topContainer.parentNode.insertBefore(button, topContainer);
  } else {
    document.body.insertBefore(button, document.body.firstChild);
  }

  console.log('[FlipTrack] Button added to page');
}

function trackProduct(productTitle, productPrice, button) {
  const productName = productTitle || 'Unknown Product';
  const price = productPrice || 0;
  const url = window.location.href;

  console.log('[FlipTrack] Tracking product:', { productName, price, url });

  chrome.runtime.sendMessage(
    {
      action: 'addProduct',
      data: {
        name: productName,
        price: price,
        url: url
      }
    },
    (response) => {
      console.log('[FlipTrack] Response from background:', response);

      if (response && response.success) {
        button.textContent = '✅ Added to FlipTrack!';
        button.disabled = true;
        button.style.background = 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)';

        // Show browser notification
        if (Notification.permission === 'granted') {
          new Notification('FlipTrack', {
            body: productName + ' added to tracking',
            icon: chrome.runtime.getURL('icons/icon_48.png')
          });
        }

        setTimeout(() => {
          button.textContent = '📌 Track Price with FlipTrack';
          button.disabled = false;
          button.style.background = 'linear-gradient(135deg, #6750a4 0%, #5a4080 100%)';
        }, 3000);

        console.log('[FlipTrack] Product tracked successfully');
      } else {
        console.error('[FlipTrack] Failed to track product:', response);
        alert('Failed to track product. Check console for details.');
      }
    }
  );
}

// Request notification permission
if (Notification.permission === 'default') {
  Notification.requestPermission();
}

console.log('[FlipTrack] Content script initialization complete');
