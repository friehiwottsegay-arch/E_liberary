import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bot, 
  MessageCircle, 
  BookOpen, 
  GraduationCap, 
  CreditCard, 
  Settings, 
  HelpCircle,
  ChevronRight,
  Star,
  Clock,
  Users,
  Zap,
  Lightbulb,
  Phone,
  Mail,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import AIChat from './AIChat';
import { geminiApi } from '../../services/geminiApi';

const AIHelpCenter = ({ userContext = {} }) => {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [chatInitialMessage, setChatInitialMessage] = useState(null);

  // FAQ Categories
  const faqCategories = {
    all: { label: 'All Topics', icon: <HelpCircle className="w-5 h-5" /> },
    books: { label: 'Books & Library', icon: <BookOpen className="w-5 h-5" /> },
    exams: { label: 'Exams & Learning', icon: <GraduationCap className="w-5 h-5" /> },
    payments: { label: 'Payments & Billing', icon: <CreditCard className="w-5 h-5" /> },
    account: { label: 'Account & Settings', icon: <Settings className="w-5 h-5" /> },
    technical: { label: 'Technical Support', icon: <Zap className="w-5 h-5" /> }
  };

  // FAQ Data
  const faqs = [
    {
      id: 1,
      category: 'books',
      question: 'How do I search for books in the library?',
      answer: 'You can search for books using the search bar on the main page. Use keywords, author names, or book titles. You can also filter by category, language, and availability.',
      popularity: 95
    },
    {
      id: 2,
      category: 'books',
      question: 'What\'s the difference between hard copy and soft copy books?',
      answer: 'Hard copy books are physical books that can be delivered to you. Soft copy books are digital versions you can download and read on your device immediately.',
      popularity: 88
    },
    {
      id: 3,
      category: 'books',
      question: 'Can I rent books instead of buying them?',
      answer: 'Yes! Many books are available for rental. You can rent books for a specified period at a lower cost than purchasing.',
      popularity: 82
    },
    {
      id: 4,
      category: 'exams',
      question: 'How do I take an exam on the platform?',
      answer: 'Navigate to the Exams section, choose your subject, and click "Start Exam". You can take exams in timed mode or study mode for practice.',
      popularity: 92
    },
    {
      id: 5,
      category: 'exams',
      question: 'Can I retake an exam if I\'m not satisfied with my score?',
      answer: 'Yes, most exams can be retaken. Check the specific exam rules for retry limits and waiting periods.',
      popularity: 78
    },
    {
      id: 6,
      category: 'exams',
      question: 'How do I track my learning progress?',
      answer: 'Visit your Dashboard to see detailed progress analytics, including completed exams, scores, time spent studying, and recommendations.',
      popularity: 85
    },
    {
      id: 7,
      category: 'payments',
      question: 'What payment methods are accepted?',
      answer: 'We accept Telebir, CBE Bir, HelloCash, Amole, Dashen Bank, Awash Bank, and international cards via Stripe.',
      popularity: 90
    },
    {
      id: 8,
      category: 'payments',
      question: 'How do I get a refund for a purchase?',
      answer: 'Refunds can be requested within 7 days of purchase for digital content or 14 days for physical books. Contact support with your order details.',
      popularity: 75
    },
    {
      id: 9,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions sent to your email address.',
      popularity: 87
    },
    {
      id: 10,
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'Go to your Dashboard, click on "Profile Settings", and update your information. Don\'t forget to save your changes.',
      popularity: 70
    },
    {
      id: 11,
      category: 'technical',
      question: 'The website is loading slowly. What should I do?',
      answer: 'Try clearing your browser cache, check your internet connection, or try using a different browser. Contact support if the issue persists.',
      popularity: 65
    },
    {
      id: 12,
      category: 'technical',
      question: 'I can\'t download my purchased books. What\'s wrong?',
      answer: 'Ensure you\'re logged into the correct account and have a stable internet connection. Try refreshing the page or contact support.',
      popularity: 72
    }
  ];

  // Quick Actions
  const quickActions = [
    {
      title: 'Start AI Chat',
      description: 'Get instant help from our AI assistant',
      icon: <Bot className="w-6 h-6" />,
      action: () => setShowChat(true),
      color: 'bg-blue-500'
    },
    {
      title: 'Browse Books',
      description: 'Explore our digital library',
      icon: <BookOpen className="w-6 h-6" />,
      action: () => window.location.href = '/products',
      color: 'bg-green-500'
    },
    {
      title: 'Take Exam',
      description: 'Test your knowledge',
      icon: <GraduationCap className="w-6 h-6" />,
      action: () => window.location.href = '/exam',
      color: 'bg-purple-500'
    },
    {
      title: 'Contact Support',
      description: 'Speak with our team',
      icon: <MessageSquare className="w-6 h-6" />,
      action: () => setActiveTab('contact'),
      color: 'bg-orange-500'
    }
  ];

  // Support channels
  const supportChannels = [
    {
      title: 'Live Chat',
      description: 'Chat with our AI assistant or support team',
      icon: <MessageCircle className="w-6 h-6" />,
      availability: '24/7 AI • 9 AM - 6 PM Human Support',
      action: () => setShowChat(true),
      primary: true
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: <Mail className="w-6 h-6" />,
      availability: 'Response within 24 hours',
      contact: 'support@elibrary.com',
      action: () => window.location.href = 'mailto:support@elibrary.com'
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with our team',
      icon: <Phone className="w-6 h-6" />,
      availability: 'Mon-Fri 9 AM - 6 PM',
      contact: '+251-11-123-4567',
      action: () => window.location.href = 'tel:+251111234567'
    }
  ];

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => b.popularity - a.popularity);

  // Handle FAQ click - start chat with the question
  const handleFaqClick = (faq) => {
    setChatInitialMessage(faq.question);
    setShowChat(true);
  };

  // Handle ask AI about search
  const handleAskAI = () => {
    if (searchQuery.trim()) {
      setChatInitialMessage(searchQuery);
      setShowChat(true);
    }
  };

  if (showChat) {
    return (
      <div className="h-full">
        <AIChat 
          isFullScreen={true}
          userContext={userContext}
          onClose={() => setShowChat(false)}
          initialMessage={chatInitialMessage}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How can we help you?
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Find answers, get support, or chat with our AI assistant
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help articles, guides, or ask a question..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-32 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-lg"
                />
                <button
                  onClick={handleAskAI}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Bot className="w-4 h-4" />
                  <span>Ask AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 text-left group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {action.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {action.description}
              </p>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'faq'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'contact'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Contact
          </button>
        </div>

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {Object.entries(faqCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === key
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {category.icon}
                  <span>{category.label}</span>
                </button>
              ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleFaqClick(faq)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                          {faq.question}
                          <ChevronRight className="w-4 h-4 ml-2 text-gray-400" />
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          {faq.answer}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-current text-yellow-400" />
                            <span>{faq.popularity}% helpful</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Bot className="w-4 h-4" />
                            <span>Ask AI for more details</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Try adjusting your search or ask our AI assistant
                  </p>
                  <button
                    onClick={handleAskAI}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 mx-auto"
                  >
                    <Bot className="w-4 h-4" />
                    <span>Ask AI Assistant</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 ${
                  channel.primary ? 'ring-2 ring-blue-500 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 ${
                    channel.primary ? 'bg-blue-500' : 'bg-gray-500'
                  } rounded-lg flex items-center justify-center text-white`}>
                    {channel.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {channel.title}
                    </h3>
                    {channel.primary && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {channel.description}
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{channel.availability}</span>
                  </div>
                  {channel.contact && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <ExternalLink className="w-4 h-4" />
                      <span>{channel.contact}</span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={channel.action}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    channel.primary
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                  }`}
                >
                  {channel.title === 'Live Chat' ? 'Start Chat' : 
                   channel.title === 'Email Support' ? 'Send Email' : 'Call Now'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIHelpCenter;