from flask import Flask, jsonify
from flask_cors import CORS
import requests
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Configuração fixa e estável da API-Sports
API_CONFIG = {
    'KEY': '6eeb6ad06d3edbcb77ae34be643302da',
    'URL': 'https://v3.football.api-sports.io/fixtures'
}

@app.route('/api/matches', methods=['GET'])
def get_stable_matches():
    # Define a data de hoje no fuso de Brasília
    today = (datetime.utcnow() - timedelta(hours=3)).strftime('%Y-%m-%d')
    
    try:
        response = requests.get(
            API_CONFIG['URL'], 
            params={'date': today, 'timezone': 'America/Sao_Paulo'}, 
            headers={'x-apisports-key': API_CONFIG['KEY']},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            # Retorna apenas os primeiros 10 jogos para manter a performance
            return jsonify({"response": data.get('response', [])[:10]})
        else:
            return jsonify({"response": [], "error": "API indisponível"})
            
    except Exception as e:
        return jsonify({"response": [], "error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
