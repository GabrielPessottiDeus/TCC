import { Router, Request, Response } from "express";
import crypto from "crypto";

const router = Router();

// ── Banco em memória ──────────────────────────────────────────────────────────
interface UserRecord {
  id: number;
  username: string;
  passwordHash: string; // SHA-256 hex
}

function hashPassword(plain: string): string {
  return crypto.createHash("sha256").update(plain).digest("hex");
}

const usersTable: UserRecord[] = [
  { id: 1, username: "alice",  passwordHash: hashPassword("senha123") },
  { id: 2, username: "bob",    passwordHash: hashPassword("qwerty!")  },
  { id: 3, username: "carlos", passwordHash: hashPassword("abc@2024") },
];

// ── POST /login ───────────────────────────────────────────────────────────────
router.post("/login", (req: Request, res: Response): void => {
  const { username, password } = req.body as {
    username?: string;
    password?: string;
  };

  // Validação de presença dos campos
  if (!username || !password) {
    res.status(400).json({
      authenticated: false,
      message: "Os campos 'username' e 'password' são obrigatórios.",
    });
    return;
  }

  const incomingHash = hashPassword(password);

  // Query: busca o registro cujo username E passwordHash correspondam
  const matchedUser: UserRecord | undefined = usersTable.find(
    (row) => row.username === username && row.passwordHash === incomingHash
  );

  if (!matchedUser) {
    res.status(401).json({
      authenticated: false,
      message: "Credenciais inválidas.",
    });
    return;
  }

  // Sucesso autenticativo — resposta 200
  res.status(200).json({
    authenticated: true,
    message: "Login realizado com sucesso.",
    user: {
      id: matchedUser.id,
      username: matchedUser.username,
    },
  });
});

export default router;