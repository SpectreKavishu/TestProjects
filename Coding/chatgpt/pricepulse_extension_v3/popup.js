document.getElementById('trackBtn').addEventListener('click', () => {
  const id = document.getElementById('productIdInput').value;
  if (!id) return alert('Enter valid ID');
  chrome.storage.local.get(['tracked'], data => {
    const arr = data.tracked || [];
    if (!arr.includes(id)) arr.push(id);
    chrome.storage.local.set({ tracked: arr });
    load();
  });
});
function load() {
  chrome.storage.local.get(['tracked'], data => {
    const arr = data.tracked || [];
    const list = document.getElementById('trackedList');
    list.innerHTML = '';
    arr.forEach(x => {
      const li = document.createElement('li');
      li.textContent = x;
      list.appendChild(li);
    });
  });
}
load();
