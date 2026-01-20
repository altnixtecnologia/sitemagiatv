const WHATS_NUMBER = '5548991004780';

// Controlo da Janela Camuflada
function openWysterModal() {
    document.getElementById('wyster-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeWysterModal() {
    document.getElementById('wyster-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Funções de Venda Restauradas
function buyPlan(plano, valor) {
    const msg = encodeURIComponent(`Olá! Quero contratar o ${plano} no valor de ${valor} da MagiaTV.`);
    window.open(`https://wa.me/${WHATS_NUMBER}?text=${msg}`, '_blank');
}

function requestTest() {
    window.open(`https://wa.me/${WHATS_NUMBER}?text=Quero um teste grátis na MagiaTV!`, '_blank');
}

function openWhatsAppGeneral() {
    window.open(`https://wa.me/${WHATS_NUMBER}?text=Olá! Preciso de suporte na MagiaTV.`, '_blank');
}
