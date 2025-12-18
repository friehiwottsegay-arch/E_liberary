import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaArrowLeft, 
  FaStar, 
  FaRegStar, 
  FaHeart, 
  FaShare,
  FaShoppingCart,
  FaCreditCard,
  FaDownload,
  FaEye,
  FaCalendar,
  FaUser,
  FaBook,
  FaLanguage,
  FaGlobe,
  FaCheck,
  FaCrown,
  FaGem,
  FaLock,
  FaShieldAlt,
  FaPhone,
  FaMobile,
  FaUniversity,
  FaMoneyBillWave,
  FaIdCard,
  FaExclamationTriangle,
  FaSync,
  FaTag,
  FaAward,
  FaUsers,
  FaFileAlt,
  FaLockOpen,
  FaHistory,
  FaShoppingBag,
  FaClock,
  FaShippingFast
} from "react-icons/fa";
import BookTypeSelector from "../BookTypeSelector";

const BookSell = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [userPurchases, setUserPurchases] = useState(new Set());
  const [exchangeRate, setExchangeRate] = useState(55);
  const [exchangeRateLoading, setExchangeRateLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedBookType, setSelectedBookType] = useState(null);
  
  // Payment states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("telebir");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentStep, setPaymentStep] = useState("method");
  const [paymentDetails, setPaymentDetails] = useState({
    phoneNumber: "",
    transactionId: ""
  });

  useEffect(() => {
    fetchBookData();
    loadUserData();
    fetchExchangeRate();
  }, [id]);

  const fetchExchangeRate = async () => {
    setExchangeRateLoading(true);
    try {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      setExchangeRate(response.data.rates.ETB || 55);
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
    } finally {
      setExchangeRateLoading(false);
    }
  };

  const fetchBookData = async () => {
    setLoading(true);
    try {
      // Get all books from the API
      const response = await axios.get(`http://127.0.0.1:8000/api/books/`);
      
      // Find the specific book by ID
      const bookData = response.data.find(book => book.id === parseInt(id));
      
      if (!bookData) {
        throw new Error(`Book with ID ${id} not found`);
      }
      
      setBook(bookData);
      
      // Find related books from the same category
      const relatedBooks = response.data.filter(book =>
        book.category === bookData.category &&
        book.id !== parseInt(id) &&
        book.is_active
      ).slice(0, 4); // Limit to 4 related books
      
      setRelatedBooks(relatedBooks);
    } catch (error) {
      console.error("Error fetching book data:", error);
      setBook(null); // Set to null to trigger "Book Not Found" state
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const savedFavorites = localStorage.getItem('marketFavorites');
      const savedPurchases = localStorage.getItem('marketPurchases');
      
      if (savedFavorites) {
        const favoritesSet = new Set(JSON.parse(savedFavorites));
        setFavorites(favoritesSet);
        setIsFavorite(favoritesSet.has(parseInt(id)));
      }
      
      if (savedPurchases) {
        setUserPurchases(new Set(JSON.parse(savedPurchases)));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNmNGY2ZmYiLz48dGV4dCB4PSIxNTAiIHk9IjIwMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJvb2s8L3RleHQ+PC9zdmc+';
    return path.startsWith("http") ? path : `http://127.0.0.1:8000${path}`;
  };

  const getPriceInETB = (usdPrice) => {
    return (parseFloat(usdPrice || 0) * exchangeRate).toFixed(2);
  };

  const hasPurchased = () => {
    return userPurchases.has(parseInt(id));
  };

  const toggleFavorite = () => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(parseInt(id))) {
      newFavorites.delete(parseInt(id));
      setIsFavorite(false);
    } else {
      newFavorites.add(parseInt(id));
      setIsFavorite(true);
    }
    setFavorites(newFavorites);
    localStorage.setItem('marketFavorites', JSON.stringify([...newFavorites]));
  };

  const addToCart = () => {
    const cart = new Set();
    cart.add(parseInt(id));
    localStorage.setItem('marketCart', JSON.stringify([...cart]));
    alert("Book added to cart!");
  };

  const handleBookTypeSelect = (typeInfo) => {
    setSelectedBookType(typeInfo);
    console.log("Selected book type:", typeInfo);
  };

  const handleBuyNow = () => {
    if (hasPurchased()) {
      alert("You already own this book!");
      return;
    }
    if (!selectedBookType) {
      alert("Please select a book type first!");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayNow = async () => {
    if (!book || !selectedBookType) return;
    
    setPaymentProcessing(true);
    
    try {
      // Handle Chapa payments specially
      if (paymentMethod === 'chapa') {
        // Ethiopian Test Mode Chapa Payment
        const paymentData = {
          book_id: book.id,
          payment_type: selectedBookType.bookType === 'hard' ? 'purchase_hard' : 'purchase_soft',
          amount: getPriceInETB(selectedBookType.price),
          currency: 'ETB',
          customer_email: 'test.ethiopia@example.com',
          customer_name: 'Ethiopian Test Customer',
          description: `Ethiopian Test Purchase: ${book.title} (${selectedBookType.bookType})`,
          phone_number: paymentDetails.phoneNumber || '+251911234567',
          exchange_rate: exchangeRate,
          test_mode: true,
          ethiopian_payment: true
        };

        const response = await axios.post('http://127.0.0.1:8000/api/payments/chapa/', paymentData);
        
        if (response.data.success) {
          // Check if test mode response
          if (response.data.test_mode) {
            // Ethiopian test mode - simulate payment completion
            setPaymentSuccess(true);
            setPaymentStep("success");
            
            const newPurchases = new Set([...userPurchases, book.id]);
            setUserPurchases(newPurchases);
            localStorage.setItem('marketPurchases', JSON.stringify([...newPurchases]));
            
            setTimeout(() => {
              setShowPaymentModal(false);
              setPaymentProcessing(false);
              setPaymentSuccess(false);
              setPaymentStep("method");
              setPaymentDetails({ phoneNumber: "", transactionId: "" });
            }, 3000);
          } else {
            // Real mode - redirect to Chapa
            // Store payment info for success page
            localStorage.setItem('lastChapaPayment', JSON.stringify({
              tx_ref: response.data.data.tx_ref,
              amount: response.data.data.amount,
              currency: response.data.data.currency,
              book_id: book.id,
              book_title: book.title,
              book_type: selectedBookType.bookType
            }));

            // Redirect to Chapa checkout
            window.location.href = response.data.data.checkout_url;
          }
        } else {
          throw new Error(response.data.message || 'Chapa payment failed');
        }
      } else if (paymentMethod === 'telebir' || paymentMethod === 'cbe_bir' || paymentMethod === 'hellocash') {
        // Ethiopian mobile money test payments
        const paymentData = {
          book_id: book.id,
          payment_type: selectedBookType.bookType === 'hard' ? 'purchase_hard' : 'purchase_soft',
          payment_method: paymentMethod,
          phone_number: paymentDetails.phoneNumber,
          transaction_id: paymentDetails.transactionId || `ET${Date.now()}`,
          exchange_rate: exchangeRate,
          test_mode: true,
          ethiopian_payment: true,
          currency: 'ETB'
        };

        // Add rental duration if it's a rental
        if (selectedBookType.bookType === 'rent') {
          paymentData.payment_type = 'rental';
          paymentData.rental_duration_weeks = selectedBookType.duration || 1;
        }
        
        const response = await axios.post('http://127.0.0.1:8000/api/enhanced-payments/process-payment/', paymentData);
        
        if (response.data.success) {
          setPaymentSuccess(true);
          setPaymentStep("success");
          
          const newPurchases = new Set([...userPurchases, book.id]);
          setUserPurchases(newPurchases);
          localStorage.setItem('marketPurchases', JSON.stringify([...newPurchases]));
          
          setTimeout(() => {
            setShowPaymentModal(false);
            setPaymentProcessing(false);
            setPaymentSuccess(false);
            setPaymentStep("method");
            setPaymentDetails({ phoneNumber: "", transactionId: "" });
          }, 3000);
        } else {
          throw new Error(response.data.message || 'Ethiopian payment failed');
        }
      } else {
        // Handle other payment methods
        const paymentData = {
          book_id: book.id,
          payment_type: selectedBookType.bookType === 'hard' ? 'purchase_hard' : 'purchase_soft',
          payment_method: paymentMethod,
          phone_number: paymentDetails.phoneNumber,
          transaction_id: paymentDetails.transactionId || `TXN${Date.now()}`,
          exchange_rate: exchangeRate
        };

        // Add rental duration if it's a rental
        if (selectedBookType.bookType === 'rent') {
          paymentData.payment_type = 'rental';
          paymentData.rental_duration_weeks = selectedBookType.duration || 1;
        }
        
        const response = await axios.post('http://127.0.0.1:8000/api/enhanced-payments/process-payment/', paymentData);
        
        if (response.data.success) {
          setPaymentSuccess(true);
          setPaymentStep("success");
          
          const newPurchases = new Set([...userPurchases, book.id]);
          setUserPurchases(newPurchases);
          localStorage.setItem('marketPurchases', JSON.stringify([...newPurchases]));
          
          setTimeout(() => {
            setShowPaymentModal(false);
            setPaymentProcessing(false);
            setPaymentSuccess(false);
            setPaymentStep("method");
            setPaymentDetails({ phoneNumber: "", transactionId: "" });
          }, 3000);
        } else {
          throw new Error(response.data.message || 'Payment failed');
        }
      }
      
    } catch (error) {
      console.error("Payment error:", error);
      alert(`Payment failed: ${error.message}`);
      setPaymentProcessing(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? 
            <FaStar key={star} className="text-yellow-400 text-lg" /> : 
            <FaRegStar key={star} className="text-gray-300 text-lg" />
        ))}
      </div>
    );
  };

  const paymentMethods = [
    {
      id: "chapa",
      name: "Chapa (ET Test)",
      icon: FaCreditCard,
      description: "Chapa Payment Gateway - Ethiopian Test Mode",
      type: "gateway",
      popular: true,
      isTestMode: true,
      ethiopianOnly: true
    },
    {
      id: "chapa_real",
      name: "Chapa (Real)",
      icon: FaCreditCard,
      description: "Chapa Payment Gateway - Production",
      type: "gateway",
      popular: false,
      ethiopianOnly: true
    },
    {
      id: "telebir",
      name: "Telebir (ET)",
      icon: FaMobile,
      description: "Ethio Telecom Mobile Money - Test",
      type: "mobile",
      popular: true,
      isTestMode: true,
      ethiopianOnly: true
    },
    {
      id: "cbe_bir",
      name: "CBE Birr (ET)",
      icon: FaUniversity,
      description: "Commercial Bank of Ethiopia - Test",
      type: "bank",
      popular: true,
      isTestMode: true,
      ethiopianOnly: true
    },
    {
      id: "hellocash",
      name: "HelloCash (ET)",
      icon: FaMoneyBillWave,
      description: "Ethio Telecom HelloCash - Test",
      type: "mobile",
      popular: false,
      isTestMode: true,
      ethiopianOnly: true
    },
    {
      id: "stripe",
      name: "Credit/Debit Card",
      icon: FaCreditCard,
      description: "International Cards",
      type: "card"
    }
  ];

  const selectedMethod = paymentMethods.find(method => method.id === paymentMethod);
  const priceInETB = selectedBookType ? getPriceInETB(selectedBookType.price) : "0.00";
  const displayPrice = selectedBookType ? `$${selectedBookType.price} (≈ ${priceInETB} ETB)` : "Select format to see price";

  // Customer Reviews Component
  const CustomerReviews = ({ book }) => {
    // Sample reviews data - in real app, this would come from API
    const reviews = [
      {
        id: 1,
        user: "John D.",
        rating: 5,
        date: "2024-01-15",
        comment: "Excellent book! Very detailed and well-written. Highly recommend for anyone interested in this topic.",
        helpful: 12,
        avatar: "👨‍💼"
      },
      {
        id: 2,
        user: "Sarah M.",
        rating: 4,
        date: "2024-01-10",
        comment: "Great content with practical examples. A bit expensive but worth the investment.",
        helpful: 8,
        avatar: "👩‍🎓"
      },
      {
        id: 3,
        user: "Michael R.",
        rating: 5,
        date: "2024-01-08",
        comment: "This book changed my perspective completely. The author explains complex topics in simple terms.",
        helpful: 15,
        avatar: "👨‍🔬"
      }
    ];

    const renderStars = (rating) => {
      return (
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            star <= rating ? 
              <FaStar key={star} className="text-yellow-400 text-sm" /> : 
              <FaRegStar key={star} className="text-gray-300 text-sm" />
          ))}
        </div>
      );
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <FaUsers className="mr-3 text-blue-500" />
          Customer Reviews ({reviews.length})
        </h3>
        
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 dark:border-gray-600 pb-6 last:border-b-0">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                  {review.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">{review.user}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{review.comment}</p>
                  <div className="flex items-center space-x-4">
                    <button className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                      Helpful ({review.helpful})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Book Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The book you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/market')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Back to Market
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-500 scale-100 max-h-[90vh] overflow-y-auto">
            
            {paymentStep === "method" && (
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCrown className="text-2xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    Purchase Book
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Buy "{book.title}" now ({selectedBookType?.bookType})
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-4 mb-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={getImageUrl(book.cover_url || book.cover_image)}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded-xl shadow-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 dark:text-white line-clamp-2">
                        {book.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        by {book.author}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xl font-bold text-green-600 dark:text-green-400">
                          ${selectedBookType?.price}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          ≈ {priceInETB} ETB
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Select Payment Method
                  </h4>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          paymentMethod === method.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            paymentMethod === method.id
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600"
                          }`}>
                            {React.createElement(method.icon, { className: "text-lg" })}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-gray-800 dark:text-white">
                                {method.name}
                              </span>
                              {method.popular && (
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                  Popular
                                </span>
                              )}
                              {method.isTestMode && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                                  🇪🇹 Test Mode
                                </span>
                              )}
                              {method.ethiopianOnly && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  Ethiopia
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setPaymentStep("details")}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-teal-600"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {paymentStep === "details" && (
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    Payment Details
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Complete payment with {selectedMethod?.name}
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  {selectedMethod?.id === 'chapa' ? (
                    <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <FaCreditCard className="text-blue-500" />
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200">Chapa Payment</h4>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600 dark:text-green-400">🇪🇹</span>
                          <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                            Ethiopian Test Mode Active
                          </span>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                          Simulated payment for testing Ethiopian payment methods
                        </p>
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-300 mb-3">
                        {paymentMethod === 'chapa' ?
                          'Test mode: Simulated payment with Ethiopian methods' :
                          'Real payment: Redirect to Chapa production'
                        }
                      </p>
                      <div className="bg-white dark:bg-blue-800 rounded-lg p-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            ${selectedBookType?.price} USD
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            ≈ {priceInETB} ETB
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Ethiopian Test Mode Payment Methods */}
                      {(selectedMethod?.ethiopianOnly && selectedMethod?.isTestMode) && (
                        <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-yellow-600 dark:text-yellow-400">🇪🇹</span>
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                              Ethiopian Test Payment
                            </h4>
                          </div>
                          <p className="text-sm text-yellow-600 dark:text-yellow-300">
                            This is a test payment using Ethiopian payment methods (Telebir, CBE Birr, etc.)
                          </p>
                        </div>
                      )}

                      {(selectedMethod?.type === 'mobile' || selectedMethod?.type === 'bank') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Phone Number {selectedMethod?.ethiopianOnly ? '(Ethiopian format)' : '*'}
                          </label>
                          <input
                            type="tel"
                            placeholder={selectedMethod?.ethiopianOnly ? "+251911234567" : "09XXXXXXXX"}
                            value={paymentDetails.phoneNumber}
                            onChange={(e) => setPaymentDetails(prev => ({...prev, phoneNumber: e.target.value}))}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {selectedMethod?.isTestMode ? 'Test Transaction ID (Optional)' : 'Transaction ID (Optional)'}
                        </label>
                        <input
                          type="text"
                          placeholder={selectedMethod?.isTestMode ? "Leave blank for auto-generation" : "Enter transaction ID if available"}
                          value={paymentDetails.transactionId}
                          onChange={(e) => setPaymentDetails(prev => ({...prev, transactionId: e.target.value}))}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setPaymentStep("method")}
                    disabled={paymentProcessing}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePayNow}
                    disabled={paymentProcessing || (selectedMethod?.type !== 'card' && !paymentDetails.phoneNumber)}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 disabled:opacity-50"
                  >
                    {paymentProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      "Pay Now"
                    )}
                  </button>
                </div>
              </div>
            )}

            {paymentStep === "success" && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheck className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  Payment Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You now own "{book.title}" ({selectedBookType?.bookType})
                </p>
                <div className="text-sm text-gray-500">
                  Redirecting to your library...
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/market')}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <FaArrowLeft />
            <span>Back to Market</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover and Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl sticky top-8">
              <div className="text-center">
                <div className="relative mb-6">
                  <img
                    src={getImageUrl(book.cover_url || book.cover_image)}
                    alt={book.title}
                    className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNmNGY2ZmYiLz48dGV4dCB4PSIxNTAiIHk9IjIwMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJvb2s8L3RleHQ+PC9zdmc+';
                    }}
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {book.is_premium && (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                        <FaCrown className="mr-1" />
                        PREMIUM
                      </span>
                    )}
                    {book.book_type && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg ${
                        book.book_type === 'hard' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                        book.book_type === 'soft' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                        'bg-gradient-to-r from-purple-500 to-pink-600'
                      } text-white`}>
                        <FaShoppingBag className="mr-1" />
                        {book.book_type === 'hard' ? 'Hard Copy' :
                         book.book_type === 'soft' ? 'Soft Copy' :
                         book.book_type === 'both' ? 'Hard & Soft' :
                         book.book_type}
                      </span>
                    )}
                    {book.is_for_rent && (
                      <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                        <FaClock className="mr-1" />
                        RENT AVAILABLE
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={toggleFavorite}
                      className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                        isFavorite 
                          ? 'bg-red-500/20 text-red-500' 
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      <FaHeart />
                    </button>
                    <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300">
                      <FaShare />
                    </button>
                  </div>
                </div>

                {/* Book Title */}
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {book.title}
                </h1>
                
                {/* Author */}
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4 flex items-center justify-center">
                  <FaUser className="mr-2" />
                  by {book.author}
                </p>

                {/* Rating */}
                <div className="flex items-center justify-center space-x-4 mb-6">
                  {renderStars(book.rating || 0)}
                  <span className="text-sm text-gray-500">
                    ({book.rating || 0}) • {book.views || 0} views
                  </span>
                </div>

                {/* Price Display */}
                {book.display_price && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-4 mb-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {book.display_price}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Available formats
                      </div>
                    </div>
                  </div>
                )}

                {/* Book Type Selection */}
                <div className="mb-6">
                  <BookTypeSelector
                    book={book}
                    onSelectType={handleBookTypeSelect}
                    selectedType={selectedBookType}
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {hasPurchased() ? (
                    <div className="space-y-3">
                      <button
                        onClick={() => navigate(`/book/read/${book.id}`)}
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                      >
                        <FaLockOpen className="text-lg" />
                        <span>Read Now</span>
                      </button>
                      {book.pdf_file && (
                        <button
                          onClick={() => window.open(`http://127.0.0.1:8000${book.pdf_file}`, '_blank')}
                          className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                        >
                          <FaDownload className="text-lg" />
                          <span>Download PDF</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={handleBuyNow}
                        disabled={!selectedBookType}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaCreditCard className="text-lg" />
                        <span>Buy Now - {selectedBookType ? `$${selectedBookType.price} (≈ ${getPriceInETB(selectedBookType.price)} ETB)` : 'Select format to see price'}</span>
                      </button>
                      <button
                        onClick={addToCart}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                      >
                        <FaShoppingCart className="text-lg" />
                        <span>Add to Cart</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Features */}
                <div className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <FaShieldAlt className="text-green-500 mr-2" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center">
                    <FaLock className="text-blue-500 mr-2" />
                    <span>Instant access after purchase</span>
                  </div>
                  <div className="flex items-center">
                    <FaDownload className="text-purple-500 mr-2" />
                    <span>Downloadable PDF included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Book Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <FaBook className="mr-3 text-blue-500" />
                Book Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {book.page_count > 0 && (
                    <div className="flex items-center">
                      <FaBook className="text-gray-500 mr-3" />
                      <div>
                        <span className="text-sm text-gray-500">Pages</span>
                        <div className="font-semibold text-gray-800 dark:text-white">{book.page_count}</div>
                      </div>
                    </div>
                  )}
                  
                  {book.language && (
                    <div className="flex items-center">
                      <FaLanguage className="text-gray-500 mr-3" />
                      <div>
                        <span className="text-sm text-gray-500">Language</span>
                        <div className="font-semibold text-gray-800 dark:text-white">{book.language}</div>
                      </div>
                    </div>
                  )}
                  
                  {book.published_date && (
                    <div className="flex items-center">
                      <FaCalendar className="text-gray-500 mr-3" />
                      <div>
                        <span className="text-sm text-gray-500">Published</span>
                        <div className="font-semibold text-gray-800 dark:text-white">
                          {new Date(book.published_date).getFullYear()}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Book Type Information */}
                  {book.book_type && (
                    <div className="flex items-center">
                      <FaShippingFast className="text-gray-500 mr-3" />
                      <div>
                        <span className="text-sm text-gray-500">Available Format</span>
                        <div className="font-semibold text-gray-800 dark:text-white">
                          {book.book_type === 'hard' ? 'Hard Copy' :
                           book.book_type === 'soft' ? 'Soft Copy' :
                           book.book_type === 'both' ? 'Hard & Soft Copy' :
                           book.book_type}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {book.delivery_method && (
                    <div className="flex items-center">
                      <FaShippingFast className="text-gray-500 mr-3" />
                      <div>
                        <span className="text-sm text-gray-500">Delivery</span>
                        <div className="font-semibold text-gray-800 dark:text-white">
                          {book.delivery_method === 'both' ? 'Pickup or Delivery' :
                           book.delivery_method === 'pickup' ? 'Pickup' :
                           book.delivery_method === 'delivery' ? 'Delivery' :
                           book.delivery_method}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaEye className="text-gray-500 mr-3" />
                    <div>
                      <span className="text-sm text-gray-500">Views</span>
                      <div className="font-semibold text-gray-800 dark:text-white">{book.views || 0}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FaDownload className="text-gray-500 mr-3" />
                    <div>
                      <span className="text-sm text-gray-500">Downloads</span>
                      <div className="font-semibold text-gray-800 dark:text-white">{book.downloads || 0}</div>
                    </div>
                  </div>
                  
                  {book.created_at && (
                    <div className="flex items-center">
                      <FaHistory className="text-gray-500 mr-3" />
                      <div>
                        <span className="text-sm text-gray-500">Added</span>
                        <div className="font-semibold text-gray-800 dark:text-white">
                          {new Date(book.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Pricing Information */}
                  <div className="flex items-center">
                    <FaMoneyBillWave className="text-gray-500 mr-3" />
                    <div>
                      <span className="text-sm text-gray-500">Pricing</span>
                      <div className="font-semibold text-gray-800 dark:text-white">
                        {book.display_price || `$${book.price}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {book.description && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Description</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {book.description}
                  </p>
                </div>
              )}

              {book.tags && book.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {book.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-full flex items-center"
                      >
                        <FaTag className="mr-1 text-xs" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Customer Reviews */}
            <CustomerReviews book={book} />

            {/* Related Books */}
            {relatedBooks.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                  <FaGem className="mr-3 text-purple-500" />
                  Related Books
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedBooks.map((relatedBook) => (
                    <div
                      key={relatedBook.id}
                      onClick={() => navigate(`/market/book/${relatedBook.id}/sell`)}
                      className="cursor-pointer bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-600 rounded-lg mb-3 overflow-hidden">
                        <img
                          src={getImageUrl(relatedBook.cover_url || relatedBook.cover_image)}
                          alt={relatedBook.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-semibold text-gray-800 dark:text-white text-sm line-clamp-2 mb-1">
                        {relatedBook.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                        by {relatedBook.author}
                      </p>
                      <div className="text-sm font-bold text-green-600 dark:text-green-400">
                        ${relatedBook.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSell;