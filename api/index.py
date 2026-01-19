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
    try:
        res_sports = requests.get(
            f"{API_CONFIG['FOOTBALL_URL']}/fixtures", 
            params={'date': today, 'timezone': 'America/Sao_Paulo'}, 
            headers=headers,
            timeout=10
        )
        sports_data = res_sports.json().get('response', [])
    except Exception as e:
        return jsonify({"error": f"Erro API-Sports: {str(e)}"}), 500

    # 2. Busca canais no Wyster Jogos
    try:
        res_wyster = requests.post(
            API_CONFIG['WYSTER_URL'], 
            data={'token': API_CONFIG['WYSTER_TOKEN']}, 
            headers={'X-Requested-With': 'XMLHttpRequest'},
            timeout=10
        )
        wyster_data = res_wyster.json() if res_wyster.status_code == 200 else []
    except Exception:
        wyster_data = []

    # 3. Cruzamento Simplificado (Resolve Criciúma vs Criciuma)
    for match in sports_data:
        # Pega o nome do time da casa e remove espaços extras
        home_name = match['teams']['home']['name'].lower().strip()
        match['canais'] = [] 
        
        for w_game in wyster_data:
            w_home = w_game.get('time1', '').lower().strip()
            
            # Se um nome contém o outro (ex: "Criciuma" está em "Criciúma E.C.")
            if w_home and (w_home[:5] in home_name or home_name[:5] in w_home):
                match['canais'] = w_game.get('canais', [])
                break

    return jsonify({"response": sports_data})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
