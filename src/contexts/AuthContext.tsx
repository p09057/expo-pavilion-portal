import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthState } from '../types';
import { AUTH_TOKEN_KEY, verifyToken, generateToken } from '../utils/auth';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      const user = verifyToken(token);
      if (user) {
        setAuthState({
          isAuthenticated: true,
          user,
          token,
        });
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const { hashPassword } = await import('../utils/auth');
    const { USERS } = await import('../config/users');
    
    const user = USERS.find(u => u.username === username);
    if (!user || user.passwordHash !== hashPassword(password)) {
      return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;
    const token = generateToken(userWithoutPassword);
    
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setAuthState({
      isAuthenticated: true,
      user: userWithoutPassword,
      token,
    });
    
    return true;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};