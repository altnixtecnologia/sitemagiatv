// ==========================================
// 1. ÁREA DOS FILMES EM ALTA
// ==========================================
const MOVIE_HIGHLIGHTS = [
    {
        "title": "Plano em Família 2 (2025)",
        "category": "Ação, Comédia",
        "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/aLgvLNWETZ2wtPzU3E7lavEpCJw.jpg",
        "trailerId": "64-0cFnQ6Ls"
    },
    {
        "title": "Zootopia 2 (2025)",
        "category": "Animação, Família",
        "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/fthvYnjERbXt3ILjLjHpPNd5IVJ.jpg",
        "trailerId": "z-C1VtXQr6o"
    },
    {
        "title": "IT: Bem-Vindo a Derry (2025)",
        "category": "Drama, Mistério",
        "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/gMTfrLvrDaD0zrhpLZ7zXIIpKfJ.jpg",
        "trailerId": "_t4_QgZoyn8"
    },
    {
        "title": "Frankenstein (2025)",
        "category": "Drama, Terror",
        "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/cXsMxClCcAF1oMwoXZvbKwWoNeS.jpg",
        "trailerId": "gRvl9uxmcbA"
    }
];

// ==========================================
// CONFIGURAÇÕES GERAIS
// ==========================================
const API_CONFIG = {
    key: '6eeb6ad06d3edbcb77ae34be643302da', 
    url: 'https://v3.football.api-sports.io',
    whatsappNumber: '5548991004780' 
};

// ==========================================
// LÓGICA DE FUTEBOL (VERSÃO CORRIGIDA API-SPORTS)
// ==========================================

async function getMatches() {
    const updateIndicator = document.getElementById('update-indicator');
    const mainContainer = document.getElementById('main-matches');
    const otherContainer = document.getElementById('other-matches');
    const btnContainer = document.getElementById('show-more-container');
    
    if(!mainContainer) return; 

    if(updateIndicator) updateIndicator.innerHTML = '<i class="fas fa-sync-alt mr-2 animate-spin"></i>Conectando ao servidor API-Sports...';

    const todayStr = new Date().toLocaleDateString('en-CA');
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toLocaleDateString('en-CA');
    
    // Configuração de Cabeçalhos CORRETA para API-Sports
    const myHeaders = new Headers();
    myHeaders.append("x-apisports-key", API_CONFIG.key); // <-- CORREÇÃO: x-apisports-key
    
    let url = `${API_CONFIG.url}/fixtures?from=${todayStr}&to=${nextWeekStr}&timezone=America/Sao_Paulo`;
    
    try {
        let response = await fetch(url, { method: 'GET', headers: myHeaders });
        let data = await response.json();
        
        // Verifica se há erro de autenticação ou limite
        if (data.errors && Object.keys(data.errors).length > 0) {
            const erro = data.errors.requests || data.errors.token || "Erro de Chave";
            mainContainer.innerHTML = `<div class="col-span-full text-center py-8 bg-red-50 border border-red-200 rounded-lg"><p class="text-red-700 font-bold">Aviso da API: ${erro}</p></div>`;
            return;
        }

        let allMatches = (data.response || []).filter(match => {
            const league = (match.league.name || "").toLowerCase();
            const country = (match.league.country || "").toLowerCase();
            return country === "brazil" || league.includes("paulista") || league.includes("carioca") || league.includes("catarinense") || league.includes("copa sao paulo") || league.includes("copinha");
        });

        // PRIORIDADE NO TOPO: Séries A/B, Libertadores, Estaduais Principais e Copinha
        const priorityTerms = [
            'Serie A', 'Serie B', 'Copa do Brasil', 'Libertadores', 'Sudamericana', 
            'Paulista', 'Carioca', 'Gaucho', 'Catarinense', 'Mineiro', 'Paranaense', 'Copa Sao Paulo'
        ];

        const mainGames = allMatches.filter(match => {
            const leagueName = match.league.name;
            return priorityTerms.some(term => leagueName.includes(term));
        });

        const otherGames = allMatches.filter(match => !mainGames.includes(match));

        // Renderização Dinâmica
        if (mainGames.length > 0) {
            renderMatches(mainGames, mainContainer);
        } else if (allMatches.length > 0) {
            renderMatches(allMatches, mainContainer); // Mostra qualquer BR se não houver elite
        } else {
            mainContainer.innerHTML = `<div class="col-span-full text-center py-8 bg-white rounded-lg shadow"><p class="text-gray-500">Nenhum jogo brasileiro disponível para esta data na API.</p></div>`;
        }

        if (otherGames.length > 0 && mainGames.length > 0) {
            renderMatches(otherGames, otherContainer);
            if(btnContainer) btnContainer.classList.remove('hidden');
        } else {
            if(btnContainer) btnContainer.classList.add('hidden');
        }
        
        if(updateIndicator) {
            const time = new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
            updateIndicator.innerHTML = `<i class="fas fa-check-circle mr-2 text-green-500"></i>Agenda sincronizada às ${time}`;
        }

    } catch (error) {
        console.error("Erro MagiaTV:", error);
        mainContainer.innerHTML = `<div class="col-span-full text-center py-8"><p class="text-gray-500">Falha na conexão de rede.</p></div>`;
    }
}

