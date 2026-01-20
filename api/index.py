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
    
    # Camuflagem de Navegador Real (Chrome no Windows)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': 'https://wysterjogos.nptv2.com',
        'Referer': 'https://wysterjogos.nptv2.com/',
        'Connection': 'keep-alive'
    }

    wyster_data = []
    status_debug = "Iniciando..."
    
    try:
        # Tenta a conexão com a Wyster
        res_w = session.post(
            API_CONFIG['WYSTER_URL'], 
            data={'token': API_CONFIG['WYSTER_TOKEN']}, 
            headers=headers,
            timeout=12
        )
        status_debug = f"Status: {res_w.status_code}"
        if res_w.status_code == 200:
            wyster_data = res_w.json()
    except Exception as e:
        status_debug = "Erro de Conexão"

    # Busca logos na API-Sports
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

    final_list = []
    for w in wyster_data:
        home_w = w.get('time1', '').lower().strip()
        game_obj = {
            "teams": {
                "home": {"name": w.get('time1'), "logo": "https://media.api-sports.io/football/teams/default.png"},
                "away": {"name": w.get('time2'), "logo": "https://media.api-sports.io/football/teams/default.png"}
            },
            "league": {"name": "MagiaTV Ao Vivo"},
            "fixture": {"status": {"short": "LIVE" if "AO VIVO" in w.get('status', '') else "NS"}},
            "goals": {"home": 0, "away": 0},
            "canais": w.get('canais', [])
        }
        # Puxa logos oficiais se encontrar
        for s in sports_data:
            if home_w[:5] in s['teams']['home']['name'].lower():
                game_obj["teams"]["home"]["logo"] = s['teams']['home']['logo']
                game_obj["teams"]["away"]["logo"] = s['teams']['away']['logo']
                break
        final_list.append(game_obj)

    # Se a lista estiver vazia (Bloqueio 403), mostra o erro para sabermos
    if not final_list:
        final_list.append({
            "teams": {"home": {"name": "Grade MagiaTV", "logo": ""}, "away": {"name": status_debug, "logo": ""}},
            "league": {"name": "Sincronizando"},
            "fixture": {"status": {"short": "NS"}},
            "goals": {"home": 0, "away": 0},
            "canais": [{"nome": "Suporte", "img_url": "https://media.api-sports.io/football/teams/default.png"}]
        })

    return jsonify({"response": final_list})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
