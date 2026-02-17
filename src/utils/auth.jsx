import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Demo users database (fallback for when API is not available)
const DEMO_USERS = {
  'admin@pawwalkers.com': {
    email: 'admin@pawwalkers.com',
    password: 'admin123',
    role: 'admin',
    full_name: 'Admin User',
    id: 1
  },
  'client@example.com': {
    email: 'client@example.com',
    password: 'client123',
    role: 'client',
    full_name: 'John Smith',
    id: 2
  }
};

// Helper function to get user from localStorage
const getUserFromLocalStorage = () => {
  const storedUser = localStorage.getItem('pawwalkers_user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      localStorage.removeItem('pawwalkers_user');
    }
  }
  return null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session on mount
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        } else {
          // Fallback to localStorage for demo mode
          const localUser = getUserFromLocalStorage();
          if (localUser) {
            setUser(localUser);
          }
        }
      } else {
        // API not available, try localStorage for demo mode
        const localUser = getUserFromLocalStorage();
        if (localUser) {
          setUser(localUser);
        }
      }
    } catch (error) {
      // API not available, try localStorage for demo mode
      const localUser = getUserFromLocalStorage();
      if (localUser) {
        setUser(localUser);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Try API login first
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        // Also store in localStorage as backup
        localStorage.setItem('pawwalkers_user', JSON.stringify(data.user));
        return data.user;
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Invalid email or password');
      }
    } catch (error) {
      // If API is completely unavailable, check demo users as fallback
      console.log('API login failed, checking demo users:', error.message);
      
      const demoUser = DEMO_USERS[email];
      
      if (demoUser && demoUser.password === password) {
        // Remove password from user object
        const { password: _, ...userWithoutPassword } = demoUser;
        
        // Store user in state and localStorage
        setUser(userWithoutPassword);
        localStorage.setItem('pawwalkers_user', JSON.stringify(userWithoutPassword));
        
        return userWithoutPassword;
      }
      
      // If demo user doesn't exist or password wrong, throw error
      throw new Error('Invalid email or password');
    }
  };

  const logout = async () => {
    try {
      // Try API logout first
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.log('API logout failed:', error.message);
    }
    
    // Always clear local state
    setUser(null);
    localStorage.removeItem('pawwalkers_user');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('pawwalkers_user', JSON.stringify(updatedUser));
  };

  const value = { 
    user, 
    loading, 
    login, 
    logout,
    updateUser 
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