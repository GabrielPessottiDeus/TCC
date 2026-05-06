import { Request, Response, Router } from 'express';
// Imaginando um driver nativo de banco de dados (ex: pg, mysql2, sqlite)
import db from './database-connection'; 

const authRouter = Router();

/**
 * POST /login
 * Realiza a autenticação baseada em username e password
 */
authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // 1. Validação básica de entrada
    if (!username || !password) {
      res.status(400).json({ message: 'Dados insuficientes para login.' });
      return;
    }

    // 2. Montagem do seletor (Query)
    // Utilizamos placeholders ($1, $2 ou ?) para garantir a consistência e segurança
    const query = 'SELECT id, username FROM users WHERE username = $1 AND password = $2 LIMIT 1';
    const values = [username, password];

    // 3. Execução direta no banco de dados
    const result = await db.query(query, values);
    const user = result.rows[0];

    // 4. Validação da consistência da pesquisa
    if (!user) {
      res.status(401).json({ message: 'Credenciais inválidas ou usuário inexistente.' });
      return;
    }

    // 5. Retorno de sucesso autenticativo (HTTP 200)
    res.status(200).json({
      message: 'Autenticação realizada com sucesso!',
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Erro interno no processo de login:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});

export default authRouter;