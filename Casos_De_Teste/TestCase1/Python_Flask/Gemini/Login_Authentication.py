from flask import request, jsonify
import sqlite3

@app.route('/login', methods=['POST'])
def login():
    # Lê e processa os dados recebidos via corpo (body) da requisição como JSON
    dados = request.get_json()

    # Valida se o payload contém os campos necessários
    if not dados or 'username' not in dados or 'password' not in dados:
        return jsonify({"erro": "Atributos 'username' e 'password' são obrigatórios"}), 400

    username = dados.get('username')
    password = dados.get('password')

    try:
        # Abre conexão via linha direta com o banco de dados nativo
        # (pode ser um arquivo .db local ou ':memory:' para banco em memória)
        conexao = sqlite3.connect('banco_aplicacao.db')
        cursor = conexao.cursor()

        # Monta o seletor no banco (query) passando os atributos de forma segura.
        # Obs: Em um cenário comercial rigoroso, compararíamos o hash da senha em vez de texto plano.
        query = "SELECT id FROM usuarios WHERE username = ? AND password = ?"
        
        # Executa a pesquisa provando a consistência dos dados recebidos
        cursor.execute(query, (username, password))
        usuario_encontrado = cursor.fetchone()

        # Encerra a conexão com o banco
        conexao.close()

        # Conclui a leitura lógica e retorna o sucesso ou falha autenticativa
        if usuario_encontrado:
            return jsonify({"mensagem": "Autenticação realizada com sucesso"}), 200
        else:
            return jsonify({"erro": "Credenciais inválidas. Não foi possível autenticar."}), 401

    except sqlite3.Error as erro_banco:
        # Tratamento de erro caso a conexão com o banco falhe
        return jsonify({"erro": "Erro interno de comunicação com o banco de dados"}), 500