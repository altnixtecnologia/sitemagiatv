// JavaScript principal para MagiaTV

// Banco de dados de brasões de times brasileiros
const TEAM_SHIELDS = {
    'Palmeiras': {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDBGRjAwO3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkZGRkY7c3RvcC1vcGFjaXR5OjEiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9InVybCgjZ3JhZGllbnQpIi8+Cjx0ZXh0IHg9IjMyIiB5PSIzNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzAwNEQ5OSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwcHgiIGZvbnQtd2VpZ2h0PSJib2xkIj5QQVA8L3RleHQ+Cjwvc3ZnPg==',
        colors: 'from-green-600 to-white',
        text: 'PAL'
    },
    'Santos': {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGRkZGRjtzdG9wLW9wYWNpdHk6MSIgLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwO3N0b3Atb3BhY2l0eToxIiAvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjMyIiBmaWxsPSJ1cmwoI2dyYWRpZW50MikiLz4KPHRleHQgeD0iMzIiIHk9IjM2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTBweCIgZm9udC13ZWlnaHQ9ImJvbGQiPlNBTjwvdGV4dD4KPC9zdmc+',
        colors: 'from-white to-black',
        text: 'SAN'
    },
    'Flamengo': {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQzIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGNjM2MztzdG9wLW9wYWNpdHk6MSIgLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwO3N0b3Atb3BhY2l0eToxIiAvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjMyIiBmaWxsPSJ1cmwoI2dyYWRpZW50MykiLz4KPHRleHQgeD0iMzIiIHk9IjM2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTBweCIgZm9udC13ZWlnaHQ9ImJvbGQiPkZMQTwvdGV4dD4KPC9zdmc+',
        colors: 'from-red-600 to-black',
        text: 'FLA'
    },
    'Fluminense': {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQ0IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGNjM2MztzdG9wLW9wYWNpdHk6MSIgLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDBGRjAwO3N0b3Atb3BhY2l0eToxIiAvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjMyIiBmaWxsPSJ1cmwoI2dyYWRpZW50NCkiLz4KPHRleHQgeD0iMzIiIHk9IjM2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTBweCIgZm9udC13ZWlnaHQ9ImJvbGQiPkZMVU48L3RleHQ+Cjwvc3ZnPg==',
        colors: 'from-red-600 to-green-600',
        text: 'FLU'
    },
    'Corinthians': {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQ1IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMDAwMDtzdG9wLW9wYWNpdHk6MSIgLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZGRkZGO3N0b3Atb3BhY2l0eToxIiAvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjMyIiBmaWxsPSJ1cmwoI2dyYWRpZW50NSkiLz4KPHRleHQgeD0iMzIiIHk9IjM2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTBweCIgZm9udC13ZWlnaHQ9ImJvbGQiPkNPUjwvdGV4dD4KPC9zdmc+',
        colors: 'from-black to-white',
        text: 'COR'
    },
    'São Paulo': {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQ2IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGNjM2MztzdG9wLW9wYWNpdHk6MSIgLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZGRkZGO3N0b3Atb3BhY2l0eToxIiAvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjMyIiBmaWxsPSJ1cmwoI2dyYWRpZW50NikiLz4KPHRleHQgeD0iMzIiIHk9IjM2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTBweCIgZm9udC13ZWlnaHQ9ImJvbGQiPlNQQTwvdGV4dD4KPC9zdmc+',
        colors: 'from-red-600 to-white',
        text: 'SPA'
    }
};

// API de jogos do dia (TheSportsDB - Gratuita)
const SPORTSDB_CONFIG = {
    baseUrl: 'https://www.thesportsdb.com/api/v1/json/1',
    endpoints: {
        eventsDay: '/eventsday.php',
        eventDetails: '/lookupevent.php'
    }
};

