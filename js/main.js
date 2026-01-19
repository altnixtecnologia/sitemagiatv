// ==========================================
// 1. ÁREA DOS FILMES EM ALTA
// ==========================================
const MOVIE_HIGHLIGHTS = [
    { "title": "Plano em Família 2 (2025)", "category": "Ação, Comédia", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/aLgvLNWETZ2wtPzU3E7lavEpCJw.jpg", "trailerId": "64-0cFnQ6Ls" },
    { "title": "Zootopia 2 (2025)", "category": "Animação, Família", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/fthvYnjERbXt3ILjLjHpPNd5IVJ.jpg", "trailerId": "z-C1VtXQr6o" },
    { "title": "IT: Bem-Vindo a Derry (2025)", "category": "Drama, Mistério", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/gMTfrLvrDaD0zrhpLZ7zXIIpKfJ.jpg", "trailerId": "_t4_QgZoyn8" },
    { "title": "Frankenstein (2025)", "category": "Drama, Terror", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/cXsMxClCcAF1oMwoXZvbKwWoNeS.jpg", "trailerId": "gRvl9uxmcbA" }
];

// ==========================================
// 2. CONFIGURAÇÕES GERAIS
// ==========================================
const API_CONFIG = {
    backendUrl: 'https://sitemagiatv.vercel.app/api/matches',
    whatsappNumber: '5548991004780' 
};

// ==========================================
// 3. LÓGICA DE FUTEBOL (VERSÃO SEGURA)
// ==========================================

async function getMatches() {
    const updateIndicator = document.getElementById('update-indicator');
    const mainContainer = document.getElementById('main-matches');
    
    if(!mainContainer) return; 
    if(updateIndicator) updateIndicator.innerHTML = '<i class="fas fa-sync-alt mr-2 animate-spin"></i>Carregando jogos...';

    try {
        const response = await fetch(API_CONFIG.backendUrl);
        const data = await response.json();
        
        // Filtro amplo para garantir que o Catarinense apareça
        let allMatches = (data.response || []).filter(match => {
            const league = (match.league.name || "").toLowerCase();
            const country = (match.league.country || "").toLowerCase();
            return country === "brazil" || league.includes("catarinense") || league.includes("copinha") || league.includes("paulista") || league.includes("carioca");
        });

        if (allMatches.length > 0) {
            renderMatches(allMatches, mainContainer);
        } else {
            mainContainer.innerHTML = `<div class="col-span-full text-center py-8 bg-white rounded-lg shadow"><p class="text-gray-500">Nenhum jogo localizado no momento. Tente atualizar a página.</p></div>`;
        }

        if(updateIndicator) {
            const time = new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
            updateIndicator.innerHTML = `<i class="fas fa-check-circle mr-2 text-green-500"></i>Agenda MagiaTV atualizada às ${time}`;
        }

    } catch (error) {
        console.error("Erro no fetch:", error);
        mainContainer.innerHTML = `<div class="col-span-full text-center py-8"><p class="text-gray-500">Erro ao conectar com o servidor da MagiaTV.</p></div>`;
    }
}

function renderMatches(matches, container) {
    container.innerHTML = matches.map(match => {
        const isLive = ['1H', '2H', 'HT', 'LIVE'].includes(match.fixture.status.short);
        const d = new Date(match.fixture.date);
        const dateDisplay = `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')} • ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
        
        // Destaque para o Catarinense
        let borderColor = match.league.name.includes('Catarinense') ? 'border-blue-500 shadow-lg' : 'border-gray-100';

        // Canais vindos do backend
        let channelsHtml = '';
        if (match.canais && match.canais.length > 0) {
            channelsHtml = `
                <div class="mt-3 pt-2 border-t border-gray-100 flex flex-wrap justify-center gap-2">
                    ${match.canais.map(c => `
                        <div class="flex flex-col items-center">
                            <img src="${c.img_url}" class="h-5 w-auto object-contain mb-1" title="${c.nome}">
                            <span class="text-[7px] text-gray-400 font-bold uppercase">${c.nome}</span>
                        </div>
                    `).join('')}
                </div>`;
        }

        return `
            <div class="bg-white rounded-lg shadow-md p-4 border-l-4 ${borderColor} relative card-hover">
                <div class="flex items-center justify-between mb-4 border-b pb-2">
                    <span class="${isLive ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-gray-100 text-gray-600'} px-2 py-1 rounded text-xs font-bold uppercase">${isLive ? 'AO VIVO' : 'Agendado'}</span>
                    <span class="text-xs text-gray-500 text-right"><div class="font-bold">${dateDisplay}</div><div class="text-blue-600 font-medium truncate max-w-[120px]">${match.league.name}</div></span>
                </div>
                <div class="flex items-center justify-between px-2">
                    <div class="flex flex-col items-center w-[35%]"><img src="${match.teams.home.logo}" class="w-10 h-10 object-contain"><p class="text-xs font-bold text-center mt-2">${match.teams.home.name}</p></div>
                    <div class="text-lg font-black text-gray-700">${match.goals.home ?? 0} x ${match.goals.away ?? 0}</div>
                    <div class="flex flex-col items-center w-[35%]"><img src="${match.teams.away.logo}" class="w-10 h-10 object-contain"><p class="text-xs font-bold text-center mt-2">${match.teams.away.name}</p></div>
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
function openWhatsAppGeneral() { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=Olá!`, '_blank'); }
function openWhatsAppGame(h, a) { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=${encodeURIComponent(`Quero assistir ${h} x ${a} no MagiaTV!`)}`, '_blank'); }
function requestTest() { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=Quero um teste grátis`, '_blank'); }
function buyPlan(p, v) { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=${encodeURIComponent(`Quero assinar o ${p} de ${v}.`)}`, '_blank'); }

document.addEventListener('DOMContentLoaded', () => { getMatches(); renderMovies(); if(document.getElementById('menu-btn')) document.getElementById('menu-btn').onclick = () => document.getElementById('mobile-menu').classList.toggle('hidden'); });
