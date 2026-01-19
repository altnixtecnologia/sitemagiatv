const API_CONFIG = {
    backendUrl: 'https://sitemagiatv.vercel.app/api/matches',
    whatsappNumber: '5548991004780' 
};

async function getMatches() {
    const mainContainer = document.getElementById('main-matches');
    const updateIndicator = document.getElementById('update-indicator');
    if(!mainContainer) return;

    try {
        const response = await fetch(API_CONFIG.backendUrl);
        const data = await response.json();
        const responseList = data.response || [];

        if (responseList.length > 0) {
            renderMatches(responseList, mainContainer);
        } else {
            mainContainer.innerHTML = `<div class="col-span-full text-center py-8"><p class="text-gray-500">Nenhuma transmissão ao vivo encontrada.</p></div>`;
        }

        if(updateIndicator) {
            const time = new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
            updateIndicator.innerHTML = `<i class="fas fa-check-circle mr-2 text-green-500"></i>Grade atualizada às ${time}`;
        }
    } catch (e) {
        mainContainer.innerHTML = `<p class="text-center text-red-500">Erro de conexão.</p>`;
    }
}

function renderMatches(matches, container) {
    container.innerHTML = matches.map(match => {
        const isLive = ['1H', '2H', 'HT', 'LIVE'].includes(match.fixture.status.short);
        
        let channelsHtml = (match.canais || []).map(c => `
            <div class="flex flex-col items-center">
                <img src="${c.img_url}" class="h-6 w-auto object-contain">
                <span class="text-[7px] text-gray-400 font-bold uppercase mt-1">${c.nome}</span>
            </div>`).join('');

        return `
            <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500 card-hover">
                <div class="flex items-center justify-between mb-4 border-b pb-2">
                    <span class="${isLive ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-gray-100 text-gray-600'} px-2 py-1 rounded text-xs font-bold uppercase">${isLive ? 'AO VIVO' : 'Agendado'}</span>
                    <span class="text-xs text-blue-600 font-bold truncate max-w-[150px]">${match.league.name}</span>
                </div>
                <div class="flex items-center justify-between px-2">
                    <div class="flex flex-col items-center w-[35%]"><img src="${match.teams.home.logo}" class="w-10 h-10 object-contain"><p class="text-xs font-bold text-center mt-2">${match.teams.home.name}</p></div>
                    <div class="text-lg font-black text-gray-700">${match.goals.home ?? 0} x ${match.goals.away ?? 0}</div>
                    <div class="flex flex-col items-center w-[35%]"><img src="${match.teams.away.logo}" class="w-10 h-10 object-contain"><p class="text-xs font-bold text-center mt-2">${match.teams.away.name}</p></div>
                </div>
                <div class="mt-3 pt-2 border-t flex flex-wrap justify-center gap-3">${channelsHtml}</div>
                <button class="w-full mt-4 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold" onclick="openWhatsAppGame('${match.teams.home.name}', '${match.teams.away.name}')">Assistir Agora</button>
            </div>`;
    }).join('');
}

function openWhatsAppGame(h, a) { window.open(`https://wa.me/${API_CONFIG.whatsappNumber}?text=${encodeURIComponent(`Quero assistir ${h} x ${a} no MagiaTV!`)}`, '_blank'); }
document.addEventListener('DOMContentLoaded', getMatches);
