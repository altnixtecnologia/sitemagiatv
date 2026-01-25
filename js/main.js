const WHATS_NUMBER = '5548991004780';

const MOVIE_HIGHLIGHTS = [
    { "title": "Stranger Things (2016)", "category": "Sci-Fi & Fantasy, Mistério e Action & Adventure", "image": "https://media.themoviedb.org/t/p/w300_and_h450_face/twfKp60THrcOIep9sjHODOOfO8d.jpg", "trailerId": "fLL0_Vy2Wlo"  },
    { "title": "A Única Saída", "category": "Comédia", "image": "https://media.filmelier.com//images/tit/113197/poster/eojjeolsuga-eobsda42541.webp", "trailerId": "vi9DAcAbejA" },
    { "title": "Anaconda", "category": "Ação", "image": "https://media.filmelier.com//images/tit/28934/poster/anaconda14524.webp", "trailerId": "US_KXy4EZQ8" },
    { "title": "Marty Supreme", "category": "Drama", "image": "https://media.filmelier.com//images/tit/113411/poster/marty-supreme32420.webp", "trailerId": "SovoTyFeF-I" }
];

function renderMovies() {
    const container = document.getElementById('movies-container');
    if(!container) return;
    container.innerHTML = MOVIE_HIGHLIGHTS.map(m => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden group card-hover cursor-pointer" onclick="openTrailer('${m.trailerId}')">
            <div class="relative aspect-[2/3] overflow-hidden">
                <img src="${m.image}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <i class="fas fa-play text-white text-3xl"></i>
                </div>
            </div>
            <div class="p-3 text-center text-xs font-bold text-gray-700">${m.title}</div>
        </div>`).join('');
}

function buyPlan(plano, valor) {
    window.open(`https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(`Olá! Quero o ${plano} de ${valor} na MagiaTV.`)}`, '_blank');
}

function requestTest() {
    window.open(`https://wa.me/${WHATS_NUMBER}?text=Quero um teste grátis na MagiaTV!`, '_blank');
}

function openWhatsAppGeneral() {
    window.open(`https://wa.me/${WHATS_NUMBER}?text=Olá! Preciso de suporte na MagiaTV.`, '_blank');
}

function openTrailer(id) { 
    document.getElementById('youtube-player').src = `https://www.youtube.com/embed/${id}?autoplay=1`; 
    document.getElementById('video-modal').classList.remove('hidden'); 
}

function closeVideoModal() { 
    document.getElementById('youtube-player').src = ''; 
    document.getElementById('video-modal').classList.add('hidden'); 
}

document.addEventListener('DOMContentLoaded', () => {
    renderMovies();
    const menuBtn = document.getElementById('menu-btn');
    if(menuBtn) {
        menuBtn.onclick = () => document.getElementById('mobile-menu').classList.toggle('hidden');
    }
});
