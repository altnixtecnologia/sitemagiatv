// ==========================================
// 1. FILMES E CONFIGURAÇÕES
// ==========================================
const MOVIE_HIGHLIGHTS = [
    { "title": "Plano em Família 2", "category": "Ação", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/aLgvLNWETZ2wtPzU3E7lavEpCJw.jpg", "trailerId": "64-0cFnQ6Ls" },
    { "title": "Zootopia 2", "category": "Animação", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/fthvYnjERbXt3ILjLjHpPNd5IVJ.jpg", "trailerId": "z-C1VtXQr6o" },
    { "title": "IT: Derry (2025)", "category": "Terror", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/gMTfrLvrDaD0zrhpLZ7zXIIpKfJ.jpg", "trailerId": "_t4_QgZoyn8" },
    { "title": "Frankenstein (2025)", "category": "Terror", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/cXsMxClCcAF1oMwoXZvbKwWoNeS.jpg", "trailerId": "gRvl9uxmcbA" }
];

const API_CONFIG = {
    wysterUrl: 'https://wysterjogos.nptv2.com/',
    wysterToken: '3fa85b7679ffeb398e99a27c2acd9489',
    whatsappNumber: '5548991004780',
    // Proxy para contornar bloqueios de navegador (CORS)
    proxyUrl: 'https://api.allorigins.win/raw?url=' 
};

// ==========================================
// 2. LÓGICA DE FUTEBOL (BUSCA DIRETA)
// ==========================================
async function getMatches() {
    const mainContainer = document.getElementById('main-matches');
    const updateIndicator = document.getElementById('update-indicator');
    if(!mainContainer) return;

    try {
        // Criamos o formulário de pedido igual ao que o painel da Wyster espera
        const formData = new FormData();
        formData.append('token', API_CONFIG.wysterToken);

        // Tentativa 1: Busca Direta (Usa o IP do usuário)
        let response = await fetch(API_CONFIG.proxyUrl + encodeURIComponent(API_CONFIG.wysterUrl), {
            method: 'POST',
            body: formData
        });

        const responseList = await response.json();

        if (responseList && responseList.length > 0) {
            renderMatches(responseList, mainContainer);
        } else {
            mainContainer.innerHTML = `<div class="col-span-full text-center py-8"><p class="text-gray-500">Nenhum jogo ativo no painel agora.</p></div>`;
        }

        if(updateIndicator) {
            const time = new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
            updateIndicator.innerHTML = `<i class="fas fa-check-circle mr-2 text-green-500"></i>Grade MagiaTV atualizada às ${time}`;
        }
    } catch (e) {
        console.error("Erro na busca direta:", e);
        mainContainer.innerHTML = `<p class="text-center text-red-500 font-bold">Erro ao sincronizar com o painel Wyster.</p>`;
    }
}

function renderMatches(matches, container) {
    container.innerHTML = matches.map(match => {
        const isLive = (match.status || "").includes("AO VIVO");
        let channelsHtml = (match.canais || []).map(c => `
            <div class="flex flex-col items-center">
                <img src="${c.img_url}" class="h-6 w-auto object-contain" onerror="this.src='https://media.api-sports.io/football/teams/default.png'">
                <span class="text-[7px] text-gray-400 font-bold uppercase mt-1">${c.nome}</span>
            </div>`).join('');

        return `
            <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500 card-hover">
                <div class="flex items-center justify-between mb-4 border-b pb-2">
                    <span class="${isLive ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-gray-100 text-gray-600'} px-2 py-1 rounded text-xs font-bold uppercase">${isLive ? 'AO VIVO' : 'Grade'}</span>
                    <span class="text-xs text-blue-600 font-bold truncate">MagiaTV Ao Vivo</span>
                </div>
                <div class="flex items-center justify-between px-2">
                    <div class="flex flex-col items-center w-[45%]"><p class="text-sm font-bold text-center">${match.time1}</p></div>
                    <div class="text-lg font-black text-gray-300">VS</div>
                    <div class="flex flex-col items-center w-[45%]"><p class="text-sm font-bold text-center">${match.time2}</p></div>
                </div>
                <div class="mt-3 pt-2 border-t flex flex-wrap justify-center gap-3">${channelsHtml}</div>
                <button class="w-full mt-4 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition" onclick="openWhatsAppGame('${match.time1}', '${match.time2}')">Assistir Agora</button>
            </div>`;
    }).join('');
}

// ==========================================
// 3. UTILITÁRIOS E BOTÕES (RESTAURADOS)
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
function openWhatsAppGeneral() { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=Olá!`, '_blank'); }
function openWhatsAppGame(h, a) { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=${encodeURIComponent(`Quero assistir ${h} x ${a} na MagiaTV!`)}`, '_blank'); }
function requestTest() { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=Quero um teste grátis na MagiaTV!`, '_blank'); }
function buyPlan(p, v) { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=${encodeURIComponent(`Quero assinar o ${p} de ${v}`)}`, '_blank'); }

document.addEventListener('DOMContentLoaded', () => { getMatches(); renderMovies(); if(document.getElementById('menu-btn')) document.getElementById('menu-btn').onclick = () => document.getElementById('mobile-menu').classList.toggle('hidden'); });
