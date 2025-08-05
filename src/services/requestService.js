import { databases, DATABASE_ID } from '../lib/appwrite';
import { ID } from 'appwrite';

const REQUESTS_COLLECTION_ID = 'requests';

export const requestService = {
  // Create a new equipment rental request
  async createRequest(requestData) {
    try {
      const request = await databases.createDocument(
        DATABASE_ID,
        REQUESTS_COLLECTION_ID,
        ID.unique(),
        {
          userId: requestData.userId,
          machineryCategory: requestData.machineryCategory,
          location: requestData.location,
          startDate: new Date(requestData.startDate).toISOString(),
          endDate: new Date(requestData.endDate).toISOString(),
          durationDays: requestData.durationDays || 1,
          operatorRequired: requestData.operatorRequired || false,
          budgetRange: requestData.budgetRange || 0,
          description: requestData.description || '',
          status: requestData.status || 'pending',
          createdAt: new Date().toISOString(),
          latitude: requestData.latitude || '',
          longitude: requestData.longitude || ''
        }
      );
      
      return { success: true, data: request };
    } catch (error) {
      console.error('Error creating request:', error);
      return { success: false, error: error.message };
    }
  },

  // Get request by ID
  async getRequestById(requestId) {
    try {
      const request = await databases.getDocument(
        DATABASE_ID,
        REQUESTS_COLLECTION_ID,
        requestId
      );
      
      return { success: true, data: request };
    } catch (error) {
      console.error('Error fetching request:', error);
      return { success: false, error: error.message };
    }
  },

  // Get requests by user ID
  async getRequestsByUserId(userId) {
    try {
      const { Query } = await import('appwrite');
      const requests = await databases.listDocuments(
        DATABASE_ID,
        REQUESTS_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('createdAt')
        ]
      );
      
      return { success: true, data: requests.documents };
    } catch (error) {
      console.error('Error fetching user requests:', error);
      return { success: false, error: error.message };
    }
  }
};
