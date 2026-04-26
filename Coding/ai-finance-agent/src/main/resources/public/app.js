document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const loader = document.getElementById('loader');
    const resultsContainer = document.getElementById('resultsContainer');

    const triggerSearch = async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        // UI Reset
        resultsContainer.innerHTML = '';
        loader.classList.remove('hidden');

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('API Error');
            
            const data = await response.json();
            
            loader.classList.add('hidden');

            if (data.length === 0) {
                resultsContainer.innerHTML = `<p style="text-align:center; color: var(--text-secondary);">No relevant stocks found for this query.</p>`;
                return;
            }

            // Render matched stock cards
            data.forEach((stock, index) => {
                const card = document.createElement('div');
                card.className = 'stock-card';
                card.style.animationDelay = `${index * 0.15}s`; // Staggered animation
                
                card.innerHTML = `
                    <div class="card-header">
                        <div class="company-info">
                            <h3>${stock.companyName}</h3>
                            <span class="ticker">${stock.ticker}</span>
                        </div>
                        <div class="match-score">
                            <span class="label">Vector Match</span>
                            <span class="value">${stock.matchScore.toFixed(4)}</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <p>${stock.description}</p>
                    </div>
                `;
                resultsContainer.appendChild(card);
            });

        } catch (error) {
            console.error('Failed to hunt for stocks:', error);
            loader.classList.add('hidden');
            resultsContainer.innerHTML = `<p style="text-align:center; color: #ef4444;">Failed to connect to the pgvector RAG backend.</p>`;
        }
    };

    searchBtn.addEventListener('click', triggerSearch);
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            triggerSearch();
        }
    });
});
