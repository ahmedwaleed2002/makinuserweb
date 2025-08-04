import { storage, STORAGE_BUCKET_ID } from '../lib/appwrite';
import { ID } from 'appwrite';

export const storageService = {
  // Upload a file to Appwrite storage
  async uploadFile(file) {
    try {
      const response = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        file
      );
      return { success: true, data: response };
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Handle rate limit errors
      if (error.message.includes('Rate limit') || error.code === 429) {
        return { success: false, error: 'Upload rate limit exceeded. Please wait a moment and try again.' };
      }
      
      return { success: false, error: error.message };
    }
  },

  // Get file preview URL
  getFilePreview(fileId, width = 200, height = 200) {
    try {
      const url = storage.getFilePreview(
        STORAGE_BUCKET_ID,
        fileId,
        width,
        height
      );
      return url;
    } catch (error) {
      console.error('Error getting file preview:', error);
      return null;
    }
  },

  // Get file view URL (for direct access)
  getFileView(fileId) {
    try {
      const url = storage.getFileView(STORAGE_BUCKET_ID, fileId);
      return url;
    } catch (error) {
      console.error('Error getting file view:', error);
      return null;
    }
  },

  // Delete a file from storage
  async deleteFile(fileId) {
    try {
      await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      return { success: false, error: error.message };
    }
  },

  // Get file download URL
  getFileDownload(fileId) {
    try {
      const url = storage.getFileDownload(STORAGE_BUCKET_ID, fileId);
      return url;
    } catch (error) {
      console.error('Error getting file download URL:', error);
      return null;
    }
  }
};
