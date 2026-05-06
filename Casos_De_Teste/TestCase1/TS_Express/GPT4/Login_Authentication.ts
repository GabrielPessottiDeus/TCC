import { Request, Response, Router } from "express";

const router = Router();

// Simulação de "banco de dados" em memória
interface User {
  username: string;
  password: string;
}

const fakeDatabase: User[] = [
  { username: "admin", password: "123456" },
  { username: "user", password: "password" },
];

router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Validação básica de entrada
  if (!username || !password) {
    return res.status(400).json({ message: "Username e password são obrigatórios" });
  }

  // "Query" simulada no banco (busca do usuário)
  const user = fakeDatabase.find(
    (u) => u.username === username && u.password === password
  );

  // Validação do resultado da "query"
  if (!user) {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }

  // Sucesso na autenticação
  return res.status(200).json({
    message: "Autenticação realizada com sucesso",
    user: { username: user.username },
  });
});

export default router;