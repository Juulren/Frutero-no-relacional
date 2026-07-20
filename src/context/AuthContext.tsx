import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '../models/types';

interface AuthContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const logout = () => setUserRole(null);

  return (
    <AuthContext.Provider value={{ userRole, setUserRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
