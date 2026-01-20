// ==========================================
// 1. ÁREA DE CONTEÚDO (FILMES)
// ==========================================
const MOVIE_HIGHLIGHTS = [
    { "title": "Plano em Família 2", "category": "Ação", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/aLgvLNWETZ2wtPzU3E7lavEpCJw.jpg", "trailerId": "64-0cFnQ6Ls" },
    { "title": "Zootopia 2", "category": "Animação", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/fthvYnjERbXt3ILjLjHpPNd5IVJ.jpg", "trailerId": "z-C1VtXQr6o" },
    { "title": "IT: Derry (2025)", "category": "Terror", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/gMTfrLvrDaD0zrhpLZ7zXIIpKfJ.jpg", "trailerId": "_t4_QgZoyn8" },
    { "title": "Frankenstein", "category": "Terror", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/cXsMxClCcAF1oMwoXZvbKwWoNeS.jpg", "trailerId": "gRvl9uxmcbA" }
];

const API_CONFIG = {
    backendUrl: 'https://sitemagiatv.vercel.app/api/matches',
    wysterExternal: 'https://wysterjogos.nptv2.com/',
    whatsappNumber: '5548991004780' 
};

// ==========================================
// 2. SINCRONIZAÇÃO DE JOGOS
// ==========================================
async function getMatches() {
    const mainContainer = document.getElementById('main-matches');
    const updateIndicator = document.getElementById('update-indicator');
    if(!mainContainer) return;

    try {
        const response = await fetch(`${API_CONFIG.backendUrl}?t=${Date.now()}`);
        const data = await response.json();
        renderMatches(data.response || [], mainContainer);
        
        if(updateIndicator) {
            const time = new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
            updateIndicator.innerHTML = `<i class="fas fa-check-circle mr-2 text-green-500"></i>Grade MagiaTV sincronizada às ${time}`;
        }
    } catch (e) {
        mainContainer.innerHTML = `<p class="text-center text-red-500">Conectando ao painel...</p>`;
    }
}

function renderMatches(matches, container) {
    container.innerHTML = matches.map(match => {
        return `
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 card-hover text-center">
                <div class="mb-2"><span class="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded uppercase">${match.league.name}</span></div>
                <div class="flex items-center justify-between gap-4 mb-4">
                    <div class="flex-1"><p class="font-bold text-sm">${match.teams.home.name}</p></div>
                    <div class="text-gray-300 font-black italic">VS</div>
                    <div class="flex-1"><p class="font-bold text-sm">${match.teams.away.name}</p></div>
                </div>
                <button class="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition" onclick="window.open('${API_CONFIG.wysterExternal}', '_blank')">Abrir Transmissão Ao Vivo</button>
            </div>`;
    }).join('');
}

// ==========================================
// 3. UTILITÁRIOS E WHATSAPP
// ==========================================
function renderMovies() {
    const container = document.getElementById('movies-container');
    if(!container) return;
    container.innerHTML = MOVIE_HIGHLIGHTS.map(movie => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden group">
            <div class="relative aspect-[2/3] overflow-hidden">
                <img src="${movie.image}" alt="${movie.title}" class="w-full h-full object-cover group-hover:scale-110 transition duration-300">
                <button onclick="openTrailer('${movie.trailerId}')" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300"><i class="fas fa-play text-white text-3xl"></i></button>
            </div>
            <div class="p-4"><h5 class="font-bold text-gray-800 text-sm mb-1">${movie.title}</h5></div>
        </div>`).join('');
}

function openTrailer(id) { document.getElementById('youtube-player').src = `https://www.youtube.com/embed/${id}?autoplay=1`; document.getElementById('video-modal').classList.remove('hidden'); }
function closeVideoModal() { document.getElementById('youtube-player').src = ''; document.getElementById('video-modal').classList.add('hidden'); }
function openWhatsAppGeneral() { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=Olá! Vim pelo site.`, '_blank'); }
function requestTest() { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=Quero um teste grátis na MagiaTV!`, '_blank'); }
function buyPlan(p, v) { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=${encodeURIComponent(`Quero o plano ${p} de ${v}`)}`, '_blank'); }

document.addEventListener('DOMContentLoaded', () => { 
    getMatches(); 
    renderMovies(); 
    const b = document.getElementById('menu-btn');
    if(b) b.onclick = () => document.getElementById('mobile-menu').classList.toggle('hidden');
});
