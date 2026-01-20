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
    session = requests.Session()
    
    # Camuflagem de iPhone (Geralmente evita erro 403 em firewalls)
    headers = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        'Accept': '*/*',
        'Origin': 'https://wysterjogos.nptv2.com',
        'Referer': 'https://wysterjogos.nptv2.com/'
    }

    # 1. BUSCA NA WYSTER
    wyster_data = []
    try:
        # Tenta pegar os dados direto
        res_w = session.post(
            API_CONFIG['WYSTER_URL'], 
            data={'token': API_CONFIG['WYSTER_TOKEN']}, 
            headers=headers,
            timeout=10
        )
        if res_w.status_code == 200:
            wyster_data = res_w.json()
    except:
        pass

    # 2. BUSCA NA API-SPORTS (LOGOS)
    today = (datetime.utcnow() - timedelta(hours=3)).strftime('%Y-%m-%d')
    sports_data = []
    try:
        res_s = requests.get(
            f"{API_CONFIG['FOOTBALL_URL']}/fixtures", 
            params={'date': today, 'timezone': 'America/Sao_Paulo'}, 
            headers={'x-apisports-key': API_CONFIG['KEY']},
            timeout=5
        )
        sports_data = res_s.json().get('response', [])
    except:
        pass

    # 3. UNIFICAÇÃO
    final_list = []
    for w_game in wyster_data:
        home_w = w_game.get('time1', '').lower().strip()
        game_obj = {
            "teams": {
                "home": {"name": w_game.get('time1'), "logo": "https://media.api-sports.io/football/teams/default.png"},
                "away": {"name": w_game.get('time2'), "logo": "https://media.api-sports.io/football/teams/default.png"}
            },
            "league": {"name": "MagiaTV Ao Vivo"},
            "fixture": {"status": {"short": "LIVE" if "AO VIVO" in w_game.get('status', '') else "NS"}},
            "goals": {"home": 0, "away": 0},
            "canais": w_game.get('canais', [])
        }
        for s in sports_data:
            if home_w[:5] in s['teams']['home']['name'].lower():
                game_obj["teams"]["home"]["logo"] = s['teams']['home']['logo']
                game_obj["teams"]["away"]["logo"] = s['teams']['away']['logo']
                break
        final_list.append(game_obj)

    # CARD DE SEGURANÇA (Corrigido sem o link quebrado do placeholder)
    if not final_list:
        final_list.append({
            "teams": {"home": {"name": "Grade MagiaTV", "logo": "https://media.api-sports.io/football/teams/default.png"}, 
                     "away": {"name": "Sincronizando", "logo": "https://media.api-sports.io/football/teams/default.png"}},
            "league": {"name": "Atualizando Canais"},
            "fixture": {"status": {"short": "NS"}},
            "goals": {"home": 0, "away": 0},
            "canais": [{"nome": "Suporte", "img_url": "https://media.api-sports.io/football/teams/default.png"}]
        })

    return jsonify({"response": final_list})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
