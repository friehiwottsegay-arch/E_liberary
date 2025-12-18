import React, { useEffect, useState, useMemo } from "react";
import { 
  FaFilter, 
  FaSort, 
  FaSearch, 
  FaTimes, 
  FaStar, 
  FaRegStar,
  FaEye,
  FaDownload,
  FaBook,
  FaCalendar,
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaCrown,
  FaBookOpen,
  FaAward,
  FaList,
  FaTh,
  FaHeart,
  FaCreditCard,
  FaLock,
  FaShieldAlt,
  FaCheck,
  FaGem,
  FaMobile,
  FaUniversity,
  FaMoneyBillWave,
  FaQrcode,
  FaPhone,
  FaIdCard,
  FaReceipt,
  FaSync,
  FaExclamationTriangle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import placeholderImg from "../../assets/women/FeaturedBook1.png";

// Exchange rate service with live API
const exchangeRateService = {
  async getExchangeRate() {
    try {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      return response.data.rates.ETB || 55;
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      return 55;
    }
  }
};

// Enhanced payment service
const paymentService = {
  async processPayment(paymentData) {
    try {
      const response = await axios.post('http://localhost:8000/api/payments/process/', paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Payment processing failed');
    }
  },

  getPaymentInstructions(method) {
    const instructions = {
      telebir: {
        steps: [
          "Dial *806# on your Ethio Telecom line",
          "Select 'Send Money'",
          "Enter recipient number: 0912345678",
          "Enter amount",
          "Enter your PIN to confirm"
        ],
        note: "You will receive a confirmation SMS"
      },
      cbeBir: {
        steps: [
          "Dial *889# on your registered phone",
          "Select 'Transfer'",
          "Choose 'CBE Birr'",
          "Enter recipient number: 0912345678",
          "Enter amount and confirm"
        ],
        note: "Service available 24/7"
      },
      hellocash: {
        steps: [
          "Dial *812# on your HelloCash line",
          "Select 'Send Money'",
          "Enter recipient number",
          "Enter amount",
          "Confirm transaction"
        ],
        note: "Transaction fee may apply"
      },
      dashen: {
        steps: [
          "Open Dashen Bank mobile app",
          "Select 'Transfer'",
          "Choose 'To Mobile Wallet'",
          "Select recipient network",
          "Enter amount and complete"
        ],
        note: "Use your mobile banking credentials"
      },
      awash: {
        steps: [
          "Dial *829# on your registered phone",
          "Select 'Mobile Banking'",
          "Choose 'Fund Transfer'",
          "Enter recipient details",
          "Confirm transaction"
        ],
        note: "Available for Awash Bank customers"
      },
      amole: {
        steps: [
          "Open Amole Digital Wallet app",
          "Select 'Pay' or 'Transfer'",
          "Scan QR code or enter details",
          "Enter amount",
          "Authorize payment"
        ],
        note: "Digital wallet transaction"
      },
      stripe: {
        steps: [
          "Enter card details securely",
          "Verify with 3D Secure if prompted",
          "Review payment amount",
          "Complete authentication"
        ],
        note: "Secure international payment"
      },
      paypal: {
        steps: [
          "You will be redirected to PayPal",
          "Log in to your account",
          "Review payment details",
          "Confirm payment"
        ],
        note: "International payment gateway"
      }
    };
    return instructions[method] || { steps: [], note: "Follow on-screen instructions" };
  }
};

const Products = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortOption, setSortOption] = useState("popular");
  const [filterOption, setFilterOption] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [yearRange, setYearRange] = useState({ min: 1900, max: new Date().getFullYear() });
  const [pageRange, setPageRange] = useState({ min: 0, max: 1000 });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [languageFilter, setLanguageFilter] = useState("all");
  const [priceTypeFilter, setPriceTypeFilter] = useState("all");
  const [gradeLevelFilter, setGradeLevelFilter] = useState("all");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  
  // Enhanced payment states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [paymentAction, setPaymentAction] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("telebir");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [userPurchases, setUserPurchases] = useState(new Set());
  const [paymentStep, setPaymentStep] = useState("method");
  const [paymentDetails, setPaymentDetails] = useState({
    phoneNumber: "",
    accountNumber: "",
    pin: "",
    transactionId: ""
  });
  const [exchangeRate, setExchangeRate] = useState(55);
  const [exchangeRateLoading, setExchangeRateLoading] = useState(false);
  
  const navigate = useNavigate();

  const languages = ["English", "Amharic", "Oromo", "Tigrinya", "Somali", "All"];
  const priceTypes = ["All", "Free", "Premium"];
  const gradeLevels = ["All", "Beginner", "Intermediate", "Advanced", "Expert"];

  // Enhanced book tags
  const availableTags = [
    "Bestseller", "New Release", "Award Winning", "Editor's Pick", 
    "Trending", "Classic", "Limited Time", "Popular", "Featured",
    "Ethiopian Author", "Local Content", "Educational", "Research"
  ];

  // Enhanced payment methods with Ethiopian options
  const paymentMethods = [
    {
      id: "telebir",
      name: "Telebir",
      icon: FaMobile,
      description: "Ethio Telecom Mobile Money",
      supportedNetworks: ["Ethio Telecom"],
      type: "mobile",
      shortCode: "*806#",
      popular: true
    },
    {
      id: "cbeBir",
      name: "CBE Birr",
      icon: FaUniversity,
      description: "Commercial Bank of Ethiopia",
      supportedNetworks: ["CBE"],
      type: "bank",
      shortCode: "*889#",
      popular: true
    },
    {
      id: "hellocash",
      name: "HelloCash",
      icon: FaMoneyBillWave,
      description: "HelloCash Mobile Money",
      supportedNetworks: ["HelloCash"],
      type: "mobile",
      shortCode: "*812#"
    },
    {
      id: "dashen",
      name: "Dashen Bank",
      icon: FaUniversity,
      description: "Dashen Mobile Banking",
      supportedNetworks: ["Dashen Bank"],
      type: "bank",
      shortCode: "*809#"
    },
    {
      id: "awash",
      name: "Awash Bank",
      icon: FaUniversity,
      description: "Awash Mobile Banking",
      supportedNetworks: ["Awash Bank"],
      type: "bank",
      shortCode: "*829#"
    },
    {
      id: "amole",
      name: "Amole",
      icon: FaIdCard,
      description: "Amole Digital Wallet",
      supportedNetworks: ["Amole"],
      type: "wallet"
    },
    {
      id: "stripe",
      name: "Credit/Debit Card",
      icon: FaCreditCard,
      description: "International Cards",
      supportedNetworks: ["Visa", "Mastercard", "Amex"],
      type: "card"
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: FaShieldAlt,
      description: "PayPal International",
      supportedNetworks: [],
      type: "digital"
    }
  ];

  // Fetch exchange rate on component mount
  useEffect(() => {
    fetchAllData();
    loadUserPurchases();
    fetchExchangeRate();
  }, []);

  const fetchExchangeRate = async () => {
    setExchangeRateLoading(true);
    try {
      const rate = await exchangeRateService.getExchangeRate();
      setExchangeRate(rate);
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
    } finally {
      setExchangeRateLoading(false);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [booksRes, categoriesRes, subCategoriesRes] = await Promise.all([
        axios.get("http://localhost:8000/api/books/"),
        axios.get("http://localhost:8000/api/category/"),
        axios.get("http://localhost:8000/api/Subcategory/")
      ]);

      setBooks(Array.isArray(booksRes.data) ? booksRes.data : []);
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      setSubCategories(Array.isArray(subCategoriesRes.data) ? subCategoriesRes.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setBooks([]);
      setCategories([]);
      setSubCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPurchases = async () => {
    try {
      const savedPurchases = localStorage.getItem('userBookPurchases');
      if (savedPurchases) {
        setUserPurchases(new Set(JSON.parse(savedPurchases)));
      }
    } catch (error) {
      console.error("Error loading purchases:", error);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return placeholderImg;
    return path.startsWith("http") ? path : `http://localhost:8000${path}`;
  };

  const getPdfUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `http://localhost:8000${path}`;
  };

  // Calculate price in ETB with live exchange rate
  const getPriceInETB = (usdPrice) => {
    return (parseFloat(usdPrice || 0) * exchangeRate).toFixed(2);
  };

  // Check if user has purchased a book
  const hasPurchased = (bookId) => {
    return userPurchases.has(bookId);
  };

  // Handle book reading with payment check
  const handleReadBook = (book) => {
    if (book.is_premium && !hasPurchased(book.id)) {
      setSelectedBook(book);
      setPaymentAction("read");
      setShowPaymentModal(true);
      return;
    }
    
    axios.post(`http://localhost:8000/api/books/${book.id}/increment_views/`);
    navigate(`/book/read/${book.id}`);
  };

  // Handle download with payment check
  const handleDownload = async (book, e) => {
    e.stopPropagation();
    
    if (book.is_premium && !hasPurchased(book.id)) {
      setSelectedBook(book);
      setPaymentAction("download");
      setShowPaymentModal(true);
      return;
    }

    try {
      await axios.post(`http://localhost:8000/api/books/${book.id}/increment_downloads/`);
      const pdfUrl = getPdfUrl(book.pdf_file);
      if (pdfUrl) {
        window.open(pdfUrl, '_blank');
      }
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  // Enhanced category and subcategory handling
  const handleCategoryClick = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubCategoryClick = (subCategoryId) => {
    setSelectedSubCategories(prev => 
      prev.includes(subCategoryId)
        ? prev.filter(id => id !== subCategoryId)
        : [...prev, subCategoryId]
    );
  };

  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleFavorite = (bookId, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(bookId)) {
        newFavorites.delete(bookId);
      } else {
        newFavorites.add(bookId);
      }
      return newFavorites;
    });
  };

  const renderRating = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? 
            <FaStar key={star} className="text-yellow-400 text-xs" /> : 
            <FaRegStar key={star} className="text-gray-300 text-xs" />
        ))}
        <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">({rating})</span>
      </div>
    );
  };

  // Filter and sort books with advanced filters
  const sortedAndFilteredBooks = useMemo(() => {
    const booksArray = Array.isArray(books) ? books : [];
    
    return booksArray
      .filter(book => {
        if (!book) return false;
        
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesSearch = 
            (book.title?.toLowerCase() || '').includes(query) ||
            (book.author?.toLowerCase() || '').includes(query) ||
            (book.description?.toLowerCase() || '').includes(query) ||
            (book.category_name?.toLowerCase() || '').includes(query) ||
            (book.sub_category_name?.toLowerCase() || '').includes(query);
          if (!matchesSearch) return false;
        }
        
        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(book.category)) {
          return false;
        }
        
        // Sub-category filter
        if (selectedSubCategories.length > 0 && !selectedSubCategories.includes(book.sub_category)) {
          return false;
        }
        
        // Rating filter
        const bookRating = book.rating || 0;
        if (ratingFilter > 0 && bookRating < ratingFilter) return false;
        
        // Year filter
        const bookYear = book.published_date ? 
          new Date(book.published_date).getFullYear() : 
          (book.created_at ? new Date(book.created_at).getFullYear() : new Date().getFullYear());
        if (bookYear < yearRange.min || bookYear > yearRange.max) return false;
        
        // Page count filter
        const bookPages = book.page_count || 0;
        if (bookPages < pageRange.min || bookPages > pageRange.max) return false;
        
        // Price filter
        const bookPrice = book.price || 0;
        if (bookPrice < priceRange.min || bookPrice > priceRange.max) return false;
        
        // Language filter
        if (languageFilter !== "all" && book.language !== languageFilter) return false;
        
        // Price type filter
        if (priceTypeFilter === "free" && !book.is_free) return false;
        if (priceTypeFilter === "premium" && !book.is_premium) return false;
        
        // Grade level filter
        if (gradeLevelFilter !== "all" && book.grade_level !== gradeLevelFilter) return false;
        
        // Tags filter
        if (selectedTags.length > 0) {
          const bookTags = Array.isArray(book.tags) ? book.tags : 
                          (typeof book.tags === 'string' ? book.tags.split(',') : []);
          if (!selectedTags.some(tag => bookTags.includes(tag))) {
            return false;
          }
        }
        
        return true;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case "title":
            return (a.title || '').localeCompare(b.title || '');
          case "author":
            return (a.author || '').localeCompare(b.author || '');
          case "newest":
            return new Date(b.created_at || 0) - new Date(a.created_at || 0);
          case "oldest":
            return new Date(a.created_at || 0) - new Date(b.created_at || 0);
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          case "popular":
            return (b.views || 0) - (a.views || 0);
          case "pages":
            return (b.page_count || 0) - (a.page_count || 0);
          case "downloads":
            return (b.downloads || 0) - (a.downloads || 0);
          default:
            return 0;
        }
      });
  }, [
    books, searchQuery, filterOption, sortOption, selectedCategories, 
    selectedSubCategories, ratingFilter, yearRange, pageRange, priceRange, 
    languageFilter, priceTypeFilter, gradeLevelFilter, selectedTags
  ]);

