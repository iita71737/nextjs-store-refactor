'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  email: string;
  type: number;
}

interface AuthContextProps {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  isLoggedIn: boolean;
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [user, setUserState] = useState<User | null>(null);
  const setUser = (newUser: User) => {
    setUserState(newUser);
    localStorage.setItem('authUser', JSON.stringify(newUser)); // 可選：保存到本地存儲
  };
  const clearUser = () => {
    setUserState(null);
    localStorage.removeItem('authUser'); // 清除本地存儲
  };

  const [token, setTokenState] = useState<string | null>(null);
  const setToken = (newToken: string) => {
    setTokenState(newToken);
    localStorage.setItem('authToken', newToken); // 可選：持久化 Token
  };
  const clearToken = () => {
    setTokenState(null);
    localStorage.removeItem('authToken'); // 清除本地 Token
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ token, setToken, clearToken, isLoggedIn, user, setUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
