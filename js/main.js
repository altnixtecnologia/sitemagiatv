// ==========================================
// 1. ÁREA DOS FILMES (COLE O CÓDIGO DO PAINEL AQUI)
// ==========================================

const MOVIE_HIGHLIGHTS = [
    {
        "title": "Deadpool & Wolverine",
        "category": "Ação / Comédia",
        "image": "https://image.tmdb.org/t/p/w500/8cdWjvZonExuu9eFtt42o1UCrwm.jpg",
        "trailerId": "73_1biulkYk"
    },
    {
        "title": "Divertida Mente 2",
        "category": "Animação",
        "image": "https://image.tmdb.org/t/p/w500/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg",
        "trailerId": "y10kM7v7dM4"
    },
    {
        "title": "Planeta dos Macacos",
        "category": "Ficção Científica",
        "image": "https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg",
        "trailerId": "w2lIEpWwR6I"
    },
    {
        "title": "Bad Boys 4",
        "category": "Ação / Policial",
        "image": "https://image.tmdb.org/t/p/w500/3w84hCFJATpiCO5g8hpdqVPB2q.jpg",
        "trailerId": "SjRj3i3-TBA"
    }
];

// ==========================================
// CONFIGURAÇÕES GERAIS
// ==========================================
const API_CONFIG = {
    key: '6eeb6ad06d3edbcb77ae34be643302da', 
    url: 'https://v3.football.api-sports.io',
    whatsappNumber: '5548991004780' // Seu número
};

// ==========================================
// LÓGICA DO SITE (NÃO PRECISA MEXER ABAIXO)
// ==========================================

// --- FUTEBOL ---
const myHeaders = new Headers();
myHeaders.append("x-rapidapi-key", API_CONFIG.key);
myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");
const requestOptions = { method: 'GET', headers: myHeaders, redirect: 'follow' };

async function getMatches() {
    const updateIndicator = document.getElementById('update-indicator');
    const matchesTitle = document.getElementById('matches-title');
    const container = document.getElementById('today-matches');
    
    if(!container) return; 

    if(updateIndicator) updateIndicator.innerHTML = '<i class="fas fa-sync-alt mr-2 animate-spin"></i>Buscando jogos...';

    const today = new Date();
    const todayStr = formatDate(today);
    let url = `${API_CONFIG.url}/fixtures?date=${todayStr}&timezone=America/Sao_Paulo`;
    
    try {
        let response = await fetch(url, requestOptions);
        let data = await response.json();
        let matches = filterBrazilianMatches(data.response);
        let periodTitle = "Jogos de Hoje";

        if (matches.length === 0) {
            const nextWeek = addDays(today, 7);
            const nextWeekStr = formatDate(nextWeek);
            url = `${API_CONFIG.url}/fixtures?from=${todayStr}&to=${nextWeekStr}&timezone=America/Sao_Paulo`;
            if(updateIndicator) updateIndicator.innerHTML = '<i class="fas fa-calendar-week mr-2"></i>Buscando na semana...';
            response = await fetch(url, requestOptions);
            data = await response.json();
            matches = filterBrazilianMatches(data.response);
            periodTitle = "Jogos da Semana";
        }

        if(matchesTitle) matchesTitle.textContent = periodTitle;
        renderMatches(matches, container);
        if(updateIndicator) {
            const time = new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
            updateIndicator.innerHTML = `<i class="fas fa-check-circle mr-2 text-green-500"></i>Atualizado às ${time}`;
        }
    } catch (error) {
        console.error('Erro API:', error);
        container.innerHTML = `<div class="col-span-full text-center py-8"><p class="text-gray-500">Sistema indisponível.</p></div>`;
    }
}

function filterBrazilianMatches(matches) {
    if (!matches) return [];
    return matches.filter(match => {
        const c = match.league.country;
        const h = match.teams.home.name;
        const a = match.teams.away.name;
        return c === "Brazil" || h === "Brazil" || a === "Brazil";
    }).slice(0, 9).sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));
}

