// js/extractor.js - Lógica de captura de dados externos

async function fetchExternalGames() {
    const url = 'https://wysterjogos.nptv2.com/';
    const token = '3fa85b7679ffeb398e99a27c2acd9489'; // Token identificado no sistema

    const formData = new URLSearchParams();
    formData.append('token', token);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });

        if (!response.ok) throw new Error('Falha na rede');
        
        const data = await response.json();
        return data; // Retorna a lista completa de jogos extraídos
    } catch (error) {
        console.error("Erro na extração Wyster:", error);
        return null;
    }
}
