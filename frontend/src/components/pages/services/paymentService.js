import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Payment service for handling all payment operations
export const paymentService = {
  // Process payment
  async processPayment(paymentData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/payments/process/`, paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Payment processing failed');
    }
  },

  // Verify payment
  async verifyPayment(paymentId, transactionId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/payments/verify/`, {
        payment_id: paymentId,
        transaction_id: transactionId
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
  },

  // Get payment methods
  async getPaymentMethods() {
    try {
      const response = await axios.get(`${API_BASE_URL}/payments/methods/`);
      return response.data;
    } catch (error) {
      // Fallback to default methods if API fails
      return Object.values(ethiopianPaymentProviders);
    }
  },

  // Get user purchases
  async getUserPurchases() {
    try {
      const response = await axios.get(`${API_BASE_URL}/payments/user-purchases/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user purchases:', error);
      return [];
    }
  },

  // Check if user has access to a book
  async checkBookAccess(bookId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/user-purchases/check-access/${bookId}/`);
      return response.data;
    } catch (error) {
      return { has_access: false };
    }
  },

  // Quick payment - single step
  async quickPayment(bookId, paymentMethod, phoneNumber = '') {
    try {
      const paymentData = {
        book_id: bookId,
        payment_method: paymentMethod,
        phone_number: phoneNumber,
        transaction_id: `TXN${Date.now()}`
      };
      
      const response = await axios.post(`${API_BASE_URL}/payments/process/`, paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Quick payment failed');
    }
  }
};

// Ethiopian payment providers with enhanced data
export const ethiopianPaymentProviders = {
  telebir: {
    id: 'telebir',
    name: "Telebir",
    shortCode: "*806#",
    description: "Ethio Telecom Mobile Money",
    instructions: "Dial *806# and follow instructions to send payment",
    supportedNetworks: ["Ethio Telecom"],
    type: 'mobile',
    color: 'from-blue-500 to-blue-600',
    icon: 'mobile',
    popular: true
  },
  cbeBir: {
    id: 'cbe_bir',
    name: "CBE Bir",
    shortCode: "*889#",
    description: "Commercial Bank of Ethiopia",
    instructions: "Use CBE mobile banking or dial *889#",
    supportedNetworks: ["CBE"],
    type: 'bank',
    color: 'from-green-500 to-green-600',
    icon: 'university',
    popular: true
  },
  hellocash: {
    id: 'hellocash',
    name: "HelloCash",
    shortCode: "*812#",
    description: "HelloCash Mobile Money",
    instructions: "Dial *812# for HelloCash payment",
    supportedNetworks: ["HelloCash"],
    type: 'mobile',
    color: 'from-purple-500 to-purple-600',
    icon: 'money-bill',
    popular: false
  },
  dashen: {
    id: 'dashen',
    name: "Dashen Bank",
    shortCode: "*809#",
    description: "Dashen Mobile Banking",
    instructions: "Use Dashen mobile banking or dial *809#",
    supportedNetworks: ["Dashen Bank"],
    type: 'bank',
    color: 'from-red-500 to-red-600',
    icon: 'university',
    popular: false
  },
  awash: {
    id: 'awash',
    name: "Awash Bank",
    shortCode: "*829#",
    description: "Awash Mobile Banking",
    instructions: "Use Awash mobile banking or dial *829#",
    supportedNetworks: ["Awash Bank"],
    type: 'bank',
    color: 'from-orange-500 to-orange-600',
    icon: 'university',
    popular: false
  },
  amole: {
    id: 'amole',
    name: "Amole",
    description: "Amole Digital Wallet",
    instructions: "Use Amole app or website to complete payment",
    supportedNetworks: ["Amole"],
    type: 'wallet',
    color: 'from-yellow-500 to-yellow-600',
    icon: 'id-card',
    popular: true
  },
  stripe: {
    id: 'stripe',
    name: "Credit/Debit Card",
    description: "International Cards (Visa, Mastercard)",
    instructions: "Secure payment with your card",
    supportedNetworks: ["Visa", "Mastercard", "Amex"],
    type: 'card',
    color: 'from-indigo-500 to-indigo-600',
    icon: 'credit-card',
    popular: true
  },
  paypal: {
    id: 'paypal',
    name: "PayPal",
    description: "PayPal International",
    instructions: "Pay with your PayPal account",
    supportedNetworks: [],
    type: 'digital',
    color: 'from-blue-400 to-blue-500',
    icon: 'shield',
    popular: false
  },
  telebirQuick: {
    id: 'telebir_quick',
    name: "Telebir Quick Pay",
    shortCode: "*806#",
    description: "Instant payment with Telebir",
    instructions: "Dial *806# - Quick Payment",
    supportedNetworks: ["Ethio Telecom"],
    type: 'mobile',
    color: 'from-blue-600 to-blue-700',
    icon: 'mobile',
    quick: true
  },
  cbeQuick: {
    id: 'cbe_quick',
    name: "CBE Quick Pay",
    shortCode: "*889#",
    description: "Instant payment with CBE",
    instructions: "Dial *889# - Quick Payment",
    supportedNetworks: ["CBE"],
    type: 'bank',
    color: 'from-green-600 to-green-700',
    icon: 'university',
    quick: true
  },
  amoleQuick: {
    id: 'amole_quick',
    name: "Amole Quick Pay",
    description: "Instant payment with Amole",
    instructions: "Amole App - Quick Payment",
    supportedNetworks: ["Amole"],
    type: 'wallet',
    color: 'from-yellow-600 to-yellow-700',
    icon: 'id-card',
    quick: true
  }
};

// Quick payment options for one-click payment
export const quickPaymentOptions = [
  {
    id: 'telebir_quick',
    name: 'Pay with Telebir',
    description: 'Instant payment via *806#',
    icon: 'mobile',
    color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    method: 'telebir'
  },
  {
    id: 'cbe_quick',
    name: 'Pay with CBE Bir',
    description: 'Instant payment via *889#',
    icon: 'university',
    color: 'bg-gradient-to-r from-green-500 to-green-600',
    method: 'cbe_bir'
  },
  {
    id: 'amole_quick',
    name: 'Pay with Amole',
    description: 'Instant payment via Amole App',
    icon: 'id-card',
    color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    method: 'amole'
  },
  
];