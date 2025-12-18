// Gemini AI API Service
import axios from 'axios';
import { GEMINI_CONFIG, CHAT_CONFIG, AI_CONFIG } from '../config/aiConfig';

class GeminiApiService {
  constructor() {
    this.apiKey = GEMINI_CONFIG.apiKey;
    this.baseUrl = `${GEMINI_CONFIG.baseUrl}/${GEMINI_CONFIG.model}:generateContent`;
    this.conversationHistory = [];
    this.maxHistory = CHAT_CONFIG.maxHistory;
  }

  // Initialize conversation with system context about E-Library
  initializeContext(userRole = 'GUEST') {
    const systemPrompt = AI_CONFIG.SYSTEM_PROMPTS[userRole] || AI_CONFIG.SYSTEM_PROMPTS.DEFAULT;
    
    const systemContext = {
      role: 'system',
      content: systemPrompt
    };
    
    this.conversationHistory = [systemContext];
  }

  // Generate AI response using Gemini API
  async generateResponse(userMessage, context = {}) {
    try {
      // Add user message to conversation history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      // Prepare the request payload
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: this.buildPrompt(userMessage, context)
              }
            ]
          }
        ],
        generationConfig: GEMINI_CONFIG.generationConfig,
        safetySettings: GEMINI_CONFIG.safetySettings
      };

      const response = await axios.post(
        `${this.baseUrl}?key=${this.apiKey}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data && response.data.candidates && response.data.candidates[0]) {
        const aiResponse = response.data.candidates[0].content.parts[0].text;
        
        // Add AI response to conversation history
        this.conversationHistory.push({
          role: 'assistant',
          content: aiResponse
        });

        return {
          success: true,
          message: aiResponse,
          conversationId: Date.now()
        };
      } else {
        throw new Error('Invalid response format from Gemini API');
      }

    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Provide fallback responses for common issues
      if (error.response?.status === 429) {
        return {
          success: false,
          message: AI_CONFIG.ERROR_MESSAGES.RATE_LIMIT,
          error: 'Rate limit exceeded'
        };
      } else if (error.response?.status === 403) {
        return {
          success: false,
          message: AI_CONFIG.ERROR_MESSAGES.API_ERROR,
          error: 'API key issue'
        };
      } else {
        return {
          success: false,
          message: AI_CONFIG.ERROR_MESSAGES.NETWORK_ERROR,
          error: error.message
        };
      }
    }
  }

  // Build comprehensive prompt with context
  buildPrompt(userMessage, context) {
    let prompt = `As an AI assistant for the E-Library educational platform, please respond to this user query: "${userMessage}"`;

    // Add context if available
    if (context.userRole) {
      prompt += `\n\nUser Role: ${context.userRole}`;
    }

    if (context.currentPage) {
      prompt += `\nCurrent Page: ${context.currentPage}`;
    }

    if (context.userPreferences) {
      prompt += `\nUser Preferences: ${JSON.stringify(context.userPreferences)}`;
    }

    // Add conversation history for context (limited by maxHistory)
    const recentHistory = this.conversationHistory.slice(-this.maxHistory);
    if (recentHistory.length > 1) {
      prompt += `\n\nRecent conversation context:`;
      recentHistory.forEach(msg => {
        if (msg.role !== 'system') {
          prompt += `\n${msg.role}: ${msg.content}`;
        }
      });
    }

    prompt += `\n\nPlease provide a helpful, concise response that's relevant to the E-Library platform. If the question is about platform features, provide specific guidance. If it's a general question, relate it back to learning and education when possible.`;

    return prompt;
  }

  // Get conversation history
  getConversationHistory() {
    return this.conversationHistory.filter(msg => msg.role !== 'system');
  }

  // Clear conversation history
  clearHistory() {
    this.initializeContext();
  }

  // Get suggested questions based on context
  getSuggestedQuestions(context = {}) {
    const userRole = context.userRole || 'GUEST';
    const currentPage = context.currentPage || '';
    
    // Get role-based questions
    let questions = [...AI_CONFIG.SUGGESTED_QUESTIONS.GENERAL];
    
    // Add context-specific questions based on current page
    if (currentPage.includes('/products') || currentPage.includes('/book')) {
      questions = [...questions, ...AI_CONFIG.SUGGESTED_QUESTIONS.BOOKS];
    } else if (currentPage.includes('/exam')) {
      questions = [...questions, ...AI_CONFIG.SUGGESTED_QUESTIONS.EXAMS];
    } else if (currentPage.includes('/payment') || currentPage.includes('/cart')) {
      questions = [...questions, ...AI_CONFIG.SUGGESTED_QUESTIONS.PAYMENTS];
    }
    
    // Remove duplicates and return limited set
    return [...new Set(questions)].slice(0, 8);
  }

  // Analyze user intent for better responses
  analyzeIntent(message) {
    const intents = {
      navigation: ['how to', 'where is', 'find', 'locate', 'navigate'],
      technical: ['error', 'bug', 'not working', 'problem', 'issue'],
      feature: ['what is', 'explain', 'how does', 'feature'],
      account: ['login', 'password', 'account', 'profile', 'register'],
      payment: ['pay', 'payment', 'buy', 'purchase', 'cost', 'price'],
      exam: ['exam', 'test', 'quiz', 'question', 'study', 'learn']
    };

    const messageLower = message.toLowerCase();
    
    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        return intent;
      }
    }

    return 'general';
  }

  // Get quick actions based on user message
  getQuickActions(message, context = {}) {
    const userRole = context.userRole || 'GUEST';
    const intent = this.analyzeIntent(message);
    
    // Get role-based actions
    const roleActions = AI_CONFIG.QUICK_ACTIONS[userRole.toUpperCase()] || AI_CONFIG.QUICK_ACTIONS.GUEST;
    
    // Get intent-based actions
    const intentActions = {
      navigation: roleActions.filter(action => action.action === 'navigate'),
      technical: [
        { label: 'Contact Support', action: 'contact', target: 'support' },
        { label: 'View Help', action: 'navigate', target: '/help' },
        { label: 'Report Issue', action: 'report', target: 'bug' }
      ],
      exam: [
        { label: 'Browse Exams', action: 'navigate', target: '/exam' },
        { label: 'View Progress', action: 'navigate', target: '/dashboard' },
        { label: 'Study Materials', action: 'navigate', target: '/products' }
      ],
      payment: [
        { label: 'Payment Methods', action: 'info', target: 'payment-methods' },
        { label: 'Purchase History', action: 'navigate', target: '/dashboard' },
        { label: 'Billing Support', action: 'contact', target: 'billing' }
      ]
    };

    return intentActions[intent] || roleActions.slice(0, 3);
  }
}

// Export singleton instance
export const geminiApi = new GeminiApiService();
export default geminiApi;