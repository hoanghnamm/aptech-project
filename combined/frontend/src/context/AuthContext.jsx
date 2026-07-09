import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import * as authApi from '../api/auth.api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check for existing token and fetch current user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((data) => {
        setUser(data?.user || null);
      })
      .catch(() => {
        // Token invalid/expired — clear it silently
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const data = await authApi.login({ email, password });
    setUser(data?.user || null);
    return data;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const data = await authApi.register({ name, email, password });
    setUser(data?.user || null);
    return data;
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/** Convenience hook — use instead of useContext(AuthContext) */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}