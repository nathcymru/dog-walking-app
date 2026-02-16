import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Demo users database
const DEMO_USERS = {
  'admin@pawwalkers.com': {
    email: 'admin@pawwalkers.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    id: 1
  },
  'client@example.com': {
    email: 'client@example.com',
    password: 'client123',
    role: 'client',
    name: 'John Smith',
    id: 2
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored session on mount
    const storedUser = localStorage.getItem('pawwalkers_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('pawwalkers_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Try API login first
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include', // CRITICAL for session cookies
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('pawwalkers_user', JSON.stringify(userData));
        return userData;
      }
      
      // Fallback to demo auth if API is not available
      await new Promise(resolve => setTimeout(resolve, 500));

      const demoUser = DEMO_USERS[email];
      
      if (!demoUser || demoUser.password !== password) {
        throw new Error('Invalid email or password');
      }

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = demoUser;
      
      // Store user in state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('pawwalkers_user', JSON.stringify(userWithoutPassword));
      
      return userWithoutPassword;
    } catch (error) {
      // If API call fails, try demo authentication
      const demoUser = DEMO_USERS[email];
      
      if (!demoUser || demoUser.password !== password) {
        throw new Error('Invalid email or password');
      }

      const { password: _, ...userWithoutPassword } = demoUser;
      setUser(userWithoutPassword);
      localStorage.setItem('pawwalkers_user', JSON.stringify(userWithoutPassword));
      
      return userWithoutPassword;
    }
  };

  const logout = async () => {
    try {
      // Try to logout from API
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout API call failed', error);
    }
    
    setUser(null);
    localStorage.removeItem('pawwalkers_user');
  };

  const value = { 
    user, 
    loading, 
    login, 
    logout 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}