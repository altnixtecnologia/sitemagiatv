// ==========================================
// 1. FILMES EM ALTA
// ==========================================
const MOVIE_HIGHLIGHTS = [
    { "title": "Plano em Família 2 (2025)", "category": "Ação", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/aLgvLNWETZ2wtPzU3E7lavEpCJw.jpg", "trailerId": "64-0cFnQ6Ls" },
    { "title": "Zootopia 2 (2025)", "category": "Animação", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/fthvYnjERbXt3ILjLjHpPNd5IVJ.jpg", "trailerId": "z-C1VtXQr6o" },
    { "title": "IT: Bem-Vindo a Derry", "category": "Terror", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/gMTfrLvrDaD0zrhpLZ7zXIIpKfJ.jpg", "trailerId": "_t4_QgZoyn8" },
    { "title": "Frankenstein (2025)", "category": "Terror", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/cXsMxClCcAF1oMwoXZvbKwWoNeS.jpg", "trailerId": "gRvl9uxmcbA" }
];

const API_CONFIG = {
    backendUrl: 'https://sitemagiatv.vercel.app/api/matches',
    whatsappNumber: '5548991004780' 
};

async function getMatches() {
    const updateIndicator = document.getElementById('update-indicator');
    const mainContainer = document.getElementById('main-matches');
    if(!mainContainer) return; 

    if(updateIndicator) updateIndicator.innerHTML = '<i class="fas fa-sync-alt mr-2 animate-spin"></i>Buscando canais MagiaTV...';

    try {
        const response = await fetch(API_CONFIG.backendUrl);
        const data = await response.json();
        const responseList = data.response || [];

        if (responseList.length > 0) {
            renderMatches(responseList, mainContainer);
        } else {
            mainContainer.innerHTML = `<div class="col-span-full text-center py-8 bg-white rounded-lg shadow"><p class="text-gray-500">Nenhuma transmissão ao vivo no momento.</p></div>`;
        }

        if(updateIndicator) {
            const time = new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
            updateIndicator.innerHTML = `<i class="fas fa-check-circle mr-2 text-green-500"></i>Grade MagiaTV atualizada às ${time}`;
        }

    } catch (error) {
        console.error("Erro no Backend:", error);
        mainContainer.innerHTML = `<div class="col-span-full text-center py-8"><p class="text-red-500 font-bold">Servidor em manutenção.</p></div>`;
    }
}

function renderMatches(matches, container) {
    container.innerHTML = matches.map(match => {
        const isLive = ['1H', '2H', 'HT', 'LIVE'].includes(match.fixture.status.short);
        
        let borderColor = match.league.name.includes('Catarinense') ? 'border-blue-500 shadow-lg' : 'border-gray-100';

        // Lista de Canais do Wyster
        let channelsHtml = '';
        if (match.canais && match.canais.length > 0) {
            channelsHtml = `
                <div class="mt-3 pt-2 border-t border-gray-100 flex flex-wrap justify-center gap-3">
                    ${match.canais.map(c => `
                        <div class="flex flex-col items-center">
                            <img src="${c.img_url}" class="h-6 w-auto object-contain" title="${c.nome}" onerror="this.src='https://via.placeholder.com/30?text=TV'">
                            <span class="text-[7px] text-gray-400 font-bold uppercase mt-1">${c.nome}</span>
                        </div>
                    `).join('')}
                </div>`;
        }

        return `
            <div class="bg-white rounded-lg shadow-md p-4 border-l-4 ${borderColor} relative card-hover">
                <div class="flex items-center justify-between mb-4 border-b pb-2">
                    <span class="${isLive ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-gray-100 text-gray-600'} px-2 py-1 rounded text-xs font-bold uppercase">${isLive ? 'AO VIVO' : 'Agendado'}</span>
                    <span class="text-xs text-blue-600 font-bold truncate max-w-[150px]">${match.league.name}</span>
                </div>
                <div class="flex items-center justify-between px-2">
                    <div class="flex flex-col items-center w-[35%]">
                        <img src="${match.teams.home.logo}" class="w-10 h-10 object-contain" onerror="this.src='https://via.placeholder.com/40?text=HOME'">
                        <p class="text-xs font-bold text-center mt-2">${match.teams.home.name}</p>
                    </div>
                    <div class="text-lg font-black text-gray-700">${match.goals.home ?? 0} x ${match.goals.away ?? 0}</div>
                    <div class="flex flex-col items-center w-[35%]">
                        <img src="${match.teams.away.logo}" class="w-10 h-10 object-contain" onerror="this.src='https://via.placeholder.com/40?text=AWAY'">
                        <p class="text-xs font-bold text-center mt-2">${match.teams.away.name}</p>
                    </div>
                </div>
                ${channelsHtml}
                <button class="w-full mt-4 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition" onclick="openWhatsAppGame('${match.teams.home.name}', '${match.teams.away.name}')">Assistir Agora</button>
            </div>`;
    }).join('');
}

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
function openWhatsAppGame(h, a) { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=${encodeURIComponent(`Quero assistir ${h} x ${a} no MagiaTV!`)}`, '_blank'); }

document.addEventListener('DOMContentLoaded', () => { getMatches(); renderMovies(); if(document.getElementById('menu-btn')) document.getElementById('menu-btn').onclick = () => document.getElementById('mobile-menu').classList.toggle('hidden'); });