function renderMatches(matches, container) {
    if (matches.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-8 bg-white rounded-lg shadow"><p class="text-gray-500">Nenhum jogo encontrado.</p></div>`;
        return;
    }
    const html = matches.map(match => {
        const status = translateStatus(match.fixture.status.short);
        const isLive = ['1H', '2H', 'HT', 'LIVE'].includes(match.fixture.status.short);
        const d = new Date(match.fixture.date);
        const dateDisplay = `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')} • ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
        return `
            <div class="bg-white rounded-lg shadow-md card-hover p-4 border border-gray-100 relative">
                <div class="flex items-center justify-between mb-4 border-b pb-2">
                    <span class="${isLive ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-gray-100 text-gray-600'} px-2 py-1 rounded text-xs font-bold uppercase">${isLive ? 'AO VIVO' : status}</span>
                    <span class="text-xs text-gray-500 text-right"><div class="font-bold">${dateDisplay}</div><div class="truncate max-w-[150px]">${match.league.name}</div></span>
                </div>
                <div class="flex items-center justify-between px-2">
                    <div class="flex flex-col items-center w-[30%]"><img src="${match.teams.home.logo}" class="w-12 h-12 object-contain mb-2"><p class="text-xs font-bold text-center leading-tight">${match.teams.home.name}</p></div>
                    <div class="flex flex-col items-center w-[30%]"><div class="text-xl font-black text-gray-700 bg-gray-50 px-3 py-1 rounded">${match.goals.home ?? 0} x ${match.goals.away ?? 0}</div><span class="text-[10px] text-gray-400 mt-1 uppercase">${isLive ? match.fixture.status.elapsed + "'" : ''}</span></div>
                    <div class="flex flex-col items-center w-[30%]"><img src="${match.teams.away.logo}" class="w-12 h-12 object-contain mb-2"><p class="text-xs font-bold text-center leading-tight">${match.teams.away.name}</p></div>
                </div>
                <button class="w-full mt-4 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition flex items-center justify-center" onclick="openWhatsAppGame('${match.teams.home.name}', '${match.teams.away.name}')"><i class="fab fa-whatsapp mr-2"></i>Assistir</button>
            </div>`;
    }).join('');
    container.innerHTML = html;
}

// --- FILMES ---
function renderMovies() {
    const container = document.getElementById('movies-container');
    if(!container) return;
    const html = MOVIE_HIGHLIGHTS.map(movie => `
        <div class="bg-white rounded-lg shadow-md card-hover overflow-hidden group">
            <div class="relative h-64 overflow-hidden">
                <img src="${movie.image}" alt="${movie.title}" class="w-full h-full object-cover transition duration-300 group-hover:scale-110">
                <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <button onclick="openTrailer('${movie.trailerId}')" class="bg-white text-red-600 w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg"><i class="fas fa-play ml-1"></i></button>
                </div>
            </div>
            <div class="p-4"><h5 class="font-bold text-gray-800 text-lg mb-1">${movie.title}</h5><p class="text-sm text-gray-500">${movie.category}</p></div>
        </div>`).join('');
    container.innerHTML = html;
}

// --- MODAL YOUTUBE ---
function openTrailer(id) {
    const m = document.getElementById('video-modal');
    const p = document.getElementById('youtube-player');
    p.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
    m.classList.remove('hidden');
}
function closeVideoModal() {
    const m = document.getElementById('video-modal');
    const p = document.getElementById('youtube-player');
    p.src = '';
    m.classList.add('hidden');
}

// --- UTILITÁRIOS ---
function translateStatus(s) { const m={'TBD':'A Definir','NS':'Agendado','1H':'1º Tempo','HT':'Intervalo','2H':'2º Tempo','ET':'Prorrogação','P':'Pênaltis','FT':'Fim','LIVE':'Ao Vivo'}; return m[s]||s; }
function formatDate(d) { return d.toISOString().split('T')[0]; }
function addDays(d, days) { const r = new Date(d); r.setDate(r.getDate() + days); return r; }

function openWhatsAppGeneral() { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=${encodeURIComponent("Olá! 👋 Vim pelo site e gostaria de falar com um atendente.")}`, '_blank'); }
function requestTest() { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=${encodeURIComponent("Olá! 👋 Gostaria de *PEDIR UM TESTE* grátis no MagiaTV.")}`, '_blank'); }
function openWhatsAppGame(h, a) { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=${encodeURIComponent(`⚽ Olá! Quero assistir ao jogo *${h} x ${a}* no MagiaTV!`)}`, '_blank'); }
function buyPlan(p, v) { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=${encodeURIComponent(`💰 Olá! Tenho interesse no *${p}* (${v}). Como faço para assinar?`)}`, '_blank'); }

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', function() {
    getMatches();
    renderMovies();
    setInterval(getMatches, 300000);
    const btn = document.getElementById('menu-btn');
    const menu = document.getElementById('mobile-menu');
    if(btn && menu) btn.addEventListener('click', () => menu.classList.toggle('hidden'));
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeVideoModal(); });
});
