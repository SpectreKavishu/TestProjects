// Content script for FlipTrack Pro
// This script runs on Flipkart pages

console.log('[FlipTrack] Content script loaded on', window.location.hostname);

// Add tracking button to product pages
window.addEventListener('load', () => {
  const productTitle = document.querySelector('[class*="ProductTitle"]') || 
                       document.querySelector('[class*="title"]') ||
                       document.querySelector('h1');

  const productPrice = document.querySelector('[class*="price"]') ||
                       document.querySelector('[class*="Price"]');

  if (productTitle && productPrice) {
    addTrackingButton(productTitle, productPrice);
  }
});

// Add tracking button to the page
function addTrackingButton(titleElement, priceElement) {
  const button = document.createElement('button');
  button.id = 'fliptrack-track-btn';
  button.textContent = '📌 Track Price with FlipTrack';
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
  `;

  button.addEventListener('mouseover', () => {
    button.style.transform = 'translateY(-2px)';
    button.style.boxShadow = '0 4px 12px rgba(103, 80, 164, 0.4)';
  });

  button.addEventListener('mouseout', () => {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 2px 8px rgba(103, 80, 164, 0.3)';
  });

  button.addEventListener('click', () => {
    trackProduct(titleElement, priceElement, button);
  });

  titleElement.parentElement.insertBefore(button, titleElement.nextSibling);
}

// Track a product
function trackProduct(titleElement, priceElement, button) {
  const productName = titleElement.textContent.trim();
  const priceText = priceElement.textContent.trim();
  const price = parseInt(priceText.replace(/[^0-9]/g, ''));
  const url = window.location.href;

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
      if (response.success) {
        button.textContent = '✅ Added to FlipTrack!';
        button.disabled = true;
        button.style.background = 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)';

        setTimeout(() => {
          button.textContent = '📌 Track Price with FlipTrack';
          button.disabled = false;
          button.style.background = 'linear-gradient(135deg, #6750a4 0%, #5a4080 100%)';
        }, 3000);

        console.log('[FlipTrack] Product tracked:', productName);
      }
    }
  );
}
