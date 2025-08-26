import { ReactNode, createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for existing session
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(userData => {
        setUser(userData);
        setIsLoaded(true);
      })
      .catch(() => {
        setUser(null);
        setIsLoaded(true);
      });
  }, []);

  const signOut = () => {
    fetch('/api/auth/logout', { method: 'POST' })
      .then(() => {
        setUser(null);
        window.location.href = '/';
      });
  };

  return (
    <AuthContext.Provider value={{ user, isLoaded, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}