// TMDB API Configuration
const TMDB_API_KEY = 'e2d4889cf9c50af5ddf240cdacc42bda';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const searchResults = document.getElementById('searchResults');
const resultsContainer = document.getElementById('resultsContainer');
const playerSection = document.getElementById('playerSection');
const playerTitle = document.getElementById('playerTitle');
const playerContainer = document.getElementById('playerContainer');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Search functionality
async function handleSearch() {
    const query = searchInput.value.trim();
    
    if (!query) {
        alert('Por favor, digite algo para pesquisar!');
        return;
    }

    showLoading();
    hideResults();
    hidePlayer();

    try {
        const results = await searchContent(query);
        displayResults(results);
    } catch (error) {
        console.error('Erro na pesquisa:', error);
        alert('Erro ao pesquisar. Tente novamente.');
    } finally {
        hideLoading();
    }
}

// Search content using TMDB API
async function searchContent(query) {
    const url = `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
}

// Display search results
function displayResults(results) {
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p style="text-align: center; color: #8a8d91; padding: 2rem;">Nenhum resultado encontrado.</p>';
        showResults();
        return;
    }

    results.forEach(item => {
        if (item.media_type === 'person') return; // Skip person results
        
        const resultItem = createResultItem(item);
        resultsContainer.appendChild(resultItem);
    });

    showResults();
}

// Create result item element
function createResultItem(item) {
    const div = document.createElement('div');
    div.className = 'result-item';
    div.onclick = () => loadPlayer(item);

    const title = item.title || item.name || 'Título não disponível';
    const posterPath = item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/300x450/3a3b3c/e4e6ea?text=Sem+Imagem';
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

    div.innerHTML = `
        <img src="${posterPath}" alt="${title}" class="result-poster" onerror="this.src='https://via.placeholder.com/300x450/3a3b3c/e4e6ea?text=Sem+Imagem'">
        <div class="result-info">
            <h4 class="result-title">${title}</h4>
            <div class="result-rating">${rating}</div>
        </div>
    `;

    return div;
}

// Load player for selected content
async function loadPlayer(item) {
    const title = item.title || item.name || 'Conteúdo Selecionado';
    playerTitle.textContent = `Reproduzindo: ${title}`;

    try {
        let playerUrl = '';
        
        if (item.media_type === 'movie') {
            // For movies, we need to get the IMDb ID
            const movieDetails = await getMovieDetails(item.id);
            if (movieDetails && movieDetails.imdb_id) {
                playerUrl = `https://superflixapi.blog/filme/${movieDetails.imdb_id}`;
            } else {
                throw new Error('IMDb ID não encontrado para este filme');
            }
        } else if (item.media_type === 'tv') {
            // For TV shows, use TMDB ID directly
            playerUrl = `https://superflixapi.blog/serie/${item.id}/1/1`;
        } else {
            throw new Error('Tipo de mídia não suportado');
        }

        // Create iframe for player
        playerContainer.innerHTML = `
            <iframe src="${playerUrl}" 
                    width="100%" 
                    height="500" 
                    frameborder="0" 
                    allowfullscreen>
            </iframe>
        `;

        showPlayer();
        
        // Scroll to player
        playerSection.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Erro ao carregar player:', error);
        alert('Erro ao carregar o player. Este conteúdo pode não estar disponível.');
    }
}

// Get movie details including IMDb ID
async function getMovieDetails(movieId) {
    const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=pt-BR`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
}

// UI Helper Functions
function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showResults() {
    searchResults.classList.remove('hidden');
}

function hideResults() {
    searchResults.classList.add('hidden');
}

function showPlayer() {
    playerSection.classList.remove('hidden');
}

function hidePlayer() {
    playerSection.classList.add('hidden');
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('VIDEW App initialized');
    
    // Focus on search input
    searchInput.focus();
    
    // Add some sample searches for testing
    const sampleSearches = ['Breaking Bad', 'Vingadores', 'Naruto', 'Stranger Things'];
    
    // You can uncomment this for testing
    // console.log('Sample searches:', sampleSearches);
});

// Error handling for fetch requests
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
    }
    
    // Escape to clear search and hide results
    if (e.key === 'Escape') {
        searchInput.value = '';
        hideResults();
        hidePlayer();
        searchInput.focus();
    }
});

// Add smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Debounce function for search input (optional enhancement)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optional: Add auto-search with debounce
// const debouncedSearch = debounce(handleSearch, 500);
// searchInput.addEventListener('input', debouncedSearch);
