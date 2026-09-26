import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserAddress } from '../types';
import { authService } from '../services/authService';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: UserAddress;
}

interface UpdateProfileData {
  name?: string;
  phone?: string;
  address?: UserAddress;
  currentPassword?: string;
  newPassword?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  updateProfile: (data: UpdateProfileData) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('fudge_auth_token') || localStorage.getItem('fudge_admin_token');
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fudge_auth_user') || localStorage.getItem('fudge_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await authService.getMe();
        if (res.user) {
          setUser(res.user);
          localStorage.setItem('fudge_auth_user', JSON.stringify(res.user));
          if (res.user.role === 'admin' || res.user.role === 'staff') {
            localStorage.setItem('fudge_admin_user', JSON.stringify(res.user));
          }
        }
      } catch (err) {
        console.warn('Session expired or invalid token');
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, [token]);

  const saveAuthSession = (authToken: string, authUser: User) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('fudge_auth_token', authToken);
    localStorage.setItem('fudge_auth_user', JSON.stringify(authUser));

    // Admin compatibility
    if (authUser.role === 'admin' || authUser.role === 'staff') {
      localStorage.setItem('fudge_admin_token', authToken);
      localStorage.setItem('fudge_admin_user', JSON.stringify(authUser));
    }
  };

  const login = async (credentials: { email: string; password: string }): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      saveAuthSession(res.token, res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      saveAuthSession(res.token, res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authService.updateProfile(data);
      setUser(res.user);
      localStorage.setItem('fudge_auth_user', JSON.stringify(res.user));
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('fudge_auth_token');
    localStorage.removeItem('fudge_auth_user');
    localStorage.removeItem('fudge_admin_token');
    localStorage.removeItem('fudge_admin_user');
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'staff';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isAdmin,
        isLoading,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
