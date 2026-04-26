import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

// PricePulse - Single-file React component (Tailwind + Material-like UX)
// How to use:
// 1) Create a new Vite + React project (or CRA) and install: react, recharts, framer-motion, lucide-react
// 2) Paste this component into src/App.jsx and run the dev server.
// 3) Replace mock fetch functions with your backend endpoints.

// Quick notes on backend & legal:
// - Flipkart doesn't publish a public product price API. Typical approaches are: 1) use an affiliate API if available, 2) licensed data partners, or 3) build a backend scraper/crawler that respects robots.txt and rate limits and proxies. Make sure to comply with Flipkart's TOS and local law.
// - For production you'll need a backend to: fetch product pages, normalize prices, store historical data, send alerts (email/push), and serve product search.

// Monetization ideas (implemented in UI hooks below):
// - Affiliate links for product redirects (premium conversions)
// - Freemium: basic free alerts, paid advanced analytics & unlimited trackers
// - API access / CSV exports for power users

// ---------- Mock utilities (replace with real API calls) ----------
const mockSearch = async (q) => {
  // pretend search: return a few Flipkart-like products
  await new Promise((r) => setTimeout(r, 400));
  return [
    {
      id: "FK-1001",
      title: "Hero Activa 125 (Mock) - Anniversary Edition",
      image: "https://via.placeholder.com/160",
      currentPrice: 75500,
      seller: "Flipkart",
      url: "https://www.flipkart.com/product/fk-1001",
    },
    {
      id: "FK-2002",
      title: "Vespa Base Model (Mock)",
      image: "https://via.placeholder.com/160",
      currentPrice: 149000,
      seller: "Flipkart",
      url: "https://www.flipkart.com/product/fk-2002",
    },
  ].filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));
};

const mockHistory = (basePrice) => {
  const out = [];
  const now = Date.now();
  for (let i = 12; i >= 0; i--) {
    out.push({
      date: new Date(now - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
      price: Math.round(basePrice * (0.9 + Math.random() * 0.2)),
    });
  }
  return out;
};

// ----------------- UI Components -----------------
function Navbar({ onCreate }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold">PP</div>
            <div>
              <div className="text-lg font-semibold">PricePulse</div>
              <div className="text-xs text-gray-500">Flipkart price tracking — realtime insights</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onCreate}
              className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm shadow-md hover:bg-indigo-700"
            >
              Track new product
            </button>
            <div className="text-sm text-gray-600">Signed in as <span className="font-medium">you@demo.com</span></div>
          </div>
        </div>
      </div>
    </header>
  );
}

function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="bg-white rounded-xl shadow p-4 flex gap-3 items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onSearch(q); }}
          placeholder="Search Flipkart products, e.g. 'activa 125'"
          className="flex-1 p-3 rounded-md border border-gray-200 focus:outline-none"
        />
        <button
          onClick={() => onSearch(q)}
          className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
        >
          Search
        </button>
      </div>
    </div>
  );
}

