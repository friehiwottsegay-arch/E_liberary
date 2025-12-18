import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaRobot, 
  FaPaperPlane, 
  FaTrash, 
  FaCopy, 
  FaDownload,
  FaTimes,
  FaUser,
  FaLightbulb,
  FaQuestionCircle,
  FaBook,
  FaGraduationCap,
  FaCreditCard,
  FaCog,
  FaChevronDown,
  FaSpinner,
  FaMicrophone,
  FaStop
} from 'react-icons/fa';
import { geminiApi } from '../../services/geminiApi';
import { AI_CONFIG } from '../../config/aiConfig';

const AIDemo = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [userRole, setUserRole] = useState('GUEST');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize AI context on mount
  useEffect(() => {
    // Get user role from localStorage or default to GUEST
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserRole(user.role || 'GUEST');
      } catch (e) {
        setUserRole('GUEST');
      }
    }

    // Initialize Gemini API with user role
    geminiApi.initializeContext(userRole);

    // Add welcome message
    const welcomeMessage = {
      id: Date.now(),
      role: 'assistant',
      content: getWelcomeMessage(userRole),
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getWelcomeMessage = (role) => {
    const welcomeMessages = {
      GUEST: "👋 Welcome to E-Library AI Assistant! I'm here to help you explore our platform. Ask me anything about books, exams, or how to get started!",
      STUDENT: "👋 Hello Student! I'm your AI study companion. I can help you with exam preparation, book recommendations, and tracking your progress. How can I assist you today?",
      TEACHER: "👋 Welcome Teacher! I'm here to help you manage courses, create exams, and support your students. What would you like to do today?",
      ADMIN: "👋 Hello Admin! I can assist you with system management, analytics, and platform administration. How can I help?",
      SELLER: "👋 Welcome Seller! I'm here to help you manage your bookstore, track sales, and optimize your listings. What do you need help with?"
    };
    return welcomeMessages[role] || welcomeMessages.GUEST;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);
    setShowSuggestions(false);

    try {
      // Get current page context
      const context = {
        userRole,
        currentPage: window.location.pathname,
        timestamp: new Date().toISOString()
      };

      // Generate AI response
      const response = await geminiApi.generateResponse(inputMessage.trim(), context);

      // Simulate typing delay for better UX
      setTimeout(() => {
        setIsTyping(false);
        
        if (response.success) {
          const aiMessage = {
            id: Date.now() + 1,
            role: 'assistant',
            content: response.message,
            timestamp: new Date().toISOString(),
            quickActions: geminiApi.getQuickActions(inputMessage.trim(), context)
          };
          setMessages(prev => [...prev, aiMessage]);
        } else {
          const errorMessage = {
            id: Date.now() + 1,
            role: 'assistant',
            content: response.message || AI_CONFIG.ERROR_MESSAGES.GENERAL_ERROR,
            timestamp: new Date().toISOString(),
            isError: true
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: AI_CONFIG.ERROR_MESSAGES.NETWORK_ERROR,
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleQuickAction = (action) => {
    if (action.action === 'navigate') {
      navigate(action.target);
    } else if (action.action === 'contact') {
      navigate('/contact');
    } else if (action.action === 'info') {
      setInputMessage(`Tell me about ${action.target}`);
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the conversation?')) {
      geminiApi.clearHistory();
      const welcomeMessage = {
        id: Date.now(),
        role: 'assistant',
        content: getWelcomeMessage(userRole),
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      setShowSuggestions(true);
    }
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    alert('Message copied to clipboard!');
  };

  const handleExportChat = () => {
    const chatText = messages.map(msg => 
      `[${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.role.toUpperCase()}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `e-library-chat-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = geminiApi.getSuggestedQuestions({ 
    userRole, 
    currentPage: window.location.pathname 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <FaRobot className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            E-Library AI Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Powered by Google Gemini AI • Your 24/7 Learning Companion
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              AI Online • Role: {userRole}
            </span>
          </div>
        </div>

        {/* Main Chat Container */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <FaRobot className="text-blue-500 text-xl" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Assistant</h3>
                <p className="text-blue-100 text-sm">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportChat}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Export Chat"
              >
                <FaDownload className="text-white" />
              </button>
              <button
                onClick={handleClearChat}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Clear Chat"
              >
                <FaTrash className="text-white" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-green-400 to-blue-500' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600'
                  }`}>
                    {message.role === 'user' ? (
                      <FaUser className="text-white text-sm" />
                    ) : (
                      <FaRobot className="text-white text-sm" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex flex-col space-y-2">
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : message.isError
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-md'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      
                      {/* Quick Actions */}
                      {message.quickActions && message.quickActions.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick Actions:</p>
                          <div className="flex flex-wrap gap-2">
                            {message.quickActions.map((action, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleQuickAction(action)}
                                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Message Actions */}
                    <div className="flex items-center space-x-2 px-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                      {message.role === 'assistant' && !message.isError && (
                        <button
                          onClick={() => handleCopyMessage(message.content)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title="Copy message"
                        >
                          <FaCopy className="text-xs" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <FaRobot className="text-white text-sm" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-md">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {showSuggestions && messages.length <= 1 && (
            <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  <FaLightbulb className="mr-2 text-yellow-500" />
                  Suggested Questions
                </h4>
                <button
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <FaChevronDown className={`transform transition-transform ${showSuggestions ? 'rotate-180' : ''}`} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedQuestions.slice(0, 6).map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-left px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <FaQuestionCircle className="inline mr-2 text-blue-500" />
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about E-Library..."
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  maxLength={AI_CONFIG.MAX_MESSAGE_LENGTH}
                  disabled={isLoading}
                />
                <div className="flex items-center justify-between mt-2 px-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {inputMessage.length}/{AI_CONFIG.MAX_MESSAGE_LENGTH}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Press Enter to send
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  !inputMessage.trim() || isLoading
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin text-xl" />
                ) : (
                  <FaPaperPlane className="text-xl" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: FaBook, title: 'Book Help', desc: 'Find & purchase books', color: 'blue' },
            { icon: FaGraduationCap, title: 'Exam Support', desc: 'Study tips & guidance', color: 'green' },
            { icon: FaCreditCard, title: 'Payment Help', desc: 'Billing & transactions', color: 'purple' },
            { icon: FaCog, title: 'Technical Support', desc: 'Platform assistance', color: 'orange' }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-lg flex items-center justify-center mb-3`}>
                <feature.icon className={`text-${feature.color}-500 text-2xl`} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-2">🤖 Powered by Google Gemini AI</h3>
          <p className="text-blue-100">
            Our AI assistant uses advanced natural language processing to provide accurate, helpful responses about the E-Library platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIDemo;
