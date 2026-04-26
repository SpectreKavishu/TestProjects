
document.getElementById("trackBtn").addEventListener("click", async () => {
  const url = document.getElementById("urlInput").value.trim();
  if (!url.includes("amazon")) {
    alert("Please enter a valid Amazon product URL.");
    return;
  }

  chrome.tabs.create({ url }, () => {
    document.getElementById("result").innerHTML = "Fetching price… Switch to newly opened tab.";
  });
});
