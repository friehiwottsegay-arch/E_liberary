// Payments and Purchases API Services
import apiClient from './client';

export const paymentsAPI = {
  // Process payment for book purchase
  processPayment: async (paymentData) => {
    try {
      const response = await apiClient.post('/payments/process/', paymentData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Payment processing failed',
      };
    }
  },

  // Process Chapa payment
  processChapaPayment: async (paymentData) => {
    try {
      const response = await apiClient.post('/payments/chapa/', paymentData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Chapa payment failed',
      };
    }
  },

  // Get available payment methods
  getPaymentMethods: async () => {
    try {
      const response = await apiClient.get('/payments/methods/');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to fetch payment methods',
      };
    }
  },

  // Get user purchase history
  getUserPurchases: async () => {
    try {
      const response = await apiClient.get('/payments/user-purchases/');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to fetch purchases',
      };
    }
  },

  // Check access to book
  checkBookAccess: async (bookId) => {
    try {
      const response = await apiClient.get(`/user-purchases/check-access/${bookId}/`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to check book access',
      };
    }
  },

  // Verify Chapa payment
  verifyChapaPayment: async (txRef) => {
    try {
      const response = await apiClient.post('/payments/chapa/verify/', {
        tx_ref: txRef,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Payment verification failed',
      };
    }
  },
};