from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from datetime import datetime

app = Flask(__name__)
# Permite que o seu site (GitHub Pages) acesse este servidor sem erros de CORS
CORS(app)

# CONFIGURAÇÕES DA MAGIATV
API_CONFIG = {
    'KEY': '6eeb6ad06d3edbcb77ae34be643302da',
    'FOOTBALL_URL': 'https://v3.football.api-sports.io',
    'WYSTER_URL': 'https://wysterjogos.nptv2.com/',
    'WYSTER_TOKEN': '3fa85b7679ffeb398e99a27c2acd9489' # Token do site externo
}

@app.route('/api/matches', methods=['GET'])
def get_matches():
    """
    Busca os jogos da API-Sports. 
    Usamos o parâmetro 'date' para evitar o erro de parâmetros obrigatórios.
    """
    # Pega a data de hoje no formato YYYY-MM-DD (2026-01-19)
    today = datetime.now().strftime('%Y-%m-%d')
    
    url = f"{API_CONFIG['FOOTBALL_URL']}/fixtures"
    params = {
        'date': today,
        'timezone': 'America/Sao_Paulo'
    }
    headers = {
        'x-apisports-key': API_CONFIG['KEY'] # Chave direta API-Sports
    }

    try:
        # O Python faz a chamada por fora do navegador, evitando bloqueios
        response = requests.get(url, params=params, headers=headers)
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/external', methods=['GET'])
def get_external_data():
    """
    Extrai dados do site Wyster Jogos via POST.
    """
    payload = {'token': API_CONFIG['WYSTER_TOKEN']}
    headers = {'X-Requested-With': 'XMLHttpRequest'}

    try:
        response = requests.post(API_CONFIG['WYSTER_URL'], data=payload, headers=headers)
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Roda o servidor na porta 5000 do VS Code
    app.run(debug=True, port=5000)
