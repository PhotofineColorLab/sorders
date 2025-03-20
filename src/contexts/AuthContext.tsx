import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast as sonnerToast } from 'sonner';
import { getStaffMembers } from '@/lib/data';

export type UserRole = 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  phoneNumber?: string;
  password?: string;
}

// Demo users for testing
const DEMO_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Staff User',
    email: 'staff@example.com',
    role: 'staff',
    createdAt: new Date(),
  }
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if we have a user in localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulate API call to fetch users
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get staff list from localStorage
      const staffListString = localStorage.getItem('staffList');
      let staffList: User[] = [];
      
      if (staffListString) {
        try {
          staffList = JSON.parse(staffListString);
        } catch (error) {
          console.error('Failed to parse staff list', error);
        }
      }
      
      // Find user with matching email and password
      const matchedUser = staffList.find(staff => 
        staff.email === email && staff.password === password
      );
      
      if (matchedUser) {
        // Create a copy without the password for security
        const userWithoutPassword = { ...matchedUser };
        delete userWithoutPassword.password;
        
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        sonnerToast.success(`Welcome back, ${userWithoutPassword.name}!`);
        
        navigate('/dashboard');
        return true;
      } else {
        // Check demo credentials as fallback
        const demoUser = DEMO_USERS.find(
          user => user.email === email && password === 'password'
        );
        
        if (demoUser) {
          setUser(demoUser);
          localStorage.setItem('user', JSON.stringify(demoUser));
          
          sonnerToast.success(`Welcome to the demo, ${demoUser.name}!`);
          
          navigate('/dashboard');
          return true;
        }
        
        sonnerToast.error('Invalid email or password');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      sonnerToast.error('An error occurred during login. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    sonnerToast.info('You have been logged out');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: loading,
        login,
        logout,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}