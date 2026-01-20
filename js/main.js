// Lista de Filmes
const MOVIE_HIGHLIGHTS = [
    { "title": "Plano em Família 2", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/aLgvLNWETZ2wtPzU3E7lavEpCJw.jpg", "trailerId": "64-0cFnQ6Ls" },
    { "title": "Zootopia 2", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/fthvYnjERbXt3ILjLjHpPNd5IVJ.jpg", "trailerId": "z-C1VtXQr6o" },
    { "title": "IT: Derry (2025)", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/gMTfrLvrDaD0zrhpLZ7zXIIpKfJ.jpg", "trailerId": "_t4_QgZoyn8" },
    { "title": "Frankenstein", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/cXsMxClCcAF1oMwoXZvbKwWoNeS.jpg", "trailerId": "gRvl9uxmcbA" }
];

const WHATS_NUMBER = '5548991004780';

// --- Lógica da Janela Flutuante Camuflada ---
function openWysterModal() {
    document.getElementById('wyster-modal').classList.remove('hidden');
    // Trava a rolagem da página principal atrás do modal
    document.body.style.overflow = 'hidden';
}

function closeWysterModal() {
    document.getElementById('wyster-modal').classList.add('hidden');
    // Destrava a rolagem
    document.body.style.overflow = 'auto';
}

// --- Renderização de Filmes ---
function renderMovies() {
    const container = document.getElementById('movies-container');
    if(!container) return;
    container.innerHTML = MOVIE_HIGHLIGHTS.map(m => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden group card-hover">
            <div class="relative aspect-[2/3] overflow-hidden">
                <img src="${m.image}" class="w-full h-full object-cover">
                <button onclick="openTrailer('${m.trailerId}')" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><i class="fas fa-play text-white text-3xl"></i></button>
            </div>
            <div class="p-3 text-center text-xs font-bold text-gray-700">${m.title}</div>
        </div>`).join('');
}

// --- Funções de Modal de Vídeo e WhatsApp ---
function openTrailer(id) { 
    document.getElementById('youtube-player').src = `https://www.youtube.com/embed/${id}?autoplay=1`; 
    document.getElementById('video-modal').classList.remove('hidden'); 
}

function closeVideoModal() { 
    document.getElementById('youtube-player').src = ''; 
    document.getElementById('video-modal').classList.add('hidden'); 
}

function requestTest() { 
    window.open(`https://wa.me/${WHATS_NUMBER}?text=Quero um teste grátis na MagiaTV!`, '_blank'); 
}

document.addEventListener('DOMContentLoaded', renderMovies);
