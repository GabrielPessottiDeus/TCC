const express = require('express');
const router = express.Router();

// Banco de dados em memória (simulando uma tabela de usuários)
const usersDatabase = [
  { id: 1, username: 'alice',   password: 'hashed_abc123' },
  { id: 2, username: 'bob',     password: 'hashed_xyz789' },
  { id: 3, username: 'carol',   password: 'hashed_qwe456' },
];

// Simula um driver de banco com método query()
const db = {
  query: (table, filters) => {
    return usersDatabase.filter(row =>
      Object.entries(filters).every(([key, val]) => row[key] === val)
    );
  },
};

// POST /login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Campos obrigatórios ausentes: username e password.',
    });
  }

  // Query no banco verificando username + password
  const results = db.query('users', { username, password });

  if (results.length === 0) {
    return res.status(401).json({
      success: false,
      message: 'Credenciais inválidas.',
    });
  }

  const authenticatedUser = results[0];

  return res.status(200).json({
    success: true,
    message: 'Autenticação realizada com sucesso.',
    user: {
      id: authenticatedUser.id,
      username: authenticatedUser.username,
    },
  });
});

module.exports = router;