const express = require('express');
const router = express.Router();

// Simulação de banco de dados em memória
const users = [
  { username: 'admin', password: 'password123' },
  { username: 'user', password: 'pass' }
];

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Consulta simulada: verificar se o usuário existe e a senha bate
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    return res.status(200).json({ message: 'Login successful' });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;
