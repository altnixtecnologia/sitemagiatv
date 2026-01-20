from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({"status": "online", "project": "MagiaTV"})

if __name__ == '__main__':
    app.run(debug=True)
