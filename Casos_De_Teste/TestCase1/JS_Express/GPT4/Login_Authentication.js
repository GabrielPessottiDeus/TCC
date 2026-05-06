const express = require('express');
const router = express.Router();

// "Banco de dados" em memória (simulação)
const users = [
  { username: 'admin', password: '1234' },
  { username: 'user', password: 'abcd' }
];

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validação básica de entrada
  if (!username || !password) {
    return res.status(400).json({ message: 'Username e password são obrigatórios' });
  }

  // "Query" no banco (busca no array)
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  // Verificação de autenticação
  if (user) {
    return res.status(200).json({ message: 'Autenticação realizada com sucesso' });
  } else {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

module.exports = router;