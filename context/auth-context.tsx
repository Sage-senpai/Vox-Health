'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { UserProfile, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Placeholder: In real app, call auth API
      console.log('[VoxHealth] Auth: mock login with', email);
      const mockUser: UserProfile = {
        id: 'user-' + Date.now(),
        name: 'User',
        email,
        dateOfBirth: '',
        medicalConditions: [],
        emergencyContact: '',
        emergencyPhone: '',
        primaryDoctor: '',
        createdAt: new Date(),
      };
      setUser(mockUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (profile: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...profile });
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
