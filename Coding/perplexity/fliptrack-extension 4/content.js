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
  const selectors = [
    'span.B_NuCI',
    'h1._6EBuvT',
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
  // 1. Try specific selectors first
  const selectors = [
    'div._30jeq3._16Jk6d',
    'div._30jeq3',
    '.Nx9bqd',
    '.CxhGGd',
    '._25b18c',
    '[class*="price"]',
    '[class*="Price"]',
    '[data-qa="price"]',
    'span[class*="rupee"]'
  ];

  for (let selector of selectors) {
    const elem = document.querySelector(selector);
    if (elem) {
      const priceText = elem.textContent || elem.innerText;
      const price = parsePrice(priceText);
      if (price) return price;
    }
  }

  // 2. Fallback: Find element with '₹' or 'Rs.' and largest font size
  try {
    const allElements = document.querySelectorAll('*');
    let maxFontSize = 0;
    let bestPrice = null;

    for (let elem of allElements) {
      // Optimization: skip elements with too many children or too much text
      if (elem.children.length > 0 || elem.textContent.length > 20) continue;

      const text = elem.textContent.trim();
      if (text.includes('₹') || text.toLowerCase().includes('rs.')) {
        const price = parsePrice(text);
        if (price) {
          const fontSize = parseFloat(window.getComputedStyle(elem).fontSize);
          if (fontSize > maxFontSize) {
            maxFontSize = fontSize;
            bestPrice = price;
          }
        }
      }
    }

    if (bestPrice) {
      console.log('[FlipTrack] Found price via fallback:', bestPrice);
      return bestPrice;
    }
  } catch (e) {
    console.error('[FlipTrack] Error in price fallback:', e);
  }

  return null;
}

function parsePrice(text) {
  if (!text) return null;
  const price = parseInt(text.replace(/[^0-9]/g, ''));
  return (!isNaN(price) && price > 0) ? price : null;
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
  button.className = 'fliptrack-button';

  // Use CSS classes instead of inline styles
  const style = document.createElement('style');
  style.textContent = `
    .fliptrack-button {
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
    }

    .fliptrack-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(103, 80, 164, 0.4);
    }

    .fliptrack-button:active {
      transform: translateY(0);
    }

    .fliptrack-button.success {
      background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
    }
  `;
  document.head.appendChild(style);

  // Add click listener properly (no inline handler)
  button.addEventListener('click', handleTrackClick);

  // Store product data on button for access in event handler
  button._productTitle = productTitle;
  button._productPrice = productPrice;

  // Insert button at top of page
  const topContainer = document.body.firstChild;
  if (topContainer) {
    topContainer.parentNode.insertBefore(button, topContainer);
  } else {
    document.body.insertBefore(button, document.body.firstChild);
  }

  console.log('[FlipTrack] Button added to page');
}

// Separate function for click handling (no inline code)
function handleTrackClick(event) {
  event.preventDefault();
  event.stopPropagation();

  const button = event.currentTarget;
  const productTitle = button._productTitle || 'Unknown Product';
  const productPrice = button._productPrice || 0;
  const url = window.location.href;

  console.log('[FlipTrack] Tracking product:', { productTitle, productPrice, url });

  chrome.runtime.sendMessage(
    {
      action: 'addProduct',
      data: {
        name: productTitle,
        price: productPrice,
        url: url
      }
    },
    (response) => {
      console.log('[FlipTrack] Response from background:', response);

      if (response && response.success) {
        button.textContent = '✅ Added to FlipTrack!';
        button.disabled = true;
        button.classList.add('success');

        // Show browser notification
        if (Notification.permission === 'granted') {
          try {
            new Notification('FlipTrack', {
              body: productTitle + ' added to tracking',
              icon: chrome.runtime.getURL('icons/icon_48.png')
            });
          } catch (e) {
            console.log('[FlipTrack] Notification error:', e);
          }
        }

        setTimeout(() => {
          button.textContent = '📌 Track Price with FlipTrack';
          button.disabled = false;
          button.classList.remove('success');
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
