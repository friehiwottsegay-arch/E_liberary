// AI Assistant Configuration
export const AI_CONFIG = {
  // Gemini API Configuration
  GEMINI_API_KEY: 'AIzaSyAw9HI1ZtiL8ecVF4cbKWOZlbfhQkYndlE',
  GEMINI_MODEL: 'gemini-pro',
  GEMINI_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models',
  
  // Chat Configuration
  MAX_CONVERSATION_HISTORY: 10,
  MAX_MESSAGE_LENGTH: 1000,
  TYPING_DELAY: 1000,
  
  // UI Configuration
  CHAT_WINDOW_HEIGHT: 600,
  CHAT_WINDOW_WIDTH: 400,
  ANIMATION_DURATION: 300,
  
  // Feature Flags
  FEATURES: {
    VOICE_INPUT: false,
    VOICE_OUTPUT: false,
    FILE_UPLOAD: false,
    CONVERSATION_EXPORT: true,
    CONVERSATION_SHARING: true,
    QUICK_ACTIONS: true,
    SUGGESTED_QUESTIONS: true,
    TYPING_INDICATOR: true,
    READ_RECEIPTS: false,
    CONVERSATION_HISTORY: true
  },
  
  // Safety Settings
  SAFETY_SETTINGS: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH", 
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    }
  ],
  
  // Generation Configuration
  GENERATION_CONFIG: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
  
  // System Prompts
  SYSTEM_PROMPTS: {
    DEFAULT: `You are an AI assistant for the E-Library platform, a comprehensive educational system. 
    
    Platform Features:
    - Digital library with books (hard copy and soft copy)
    - Comprehensive exam/quiz system with timed tests
    - User management (Students, Teachers, Admins, Sellers)
    - Payment system for book purchases and rentals
    - Sign language dictionary
    - Research projects sharing
    - Multi-language support (English, Amharic, Oromo)
    - Ethiopian payment methods (Telebir, CBE Bir, HelloCash, Amole)
    
    Your role:
    - Help users navigate the platform
    - Answer questions about books, exams, and features
    - Provide study guidance and recommendations
    - Assist with technical issues
    - Support in multiple languages when requested
    - Be friendly, helpful, and educational
    
    Guidelines:
    - Always be concise but informative
    - Ask clarifying questions when needed
    - Provide specific, actionable advice
    - Reference platform features when relevant
    - Be encouraging and supportive
    - Maintain a professional yet friendly tone`,
    
    STUDENT: `You are helping a student on the E-Library platform. Focus on:
    - Study guidance and learning strategies
    - Exam preparation and test-taking tips
    - Book recommendations based on their level
    - Progress tracking and goal setting
    - Time management for studies`,
    
    TEACHER: `You are helping a teacher/instructor on the E-Library platform. Focus on:
    - Course material organization
    - Student progress monitoring
    - Exam creation and management
    - Educational resource recommendations
    - Teaching strategies and methodologies`,
    
    ADMIN: `You are helping an administrator on the E-Library platform. Focus on:
    - System management and configuration
    - User management and analytics
    - Content moderation and quality control
    - Platform performance and optimization
    - Policy and procedure guidance`,
    
    SELLER: `You are helping a seller on the E-Library platform. Focus on:
    - Book listing and inventory management
    - Sales analytics and performance
    - Customer engagement strategies
    - Pricing and marketing recommendations
    - Platform policies for sellers`
  },
  
  // Quick Actions by User Role
  QUICK_ACTIONS: {
    GUEST: [
      { label: 'Browse Books', action: 'navigate', target: '/products' },
      { label: 'Take Sample Exam', action: 'navigate', target: '/exam' },
      { label: 'Create Account', action: 'navigate', target: '/register' },
      { label: 'Learn More', action: 'navigate', target: '/about' }
    ],
    STUDENT: [
      { label: 'My Dashboard', action: 'navigate', target: '/dashboard' },
      { label: 'Take Exam', action: 'navigate', target: '/exam' },
      { label: 'Browse Books', action: 'navigate', target: '/products' },
      { label: 'View Progress', action: 'navigate', target: '/dashboard' }
    ],
    TEACHER: [
      { label: 'Create Exam', action: 'navigate', target: '/admin/exams/upload' },
      { label: 'Upload Content', action: 'navigate', target: '/admin/books/upload' },
      { label: 'View Analytics', action: 'navigate', target: '/admin' },
      { label: 'Manage Students', action: 'navigate', target: '/admin/users' }
    ],
    ADMIN: [
      { label: 'Admin Dashboard', action: 'navigate', target: '/admin' },
      { label: 'Manage Users', action: 'navigate', target: '/admin/users' },
      { label: 'System Health', action: 'info', target: 'system-health' },
      { label: 'View Reports', action: 'navigate', target: '/admin/reports' }
    ],
    SELLER: [
      { label: 'Seller Dashboard', action: 'navigate', target: '/seller/dashboard' },
      { label: 'Add Books', action: 'navigate', target: '/seller/books/add' },
      { label: 'View Sales', action: 'navigate', target: '/seller/analytics' },
      { label: 'Manage Inventory', action: 'navigate', target: '/seller/inventory' }
    ]
  },
  
  // Suggested Questions by Context
  SUGGESTED_QUESTIONS: {
    GENERAL: [
      "How do I search for books?",
      "What payment methods are available?",
      "How does the exam system work?",
      "How can I track my progress?",
      "What languages are supported?"
    ],
    BOOKS: [
      "How do I download purchased books?",
      "What's the difference between hard and soft copies?",
      "Can I rent books instead of buying?",
      "How do I return a rented book?",
      "Are there free books available?"
    ],
    EXAMS: [
      "How do I prepare for exams?",
      "Can I retake failed exams?",
      "How long do I have to complete an exam?",
      "Are there practice tests available?",
      "How are exam scores calculated?"
    ],
    PAYMENTS: [
      "Which Ethiopian payment methods do you accept?",
      "How do I request a refund?",
      "Are there any transaction fees?",
      "How do I update my payment information?",
      "Can I pay with international cards?"
    ],
    TECHNICAL: [
      "The website is loading slowly, what should I do?",
      "I can't access my account, help!",
      "How do I clear my browser cache?",
      "The download isn't working, what's wrong?",
      "How do I report a bug or issue?"
    ]
  },
  
  // Error Messages
  ERROR_MESSAGES: {
    API_ERROR: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
    RATE_LIMIT: "I'm currently experiencing high demand. Please wait a moment before asking another question.",
    INVALID_INPUT: "I didn't quite understand that. Could you please rephrase your question?",
    NETWORK_ERROR: "There seems to be a connection issue. Please check your internet connection and try again.",
    GENERAL_ERROR: "Something went wrong on my end. Let me try to help you in a different way."
  },
  
  // Success Messages
  SUCCESS_MESSAGES: {
    CONVERSATION_CLEARED: "Conversation cleared! I'm ready to help you with anything about the E-Library platform.",
    MESSAGE_COPIED: "Message copied to clipboard!",
    CONVERSATION_EXPORTED: "Conversation exported successfully!",
    FEEDBACK_SUBMITTED: "Thank you for your feedback! It helps me improve."
  },
  
  // Fallback Responses
  FALLBACK_RESPONSES: [
    "I'm not sure about that specific topic, but I'd be happy to help you with E-Library related questions!",
    "That's an interesting question! Let me help you find information about our platform features instead.",
    "I specialize in helping with E-Library platform questions. What would you like to know about our books, exams, or features?",
    "I might not have the exact answer, but I can definitely help you navigate the E-Library platform. What are you looking for?"
  ]
};

// Export individual configurations for easier imports
export const GEMINI_CONFIG = {
  apiKey: AI_CONFIG.GEMINI_API_KEY,
  model: AI_CONFIG.GEMINI_MODEL,
  baseUrl: AI_CONFIG.GEMINI_BASE_URL,
  safetySettings: AI_CONFIG.SAFETY_SETTINGS,
  generationConfig: AI_CONFIG.GENERATION_CONFIG
};

export const CHAT_CONFIG = {
  maxHistory: AI_CONFIG.MAX_CONVERSATION_HISTORY,
  maxMessageLength: AI_CONFIG.MAX_MESSAGE_LENGTH,
  typingDelay: AI_CONFIG.TYPING_DELAY,
  features: AI_CONFIG.FEATURES
};

export const UI_CONFIG = {
  windowHeight: AI_CONFIG.CHAT_WINDOW_HEIGHT,
  windowWidth: AI_CONFIG.CHAT_WINDOW_WIDTH,
  animationDuration: AI_CONFIG.ANIMATION_DURATION
};

export default AI_CONFIG;