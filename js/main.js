const MOVIE_HIGHLIGHTS = [
    { "title": "Plano em Família 2", "category": "Ação", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/aLgvLNWETZ2wtPzU3E7lavEpCJw.jpg", "trailerId": "64-0cFnQ6Ls" },
    { "title": "Zootopia 2", "category": "Animação", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/fthvYnjERbXt3ILjLjHpPNd5IVJ.jpg", "trailerId": "z-C1VtXQr6o" },
    { "title": "IT: Derry (2025)", "category": "Terror", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/gMTfrLvrDaD0zrhpLZ7zXIIpKfJ.jpg", "trailerId": "_t4_QgZoyn8" },
    { "title": "Frankenstein", "category": "Terror", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/cXsMxClCcAF1oMwoXZvbKwWoNeS.jpg", "trailerId": "gRvl9uxmcbA" }
];

const API_CONFIG = {
    backendUrl: 'https://sitemagiatv.vercel.app/api/matches',
    whatsappNumber: '5548991004780' 
};

async function getMatches() {
    const mainContainer = document.getElementById('main-matches');
    const updateIndicator = document.getElementById('update-indicator');
    if(!mainContainer) return;

    try {
        const response = await fetch(`${API_CONFIG.backendUrl}?t=${Date.now()}`);
        const data = await response.json();
        const matches = data.response || [];

        if (matches.length > 0) {
            renderMatches(matches, mainContainer);
        } else {
            mainContainer.innerHTML = `<p class="text-center text-gray-400 py-8">Buscando novas transmissões...</p>`;
        }

        if(updateIndicator) {
            const time = new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
            updateIndicator.innerHTML = `<i class="fas fa-check-circle mr-2 text-green-500"></i>Grade MagiaTV atualizada às ${time}`;
        }
    } catch (e) {
        mainContainer.innerHTML = `<p class="text-center text-red-500">Grade temporariamente indisponível.</p>`;
    }
}

function renderMatches(matches, container) {
    container.innerHTML = matches.map(m => `
        <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500 card-hover text-center">
            <div class="mb-2"><span class="bg-red-100 text-red-800 text-[9px] font-bold px-2 py-0.5 rounded uppercase">AO VIVO</span></div>
            <div class="mb-1"><span class="text-[9px] font-bold text-gray-400 uppercase">${m.league.name}</span></div>
            <div class="flex items-center justify-between gap-2 mb-4">
                <div class="flex-1">
                    <img src="${m.teams.home.logo}" class="w-8 h-8 mx-auto object-contain" onerror="this.src='https://media.api-sports.io/football/teams/default.png'">
                    <p class="text-[10px] font-bold mt-1">${m.teams.home.name}</p>
                </div>
                <div class="text-xs font-black text-gray-300">${m.goals.home ?? 0} x ${m.goals.away ?? 0}</div>
                <div class="flex-1">
                    <img src="${m.teams.away.logo}" class="w-8 h-8 mx-auto object-contain" onerror="this.src='https://media.api-sports.io/football/teams/default.png'">
                    <p class="text-[10px] font-bold mt-1">${m.teams.away.name}</p>
                </div>
            </div>
            <button class="w-full bg-green-600 text-white py-1.5 rounded-lg text-xs font-bold" onclick="openWhatsAppGame('${m.teams.home.name}', '${m.teams.away.name}')">Assistir Agora</button>
        </div>`).join('');
}

function renderMovies() {
    const container = document.getElementById('movies-container');
    if(!container) return;
    container.innerHTML = MOVIE_HIGHLIGHTS.map(movie => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden group">
            <div class="relative aspect-[2/3] overflow-hidden">
                <img src="${movie.image}" class="w-full h-full object-cover">
                <button onclick="openTrailer('${movie.trailerId}')" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><i class="fas fa-play text-white text-3xl"></i></button>
            </div>
            <div class="p-3 text-center text-xs font-bold">${movie.title}</div>
        </div>`).join('');
}

function openTrailer(id) { document.getElementById('youtube-player').src = `https://www.youtube.com/embed/${id}?autoplay=1`; document.getElementById('video-modal').classList.remove('hidden'); }
function closeVideoModal() { document.getElementById('youtube-player').src = ''; document.getElementById('video-modal').classList.add('hidden'); }
function openWhatsAppGeneral() { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=Olá!`, '_blank'); }
function openWhatsAppGame(h, a) { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=${encodeURIComponent(`Olá! Quero assistir ao jogo ${h} x ${a} na MagiaTV!`)}`, '_blank'); }
function requestTest() { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=Quero um teste grátis na MagiaTV!`, '_blank'); }
function buyPlan(p, v) { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=${encodeURIComponent(`Quero o plano ${p} de ${v}`)}`, '_blank'); }

document.addEventListener('DOMContentLoaded', () => { getMatches(); renderMovies(); if(document.getElementById('menu-btn')) document.getElementById('menu-btn').onclick = () => document.getElementById('mobile-menu').classList.toggle('hidden'); });
