from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

API_CONFIG = {
    'KEY': '6eeb6ad06d3edbcb77ae34be643302da',
    'URL': 'https://v3.football.api-sports.io/fixtures'
}

@app.route('/api/matches', methods=['GET'])
def get_live_matches():
    try:
        # Busca especificamente jogos que estão acontecendo AGORA (live=all)
        response = requests.get(
            API_CONFIG['URL'], 
            params={'live': 'all'}, 
            headers={'x-apisports-key': API_CONFIG['KEY']},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            # Pega os primeiros 12 jogos ao vivo encontrados
            return jsonify({"response": data.get('response', [])[:12]})
        else:
            return jsonify({"response": []})
            
    except Exception:
        return jsonify({"response": []})

if __name__ == '__main__':
    app.run(debug=True)
