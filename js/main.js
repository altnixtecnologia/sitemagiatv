// ==========================================
// CONFIGURAÇÃO DA API E DADOS
// ==========================================
const API_CONFIG = {
    key: '6eeb6ad06d3edbcb77ae34be643302da', 
    url: 'https://v3.football.api-sports.io',
    // ATENÇÃO: NÚMERO ATUALIZADO
    whatsappNumber: '5548991004780' 
};

const myHeaders = new Headers();
myHeaders.append("x-rapidapi-key", API_CONFIG.key);
myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};

// ==========================================
// FUNÇÕES PRINCIPAIS (FUTEBOL)
// ==========================================

async function getMatches() {
    const updateIndicator = document.getElementById('update-indicator');
    const matchesTitle = document.getElementById('matches-title');
    const container = document.getElementById('today-matches');
    
    if(!container) return; 

    if(updateIndicator) updateIndicator.innerHTML = '<i class="fas fa-sync-alt mr-2 animate-spin"></i>Buscando jogos...';

    const today = new Date();
    const todayStr = formatDate(today);
    
    // Tenta buscar jogos de HOJE
    let url = `${API_CONFIG.url}/fixtures?date=${todayStr}&timezone=America/Sao_Paulo`;
    
    try {
        let response = await fetch(url, requestOptions);
        let data = await response.json();
        
        let matches = filterBrazilianMatches(data.response);
        let periodTitle = "Jogos de Hoje";

        // Se não tiver jogo hoje, busca da SEMANA
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
        container.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-gray-500">Sistema de jogos indisponível no momento.</p>
            </div>`;
    }
}

function filterBrazilianMatches(matches) {
    if (!matches) return [];
    
    return matches.filter(match => {
        const country = match.league.country;
        const homeName = match.teams.home.name;
        const awayName = match.teams.away.name;

        const isBrazil = country === "Brazil";
        const isSelecao = homeName === "Brazil" || awayName === "Brazil";
        
        return isBrazil || isSelecao;
    })
    .slice(0, 9)
    .sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));
}

function renderMatches(matches, container) {
    if (matches.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-8 bg-white rounded-lg shadow">
                <i class="fas fa-calendar-times text-4xl text-gray-300 mb-2"></i>
                <p class="text-gray-500">Nenhum jogo brasileiro encontrado para os próximos dias.</p>
            </div>`;
        return;
    }

    const html = matches.map(match => {
        const status = translateStatus(match.fixture.status.short);
        const isLive = ['1H', '2H', 'HT', 'LIVE'].includes(match.fixture.status.short);
        const date = new Date(match.fixture.date);
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const min = date.getMinutes().toString().padStart(2, '0');
        const dateDisplay = `${day}/${month} • ${hour}:${min}`;

        return `
            <div class="bg-white rounded-lg shadow-md card-hover p-4 border border-gray-100 relative">
                <div class="flex items-center justify-between mb-4 border-b pb-2">
                    <span class="${isLive ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-gray-100 text-gray-600'} px-2 py-1 rounded text-xs font-bold uppercase">
                        ${isLive ? 'AO VIVO' : status}
                    </span>
                    <span class="text-xs text-gray-500 text-right">
                        <div class="font-bold">${dateDisplay}</div>
                        <div class="truncate max-w-[150px]">${match.league.name}</div>
                    </span>
                </div>

                <div class="flex items-center justify-between px-2">
                    <div class="flex flex-col items-center w-[30%]">
                        <img src="${match.teams.home.logo}" alt="${match.teams.home.name}" class="w-12 h-12 object-contain mb-2">
                        <p class="text-xs font-bold text-center leading-tight">${match.teams.home.name}</p>
                    </div>

                    <div class="flex flex-col items-center w-[30%]">
                        <div class="text-xl font-black text-gray-700 bg-gray-50 px-3 py-1 rounded">
                            ${match.goals.home ?? 0} x ${match.goals.away ?? 0}
                        </div>
                        <span class="text-[10px] text-gray-400 mt-1 uppercase">
                            ${isLive ? match.fixture.status.elapsed + "'" : ''}
                        </span>
                    </div>

                    <div class="flex flex-col items-center w-[30%]">
                        <img src="${match.teams.away.logo}" alt="${match.teams.away.name}" class="w-12 h-12 object-contain mb-2">
                        <p class="text-xs font-bold text-center leading-tight">${match.teams.away.name}</p>
                    </div>
                </div>

                <button class="w-full mt-4 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition flex items-center justify-center" 
                        onclick="openWhatsAppGame('${match.teams.home.name}', '${match.teams.away.name}')">
                    <i class="fab fa-whatsapp mr-2"></i>
                    Assistir
                </button>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}

// ==========================================
// UTILITÁRIOS E HELPERS
// ==========================================

function translateStatus(status) {
    const map = {
        'TBD': 'A Definir', 'NS': 'Agendado',
        '1H': '1º Tempo', 'HT': 'Intervalo', '2H': '2º Tempo',
        'ET': 'Prorrogação', 'P': 'Pênaltis',
        'FT': 'Fim de Jogo', 'AET': 'Fim (Pro)', 'PEN': 'Fim (Pên)',
        'BT': 'Intervalo', 'SUSP': 'Suspenso', 'INT': 'Parado',
        'PST': 'Adiado', 'CANC': 'Cancelado', 'ABD': 'Abandonado',
        'AWD': 'W.O.', 'WO': 'W.O.', 'LIVE': 'Ao Vivo'
    };
    return map[status] || status;
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Abre WhatsApp pedindo TESTE (Botão do Banner)
function requestTest() {
    const text = `Olá! 👋 Gostaria de *PEDIR UM TESTE* grátis no MagiaTV.`;
    const url = `https://wa.me/${API_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// Abre WhatsApp para um jogo específico
function openWhatsAppGame(home, away) {
    const text = `⚽ Olá! Quero assistir ao jogo *${home} x ${away}* no MagiaTV!`;
    const url = `https://wa.me/${API_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// Abre WhatsApp para contratar plano
function buyPlan(planName, price) {
    const text = `💰 Olá! Tenho interesse no *${planName}* (${price}). Como faço para assinar?`;
    const url = `https://wa.me/${API_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// ==========================================
// INICIALIZAÇÃO GERAL
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 MagiaTV Iniciado');
    
    getMatches();
    setInterval(getMatches, 300000); 

    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    const form = document.getElementById('contato-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome').value;
            const msg = document.getElementById('mensagem').value;
            const text = `👤 *Novo Contato*\nNome: ${nome}\nMensagem: ${msg}`;
            window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
        });
    }
});
