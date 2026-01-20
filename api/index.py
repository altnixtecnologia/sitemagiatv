from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

API_CONFIG = {
    'KEY': '6eeb6ad06d3edbcb77ae34be643302da',
    'URL': 'https://v3.football.api-sports.io/fixtures'
}

# IDs das Ligas Principais (Brasil e Top Europa)
TOP_LEAGUES = [71, 39, 140, 135, 78, 2, 3, 13, 848]

@app.route('/api/matches', methods=['GET'])
def get_featured_matches():
    try:
        # Busca os próximos 50 jogos agendados na API
        response = requests.get(
            API_CONFIG['URL'], 
            params={'next': 50, 'timezone': 'America/Sao_Paulo'}, 
            headers={'x-apisports-key': API_CONFIG['KEY']},
            timeout=10
        )
        
        if response.status_code == 200:
            all_matches = response.json().get('response', [])
            
            # Separa os jogos das ligas principais (Série A e Europa)
            featured = [m for m in all_matches if m['league']['id'] in TOP_LEAGUES]
            
            # Se não houver jogos nas ligas principais, envia os próximos 10 gerais
            result = featured[:15] if featured else all_matches[:10]
            
            return jsonify({"response": result})
        return jsonify({"response": []})
    except:
        return jsonify({"response": []})

if __name__ == '__main__':
    app.run(debug=True)
