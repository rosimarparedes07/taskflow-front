import { useState, useEffect, type ReactNode } from 'react';
import type { User } from '@/services/api';
import {
  loginRequest,
  registerRequest,
  getMeRequest,
  type LoginDTO,
  type RegisterDTO,
} from '@/services/auth.service';
import { AuthContext, type AuthContextType } from './AuthContext';

import { TOKEN_KEY } from '@/lib/constants';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Componente Proveedor que envuelve la jerarquía de rutas
 * y gestiona el ciclo de vida de la sesión del usuario.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validación de sesión persistente (recuperación tras F5 o reapertura de pestaña)
  useEffect(() => {
    async function checkAuthSession() {
      const storedToken = localStorage.getItem(TOKEN_KEY);

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getMeRequest();
        setUser(response.data);
        setToken(storedToken);
      } catch (error) {
        console.error('[AuthContext] Sesión expirada o token inválido:', error);
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuthSession();
  }, []);

  // Iniciar sesión
  const login = async (credentials: LoginDTO) => {
    setIsLoading(true);
    try {
      const response = await loginRequest(credentials);
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem(TOKEN_KEY, receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
    } finally {
      setIsLoading(false);
    }
  };

  // Registrarse y autenticar automáticamente
  const register = async (credentials: RegisterDTO) => {
    setIsLoading(true);
    try {
      await registerRequest(credentials);
      await login({ email: credentials.email, password: credentials.password });
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
