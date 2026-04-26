
function extractPricePulseData() {
  const title = document.querySelector("#productTitle")?.innerText?.trim();
  const priceRaw = document.querySelector(".a-price-whole")?.innerText;
  const fraction = document.querySelector(".a-price-fraction")?.innerText || "00";
  const price = priceRaw ? priceRaw.replace(/[,₹]/g, '') + "." + fraction : null;

  chrome.runtime.sendMessage({
    type: "PP_SCRAPED",
    title,
    price
  });
}

setTimeout(extractPricePulseData, 1500);
