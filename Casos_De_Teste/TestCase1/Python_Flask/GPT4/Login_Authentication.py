from flask import request, jsonify
from werkzeug.security import check_password_hash

# Simulação de "banco de dados" em memória
fake_db = {
    "user1": {
        "username": "user1",
        "password_hash": "pbkdf2:sha256:260000$abc$1234567890abcdef..."  # hash fictício
    },
    "admin": {
        "username": "admin",
        "password_hash": "pbkdf2:sha256:260000$xyz$abcdef1234567890..."  # hash fictício
    }
}

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "Dados inválidos"}), 400

    username = data['username']
    password = data['password']

    # "Query" no banco (simulada)
    user = fake_db.get(username)

    if user and check_password_hash(user['password_hash'], password):
        return jsonify({"message": "Autenticação bem-sucedida"}), 200

    return jsonify({"error": "Usuário ou senha inválidos"}), 401