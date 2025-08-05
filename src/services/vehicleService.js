import { databases, DATABASE_ID } from '../lib/appwrite';

// Vehicle categories collection ID
const VEHICLE_CATEGORIES_COLLECTION_ID = 'categories';

export const vehicleService = {
  // Fetch all vehicle categories
  async getVehicleCategories() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        VEHICLE_CATEGORIES_COLLECTION_ID
      );
      return response.documents;
    } catch (error) {
      console.error('Error fetching vehicle categories:', error);
      throw error;
    }
  },

  // Get a specific vehicle category by ID
  async getVehicleCategoryById(categoryId) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        VEHICLE_CATEGORIES_COLLECTION_ID,
        categoryId
      );
      return response;
    } catch (error) {
      console.error('Error fetching vehicle category:', error);
      throw error;
    }
  },

  // Create a new vehicle category (admin function)
  async createVehicleCategory(categoryData) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        VEHICLE_CATEGORIES_COLLECTION_ID,
        'unique()', // Auto-generate ID
        categoryData
      );
      return response;
    } catch (error) {
      console.error('Error creating vehicle category:', error);
      throw error;
    }
  }
};
