document.addEventListener('DOMContentLoaded', () => {
  console.log('[FlipTrack] Popup loaded');
  loadTrackedProducts();
  setupEventListeners();
});

function loadTrackedProducts() {
  chrome.storage.local.get('trackedProducts', (data) => {
    const products = data.trackedProducts || [];
    const productsList = document.getElementById('productsList');
    const productCount = document.getElementById('productCount');

    productCount.textContent = products.length;

    if (products.length === 0) {
      productsList.innerHTML = '<p class="empty-state">No tracked products yet</p>';
      return;
    }

    productsList.innerHTML = products.map(product => `
      <div class="product-item">
        <div class="product-name">${escapeHtml(product.name)}</div>
        <div class="product-price">
          <span class="current-price">₹${product.currentPrice || 'N/A'}</span>
        </div>
        <div class="product-actions">
          <button class="btn-small btn-remove" data-id="${product.id}">Remove</button>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = e.target.dataset.id;
        removeProduct(productId);
      });
    });
  });
}

function removeProduct(productId) {
  chrome.runtime.sendMessage(
    { action: 'removeProduct', productId },
    (response) => {
      if (response.success) {
        showNotification('Product removed');
        loadTrackedProducts();
      }
    }
  );
}

function setupEventListeners() {
  document.getElementById('viewDashboard').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://fliptrack-pro.firebaseapp.com' });
  });

  document.getElementById('settings').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.className = 'notification';
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 2000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
