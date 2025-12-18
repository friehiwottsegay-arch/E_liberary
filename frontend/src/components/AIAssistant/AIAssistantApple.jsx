import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Loader,
  Lightbulb,
  RefreshCw,
  Volume2,
  VolumeX,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  MoreVertical
} from 'lucide-react';
import { geminiApi } from '../../services/geminiApi';
import './AIAssistantApple.css';

const AIAssistantApple = ({ userContext = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize AI assistant
  useEffect(() => {
    geminiApi.initializeContext();
    setSuggestedQuestions(geminiApi.getSuggestedQuestions(userContext));
    
    // Add welcome message
    setMessages([{
      id: Date.now(),
      type: 'ai',
      content: `Hello! I'm your E-Library AI assistant. I'm here to help you navigate our platform, find books, take exams, and answer any questions you might have. How can I assist you today?`,
      timestamp: new Date(),
      suggestions: geminiApi.getSuggestedQuestions(userContext).slice(0, 3)
    }]);
  }, [userContext]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Play notification sound
  const playNotificationSound = () => {
    if (isSoundEnabled) {
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        audio.play().catch(() => {});
      } catch (error) {
        // Ignore audio errors
      }
    }
  };

  // Handle sending message
  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowQuickActions(false);
    setIsTyping(true);

    try {
      // Get AI response
      const response = await geminiApi.generateResponse(messageText, {
        ...userContext,
        currentPage: window.location.pathname
      });

      setIsTyping(false);

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.message,
        timestamp: new Date(),
        success: response.success,
        quickActions: response.success ? geminiApi.getQuickActions(messageText, userContext) : [],
        suggestions: response.success ? geminiApi.getSuggestedQuestions(userContext).slice(0, 2) : []
      };

      setMessages(prev => [...prev, aiMessage]);
      
      if (response.success) {
        playNotificationSound();
      }

    } catch (error) {
      console.error('AI Assistant Error:', error);
      setIsTyping(false);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team for assistance.",
        timestamp: new Date(),
        success: false,
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggested question click
  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  // Handle quick action click
  const handleQuickAction = (action) => {
    switch (action.action) {
      case 'navigate':
        window.location.href = action.target;
        break;
      case 'contact':
        console.log('Contact action:', action.target);
        break;
      case 'info':
        handleSendMessage(`Tell me about ${action.target}`);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Copy message to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could show a toast notification here
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
  };

  // Clear conversation
  const clearConversation = () => {
    geminiApi.clearHistory();
    setMessages([{
      id: Date.now(),
      type: 'ai',
      content: `Conversation cleared! I'm ready to help you with anything about the E-Library platform. What would you like to know?`,
      timestamp: new Date(),
      suggestions: geminiApi.getSuggestedQuestions(userContext).slice(0, 3)
    }]);
    setShowQuickActions(true);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Apple-style floating button
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group apple-floating-button apple-button-hover p-4 rounded-2xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 apple-scale-in"
        >
          <MessageCircle className="w-5 h-5 apple-bounce" />
          <div className="absolute -top-1 -right-1 apple-badge flex items-center justify-center animate-pulse">
            <Sparkles className="w-2 h-2" />
          </div>
          
          {/* Apple-style tooltip */}
          <div className="apple-tooltip absolute bottom-full right-0 mb-3" data-tooltip="AI Assistant">
            <div className="px-3 py-2 bg-gray-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-lg">
              AI Assistant
              <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
            </div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-out apple-chat-window ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <div className="apple-card apple-shadow-xl flex flex-col h-full overflow-hidden apple-fade-in">
        
        {/* Apple-style Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between rounded-t-3xl relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          
          <div className="flex items-center space-x-3 relative z-10">
            <div className="relative">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm apple-glass">
                <Bot className="w-4 h-4" />
              </div>
              <div className="apple-status-online absolute -top-0.5 -right-0.5"></div>
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Assistant</h3>
              <p className="text-xs opacity-90 font-medium">E-Library Helper</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 relative z-10">
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className="apple-button-hover p-2 hover:bg-white/20 rounded-xl"
              title={isSoundEnabled ? 'Mute' : 'Unmute'}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            
            <div className="relative group">
              <button className="apple-button-hover p-2 hover:bg-white/20 rounded-xl">
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="apple-dropdown absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button
                  onClick={clearConversation}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-2xl transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Clear Chat</span>
                </button>
                <button className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2">
                  <Copy className="w-4 h-4" />
                  <span>Export Chat</span>
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="apple-button-hover p-2 hover:bg-white/20 rounded-xl"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => setIsOpen(false)}
              className="apple-button-hover p-2 hover:bg-white/20 rounded-xl"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 apple-scrollbar apple-glass-auto">
              {messages.map((message) => (
                <div key={message.id} className={`flex apple-slide-up ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 apple-shadow ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : message.isError
                            ? 'bg-red-500 text-white'
                            : 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                      }`}>
                        {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      
                      {/* Message Bubble */}
                      <div className={`apple-message-bubble ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : message.isError
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
                        
                        {/* Message Actions */}
                        {message.type === 'ai' && !message.isError && (
                          <div className="mt-3 flex items-center space-x-2">
                            <button
                              onClick={() => copyToClipboard(message.content)}
                              className="apple-button-hover text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center space-x-1 px-2 py-1 rounded-lg"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </button>
                          </div>
                        )}
                        
                        {/* Timestamp */}
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    {message.quickActions && message.quickActions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 ml-11">
                        {message.quickActions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickAction(action)}
                            className="apple-button-hover text-xs bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 apple-shadow-sm"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2 ml-11">
                        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                          <Lightbulb className="w-3 h-3" />
                          <span>Suggestions</span>
                        </div>
                        <div className="space-y-1">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="apple-button-hover block w-full text-left text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start apple-fade-in">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center apple-shadow">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="apple-card apple-message-bubble p-4 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        <div className="apple-typing-dots">
                          <div className="apple-typing-dot"></div>
                          <div className="apple-typing-dot"></div>
                          <div className="apple-typing-dot"></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {showQuickActions && messages.length <= 1 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 apple-glass-auto">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center space-x-2 font-medium">
                  <Lightbulb className="w-3 h-3" />
                  <span>Quick questions</span>
                </div>
                <div className="space-y-2">
                  {suggestedQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(question)}
                      className="apple-button-hover block w-full text-left text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 apple-glass-auto">
              <div className="flex space-x-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about E-Library..."
                  className="apple-input flex-1 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="apple-button-hover px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl apple-shadow apple-scale-in"
                >
                  {isLoading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIAssistantApple;