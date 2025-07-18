import type { User } from '../types';
import { hashPassword } from '../utils/auth';

// パスワードを生成してハッシュ化
const generateUsers = (): User[] => {
  const users = [
    { username: 'tshirai', password: 'kR9#mP2$vL8n', isAdmin: true },
    { username: 'hiroshi', password: 'bT5@wX7!qJ3m', isAdmin: false },
    { username: 'tomoko', password: 'nG4&hY9#cF6p', isAdmin: false },
    { username: 'atobe', password: 'zE8!tK3@mW5s', isAdmin: false },
    { username: 'test-user', password: 'aQ7$rN2%yH9x', isAdmin: false },
  ];

  return users.map((user, index) => ({
    id: `user-${index + 1}`,
    username: user.username,
    passwordHash: hashPassword(user.password),
    isAdmin: user.isAdmin,
  }));
};

export const USERS = generateUsers();

// パスワード情報（開発用）
export const USER_CREDENTIALS = {
  tshirai: 'kR9#mP2$vL8n',
  hiroshi: 'bT5@wX7!qJ3m',
  tomoko: 'nG4&hY9#cF6p',
  atobe: 'zE8!tK3@mW5s',
  'test-user': 'aQ7$rN2%yH9x',
};