from flask import Flask, request, jsonify

app = Flask(__name__)

# Simulação de banco de dados em memória
users = [
    {'username': 'admin', 'password': 'password123'},
    {'username': 'user', 'password': 'pass'}
]

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json(force=True)
    username = data.get('username')
    password = data.get('password')

    # Consulta simulada: verificar usuário e senha
    authenticated = any(
        user['username'] == username and user['password'] == password
        for user in users
    )

    if authenticated:
        return jsonify({'message': 'Login successful'}), 200

    return jsonify({'message': 'Invalid credentials'}), 401
