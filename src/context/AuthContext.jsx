import React, { createContext, useContext, useState, useEffect } from 'react';
import { account } from '../lib/appwrite';
import { userService } from '../services/userService';
import { withRateLimit, delay } from '../utils/rateLimitHelper';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const session = await account.get();
      
      // Check KYC status for existing session
      const userDoc = await userService.getUserByUserId(session.$id);
      
      if (userDoc.success && (userDoc.data.kycStatus === 'approved' || userDoc.data.kycStatus === 'verified')) {
        setUser(session);
      } else {
        // If KYC not approved or verified, logout the session
        await account.deleteSession('current');
        setUser(null);
      }
    } catch (error) {
      console.log('No active session');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    return await withRateLimit(async () => {
      try {
        // Check if there's already an active session
        try {
          const existingUser = await account.get();
          if (existingUser) {
            // If user is already logged in, just return success
            setUser(existingUser);
            return { success: true, message: 'Already logged in!' };
          }
        } catch (error) {
          // No active session, proceed with login
        }

        await account.createEmailPasswordSession(email, password);
        const user = await account.get();

        // Add small delay before fetching user document
        await delay(500);
        
        // Fetch user document from database to check KYC status
        const userDoc = await userService.getUserByUserId(user.$id);

        if (userDoc.success) {
          if (userDoc.data.kycStatus === 'pending') {
            // Logout the user if KYC is pending
            await account.deleteSession('current');
            setUser(null);
            return { success: false, error: 'Your account is pending approval. Please wait for admin verification to access your account.' };
          } else if (userDoc.data.kycStatus === 'approved' || userDoc.data.kycStatus === 'verified') {
            // Set user only if KYC is approved or verified
            setUser(user);
            return { success: true, message: 'Login successful! Welcome back.' };
          } else {
            // Handle other KYC statuses (rejected, etc.)
            await account.deleteSession('current');
            setUser(null);
            return { success: false, error: 'Your account verification is ' + userDoc.data.kycStatus + '. Please contact support.' };
          }
        } else {
          // If can't fetch user document, logout for security
          await account.deleteSession('current');
          setUser(null);
          console.error('Failed to fetch user document:', userDoc.error);
          return { success: false, error: 'Unable to verify account status. Please try again.' };
        }
      } catch (error) {
        console.error('Login error:', error);
        
        // Handle rate limit errors
        if (error.message.includes('Rate limit') || error.code === 429) {
          throw error; // Let withRateLimit handle the retry
        }
        
        return { success: false, error: error.message };
      }
    }, 2000);
  };

  const register = async (email, password, userData) => {
    try {
      // Create Appwrite Auth account
      const authUser = await account.create('unique()', email, password, userData.name);
      
      // Create user document in database with additional fields
      const userDocData = {
        userId: authUser.$id,
        name: userData.name,
        email: email,
        phoneNumber: userData.phoneNumber,
        passwordHash: password, // Store password in passwordHash field
        role: userData.role,
        plan: userData.plan,
        kycStatus: userData.kycStatus,
        isBlocked: userData.isBlocked,
        twoFactorEnabled: userData.twoFactorEnabled,
        status: userData.status,
        kycDocuments: userData.kycDocuments,
        profileCompleted: userData.profileCompleted,
        kycRemarks: userData.kycRemarks,
        profilePhoto: userData.profilePhoto
      };
      
      const userDocResult = await userService.createUser(userDocData);
      
      if (!userDocResult.success) {
        // If user document creation fails, we should handle cleanup
        console.error('Failed to create user document:', userDocResult.error);
      }
      
      // Login the user after successful registration
      return await login(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle rate limit errors
      if (error.message.includes('Rate limit') || error.code === 429) {
        return { success: false, error: 'Too many requests. Please wait a moment and try again.' };
      }
      
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
