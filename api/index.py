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
    # Cabeçalhos ultra-completos para evitar Erro 403
    session = requests.Session()
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Origin': 'https://wysterjogos.nptv2.com',
        'Referer': 'https://wysterjogos.nptv2.com/',
        'X-Requested-With': 'XMLHttpRequest'
    }

    # 1. BUSCA NA WYSTER
    wyster_data = []
    debug_msg = "Wyster OK"
    try:
        res_w = session.post(
            API_CONFIG['WYSTER_URL'], 
            data={'token': API_CONFIG['WYSTER_TOKEN']}, 
            headers=headers,
            timeout=10
        )
        if res_w.status_code == 200:
            wyster_data = res_w.json()
        else:
            debug_msg = f"Erro Wyster: Status {res_w.status_code}"
    except Exception as e:
        debug_msg = f"Erro Conexão: {str(e)}"

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
    except: pass

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
            "fixture": {"status": {"short": "LIVE" if "AO VIVO" in w_game.get('status', '') else "NS"}, "date": today},
            "goals": {"home": 0, "away": 0},
            "canais": w_game.get('canais', [])
        }
        for s in sports_data:
            if home_w[:5] in s['teams']['home']['name'].lower():
                game_obj["teams"]["home"]["logo"] = s['teams']['home']['logo']
                game_obj["teams"]["away"]["logo"] = s['teams']['away']['logo']
                break
        final_list.append(game_obj)

    # JOGO DE TESTE (Apenas se a lista estiver vazia para provar que o site funciona)
    if not final_list:
        final_list.append({
            "teams": {"home": {"name": "Aguardando Grade", "logo": ""}, "away": {"name": "MagiaTV", "logo": ""}},
            "league": {"name": "Sincronizando..."},
            "fixture": {"status": {"short": "NS"}},
            "goals": {"home": 0, "away": 0},
            "canais": [{"nome": "Suporte MagiaTV", "img_url": "https://cdn-icons-png.flaticon.com/512/124/124034.png"}]
        })

    return jsonify({"response": final_list, "debug": debug_msg})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
