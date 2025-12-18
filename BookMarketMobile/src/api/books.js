// Books API Services
import apiClient from './client';

export const booksAPI = {
  // Get all books
  getAllBooks: async (params = {}) => {
    try {
      const response = await apiClient.get('/books/', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to fetch books',
      };
    }
  },

  // Get book categories
  getCategories: async () => {
    try {
      const response = await apiClient.get('/categories/');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to fetch categories',
      };
    }
  },

  // Search books
  searchBooks: async (query) => {
    try {
      const response = await apiClient.get('/books/', {
        params: { search: query },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Search failed',
      };
    }
  },

  // Get books by category
  getBooksByCategory: async (categoryId) => {
    try {
      const response = await apiClient.get('/books/', {
        params: { category: categoryId },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to fetch category books',
      };
    }
  },

  // Get books by type (hard copy, soft copy, rental)
  getBooksByType: async (bookType) => {
    try {
      const response = await apiClient.get(`/admin-books/${bookType}/`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || `Failed to fetch ${bookType} books`,
      };
    }
  },

  // Get book details
  getBookDetail: async (bookId) => {
    try {
      const response = await apiClient.get(`/admin-books/${bookId}/`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to fetch book details',
      };
    }
  },

  // Increment book views
  incrementBookViews: async (bookId) => {
    try {
      await apiClient.post(`/admin-books/${bookId}/increment_views/`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to increment views',
      };
    }
  },
};