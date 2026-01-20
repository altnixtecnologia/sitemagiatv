from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

API_CONFIG = {
    'KEY': '6eeb6ad06d3edbcb77ae34be643302da',
    'FOOTBALL_URL': 'https://v3.football.api-sports.io',
    'WYSTER_PAGE': 'https://wysterjogos.nptv2.com/', # Página para Raspagem
    'WYSTER_TOKEN': '3fa85b7679ffeb398e99a27c2acd9489'
}

@app.route('/api/matches', methods=['GET'])
def get_unified_matches():
    session = requests.Session()
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    }

    final_list = []
    
    # 1. TÉCNICA DE RASPAGEM (SCRAPING)
    try:
        res = session.get(API_CONFIG['WYSTER_PAGE'], headers=headers, timeout=10)
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, 'html.parser')
            # Procuramos por elementos que contenham os nomes dos times (ajustado para o padrão comum de painéis)
            # Aqui buscamos por cards ou textos que pareçam jogos
            for item in soup.find_all(['div', 'span'], string=True):
                text = item.get_text().strip()
                if " x " in text and len(text) < 50:
                    teams = text.split(" x ")
                    final_list.append({
                        "teams": {
                            "home": {"name": teams[0], "logo": "https://media.api-sports.io/football/teams/default.png"},
                            "away": {"name": teams[1], "logo": "https://media.api-sports.io/football/teams/default.png"}
                        },
                        "league": {"name": "MagiaTV Ao Vivo"},
                        "fixture": {"status": {"short": "LIVE"}},
                        "goals": {"home": 0, "away": 0},
                        "canais": [{"nome": "Link Direto", "img_url": "https://cdn-icons-png.flaticon.com/512/124/124034.png"}]
                    })
    except Exception as e:
        print(f"Erro no Scraping: {e}")

    # 2. SE O SCRAPING NÃO TROUXER NADA, GERAMOS O CARD DE SEGURANÇA
    if not final_list:
        final_list.append({
            "teams": {"home": {"name": "Acesse a Grade", "logo": ""}, "away": {"name": "Wyster", "logo": ""}},
            "league": {"name": "Link Externo Ativo"},
            "fixture": {"status": {"short": "NS"}},
            "goals": {"home": 0, "away": 0},
            "canais": [{"nome": "Wyster Jogos", "img_url": "https://media.api-sports.io/football/teams/default.png"}]
        })

    return jsonify({"response": final_list})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