function ProductCard({ product, onOpen, onTrack }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow p-4 flex gap-4"
    >
      <img src={product.image} alt="prod" className="w-28 h-28 object-cover rounded" />
      <div className="flex-1">
        <div className="font-medium text-lg">{product.title}</div>
        <div className="text-sm text-gray-500">{product.seller}</div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-xl font-semibold">₹{product.currentPrice.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Lowest in last 30d: ₹{Math.round(product.currentPrice * 0.95).toLocaleString()}</div>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => onOpen(product)} className="px-3 py-2 rounded-md border">View</button>
            <button onClick={() => onTrack(product)} className="px-3 py-2 rounded-md bg-indigo-600 text-white">Track</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProductModal({ product, history, onClose, onCreateAlert }) {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <motion.div initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 z-40">
        <div className="flex gap-4">
          <img src={product.image} className="w-40 h-40 rounded" />
          <div className="flex-1">
            <div className="font-semibold text-2xl">{product.title}</div>
            <div className="text-gray-500 mt-1">Seller: {product.seller}</div>
            <div className="mt-4 text-3xl font-bold">₹{product.currentPrice.toLocaleString()}</div>
            <div className="mt-3 flex gap-2">
              <a href={product.url} target="_blank" rel="noreferrer" className="px-4 py-2 border rounded">Open on Flipkart</a>
              <button onClick={() => onCreateAlert(product)} className="px-4 py-2 bg-yellow-500 rounded font-medium">Notify me</button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="font-semibold mb-2">Price history (last 13 days)</div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={3} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ------------- Main App --------------
export default function PricePulseApp() {
  const [results, setResults] = useState([]);
  const [tracked, setTracked] = useState([]);
  const [modalProduct, setModalProduct] = useState(null);
  const [modalHistory, setModalHistory] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // load tracked items from localStorage (demo)
    const raw = localStorage.getItem("pp_tracked_v1");
    if (raw) setTracked(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem("pp_tracked_v1", JSON.stringify(tracked));
  }, [tracked]);

  async function doSearch(q) {
    setQuery(q);
    if (!q || q.trim().length < 2) return setResults([]);
    const r = await mockSearch(q);
    setResults(r);
  }

  function openProduct(p) {
    setModalProduct(p);
    setModalHistory(mockHistory(p.currentPrice));
  }

  function trackProduct(p) {
    if (tracked.find((t) => t.id === p.id)) return alert("Already tracking this product.");
    setTracked([{ ...p, createdAt: Date.now(), priceHistory: mockHistory(p.currentPrice) }, ...tracked]);
  }

  function createAlert(product) {
    // This would open a form to set target price, notify channels, etc.
    const target = prompt("Notify me when price is <= (₹)", Math.round(product.currentPrice * 0.95));
    if (!target) return;
    // in production, send to backend to register an alert
    alert(`Alert registered: ${product.title} <= ₹${target}. (Demo only)`);
  }

  function exportCSV() {
    const rows = ["id,title,currentPrice,seller,url"].concat(tracked.map(t => `${t.id},"${t.title}",${t.currentPrice},${t.seller},${t.url}`));
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "pricepulse_tracked.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onCreate={() => alert("Open track modal in production") } />

      <main className="pb-12">
        <SearchBar onSearch={doSearch} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <div className="space-y-4">
              {results.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-6 text-gray-500">Search results will appear here. Try "activa 125" or "vespa" (demo).</div>
              ) : (
                results.map((r) => (
                  <ProductCard key={r.id} product={r} onOpen={openProduct} onTrack={trackProduct} />
                ))
              )}
            </div>
          </section>

          <aside className="space-y-4">
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">Tracked items</div>
                <div className="text-xs text-gray-500">{tracked.length} items</div>
              </div>
              <div className="space-y-3">
                {tracked.length === 0 ? (
                  <div className="text-sm text-gray-500">No tracked items. Click "Track" on any result to add.</div>
                ) : (
                  tracked.map((t) => (
                    <div key={t.id} className="flex items-center justify-between">
                      <div className="text-sm">
                        <div className="font-medium">{t.title}</div>
                        <div className="text-xs text-gray-500">₹{t.currentPrice.toLocaleString()}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openProduct(t)} className="px-2 py-1 border rounded text-xs">Open</button>
                        <button onClick={() => setTracked(tracked.filter(x => x.id !== t.id))} className="px-2 py-1 rounded text-xs bg-red-50">Remove</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={exportCSV} className="px-3 py-2 bg-gray-100 rounded">Export CSV</button>
                <button onClick={() => alert('Upgrade to Pro: unlimited trackers, email alerts, API access')} className="px-3 py-2 bg-indigo-600 text-white rounded">Upgrade</button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <div className="font-semibold mb-2">Quick tips</div>
              <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                <li>Use tracking for big ticket items — price drops can be significant.</li>
                <li>Set alerts slightly below the expected discount to avoid false triggers.</li>
                <li>Use CSV export for bulk analysis or bookkeeping.</li>
              </ul>
            </div>
          </aside>
        </div>

        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 text-sm text-gray-500">
          <div className="py-6">Built with a Material-inspired UX, Tailwind & Recharts. Replace mock data with your backend that stores historical prices and triggers alerts.</div>
        </footer>
      </main>

      <ProductModal product={modalProduct} history={modalHistory} onClose={() => setModalProduct(null)} onCreateAlert={createAlert} />
    </div>
  );
}
