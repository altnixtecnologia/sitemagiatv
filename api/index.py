from flask import Flask, jsonify
from flask_cors import CORS
import requests
from datetime import datetime, timedelta

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
    # 1. BUSCA NA WYSTER (FONTE PRINCIPAL E ILIMITADA)
    wyster_data = []
    try:
        res_w = requests.post(
            API_CONFIG['WYSTER_URL'], 
            data={'token': API_CONFIG['WYSTER_TOKEN']}, 
            headers={'X-Requested-With': 'XMLHttpRequest'},
            timeout=10
        )
        if res_w.status_code == 200:
            wyster_data = res_w.json()
    except: pass

    # 2. BUSCA NA API-SPORTS (APENAS PARA LOGOS E DETALHES)
    today = (datetime.utcnow() - timedelta(hours=3)).strftime('%Y-%m-%d')
    sports_data = []
    try:
        res_s = requests.get(
            f"{API_CONFIG['FOOTBALL_URL']}/fixtures", 
            params={'date': today, 'timezone': 'America/Sao_Paulo'}, 
            headers={'x-apisports-key': API_CONFIG['KEY']},
            timeout=5
        )
        if res_s.status_code == 200:
            sports_data = res_s.json().get('response', [])
    except: pass

    # 3. UNIFICAÇÃO DOS DADOS
    final_list = []
    for w_game in wyster_data:
        home_w = w_game.get('time1', '').lower().strip()
        
        game_obj = {
            "teams": {
                "home": {"name": w_game.get('time1'), "logo": "https://media.api-sports.io/football/teams/default.png"},
                "away": {"name": w_game.get('time2'), "logo": "https://media.api-sports.io/football/teams/default.png"}
            },
            "league": {"name": "Programação MagiaTV"},
            "fixture": {"status": {"short": "LIVE" if "AO VIVO" in w_game.get('status', '') else "NS"}, "date": today},
            "goals": {"home": 0, "away": 0},
            "canais": w_game.get('canais', [])
        }

        # Tenta encontrar o logo oficial na API-Sports
        for s in sports_data:
            s_home = s['teams']['home']['name'].lower()
            if home_w[:5] in s_home or s_home in home_w[:5]:
                game_obj["teams"]["home"]["logo"] = s['teams']['home']['logo']
                game_obj["teams"]["away"]["logo"] = s['teams']['away']['logo']
                game_obj["league"]["name"] = s['league']['name']
                break
        
        final_list.append(game_obj)

    return jsonify({"response": final_list})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
