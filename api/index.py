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
    brazil_time = datetime.utcnow() - timedelta(hours=3)
    today = brazil_time.strftime('%Y-%m-%d')
    
    # 1. FONTE PRINCIPAL: Wyster Jogos
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

    # 2. FONTE DE BACKUP/DETALHES: API-Sports
    sports_data = []
    headers = {'x-apisports-key': API_CONFIG['KEY']}
    try:
        res_sports = requests.get(
            f"{API_CONFIG['FOOTBALL_URL']}/fixtures", 
            params={'date': today, 'timezone': 'America/Sao_Paulo'}, 
            headers=headers,
            timeout=5
        )
        if res_sports.status_code == 200:
            sports_data = res_sports.json().get('response', [])
    except Exception:
        pass

    # 3. UNIFICAÇÃO: Usamos o Wyster como base e puxamos o logo da API-Sports
    final_matches = []
    for w_game in wyster_data:
        home_w = w_game.get('time1', '').lower().strip()
        away_w = w_game.get('time2', '').lower().strip()
        
        # Estrutura padrão para o site não quebrar
        match_obj = {
            "fixture": {"status": {"short": "LIVE" if "AO VIVO" in w_game.get('status', '') else "NS"}, "date": today},
            "league": {"name": "Transmissão MagiaTV", "country": "Brazil"},
            "teams": {
                "home": {"name": w_game.get('time1'), "logo": ""},
                "away": {"name": w_game.get('time2'), "logo": ""}
            },
            "goals": {"home": 0, "away": 0},
            "canais": w_game.get('canais', [])
        }

        # Busca logos na API-Sports para este jogo específico
        for s_match in sports_data:
            s_home = s_match['teams']['home']['name'].lower()
            if home_w[:5] in s_home or s_home in home_w[:5]:
                match_obj["teams"]["home"]["logo"] = s_match['teams']['home']['logo']
                match_obj["teams"]["away"]["logo"] = s_match['teams']['away']['logo']
                match_obj["league"]["name"] = s_match['league']['name']
                match_obj["goals"] = s_match['goals']
                match_obj["fixture"]["status"] = s_match['fixture']['status']
                break
        
        final_matches.append(match_obj)

    return jsonify({"response": final_matches})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
