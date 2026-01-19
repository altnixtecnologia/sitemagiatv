from flask import Flask, jsonify
from flask_cors import CORS
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configurações da MagiaTV
API_CONFIG = {
    'KEY': '6eeb6ad06d3edbcb77ae34be643302da',
    'FOOTBALL_URL': 'https://v3.football.api-sports.io',
    'WYSTER_URL': 'https://wysterjogos.nptv2.com/',
    'WYSTER_TOKEN': '3fa85b7679ffeb398e99a27c2acd9489'
}

@app.route('/api/matches', methods=['GET'])
def get_unified_matches():
    # Pega a data de hoje para a API-Sports
    today = datetime.now().strftime('%Y-%m-%d')
    
    # 1. Busca jogos na API-Sports
    headers = {'x-apisports-key': API_CONFIG['KEY']}
    sports_data = []
    try:
        res_sports = requests.get(
            f"{API_CONFIG['FOOTBALL_URL']}/fixtures", 
            params={'date': today, 'timezone': 'America/Sao_Paulo'}, 
            headers=headers,
            timeout=5 # Timeout curto para não travar a Vercel
        )
        if res_sports.status_code == 200:
            sports_data = res_sports.json().get('response', [])
    except Exception as e:
        print(f"Erro ao buscar na API-Sports: {e}")

    # 2. Busca canais no Wyster (Opcional - se falhar, os jogos seguem aparecendo)
    wyster_data = []
    try:
        res_wyster = requests.post(
            API_CONFIG['WYSTER_URL'], 
            data={'token': API_CONFIG['WYSTER_TOKEN']}, 
            headers={'X-Requested-With': 'XMLHttpRequest'},
            timeout=4
        )
        if res_wyster.status_code == 200:
            wyster_data = res_wyster.json()
    except Exception:
        pass # Silencia o erro para não prejudicar a exibição dos jogos

    # 3. Lógica de Cruzamento Flexível
    for match in sports_data:
        match['canais'] = [] # Garante que o campo exista para o JavaScript
        home_api = match['teams']['home']['name'].lower()
        
        for w_game in wyster_data:
            home_wyster = w_game.get('time1', '').lower()
            # Se um nome estiver contido no outro (ex: "criciuma" em "criciúma e.c.")
            if home_wyster and (home_wyster in home_api or home_api in home_wyster):
                match['canais'] = w_game.get('canais', [])
                break

    return jsonify({"response": sports_data})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
