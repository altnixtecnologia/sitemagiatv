from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/matches', methods=['GET'])
def get_matches():
    # Retorna vazio para o frontend saber que deve usar a busca direta
    return jsonify({"response": []})

if __name__ == '__main__':
    app.run(debug=True)
