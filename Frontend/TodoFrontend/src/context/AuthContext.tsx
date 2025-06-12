import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthService } from '../services/authApi';
import type { UserLogin, UserRegister, AuthState } from '../types/user';

interface AuthContextType extends AuthState {
  login: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserRegister) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token'),
    loading: true,
    error: null,
  });

  useEffect(() => {
    const verifyToken = async () => {
      if (!authState.token) {
        setAuthState(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        const user = await AuthService.checkAuth();
        setAuthState({
          isAuthenticated: !!user,
          user,
          token: user ? authState.token : null,
          loading: false,
          error: null,
        });
      } catch (error) {
        // Token is invalid
        localStorage.removeItem('token');
        setAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: 'Session expired. Please log in again.',
        });
      }
    };

    verifyToken();
  }, [authState.token]);

  const login = async (credentials: UserLogin) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await AuthService.login(credentials);
      const user = await AuthService.getCurrentUser();
      
      setAuthState({
        isAuthenticated: true,
        user,
        token: response.access_token,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error('Login failed:', err);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Invalid credentials. Please try again.',
      }));
    }
  };

  const register = async (userData: UserRegister) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      await AuthService.register(userData);
      // After registration, log the user in automatically
      await login({ email: userData.email, password: userData.password });
    } catch (err: any) {
      console.error('Registration failed:', err);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.detail || 'Registration failed. Please try again.',
      }));
    }
  };

  const logout = () => {
    AuthService.logout();
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
