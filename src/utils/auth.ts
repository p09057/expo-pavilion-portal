import type { User } from '../types';

// 簡易的なハッシュ関数（本番環境では bcrypt 等を使用すべき）
export const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
};

// JWT風のトークン生成（簡易版）
export const generateToken = (user: Omit<User, 'passwordHash'>): string => {
  const payload = {
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24時間
  };
  return btoa(JSON.stringify(payload));
};

// トークンの検証
export const verifyToken = (token: string): Omit<User, 'passwordHash'> | null => {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) {
      return null;
    }
    return {
      id: payload.id,
      username: payload.username,
      isAdmin: payload.isAdmin,
    };
  } catch {
    return null;
  }
};

// ローカルストレージのキー
export const AUTH_TOKEN_KEY = 'expo-pavilion-auth-token';