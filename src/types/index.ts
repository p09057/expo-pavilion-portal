export interface Pavilion {
  id: string;
  name: string;
  url: string;
  category: PavilionCategory;
  order: number;
  description?: string;
}

export type PavilionCategory = 
  | 'foreign' // 海外パビリオン
  | 'signature' // シグネチャーパビリオン
  | 'corporate' // 企業パビリオン
  | 'japan' // 日本パビリオン
  | 'theme' // テーマ館
  | 'other'; // その他

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  isAdmin: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: Omit<User, 'passwordHash'> | null;
  token: string | null;
}