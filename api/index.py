from flask import Flask, jsonify
from flask_cors import CORS
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app)

API_CONFIG = {
    'KEY': '6eeb6ad06d3edbcb77ae34be643302da',
    'FOOTBALL_URL': 'https://v3.football.api-sports.io',
    'WYSTER_URL': 'https://wysterjogos.nptv2.com/',
    'WYSTER_TOKEN': '3fa85b7679ffeb398e99a27c2acd9489'
}

@app.route('/api/matches', methods=['GET'])
def get_unified_matches():
    today = datetime.now().strftime('%Y-%m-%d')
    
    # 1. Busca jogos na API-Sports
    headers = {'x-apisports-key': API_CONFIG['KEY']}
    res_sports = requests.get(f"{API_CONFIG['FOOTBALL_URL']}/fixtures", 
                            params={'date': today, 'timezone': 'America/Sao_Paulo'}, 
                            headers=headers)
    sports_data = res_sports.json().get('response', [])

    # 2. Busca canais no Wyster Jogos
    res_wyster = requests.post(API_CONFIG['WYSTER_URL'], 
                             data={'token': API_CONFIG['WYSTER_TOKEN']}, 
                             headers={'X-Requested-With': 'XMLHttpRequest'})
    wyster_data = res_wyster.json() if res_wyster.status_code == 200 else []

    # 3. Lógica de Cruzamento: Adiciona canais aos jogos da API-Sports
    for match in sports_data:
        home_team = match['teams']['home']['name'].lower()
        match['canais'] = [] # Padrão vazio
        
        for w_game in wyster_data:
            # Se o nome do time da casa bater (mesmo que parcialmente)
            if w_game['time1'].lower() in home_team or home_team in w_game['time1'].lower():
                match['canais'] = w_game.get('canais', [])
                break

    return jsonify({"response": sports_data})
