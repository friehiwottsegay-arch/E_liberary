// Seller API Service - Enhanced CRUD operations for comprehensive e-commerce system
import apiClient, { API_ENDPOINTS, handleApiError } from '../config/apiConfig';

// Enhanced Book Management
export const bookApi = {
  // Get all books for the seller
  getBooks: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BOOKS, { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get single book details
  getBook: async (bookId) => {
    try {
      const response = await axios.get(`${API_BASE}/books/${bookId}/`, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new book
  createBook: async (bookData) => {
    try {
      const response = await axios.post(`${API_BASE}/books/`, bookData, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update book
  updateBook: async (bookId, bookData) => {
    try {
      const response = await axios.put(`${API_BASE}/books/${bookId}/`, bookData, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete book
  deleteBook: async (bookId) => {
    try {
      const response = await axios.delete(`${API_BASE}/books/${bookId}/`, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Toggle book status
  toggleBookStatus: async (bookId) => {
    try {
      const response = await axios.post(`${API_BASE}/books/${bookId}/toggle_status/`, {}, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Toggle book featured status
  toggleBookFeatured: async (bookId) => {
    try {
      const response = await axios.post(`${API_BASE}/books/${bookId}/toggle_featured/`, {}, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get low stock books
  getLowStockBooks: async () => {
    try {
      const response = await axios.get(`${API_BASE}/books/low-stock/`, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get out of stock books
  getOutOfStockBooks: async () => {
    try {
      const response = await axios.get(`${API_BASE}/books/out-of-stock/`, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get book analytics
  getBookAnalytics: async () => {
    try {
      const response = await axios.get(`${API_BASE}/books/analytics/`, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search books
  searchBooks: async (searchParams) => {
    try {
      const response = await axios.get(`${API_BASE}/books/search/`, {
        ...createAxiosConfig(),
        params: searchParams
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload book file
  uploadBookFile: async (bookId, fileType, file) => {
    try {
      const formData = new FormData();
      formData.append('book_id', bookId);
      formData.append('file_type', fileType);
      formData.append('file', file);

      const response = await axios.post(`${API_BASE}/books/upload-file/`, formData, {
        ...createAxiosConfig(),
        headers: {
          ...createAxiosConfig().headers,
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Enhanced Order Management
export const orderApi = {
  // Get all orders
  getOrders: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE}/orders/`, {
        ...createAxiosConfig(),
        params
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single order
  getOrder: async (orderId) => {
    try {
      const response = await axios.get(`${API_BASE}/orders/${orderId}/`, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await axios.post(`${API_BASE}/orders/${orderId}/update_status/`, 
        { status }, 
        createAxiosConfig()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get order dashboard stats
  getOrderDashboardStats: async () => {
    try {
      const response = await axios.get(`${API_BASE}/orders/dashboard-stats/`, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await axios.post(`${API_BASE}/orders/`, orderData, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Cart Management
export const cartApi = {
  // Get cart
  getCart: async () => {
    try {
      const response = await axios.get(`${API_BASE}/cart/`, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add to cart
  addToCart: async (cartData) => {
    try {
      const response = await axios.post(`${API_BASE}/cart/add/`, cartData, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Remove from cart
  removeFromCart: async (itemId) => {
    try {
      const response = await axios.delete(`${API_BASE}/cart/remove/${itemId}/`, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Customer Management
export const customerApi = {
  // Get all customers
  getCustomers: async () => {
    try {
      const response = await axios.get(`${API_BASE}/customers/`, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get customer details
  getCustomer: async (customerId) => {
    try {
      const response = await axios.get(`${API_BASE}/customers/${customerId}/`, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Analytics and Reporting
export const analyticsApi = {
  // Get sales analytics
  getSalesAnalytics: async (period = '30days') => {
    try {
      const response = await axios.get(`${API_BASE}/analytics/sales/`, {
        ...createAxiosConfig(),
        params: { period }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await axios.get(`${API_BASE}/analytics/dashboard-stats/`, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Inventory Management
export const inventoryApi = {
  // Get inventory data
  getInventory: async () => {
    try {
      const response = await axios.get(`${API_BASE}/inventory/`, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update inventory
  updateInventory: async (inventoryData) => {
    try {
      const response = await axios.post(`${API_BASE}/inventory/update/`, inventoryData, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Business Settings
export const businessApi = {
  // Get business settings
  getBusinessSettings: async () => {
    try {
      const response = await axios.get(`${API_BASE}/business/settings/`, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update business settings
  updateBusinessSettings: async (settingsData) => {
    try {
      const response = await axios.put(`${API_BASE}/business/settings/`, settingsData, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Promotion Management
export const promotionApi = {
  // Get all promotions
  getPromotions: async () => {
    try {
      const response = await axios.get(`${API_BASE}/promotions/`, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new promotion
  createPromotion: async (promotionData) => {
    try {
      const response = await axios.post(`${API_BASE}/promotions/`, promotionData, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update promotion
  updatePromotion: async (promotionId, promotionData) => {
    try {
      const response = await axios.put(`${API_BASE}/promotions/${promotionId}/`, promotionData, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete promotion
  deletePromotion: async (promotionId) => {
    try {
      const response = await axios.delete(`${API_BASE}/promotions/${promotionId}/`, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Support Management
export const supportApi = {
  // Get support tickets
  getSupportTickets: async () => {
    try {
      const response = await axios.get(`${API_BASE}/support/tickets/`, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create support ticket
  createSupportTicket: async (ticketData) => {
    try {
      const response = await axios.post(`${API_BASE}/support/tickets/create/`, ticketData, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Profile Management
export const profileApi = {
  // Get seller profile
  getProfile: async () => {
    try {
      const response = await axios.get(`${API_BASE}/seller/profile/`, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update seller profile
  updateProfile: async (profileData) => {
    try {
      const response = await axios.put(`${API_BASE}/seller/profile/`, profileData, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Category Management
export const categoryApi = {
  // Get all categories
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE}/books/categories/`, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get subcategories
  getSubcategories: async (categoryId) => {
    try {
      const response = await axios.get(`${API_BASE}/books/categories/${categoryId}/subcategories/`, createAxiosConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// File Upload Helper
export const fileUploadHelper = {
  // Create FormData for book upload
  createBookFormData: (bookData, files) => {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(bookData).forEach(key => {
      if (bookData[key] !== null && bookData[key] !== undefined) {
        formData.append(key, bookData[key]);
      }
    });
    
    // Add files
    if (files.pdfFile) {
      formData.append('pdf_file', files.pdfFile);
    }
    if (files.coverImage) {
      formData.append('cover_image', files.coverImage);
    }
    
    return formData;
  },

  // Validate file types
  validateFile: (file, allowedTypes) => {
    const fileType = file.type;
    return allowedTypes.includes(fileType);
  },

  // Get file size in MB
  getFileSize: (file) => {
    return (file.size / (1024 * 1024)).toFixed(2);
  }
};

// Utility functions
export const sellerUtils = {
  // Format currency
  formatCurrency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  // Format date
  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  // Format date and time
  formatDateTime: (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Calculate days ago
  getDaysAgo: (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  // Truncate text
  truncateText: (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  // Generate random color for charts
  generateColor: (index) => {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
      '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
      '#F97316', '#6366F1', '#14B8A6', '#F43F5E'
    ];
    return colors[index % colors.length];
  },

  // Generate order number
  generateOrderNumber: () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `ORD${timestamp}${random}`;
  },

  // Calculate percentage change
  calculatePercentageChange: (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  },

  // Sort array by key
  sortArray: (array, key, direction = 'desc') => {
    return array.sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (direction === 'desc') {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
  }
};

// Export all APIs
export default {
  bookApi,
  orderApi,
  cartApi,
  customerApi,
  analyticsApi,
  inventoryApi,
  businessApi,
  promotionApi,
  supportApi,
  profileApi,
  categoryApi,
  fileUploadHelper,
  sellerUtils
};