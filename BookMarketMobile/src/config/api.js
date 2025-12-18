// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8000',
  API_PREFIX: '/api',
  TIMEOUT: 10000,
};

export const ENDPOINTS = {
  // Auth
  LOGIN: '/login/',
  REGISTER: '/register/',
  LOGOUT: '/logout/',
  CURRENT_USER: '/current_user/',
  
  // Books
  BOOKS: '/books/',
  CATEGORIES: '/categories/',
  ADMIN_BOOKS: '/admin-books/',
  
  // Exams
  EXAMS: '/exams/',
  EXAM_RESULTS: '/exams/results/',
  
  // Audiobooks
  AUDIOBOOKS: '/audiobooks/',
  GENERATE_AUDIOBOOK: '/audiobooks/generate/',
  UPLOAD_AUDIOBOOK: '/audiobooks/upload/',
  
  // Payments
  PAYMENTS: '/payments/',
  CHAPA_PAYMENT: '/payments/chapa/',
  USER_PURCHASES: '/payments/user-purchases/',
  
  // AI
  AI_CHAT: '/ai/chat/',
  
  // Dictionary
  DICTIONARY: '/dictionary/',
};
