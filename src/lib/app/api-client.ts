// This file will contain API client functions for our application

// Base API URL - will be configured properly in the future
const API_BASE_URL = '/api';

// Generic fetch function with error handling
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Add authorization headers here in the future
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// API client object with methods for different endpoints
export const apiClient = {
  // Auth methods
  auth: {
    login: async (email: string, password: string) => {
      // This is a placeholder - will be implemented later
      console.log('Login attempt with:', email);
      return { success: true };
    },
    logout: async () => {
      // This is a placeholder - will be implemented later
      return { success: true };
    },
  },
  
  // Properties methods
  properties: {
    getAll: async () => {
      // This is a placeholder - will be implemented later
      return [];
    },
    getById: async (id: string) => {
      // This is a placeholder - will be implemented later
      return null;
    },
  },
  
  // Units methods
  units: {
    getByPropertyId: async (propertyId: string) => {
      // This is a placeholder - will be implemented later
      return [];
    },
  },
  
  // Tenants methods
  tenants: {
    getByUnitId: async (unitId: string) => {
      // This is a placeholder - will be implemented later
      return [];
    },
  },
};