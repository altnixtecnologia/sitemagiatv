from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

API_CONFIG = {
    'WYSTER_PAGE': 'https://wysterjogos.nptv2.com/',
    'WYSTER_TOKEN': '3fa85b7679ffeb398e99a27c2acd9489'
}

@app.route('/api/matches', methods=['GET'])
def get_unified_matches():
    session = requests.Session()
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'}

    final_list = []
    
    try:
        # 1. TENTA CAPTURAR O HTML COMPLETO
        res = session.get(API_CONFIG['WYSTER_PAGE'], headers=headers, timeout=10)
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, 'html.parser')
            
            # 2. BUSCA AVANÇADA POR PADRÃO "TIME X TIME"
            # Procura em todo o texto do site por padrões como "Flamingo x Vasco"
            text_content = soup.get_text(" ", strip=True)
            matches = re.findall(r'([A-Z][a-zA-ZÀ-ÿ\s\.\-]{2,20})\s+[xX]\s+([A-Z][a-zA-ZÀ-ÿ\s\.\-]{2,20})', text_content)
            
            for m in matches:
                home, away = m[0].strip(), m[1].strip()
                # Filtra termos que não são times
                if "Grade" not in home and "Agenda" not in home:
                    final_list.append({
                        "teams": {
                            "home": {"name": home, "logo": "https://media.api-sports.io/football/teams/default.png"},
                            "away": {"name": away, "logo": "https://media.api-sports.io/football/teams/default.png"}
                        },
                        "league": {"name": "Transmissão MagiaTV"},
                        "fixture": {"status": {"short": "LIVE"}},
                        "goals": {"home": 0, "away": 0},
                        "canais": [{"nome": "HD/4K", "img_url": "https://cdn-icons-png.flaticon.com/512/124/124034.png"}]
                    })
    except:
        pass

    # 3. FALLBACK CASO A RASPAGEM AINDA SEJA BLOQUEADA
    if not final_list:
        final_list.append({
            "teams": {"home": {"name": "Grade ao Vivo", "logo": ""}, "away": {"name": "Disponível", "logo": ""}},
            "league": {"name": "Link Direto Ativo"},
            "fixture": {"status": {"short": "NS"}},
            "goals": {"home": 0, "away": 0},
            "canais": []
        })

    return jsonify({"response": final_list})

if __name__ == '__main__':
    app.run(debug=True)
