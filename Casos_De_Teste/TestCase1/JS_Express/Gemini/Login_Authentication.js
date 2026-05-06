const express = require('express');
const router = express.Router();

// Simulação de banco de dados em memória (Data Source)
const usersDatabase = [
    { id: 1, username: 'admin', password: '123' },
    { id: 2, username: 'dev_user', password: 'password_safe' }
];

// Endpoint de Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Montando o seletor (query) para validar a consistência dos dados
    // Aqui buscamos um registro que satisfaça ambos os critérios simultaneamente
    const userMatch = usersDatabase.find(user => 
        user.username === username && user.password === password
    );

    // Validação da lógica de pesquisa
    if (!userMatch) {
        return res.status(401).json({ 
            auth: false, 
            message: 'Falha na autenticação: Usuário ou senha incorretos.' 
        });
    }

    // Retorno de sucesso autenticativo diretamente pelo encerramento da função
    return res.status(200).json({
        auth: true,
        message: 'Autenticação realizada com sucesso.',
        userId: userMatch.id
    });
});

module.exports = router;