from flask import Flask, jsonify
from flask_cors import CORS
import requests
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Configurações MagiaTV
API_CONFIG = {
    'KEY': '6eeb6ad06d3edbcb77ae34be643302da',
    'FOOTBALL_URL': 'https://v3.football.api-sports.io',
    'WYSTER_URL': 'https://wysterjogos.nptv2.com/',
    'WYSTER_TOKEN': '3fa85b7679ffeb398e99a27c2acd9489'
}

@app.route('/api/matches', methods=['GET'])
def get_unified_matches():
    # AJUSTE DE FUSO HORÁRIO: Força o horário de Brasília (UTC-3)
    brazil_time = datetime.utcnow() - timedelta(hours=3)
    today = brazil_time.strftime('%Y-%m-%d')
    
    # 1. Busca jogos na API-Sports
    headers = {'x-apisports-key': API_CONFIG['KEY']}
    sports_data = []
    try:
        res_sports = requests.get(
            f"{API_CONFIG['FOOTBALL_URL']}/fixtures", 
            params={'date': today, 'timezone': 'America/Sao_Paulo'}, 
            headers=headers,
            timeout=8
        )
        data_json = res_sports.json()
        
        # Se houver erro de limite ou chave, retorna o erro para o site
        if data_json.get('errors'):
            return jsonify(data_json)
            
        sports_data = data_json.get('response', [])
    except Exception as e:
        print(f"Erro Sports: {e}")

    # 2. Busca canais no Wyster Jogos
    wyster_data = []
    try:
        res_wyster = requests.post(
            API_CONFIG['WYSTER_URL'], 
            data={'token': API_CONFIG['WYSTER_TOKEN']}, 
            headers={'X-Requested-With': 'XMLHttpRequest'},
            timeout=5
        )
        if res_wyster.status_code == 200:
            wyster_data = res_wyster.json()
    except Exception:
        pass

    # 3. Cruzamento de Dados (Futebol + Canais)
    for match in sports_data:
        match['canais'] = []
        home_api = match['teams']['home']['name'].lower()
        
        for w_game in wyster_data:
            home_wyster = w_game.get('time1', '').lower()
            if home_wyster and (home_wyster in home_api or home_api in home_wyster):
                match['canais'] = w_game.get('canais', [])
                break

    return jsonify({"response": sports_data})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
