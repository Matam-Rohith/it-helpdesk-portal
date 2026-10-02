import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { api } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('helpdesk_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('helpdesk_token');
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifySession() {
      const storedToken = localStorage.getItem('helpdesk_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.auth.me();
        setUser(res.user);
        localStorage.setItem('helpdesk_user', JSON.stringify(res.user));
      } catch {
        localStorage.removeItem('helpdesk_token');
        localStorage.removeItem('helpdesk_user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await api.auth.login(username, password);
      localStorage.setItem('helpdesk_token', res.token);
      localStorage.setItem('helpdesk_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const logout = () => {
    api.auth.logout().catch(() => {});
    setUser(null);
    setToken(null);
    localStorage.removeItem('helpdesk_token');
    localStorage.removeItem('helpdesk_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user && !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