// Função para obter jogos do dia
async function getTodayMatches() {
    try {
        const today = new Date();
        const dateStr = today.getFullYear() + '-' + 
                       String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                       String(today.getDate()).padStart(2, '0');
        
        const response = await fetch(`${SPORTSDB_CONFIG.baseUrl}${SPORTSDB_CONFIG.endpoints.eventsDay}?d=${dateStr}&s=Soccer`);
        const data = await response.json();
        
        if (data.events) {
            return data.events
                .filter(event => event.strSport === 'Soccer' && event.strCountry === 'Brazil')
                .map(event => ({
                    id: event.idEvent,
                    homeTeam: event.strHomeTeam,
                    awayTeam: event.strAwayTeam,
                    time: event.strTime ? event.strTime.substring(0, 5) : '00:00',
                    competition: event.strLeague || 'Amistoso',
                    status: event.strStatus || 'Agendado',
                    homeScore: event.intHomeScore || '0',
                    awayScore: event.intAwayScore || '0'
                }));
        }
        
        return [];
    } catch (error) {
        console.log('API indisponível, usando jogos estáticos');
        return getStaticMatches();
    }
}

// Função para obter jogos estáticos (fallback)
function getStaticMatches() {
    return [
        {
            id: '1',
            homeTeam: 'Palmeiras',
            awayTeam: 'Santos',
            time: '16:00',
            competition: 'Paulistão',
            status: 'Agendado',
            homeScore: '0',
            awayScore: '0'
        },
        {
            id: '2',
            homeTeam: 'Flamengo',
            awayTeam: 'Fluminense',
            time: '18:30',
            competition: 'Carioca',
            status: 'Agendado',
            homeScore: '0',
            awayScore: '0'
        },
        {
            id: '3',
            homeTeam: 'Corinthians',
            awayTeam: 'São Paulo',
            time: '20:00',
            competition: 'Brasileirão Série A',
            status: 'Agendado',
            homeScore: '0',
            awayScore: '0'
        }
    ];
}

