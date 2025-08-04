import { databases, DATABASE_ID } from '../lib/appwrite';
import { ID } from 'appwrite';

const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID || 'users';

export const userService = {
  // Create a new user document in the database
  async createUser(userData) {
    try {
      const userDoc = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        {
          userId: userData.userId,
          name: userData.name,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          passwordHash: userData.passwordHash || '',
          role: userData.role,
          plan: userData.plan,
          kycStatus: userData.kycStatus,
          isBlocked: userData.isBlocked,
          twoFactorEnabled: userData.twoFactorEnabled,
          status: userData.status,
          kycDocuments: userData.kycDocuments,
          profileCompleted: userData.profileCompleted,
          kycRemarks: userData.kycRemarks,
          profilePhoto: userData.profilePhoto || ''
        }
      );
      return { success: true, data: userDoc };
    } catch (error) {
      console.error('Error creating user document:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user document by userId
  async getUserByUserId(userId) {
    try {
      const { Query } = await import('appwrite');
      const users = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('userId', userId)]
      );
      
      if (users.documents.length > 0) {
        return { success: true, data: users.documents[0] };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      return { success: false, error: error.message };
    }
  },

  // Update user document
  async updateUser(documentId, userData) {
    try {
      const updatedUser = await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        documentId,
        userData
      );
      return { success: true, data: updatedUser };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete user document
  async deleteUser(documentId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        documentId
      );
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: error.message };
    }
  }
};
