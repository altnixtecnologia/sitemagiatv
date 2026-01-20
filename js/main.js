// 1. DADOS DOS FILMES
const MOVIE_HIGHLIGHTS = [
    { "title": "Plano em Família 2 (2025)", "category": "Ação, Comédia", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/aLgvLNWETZ2wtPzU3E7lavEpCJw.jpg", "trailerId": "64-0cFnQ6Ls" },
    { "title": "Zootopia 2 (2025)", "category": "Animação, Família", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/fthvYnjERbXt3ILjLjHpPNd5IVJ.jpg", "trailerId": "z-C1VtXQr6o" },
    { "title": "IT: Bem-Vindo a Derry (2025)", "category": "Drama, Mistério", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/gMTfrLvrDaD0zrhpLZ7zXIIpKfJ.jpg", "trailerId": "_t4_QgZoyn8" },
    { "title": "Frankenstein (2025)", "category": "Drama, Terror", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/cXsMxClCcAF1oMwoXZvbKwWoNeS.jpg", "trailerId": "gRvl9uxmcbA" }
];

// 2. CONFIGURAÇÃO DA API
const API_CONFIG = {
    key: '6eeb6ad06d3edbcb77ae34be643302da',
    url: 'https://v3.football.api-sports.io',
    whatsappNumber: '5548991004780'
};

// 3. LÓGICA PRINCIPAL
async function getMatches() {
    const updateIndicator = document.getElementById('update-indicator');
    const mainContainer = document.getElementById('main-matches');
    const otherContainer = document.getElementById('other-matches');
    const btnContainer = document.getElementById('show-more-container');
    
    if(!mainContainer) return;
    if(updateIndicator) updateIndicator.innerHTML = '<i class="fas fa-sync-alt mr-2 animate-spin"></i>Conectando ao satélite...';

    const todayStr = new Date().toLocaleDateString('en-CA');
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toLocaleDateString('en-CA');

    const headers = new Headers();
    headers.append("x-apisports-key", API_CONFIG.key);

    try {
        const response = await fetch(`${API_CONFIG.url}/fixtures?from=${todayStr}&to=${nextWeekStr}&timezone=America/Sao_Paulo`, { method: 'GET', headers: headers });
        const data = await response.json();

        if (data.errors && data.errors.requests) {
            mainContainer.innerHTML = `<p class="col-span-full text-center py-8">Limite da API atingido.</p>`;
            return;
        }

        const allMatches = (data.response || []).filter(m => {
            const league = (m.league.name || "").toLowerCase();
            const country = (m.league.country || "").toLowerCase();
            return country === "brazil" || league.includes("paulista") || league.includes("carioca") || league.includes("catarinense") || league.includes("copinha");
        });

        const priorityTerms = ['Serie A', 'Copa do Brasil', 'Libertadores', 'Paulista', 'Carioca', 'Gaucho', 'Catarinense', 'Mineiro', 'Copinha'];
        const mainGames = allMatches.filter(m => priorityTerms.some(term => m.league.name.includes(term)));
        const otherGames = allMatches.filter(m => !mainGames.includes(m));

        if (mainGames.length > 0) {
            renderMatches(mainGames, mainContainer);
        } else if (allMatches.length > 0) {
            renderMatches(allMatches, mainContainer);
        } else {
            mainContainer.innerHTML = `<p class="col-span-full text-center py-8 text-gray-500">Nenhum jogo brasileiro nesta semana.</p>`;
        }

        if (otherGames.length > 0 && mainGames.length > 0) {
            renderMatches(otherGames, otherContainer);
            if(btnContainer) btnContainer.classList.remove('hidden');
        }

        if(updateIndicator) {
            updateIndicator.innerHTML = `<i class="fas fa-check-circle mr-2 text-green-500"></i>Agenda atualizada às ${new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}`;
        }
    } catch (e) {
        mainContainer.innerHTML = `<p class="col-span-full text-center py-8">Erro de conexão.</p>`;
    }
}

function renderMatches(matches, container) {
    container.innerHTML = matches.map(m => {
        const isLive = ['1H', '2H', 'HT', 'LIVE'].includes(m.fixture.status.short);
        const d = new Date(m.fixture.date);
        const dateStr = `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')} • ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
        const border = m.league.name.includes('Catarinense') ? 'border-blue-400' : 'border-gray-100';
        
        return `
            <div class="bg-white rounded-lg shadow-md p-4 border-l-4 ${border} card-hover">
                <div class="flex items-center justify-between mb-4 border-b pb-2">
                    <span class="${isLive ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-gray-100 text-gray-600'} px-2 py-1 rounded text-xs font-bold uppercase">${isLive ? 'AO VIVO' : translateStatus(m.fixture.status.short)}</span>
                    <span class="text-xs text-gray-500 text-right"><div class="font-bold">${dateStr}</div><div class="text-blue-600 truncate max-w-[120px]">${m.league.name}</div></span>
                </div>
                <div class="flex items-center justify-between px-2">
                    <div class="flex flex-col items-center w-[35%]"><img src="${m.teams.home.logo}" class="w-10 h-10 object-contain"><p class="text-xs font-bold text-center mt-2">${m.teams.home.name}</p></div>
                    <div class="text-lg font-black">${m.goals.home ?? 0} x ${m.goals.away ?? 0}</div>
                    <div class="flex flex-col items-center w-[35%]"><img src="${m.teams.away.logo}" class="w-10 h-10 object-contain"><p class="text-xs font-bold text-center mt-2">${m.teams.away.name}</p></div>
                </div>
                <button onclick="openWhatsAppGame('${m.teams.home.name}', '${m.teams.away.name}')" class="w-full mt-4 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition">Assistir Agora</button>
            </div>`;
    }).join('');
}

// 4. AUXILIARES
function translateStatus(s) { 
    const m = {'TBD':'A Definir','NS':'Agendado','1H':'1º Tempo','HT':'Intervalo','2H':'2º Tempo','FT':'Fim','LIVE':'Ao Vivo'}; 
    return m[s] || s; 
}

function renderMovies() {
    const c = document.getElementById('movies-container');
    if(!c) return;
    c.innerHTML = MOVIE_HIGHLIGHTS.map(m => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden group">
            <div class="relative aspect-[2/3] overflow-hidden">
                <img src="${m.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-300">
                <button onclick="openTrailer('${m.trailerId}')" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300"><i class="fas fa-play text-white text-3xl"></i></button>
            </div>
            <div class="p-4"><h5 class="font-bold text-gray-800 text-sm">${m.title}</h5></div>
        </div>`).join('');
}

function openTrailer(id) { document.getElementById('youtube-player').src = `https://www.youtube.com/embed/${id}?autoplay=1`; document.getElementById('video-modal').classList.remove('hidden'); }
function closeVideoModal() { document.getElementById('youtube-player').src = ''; document.getElementById('video-modal').classList.add('hidden'); }
function toggleOtherGames() { document.getElementById('other-matches').classList.toggle('hidden'); }
function openWhatsAppGeneral() { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=Olá!`, '_blank'); }
function openWhatsAppGame(h, a) { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=Quero assistir ${h} x ${a}`, '_blank'); }
function requestTest() { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=Quero um teste grátis`, '_blank'); }
function buyPlan(p, v) { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=Quero assinar o ${p}`, '_blank'); }

document.addEventListener('DOMContentLoaded', () => { 
    getMatches(); 
    renderMovies(); 
    const b = document.getElementById('menu-btn');
    if(b) b.onclick = () => document.getElementById('mobile-menu').classList.toggle('hidden');
});
