import { Router, Request, Response } from 'express';

const router = Router();

interface LoginRequest {
  username: string;
  password: string;
}

interface User {
  username: string;
  password: string;
}

const users: User[] = [
  { username: 'admin', password: 'password123' },
  { username: 'user', password: 'pass' }
];

router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body as LoginRequest;

  const authenticated = users.some(
    (user) => user.username === username && user.password === password
  );

  if (authenticated) {
    return res.status(200).json({ message: 'Login successful' });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

export default router;