// Função para atualizar interface com jogos reais
async function updateTodayMatches() {
    const updateIndicator = document.getElementById('update-indicator');
    
    // Mostrar indicador de carregamento
    if (updateIndicator) {
        updateIndicator.innerHTML = '<i class="fas fa-sync-alt mr-2 animate-spin"></i>Atualizando jogos...';
    }
    
    const todayMatches = await getTodayMatches();
    const matchesContainer = document.getElementById('today-matches');
    
    // Atualizar indicador após carregar
    if (updateIndicator) {
        updateIndicator.innerHTML = '<i class="fas fa-check-circle mr-2 text-green-500"></i>Atualizado há ' + new Date().toLocaleTimeString('pt-BR');
    }
    
    if (todayMatches.length === 0) {
        matchesContainer.innerHTML = `
            <div class="col-span-full text-center py-8">
                <i class="fas fa-futbol text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">Nenhum jogo encontrado para hoje</p>
                <button onclick="updateTodayMatches()" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                    <i class="fas fa-sync-alt mr-2"></i>Atualizar
                </button>
            </div>
        `;
        return;
    }
    
    // Criar HTML com jogos reais
    const matchesHTML = todayMatches.map(match => {
        const homeShield = getTeamShield(match.homeTeam);
        const awayShield = getTeamShield(match.awayTeam);
        const isLive = match.status === 'In Progress' || match.status === 'Live';
        
        return `
            <div class="bg-white rounded-lg shadow-md card-hover p-6">
                <div class="flex items-center justify-between mb-4">
                    <span class="${isLive ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-blue-100 text-blue-800'} px-3 py-1 rounded-full text-sm font-semibold">
                        ${isLive ? 'AO VIVO' : 'HOJE'}
                    </span>
                    <span class="text-gray-500 text-sm">${match.time}</span>
                </div>
                <div class="text-center">
                    <div class="flex justify-between items-center mb-4">
                        <div class="text-center">
                            <img src="${homeShield.url}" alt="${match.homeTeam}" class="w-16 h-16 rounded-full mx-auto mb-2 shadow-lg border-2 border-gray-300 hover:scale-110 transition-transform">
                            <p class="text-sm font-medium">${match.homeTeam}</p>
                            <p class="text-lg font-bold ${isLive ? 'text-red-600' : 'text-gray-600'}">${match.homeScore}</p>
                        </div>
                        <div class="text-2xl font-bold text-gray-600">VS</div>
                        <div class="text-center">
                            <img src="${awayShield.url}" alt="${match.awayTeam}" class="w-16 h-16 rounded-full mx-auto mb-2 shadow-lg border-2 border-gray-300 hover:scale-110 transition-transform">
                            <p class="text-sm font-medium">${match.awayTeam}</p>
                            <p class="text-lg font-bold ${isLive ? 'text-red-600' : 'text-gray-600'}">${match.awayScore}</p>
                        </div>
                    </div>
                    <p class="text-gray-600 text-sm mb-3">${match.competition}</p>
                    <button class="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition" onclick="openFootballVideo('dQw4w9WgXcQ')">
                        <i class="fas fa-play mr-2"></i>Ver Jogo
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Atualizar container
    if (matchesContainer) {
        matchesContainer.innerHTML = matchesHTML;
    }
}

// Função para testar os escudos (debug)
function debugTeamShields() {
    console.log('=== DEBUG ESCUDOS ===');
    const teams = ['Palmeiras', 'Santos', 'Flamengo', 'Fluminense', 'Corinthians', 'São Paulo'];
    
    teams.forEach(team => {
        const shield = getTeamShield(team);
        console.log(`${team}: ${shield.text} - ${shield.colors}`);
        // Criar elemento de teste
        const img = new Image();
        img.src = shield.url;
        img.onload = () => console.log(`✅ ${team} - SVG carregado com sucesso`);
        img.onerror = () => console.log(`❌ ${team} - Erro ao carregar SVG`);
    });
}
function getTeamShield(teamName) {
    const team = TEAM_SHIELDS[teamName];
    if (team) {
        return {
            url: team.url,
            colors: team.colors,
            text: team.text
        };
    }
    
    // Brasão padrão para times não cadastrados
    return {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiM2Yjc0ZmEiLz4KPHRleHQgeD0iMzIiIHk9IjM4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwcHgiIGZvbnQtd2VpZ2h0PSJib2xkIj5URTwvdGV4dD4KPC9zdmc+',
        colors: 'from-gray-600 to-gray-800',
        text: teamName.substring(0, 3).toUpperCase()
    };
}

// Configurações e variáveis globais
const CONFIG = {
    WHATSAPP_NUMBER: '5500000000000', // Substitua pelo número real
    MENSAGEM_PADRAO: '📺 Olá! Estou interessado no MagiaTV. Poderia me dar mais informações?',
    ANIMATION_DURATION: 600,
    YOUTUBE_EMBED_URL: 'https://www.youtube.com/embed/'
};

// Funções para vídeos do YouTube
function openTrailer(videoId) {
    const modal = document.getElementById('video-modal');
    const player = document.getElementById('youtube-player');
    
    // Configurar o src do iframe com o vídeo do YouTube
    player.src = `${CONFIG.YOUTUBE_EMBED_URL}${videoId}?autoplay=1&rel=0&modestbranding=1`;
    
    // Mostrar o modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Prevenir scroll da página
    document.body.style.overflow = 'hidden';
}

function openFootballVideo(videoId) {
    openTrailer(videoId);
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const player = document.getElementById('youtube-player');
    
    // Limpar o src do iframe para parar o vídeo
    player.src = '';
    
    // Esconder o modal
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    
    // Restaurar scroll da página
    document.body.style.overflow = 'auto';
}

// Fechar modal ao clicar fora do vídeo
function initializeModalHandlers() {
    const modal = document.getElementById('video-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeVideoModal();
            }
        });
    }
    
    // Fechar modal com a tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeVideoModal();
        }
    });
}

// Inicialização do site
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 MagiaTV carregado com sucesso!');
    
    initializeMobileMenu();
    initializeScrollAnimations();
    initializeFormHandlers();
    initializePlanButtons();
    initializeSmoothScroll();
    addWhatsAppFloatButton();
    initializeCounters();
    initializeModalHandlers();
});

// Menu mobile
function initializeMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('show');
            
            // Animação do ícone
            const icon = menuBtn.querySelector('i');
            if (mobileMenu.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Fechar menu ao clicar em links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('show');
                menuBtn.querySelector('i').classList.remove('fa-times');
                menuBtn.querySelector('i').classList.add('fa-bars');
            });
        });
    }
}

// Animações ao scroll
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animação específica para cards
                if (entry.target.classList.contains('card-hover')) {
                    entry.target.style.animationDelay = Math.random() * 0.3 + 's';
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos
    const animatedElements = document.querySelectorAll('.fade-in-scroll, .card-hover, .plan-card');
    animatedElements.forEach(el => {
        el.classList.add('fade-in-scroll');
        observer.observe(el);
    });
}

// Scroll suave para links
function initializeSmoothScroll() {
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Manipuladores de formulário
function initializeFormHandlers() {
    const contatoForm = document.getElementById('contato-form');
    
    if (contatoForm) {
        contatoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleWhatsAppMessage();
        });
    }
    
    // Máscara de telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function() {
            this.value = formatPhoneNumber(this.value);
        });
    }
}

// Botões de planos
function initializePlanButtons() {
    const planButtons = document.querySelectorAll('button[class*="whatsapp"]:not(#contato-form button)');
    
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planType = this.closest('.plan-card') ? 
                this.closest('.plan-card').querySelector('h4').textContent : 
                'MagiaTV';
            
            const message = `🎯 Olá! Estou interessado no ${planType}. Poderia me dar mais informações?`;
            openWhatsApp(message);
        });
    });
}

// Enviar mensagem WhatsApp
function handleWhatsAppMessage() {
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const plano = document.getElementById('plano').value;
    const mensagem = document.getElementById('mensagem').value;
    
    let message = `📺 *MagiaTV - Nova Mensagem*\n\n`;
    message += `👤 *Nome:* ${nome}\n`;
    message += `📱 *Telefone:* ${telefone}\n`;
    
    if (plano) {
        const planoText = {
            'basico': 'Plano Básico - R$ 29/mês',
            'intermediario': 'Plano Intermediário - R$ 49/mês',
            'premium': 'Plano Premium - R$ 79/mês',
            'duvida': 'Tenho dúvidas'
        };
        message += `📋 *Plano de Interesse:* ${planoText[plano]}\n`;
    }
    
    if (mensagem) {
        message += `💬 *Mensagem:* ${mensagem}\n`;
    }
    
    message += `\n⏰ *Horário:* ${new Date().toLocaleString('pt-BR')}`;
    
    openWhatsApp(message);
}

// Abrir WhatsApp
function openWhatsApp(message) {
    const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    
    // Adicionar efeito visual ao botão
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.classList.add('pulse-soft');
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
        
        setTimeout(() => {
            submitButton.classList.remove('pulse-soft');
            submitButton.innerHTML = '<i class="fab fa-whatsapp mr-2"></i>Enviar Mensagem no WhatsApp';
        }, 2000);
    }
    
    window.open(whatsappUrl, '_blank');
}

// Formatar número de telefone
function formatPhoneNumber(value) {
    // Remove tudo que não é número
    value = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    value = value.slice(0, 11);
    
    // Formatação progressiva
    if (value.length <= 10) {
        // (00) 0000-0000
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
        // (00) 00000-0000
        value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    
    return value;
}

// Botão flutuante do WhatsApp
function addWhatsAppFloatButton() {
    const whatsappFloat = document.createElement('a');
    whatsappFloat.href = '#';
    whatsappFloat.className = 'whatsapp-float';
    whatsappFloat.innerHTML = '<i class="fab fa-whatsapp"></i>';
    whatsappFloat.title = 'Fale Conosco no WhatsApp';
    
    whatsappFloat.addEventListener('click', function(e) {
        e.preventDefault();
        openWhatsApp(CONFIG.MENSAGEM_PADRAO);
    });
    
    document.body.appendChild(whatsappFloat);
}

// Contadores animados
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Animação de contador
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target')) || 0;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(function() {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Efeitos visuais adicionais
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar efeito de hover nos cards de filmes
    const movieCards = document.querySelectorAll('#destaques .card-hover');
    movieCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('zoom-in');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('zoom-in');
        });
    });
    
    // Efeito de brilho nos botões de plano
    const planButtons = document.querySelectorAll('.plan-card button');
    planButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('btn-glow');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('btn-glow');
        });
    });
    
    // Buscar jogos do dia na API
    updateTodayMatches();
    debugTeamShields(); // Debug dos escudos
    
    // Atualizar jogos a cada 30 minutos
    setInterval(updateTodayMatches, 30 * 60 * 1000);
});

// Função para simular loading de conteúdo
function simulateContentLoading() {
    const cards = document.querySelectorAll('.card-hover');
    
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.remove('card-loading');
            card.classList.add('fade-in-up');
        }, index * 100);
    });
}

// Inicializar loading ao carregar a página
window.addEventListener('load', function() {
    setTimeout(simulateContentLoading, 500);
});

// Adicionar efeito de parallax no hero
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.gradient-bg');
    
    if (hero && scrolled < 500) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});