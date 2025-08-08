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
    // Step 1: Send login credentials and get verification code
    loginSendCode: async (email: string, password: string) => {
      try {
        const response = await fetch('/api/auth/login/send-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Login error:', error);
        return { 
          success: false, 
          message: 'Failed to authenticate. Please check your credentials and try again.' 
        };
      }
    },
    
    // Step 2: Verify the 2FA code and complete login
    loginVerifyCode: async (code: string, email: string) => {
      try {
        const response = await fetch('/api/auth/login/verify-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, email }),
        });
        
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Code verification error:', error);
        return { 
          success: false, 
          message: 'Failed to verify code. The code may be expired or invalid.' 
        };
      }
    },
    
    logout: async () => {
      // This is a placeholder - will be implemented later
      return { success: true };
    },
    signup: async (email: string, password: string, companyName: string) => {
      try {
        const response = await fetch('/api/auth/send-verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, companyName }),
        });
        
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Signup error:', error);
        return { 
          success: false, 
          message: 'Failed to send verification email. Please try again.' 
        };
      }
    },
    verifyCode: async (code: string) => {
      try {
        const response = await fetch('/api/auth/verify-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });
        
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Code verification error:', error);
        return { 
          success: false, 
          message: 'Failed to verify code. The code may be expired or invalid.' 
        };
      }
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