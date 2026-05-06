import sqlite3
import hashlib
from flask import Blueprint, request, jsonify

# ---------------------------------------------------------------------------
# Banco em memória compartilhado via URI (mesmo processo, mesma conexão lógica)
# ---------------------------------------------------------------------------
DATABASE_URI = "file:memdb?mode=memory&cache=shared"

def get_db():
    conn = sqlite3.connect(DATABASE_URI, uri=True)
    conn.row_factory = sqlite3.Row
    return conn

def seed_db():
    """Popula o banco em memória com um usuário de exemplo ao importar o módulo."""
    conn = get_db()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT    NOT NULL UNIQUE,
            password TEXT    NOT NULL          -- SHA-256 do password
        )
        """
    )
    sample_hash = hashlib.sha256("senha123".encode()).hexdigest()
    conn.execute(
        "INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)",
        ("joao_silva", sample_hash),
    )
    conn.commit()
    conn.close()

seed_db()

# ---------------------------------------------------------------------------
# Blueprint / rota
# ---------------------------------------------------------------------------
auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    body = request.get_json(silent=True)

    if not body:
        return jsonify({"error": "Corpo da requisição ausente ou inválido."}), 400

    username: str = body.get("username", "").strip()
    password: str = body.get("password", "")

    if not username or not password:
        return jsonify({"error": "Campos 'username' e 'password' são obrigatórios."}), 422

    password_hash = hashlib.sha256(password.encode()).hexdigest()

    conn = get_db()
    row = conn.execute(
        """
        SELECT id, username
          FROM users
         WHERE username = ?
           AND password = ?
        """,
        (username, password_hash),
    ).fetchone()
    conn.close()

    if row is None:
        return jsonify({"error": "Credenciais inválidas."}), 401

    return jsonify({
        "message": "Autenticação realizada com sucesso.",
        "user": {
            "id":       row["id"],
            "username": row["username"],
        },
    }), 200