function renderMatches(matches, container) {
    container.innerHTML = matches.map(match => {
        const isLive = ['1H', '2H', 'HT', 'LIVE'].includes(match.fixture.status.short);
        const d = new Date(match.fixture.date);
        const dateDisplay = `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')} • ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
        
        // Cores das Bordas por Campeonato
        let borderColor = 'border-gray-100';
        if(match.league.name.includes('Serie A')) borderColor = 'border-green-400';
        if(match.league.name.includes('Libertadores')) borderColor = 'border-yellow-400';
        if(match.league.name.includes('Catarinense')) borderColor = 'border-blue-400';

        return `
            <div class="bg-white rounded-lg shadow-md p-4 border-l-4 ${borderColor} relative card-hover">
                <div class="flex items-center justify-between mb-4 border-b pb-2">
                    <span class="${isLive ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-gray-100 text-gray-600'} px-2 py-1 rounded text-xs font-bold uppercase">${isLive ? 'AO VIVO' : 'Agendado'}</span>
                    <span class="text-xs text-gray-500 text-right"><div class="font-bold">${dateDisplay}</div><div class="text-blue-600 font-medium truncate max-w-[120px]">${match.league.name}</div></span>
                </div>
                <div class="flex items-center justify-between px-2">
                    <div class="flex flex-col items-center w-[30%]"><img src="${match.teams.home.logo}" class="w-12 h-12 object-contain"><p class="text-xs font-bold text-center mt-2">${match.teams.home.name}</p></div>
                    <div class="text-xl font-black text-gray-700">${match.goals.home ?? 0} x ${match.goals.away ?? 0}</div>
                    <div class="flex flex-col items-center w-[30%]"><img src="${match.teams.away.logo}" class="w-12 h-12 object-contain"><p class="text-xs font-bold text-center mt-2">${match.teams.away.name}</p></div>
                </div>
                <button class="w-full mt-4 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition" onclick="openWhatsAppGame('${match.teams.home.name}', '${match.teams.away.name}')">Assistir Agora</button>
            </div>`;
    }).join('');
}

// --- OUTRAS FUNÇÕES ---
function toggleOtherGames() { 
    const c = document.getElementById('other-matches'); 
    c.classList.toggle('hidden'); 
}

function renderMovies() {
    const c = document.getElementById('movies-container');
    if(!c) return;
    c.innerHTML = MOVIE_HIGHLIGHTS.map(m => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden group">
            <div class="relative aspect-[2/3] overflow-hidden">
                <img src="${m.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-300">
                <button onclick="openTrailer('${m.trailerId}')" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <i class="fas fa-play text-white text-3xl"></i>
                </button>
            </div>
            <div class="p-4"><h5 class="font-bold text-gray-800">${m.title}</h5><p class="text-xs text-gray-500">${m.category}</p></div>
        </div>`).join('');
}

function openTrailer(id) { 
    const p = document.getElementById('youtube-player'); 
    p.src = `https://www.youtube.com/embed/${id}?autoplay=1`; 
    document.getElementById('video-modal').classList.remove('hidden'); 
}

function closeVideoModal() { 
    document.getElementById('youtube-player').src = ''; 
    document.getElementById('video-modal').classList.add('hidden'); 
}

function openWhatsAppGeneral() { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=Olá! Vim pelo site.`, '_blank'); }
function openWhatsAppGame(h, a) { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=Quero assistir ${h} x ${a}`, '_blank'); }
function requestTest() { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=Quero um teste grátis`, '_blank'); }
function buyPlan(p, v) { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=Quero assinar o ${p}`, '_blank'); }

document.addEventListener('DOMContentLoaded', () => { 
    getMatches(); 
    renderMovies(); 
    const b = document.getElementById('menu-btn');
    const m = document.getElementById('mobile-menu');
    if(b && m) b.onclick = () => m.classList.toggle('hidden');
});