// Enhanced Payment Modal Component
const PaymentModal = () => {
  if (!showPaymentModal || !selectedBook) return null;

  const selectedMethod = paymentMethods.find(method => method.id === paymentMethod);
  const priceInETB = getPriceInETB(selectedBook.price);
  const paymentInstructions = paymentService.getPaymentInstructions(paymentMethod);

  const handleCancelPayment = () => {
    setShowPaymentModal(false);
    setPaymentProcessing(false);
    setPaymentSuccess(false);
    setPaymentStep("method");
    setPaymentDetails({
      phoneNumber: "",
      accountNumber: "",
      pin: "",
      transactionId: ""
    });
  };

  const handlePayNow = async () => {
    if (!selectedBook) return;
    
    setPaymentProcessing(true);
    
    try {
      const paymentData = {
        book_id: selectedBook.id,
        book_title: selectedBook.title,
        payment_method: paymentMethod,
        amount_usd: selectedBook.price,
        amount_etb: priceInETB,
        phone_number: paymentDetails.phoneNumber,
        account_number: paymentDetails.accountNumber,
        transaction_id: paymentDetails.transactionId || `TXN${Date.now()}`,
        exchange_rate: exchangeRate
      };

      const result = await paymentService.processPayment(paymentData);
      
      if (result.success) {
        setPaymentSuccess(true);
        setPaymentStep("success");
        
        const newPurchases = new Set([...userPurchases, selectedBook.id]);
        setUserPurchases(newPurchases);
        localStorage.setItem('userBookPurchases', JSON.stringify([...newPurchases]));
        
        setTimeout(() => {
          setShowPaymentModal(false);
          setPaymentProcessing(false);
          setPaymentSuccess(false);
          setPaymentStep("method");
          setPaymentDetails({
            phoneNumber: "",
            accountNumber: "",
            pin: "",
            transactionId: ""
          });
          
          if (paymentAction === "read") {
            axios.post(`http://localhost:8000/api/books/${selectedBook.id}/increment_views/`);
            navigate(`/book/read/${selectedBook.id}`);
          } else if (paymentAction === "download") {
            const pdfUrl = getPdfUrl(selectedBook.pdf_file);
            if (pdfUrl) {
              window.open(pdfUrl, '_blank');
            }
            axios.post(`http://localhost:8000/api/books/${selectedBook.id}/increment_downloads/`);
          }
        }, 3000);
      } else {
        throw new Error(result.message || 'Payment failed');
      }
      
    } catch (error) {
      console.error("Payment error:", error);
      alert(`Payment failed: ${error.message}`);
      setPaymentProcessing(false);
    }
  };

  const renderPaymentStep = () => {
    switch (paymentStep) {
      case "method":
        return (
          <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCrown className="text-2xl text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Premium Book Access
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Purchase to {paymentAction} this premium book
              </p>
            </div>

            {/* Book Info */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-4 mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src={getImageUrl(selectedBook.cover_url || selectedBook.cover_image)}
                  alt={selectedBook.title}
                  className="w-16 h-20 object-cover rounded-xl shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = placeholderImg;
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 dark:text-white text-base sm:text-lg line-clamp-2">
                    {selectedBook.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    by {selectedBook.author}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-1">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {selectedBook.rating || 4.5}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                        ${selectedBook.price || 9.99}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        ≈ {priceInETB} ETB
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exchange Rate Info */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Current Exchange Rate:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800 dark:text-white">1 USD = {exchangeRate} ETB</span>
                  <button 
                    onClick={fetchExchangeRate}
                    disabled={exchangeRateLoading}
                    className="p-1 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
                  >
                    <FaSync className={`text-green-500 text-xs ${exchangeRateLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Select Payment Method
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      paymentMethod === method.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    } ${method.popular ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        paymentMethod === method.id 
                          ? "bg-blue-500 text-white" 
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}>
                        {React.createElement(method.icon, { className: "text-sm sm:text-base" })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <div className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                            {method.name}
                          </div>
                          {method.popular && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {method.description}
                        </div>
                      </div>
                      {paymentMethod === method.id && (
                        <FaCheck className="text-blue-500 text-sm flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleCancelPayment}
                className="flex-1 px-4 sm:px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => setPaymentStep("details")}
                className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl font-semibold transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <span>Continue to Pay</span>
              </button>
            </div>
          </div>
        );

      case "details":
        return (
          <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Payment Details
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Complete your payment with {selectedMethod?.name}
              </p>
            </div>

            {/* Payment Instructions */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-4 mb-6">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                <FaPhone className="mr-2 text-blue-500" />
                Payment Instructions
              </h4>
              
              <div className="space-y-3">
                {paymentInstructions.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{step}</p>
                  </div>
                ))}
                {paymentInstructions.note && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mt-3">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center">
                      <FaExclamationTriangle className="mr-2" />
                      {paymentInstructions.note}
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Form */}
              <div className="mt-4 space-y-3">
                {(selectedMethod?.type === 'mobile' || selectedMethod?.type === 'bank') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="09XXXXXXXX"
                      value={paymentDetails.phoneNumber}
                      onChange={(e) => setPaymentDetails(prev => ({...prev, phoneNumber: e.target.value}))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Transaction ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter transaction ID if available"
                    value={paymentDetails.transactionId}
                    onChange={(e) => setPaymentDetails(prev => ({...prev, transactionId: e.target.value}))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                <div className="text-right">
                  <div className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                    ${selectedBook.price}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    ≈ {priceInETB} ETB
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-500 text-center">
                Exchange rate: 1 USD = {exchangeRate} ETB
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-3 mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between text-sm space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <FaLock className="text-green-500" />
                  <span>Secure SSL encryption</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <FaShieldAlt className="text-blue-500" />
                  <span>Payment protected</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setPaymentStep("method")}
                disabled={paymentProcessing}
                className="flex-1 px-4 sm:px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300 disabled:opacity-50 text-sm sm:text-base"
              >
                Back
              </button>
              <button
                onClick={handlePayNow}
                disabled={paymentProcessing || (selectedMethod?.type !== 'card' && !paymentDetails.phoneNumber)}
                className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl font-semibold transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                {paymentProcessing ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FaCreditCard className="text-sm" />
                    <span>Pay Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="p-6 sm:p-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheck className="text-2xl sm:text-3xl text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
              Thank you for your purchase
            </p>
            <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You now have full access to <strong>"{selectedBook.title}"</strong>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Transaction ID: {paymentDetails.transactionId || `TXN${Date.now()}`}
              </p>
            </div>
            <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
              Redirecting you to the book...
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-500 scale-100 max-h-[90vh] overflow-y-auto">
        {renderPaymentStep()}
      </div>
    </div>
  );
};

  // Enhanced Wide Grid View Component with Wider Design
  const BookCardGrid = ({ book, featured = false }) => {
    const isFavorite = favorites.has(book.id);
    const isPurchased = hasPurchased(book.id);
    const priceInETB = getPriceInETB(book.price);
    
    return (
      <div
        onClick={() => handleReadBook(book)}
        className="cursor-pointer rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-300 dark:border-gray-600 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:scale-105 group relative w-full"
      >
        {/* Premium Badge */}
        {book.is_premium && (
          <div className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg ${
            isPurchased 
              ? 'bg-gradient-to-r from-green-400 to-teal-500 text-white' 
              : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
          }`}>
            <FaCrown className="mr-1" />
            {isPurchased ? 'PURCHASED' : 'PREMIUM'}
          </div>
        )}

        {/* Free Badge */}
        {book.is_free && (
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-green-400 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
            FREE
          </div>
        )}

        <div className={`w-full h-64 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-700 dark:to-gray-800 overflow-hidden relative`}>
          <img
            src={getImageUrl(book.cover_url || book.cover_image)}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderImg;
            }}
          />
          
          {/* Overlay with quick actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReadBook(book);
              }}
              className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
            >
              <FaBookOpen className="text-xl" />
            </button>
            {book.pdf_file && (
              <button
                onClick={(e) => handleDownload(book, e)}
                className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
              >
                <FaDownload className="text-xl" />
              </button>
            )}
            <button
              onClick={(e) => toggleFavorite(book.id, e)}
              className={`bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110 ${
                isFavorite ? 'text-red-500' : 'text-white'
              }`}
            >
              <FaHeart className="text-xl" />
            </button>
          </div>

          {/* Price Tag */}
          {book.is_premium && !isPurchased && (
            <div className="absolute bottom-3 left-3 bg-black/80 text-white px-3 py-2 rounded-xl backdrop-blur-sm">
              <div className="text-sm font-bold">${book.price}</div>
              <div className="text-xs">≈ {priceInETB} ETB</div>
            </div>
          )}

          {/* Tags */}
          {book.tags && book.tags.length > 0 && (
            <div className="absolute top-3 right-3 flex flex-col space-y-1">
              {book.tags.slice(0, 2).map((tag, index) => (
                <span 
                  key={index}
                  className="bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-gray-800 dark:text-white line-clamp-2 text-lg flex-1 mr-2">
              {book.title || "Untitled"}
            </h3>
            {book.rating > 0 && (
              <div className="flex items-center bg-white dark:bg-gray-700 px-2 py-1 rounded-full shadow-sm flex-shrink-0">
                <FaStar className="text-yellow-400 text-sm" />
                <span className="text-sm font-bold ml-1 text-gray-700 dark:text-gray-300">
                  {book.rating}
                </span>
              </div>
            )}
          </div>
          
          {book.author && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-1 flex items-center">
              <FaUser className="mr-2" />
              by {book.author}
            </p>
          )}

          {/* Categories */}
       

          {book.description && (
            <p className="text-sm text-gray-500 dark:text-gray-500 line-clamp-2 mb-4">
              {book.description}
            </p>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
              {book.page_count > 0 && (
                <span className="flex items-center">
                  <FaBook className="mr-1" />
                  {book.page_count}p
                </span>
              )}
              {book.views > 0 && (
                <span className="flex items-center">
                  <FaEye className="mr-1" />
                  {book.views}
                </span>
              )}
              {book.downloads > 0 && (
                <span className="flex items-center">
                  <FaDownload className="mr-1" />
                  {book.downloads}
                </span>
              )}
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReadBook(book);
              }}
              className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex-shrink-0 ${
                book.is_premium && !isPurchased
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                  : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white'
              }`}
            >
              {book.is_premium && !isPurchased ? (
                <div className="flex items-center space-x-2">
                  <FaCreditCard className="text-sm" />
                  <span>Buy Now</span>
                </div>
              ) : (
                'Read Now'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Wide List View Component
  const BookCardList = ({ book }) => {
    const isFavorite = favorites.has(book.id);
    const isPurchased = hasPurchased(book.id);
    const priceInETB = getPriceInETB(book.price);
    
    return (
      <div
        onClick={() => handleReadBook(book)}
        className="cursor-pointer rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-300 dark:border-gray-600 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:scale-[1.02] group w-full"
      >
        <div className="flex flex-col md:flex-row">
          {/* Book Cover - Wider */}
          <div className="md:w-72 lg:w-80 xl:w-96 h-64 md:h-auto bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-700 dark:to-gray-800 overflow-hidden relative flex-shrink-0">
            <img
              src={getImageUrl(book.cover_url || book.cover_image)}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholderImg;
              }}
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col space-y-2">
              {book.is_premium && (
                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg ${
                  isPurchased 
                    ? 'bg-gradient-to-r from-green-400 to-teal-500 text-white' 
                    : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                }`}>
                  <FaCrown className="mr-1" />
                  {isPurchased ? 'PURCHASED' : 'PREMIUM'}
                </div>
              )}
              {book.is_free && (
                <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                  FREE
                </div>
              )}
            </div>

            {/* Price Tag */}
            {book.is_premium && !isPurchased && (
              <div className="absolute bottom-3 left-3 bg-black/80 text-white px-3 py-2 rounded-xl backdrop-blur-sm">
                <div className="text-base font-bold">${book.price}</div>
                <div className="text-sm">≈ {priceInETB} ETB</div>
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={(e) => toggleFavorite(book.id, e)}
              className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                isFavorite 
                  ? 'bg-red-500/20 text-red-500' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <FaHeart className="text-sm" />
            </button>
          </div>

          {/* Book Details - Wider */}
          <div className="flex-1 p-6 md:p-8">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4 space-y-2 sm:space-y-0">
                <div className="flex-1 mr-4">
                  <h3 className="font-bold text-xl md:text-2xl lg:text-3xl text-gray-800 dark:text-white mb-3 line-clamp-2">
                    {book.title || "Untitled"}
                  </h3>
                  <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-4 flex items-center">
                    <FaUser className="mr-2" />
                    by {book.author}
                  </p>
                </div>
                {book.rating > 0 && (
                  <div className="flex items-center bg-white dark:bg-gray-700 px-3 py-2 rounded-xl shadow-lg flex-shrink-0">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                      {book.rating}
                    </span>
                  </div>
                )}
              </div>

              {/* Categories and Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {book.category_name && (
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-full shadow-sm">
                    {book.category_name}
                  </span>
                )}
                {book.sub_category_name && (
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm rounded-full shadow-sm">
                    {book.sub_category_name}
                  </span>
                )}
                {book.grade_level && (
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                    book.grade_level === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    book.grade_level === 'intermediate' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    book.grade_level === 'advanced' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {book.grade_level?.charAt(0).toUpperCase() + book.grade_level?.slice(1)}
                  </span>
                )}
              </div>

              {/* Description */}
              {book.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1 text-base md:text-lg">
                  {book.description}
                </p>
              )}

              {/* Stats and Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-4 text-base lg:text-lg text-gray-500 dark:text-gray-400 flex-wrap">
                  {book.page_count > 0 && (
                    <span className="flex items-center">
                      <FaBook className="mr-1" />
                      {book.page_count} pages
                    </span>
                  )}
                  {book.views > 0 && (
                    <span className="flex items-center">
                      <FaEye className="mr-1" />
                      {book.views} views
                    </span>
                  )}
                  {book.downloads > 0 && (
                    <span className="flex items-center">
                      <FaDownload className="mr-1" />
                      {book.downloads} downloads
                    </span>
                  )}
                  {book.published_date && (
                    <span className="flex items-center">
                      <FaCalendar className="mr-1" />
                      {new Date(book.published_date).getFullYear()}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3 flex-wrap">
                  {book.pdf_file && (
                    <button
                      onClick={(e) => handleDownload(book, e)}
                      className={`flex items-center px-4 py-3 rounded-xl text-base lg:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                        book.is_premium && !isPurchased
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                      }`}
                    >
                      <FaDownload className="mr-2" />
                      {book.is_premium && !isPurchased ? 'Buy & Download' : 'Download'}
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReadBook(book);
                    }}
                    className={`flex items-center px-4 py-3 rounded-xl text-base lg:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      book.is_premium && !isPurchased
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                        : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white'
                    }`}
                  >
                    <FaBookOpen className="mr-2" />
                    {book.is_premium && !isPurchased ? 'Buy & Read' : 'Read Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Sidebar Component with Better Category Handling
  const EnhancedSidebar = () => {
    return (
      <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 sm:p-6 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <FaFilter className="mr-2" />
            Filters & Categories
          </h2>
        </div>

        {/* Price Type Filter */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Price Type</h3>
          <div className="space-y-2">
            {priceTypes.map(type => (
              <label key={type} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="priceType"
                  value={type.toLowerCase()}
                  checked={priceTypeFilter === type.toLowerCase()}
                  onChange={(e) => setPriceTypeFilter(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Grade Level Filter */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Grade Level</h3>
          <select 
            value={gradeLevelFilter}
            onChange={(e) => setGradeLevelFilter(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {gradeLevels.map(level => (
              <option key={level} value={level.toLowerCase()}>{level}</option>
            ))}
          </select>
        </div>

        {/* Enhanced Categories from Database */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Categories</h3>
          <div className="space-y-2">
            {Array.isArray(categories) && categories.map((category) => {
              const categorySubCategories = Array.isArray(subCategories) 
                ? subCategories.filter(sub => sub.category === category.id)
                : [];
              const isExpanded = expandedCategories[category.id];
              const isSelected = selectedCategories.includes(category.id);

              return (
                <div key={category.id} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                    <label className="flex items-center space-x-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCategoryClick(category.id)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                        {category.name}
                      </span>
                    </label>
                    
                    {categorySubCategories.length > 0 && (
                      <button
                        onClick={() => toggleCategoryExpand(category.id)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-500 rounded transition-colors"
                      >
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    )}
                  </div>
                  
                  {isExpanded && categorySubCategories.length > 0 && (
                    <div className="p-3 bg-white dark:bg-gray-800 space-y-2 border-t border-gray-200 dark:border-gray-600">
                      {categorySubCategories.map(subCategory => (
                        <label key={subCategory.id} className="flex items-center space-x-3 cursor-pointer ml-4">
                          <input
                            type="checkbox"
                            checked={selectedSubCategories.includes(subCategory.id)}
                            onChange={() => handleSubCategoryClick(subCategory.id)}
                            className="text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {subCategory.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tags Filter */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTags(prev => 
                    prev.includes(tag) 
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  );
                }}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  selectedTags.includes(tag)
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Minimum Rating</h3>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRatingFilter(star)}
                className={`text-xl sm:text-2xl transition-transform duration-300 hover:scale-110 ${
                  star <= ratingFilter ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                <FaStar />
              </button>
            ))}
            {ratingFilter > 0 && (
              <button
                onClick={() => setRatingFilter(0)}
                className="ml-2 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Clear All Filters */}
        <button
          onClick={clearAllFilters}
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
        >
          Clear All Filters
        </button>
      </div>
    );
  };

  // Loading skeleton
  const BookCardSkeleton = ({ isList = false }) => (
    isList ? (
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-pulse w-full">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-72 lg:w-80 xl:w-96 h-64 md:h-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700"></div>
          <div className="flex-1 p-8">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-3 w-3/4"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-4 w-1/2"></div>
            <div className="flex space-x-2 mb-4">
              <div className="h-7 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
              <div className="h-7 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
            </div>
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-3 w-5/6"></div>
            <div className="flex justify-between mt-4">
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
              <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded w-28"></div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-pulse w-full">
        <div className="w-full h-64 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700"></div>
        <div className="p-6">
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4 w-3/4"></div>
          <div className="flex justify-between">
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
          </div>
        </div>
      </div>
    )
  );

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedTags([]);
    setRatingFilter(0);
    setYearRange({ min: 1900, max: new Date().getFullYear() });
    setPageRange({ min: 0, max: 1000 });
    setPriceRange({ min: 0, max: 1000 });
    setLanguageFilter("all");
    setPriceTypeFilter("all");
    setGradeLevelFilter("all");
    setFilterOption("all");
    setSearchQuery("");
  };

  const activeFiltersCount = [
    selectedCategories.length > 0,
    selectedSubCategories.length > 0,
    selectedTags.length > 0,
    ratingFilter > 0,
    yearRange.min > 1900 || yearRange.max < new Date().getFullYear(),
    pageRange.min > 0 || pageRange.max < 1000,
    priceRange.min > 0 || priceRange.max < 1000,
    languageFilter !== "all",
    priceTypeFilter !== "all",
    gradeLevelFilter !== "all",
    filterOption !== "all",
    searchQuery !== ""
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* Payment Modal */}
      <PaymentModal />

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition duration-300 shadow-lg transform hover:scale-105"
          >
            <FaFilter className="text-sm" />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>
          
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 shadow-inner">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === "grid" 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                    : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500"
                }`}
              >
                <FaTh className="text-sm" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === "list" 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                    : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500"
                }`}
              >
                <FaList className="text-sm" />
              </button>
            </div>

            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 sm:w-40 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full mx-auto">
        {/* Enhanced Sidebar */}
        <div className={`
          ${isSidebarOpen ? 'fixed inset-0 z-40 block' : 'hidden'} 
          lg:block lg:static lg:w-72 xl:w-80 flex-shrink-0
        `}>
          <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] overflow-y-auto shadow-2xl">
            <EnhancedSidebar />
          </div>
        </div>

        {/* Main content - Wider */}
        <div className="flex-1 p-4 lg:p-8 w-full max-w-full">
          {/* Enhanced Search and Controls Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 shadow-inner">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 sm:p-3 rounded-xl transition-all duration-300 ${
                    viewMode === "grid" 
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                      : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500"
                  }`}
                >
                  <FaTh className="text-base sm:text-lg" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 sm:p-3 rounded-xl transition-all duration-300 ${
                    viewMode === "list" 
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                      : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500"
                  }`}
                >
                  <FaList className="text-base sm:text-lg" />
                </button>
              </div>

              {/* Enhanced Search Bar */}
              <div className="relative w-full sm:w-auto">
                <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books, authors, descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-80 lg:w-96 xl:w-120 shadow-inner text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              <div className="flex items-center space-x-2">
                <FaSort className="text-gray-500" />
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-xl px-3 sm:px-4 py-2 sm:py-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-inner"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                  <option value="title">Sort by Title</option>
                  <option value="author">Sort by Author</option>
                  <option value="pages">Most Pages</option>
                  <option value="downloads">Most Downloads</option>
                </select>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-inner">
                <span className="font-semibold">{sortedAndFilteredBooks.length}</span> of <span className="font-semibold">{books.length}</span> books
                {activeFiltersCount > 0 && (
                  <span className="ml-2 text-blue-600 dark:text-blue-400">
                    • {activeFiltersCount} active filters
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className={`gap-6 sm:gap-8 md:gap-10 ${
              viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "space-y-6 sm:space-y-8"
            }`}>
              {[...Array(8)].map((_, index) => (
                <BookCardSkeleton key={index} isList={viewMode === "list"} />
              ))}
            </div>
          ) : (
            <>
              {/* Search Results Header */}
              {searchQuery && (
                <div className="mb-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Search Results for "{searchQuery}"
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    Found {sortedAndFilteredBooks.length} books matching your search
                  </p>
                </div>
              )}

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="mb-6 flex flex-wrap gap-2 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 mr-2">
                    Active Filters:
                  </span>
                  {selectedCategories.map((categoryId, index) => {
                    const category = categories.find(c => c.id === categoryId);
                    return category ? (
                      <span key={index} className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs shadow-lg">
                        {category.name}
                        <button
                          onClick={() => setSelectedCategories(selectedCategories.filter(id => id !== categoryId))}
                          className="ml-2 hover:text-blue-200"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </span>
                    ) : null;
                  })}
                  {selectedSubCategories.map((subCategoryId, index) => {
                    const subCategory = subCategories.find(sc => sc.id === subCategoryId);
                    return subCategory ? (
                      <span key={index} className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full text-xs shadow-lg">
                        {subCategory.name}
                        <button
                          onClick={() => setSelectedSubCategories(selectedSubCategories.filter(id => id !== subCategoryId))}
                          className="ml-2 hover:text-green-200"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </span>
                    ) : null;
                  })}
                  {selectedTags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs shadow-lg">
                      {tag}
                      <button
                        onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                        className="ml-2 hover:text-orange-200"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  ))}
                  {ratingFilter > 0 && (
                    <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-xs shadow-lg">
                      Rating: {ratingFilter}+
                      <button
                        onClick={() => setRatingFilter(0)}
                        className="ml-2 hover:text-yellow-200"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Books Display */}
              <div>
                {sortedAndFilteredBooks.length === 0 ? (
                  <div className="text-center py-12 sm:py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
                    <div className="text-gray-400 dark:text-gray-600 text-4xl sm:text-6xl mb-4">🔍</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      {searchQuery || activeFiltersCount > 0 ? "No books found" : "No books available"}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto mb-6 text-sm sm:text-base">
                      {searchQuery || activeFiltersCount > 0 
                        ? "Try adjusting your search terms or filters to find what you're looking for."
                        : "Check back later for new additions to our collection."
                      }
                    </p>
                    {(searchQuery || activeFiltersCount > 0) && (
                      <button
                        onClick={clearAllFilters}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={`${
                    viewMode === "grid" 
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10" 
                      : "space-y-6 sm:space-y-8"
                  }`}>
                    {sortedAndFilteredBooks.map((book) => (
                      viewMode === "grid" ? (
                        <BookCardGrid key={book.id} book={book} />
                      ) : (
                        <BookCardList key={book.id} book={book} />
                      )
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Products;