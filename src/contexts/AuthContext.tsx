import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  role?: string;
  username?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = authAPI.getCurrentUser();
        if (userData) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Listen for storage changes (e.g., from other tabs or after login)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'accessToken') {
        loadUser();
      }
    };

    // Also listen for custom storage events (for same-tab updates)
    const handleCustomStorageChange = () => {
      loadUser();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-storage-change', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-storage-change', handleCustomStorageChange);
    };
  }, []);

  const refreshUser = () => {
    const userData = authAPI.getCurrentUser();
    setUser(userData);
  };

  const login = async (identifier: string, password: string) => {
    try {
      const result = await authAPI.login(identifier, password);
      if (result.accessToken && result.user) {
        setUser(result.user);
        // Dispatch custom event for immediate UI updates
        window.dispatchEvent(new Event('auth-storage-change'));
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      const result = await authAPI.register(email, username, password);
      if (result.accessToken && result.user) {
        setUser(result.user);
        // Dispatch custom event for immediate UI updates
        window.dispatchEvent(new Event('auth-storage-change'));
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      // Dispatch custom event for immediate UI updates
      window.dispatchEvent(new Event('auth-storage-change'));
      navigate('/');
    } catch (error) {
      // Even if logout fails, clear local state
      setUser(null);
      window.dispatchEvent(new Event('auth-storage-change'));
      navigate('/');
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && authAPI.isAuthenticated(),
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

