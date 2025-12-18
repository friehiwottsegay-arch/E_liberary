import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Loader, 
  RefreshCw,
  Copy,
  Download,
  Share2,
  Star,
  MessageSquare,
  Zap,
  BookOpen,
  GraduationCap,
  CreditCard,
  Settings,
  HelpCircle
} from 'lucide-react';
import { geminiApi } from '../../services/geminiApi';

const AIChat = ({ 
  isFullScreen = false, 
  userContext = {}, 
  onClose = () => {},
  initialMessage = null 
}) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const [quickActions, setQuickActions] = useState([]);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Quick action categories
  const actionCategories = {
    books: {
      icon: <BookOpen className="w-4 h-4" />,
      label: 'Books',
      actions: [
        'How do I search for books?',
        'What book formats are available?',
        'How do I download books?',
        'Can I rent books?'
      ]
    },
    exams: {
      icon: <GraduationCap className="w-4 h-4" />,
      label: 'Exams',
      actions: [
        'How do I take an exam?',
        'What types of questions are there?',
        'How do I check my results?',
        'Can I retake exams?'
      ]
    },
    payments: {
      icon: <CreditCard className="w-4 h-4" />,
      label: 'Payments',
      actions: [
        'What payment methods are available?',
        'How do I make a purchase?',
        'Can I get a refund?',
        'How do I check my payment history?'
      ]
    },
    account: {
      icon: <Settings className="w-4 h-4" />,
      label: 'Account',
      actions: [
        'How do I update my profile?',
        'How do I reset my password?',
        'How do I change my preferences?',
        'How do I delete my account?'
      ]
    },
    help: {
      icon: <HelpCircle className="w-4 h-4" />,
      label: 'Help',
      actions: [
        'How do I contact support?',
        'Where can I find tutorials?',
        'What are the system requirements?',
        'How do I report a bug?'
      ]
    }
  };

  // Initialize chat
  useEffect(() => {
    initializeChat();
  }, []);

  // Handle initial message
  useEffect(() => {
    if (initialMessage && messages.length === 1) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = () => {
    geminiApi.initializeContext();
    
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: `Hello! 👋 I'm your E-Library AI assistant. I can help you with:

📚 **Books & Library**
- Finding and downloading books
- Understanding different formats
- Rental and purchase options

🎓 **Exams & Learning**
- Taking exams and quizzes
- Tracking your progress
- Study recommendations

💳 **Payments & Account**
- Payment methods and billing
- Account management
- Technical support

What would you like to know about?`,
      timestamp: new Date(),
      showQuickActions: true
    };

    setMessages([welcomeMessage]);
    setChatSession(Date.now());
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

    try {
      const response = await geminiApi.generateResponse(messageText, {
        ...userContext,
        currentPage: window.location.pathname,
        sessionId: chatSession
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.message,
        timestamp: new Date(),
        success: response.success,
        actions: response.success ? geminiApi.getQuickActions(messageText, userContext) : []
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('AI Chat Error:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I apologize, but I'm experiencing some technical difficulties. Please try again or contact our support team for assistance.",
        timestamp: new Date(),
        success: false,
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    handleSendMessage(action);
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      // Could show toast notification
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
  };

  const exportChat = () => {
    const chatContent = messages.map(msg => 
      `[${msg.timestamp.toLocaleString()}] ${msg.type.toUpperCase()}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareChat = () => {
    if (navigator.share) {
      const lastAIMessage = messages.filter(m => m.type === 'ai').pop();
      navigator.share({
        title: 'E-Library AI Assistant',
        text: lastAIMessage?.content || 'Check out this helpful AI assistant!',
        url: window.location.href
      });
    } else {
      copyMessage(window.location.href);
    }
  };

  const clearChat = () => {
    initializeChat();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-900 ${
      isFullScreen ? 'rounded-none' : 'rounded-lg'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="w-8 h-8" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI Assistant</h2>
            <p className="text-sm opacity-90">E-Library Helper • Online</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={exportChat}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Export chat"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button
            onClick={shareChat}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Share chat"
          >
            <Share2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={clearChat}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Clear chat"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 dark:bg-gray-800">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : message.isError 
                      ? 'bg-red-500 text-white'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                }`}>
                  {message.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                
                {/* Message Content */}
                <div className={`rounded-2xl p-4 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.isError
                      ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 shadow-sm'
                }`}>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                  
                  {/* Message Actions */}
                  {message.type === 'ai' && !message.isError && (
                    <div className="mt-3 flex items-center space-x-3 text-xs">
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                      
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                        <Star className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              {message.actions && message.actions.length > 0 && (
                <div className="mt-3 ml-13 flex flex-wrap gap-2">
                  {message.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.label)}
                      className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center space-x-1"
                    >
                      <Zap className="w-3 h-3" />
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Quick Action Categories (shown on welcome message) */}
              {message.showQuickActions && (
                <div className="mt-4 ml-13 space-y-3">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quick Actions:
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(actionCategories).map(([key, category]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                          {category.icon}
                          <span>{category.label}</span>
                        </div>
                        <div className="space-y-1">
                          {category.actions.slice(0, 2).map((action, index) => (
                            <button
                              key={index}
                              onClick={() => handleQuickAction(action)}
                              className="block w-full text-left text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                <div className="flex items-center space-x-2">
                  <Loader className="w-4 h-4 animate-spin text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about E-Library..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <MessageSquare className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 flex items-center justify-center min-w-[60px]"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          AI responses may not always be accurate. Please verify important information.
        </div>
      </div>
    </div>
  );
};

export default AIChat;