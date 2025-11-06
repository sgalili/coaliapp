/**
 * User Context for Data Separation
 * Manages demo vs real user data access
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserContextType {
  currentUserId: string;
  isDemoUser: boolean;
  isAuthenticated: boolean;
  userProfile: any | null;
  setCurrentUser: (userId: string, isDemo: boolean) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState<string>('demo-user');
  const [isDemoUser, setIsDemoUser] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<any | null>(null);

  useEffect(() => {
    checkAuthStatus();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user.id, false);
      } else {
        // Check for demo mode
        const isDemoMode = localStorage.getItem('isAuthenticated') === 'true';
        if (isDemoMode) {
          setCurrentUser('demo-user', true);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Real authenticated user
        setCurrentUser(session.user.id, false);
      } else {
        // Check for demo mode
        const isDemoMode = localStorage.getItem('isAuthenticated') === 'true';
        if (isDemoMode) {
          setCurrentUser('demo-user', true);
        } else {
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  const setCurrentUser = (userId: string, isDemo: boolean) => {
    setCurrentUserId(userId);
    setIsDemoUser(isDemo);
    setIsAuthenticated(true);
    
    console.log(`👤 User set: ${userId} (${isDemo ? 'DEMO' : 'REAL'})`);
    
    // Load user profile
    if (!isDemo) {
      loadUserProfile(userId);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      
      setUserProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const logout = () => {
    supabase.auth.signOut();
    localStorage.removeItem('isAuthenticated');
    setCurrentUserId('');
    setIsDemoUser(false);
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  return (
    <UserContext.Provider 
      value={{
        currentUserId,
        isDemoUser,
        isAuthenticated,
        userProfile,
        setCurrentUser,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within UserProvider');
  }
  return context;
};
