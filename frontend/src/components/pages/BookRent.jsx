import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaArrowLeft, 
  FaStar, 
  FaRegStar, 
  FaHeart, 
  FaShare,
  FaRecycle,
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
  FaClock,
  FaHistory,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaFilePdf,
  FaSearch,
  FaFilter
} from "react-icons/fa";

// Exchange rate service
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

// Payment service
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
      stripe: {
        steps: [
          "Enter card details securely",
          "Verify with 3D Secure if prompted",
          "Review payment amount",
          "Complete authentication"
        ],
        note: "Secure international payment"
      }
    };
    return instructions[method] || { steps: [], note: "Follow on-screen instructions" };
  }
};

// Payment methods
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
    id: "stripe",
    name: "Credit/Debit Card",
    icon: FaCreditCard,
    description: "International Cards",
    supportedNetworks: ["Visa", "Mastercard", "Amex"],
    type: "card"
  }
];

// Customer Reviews Component
const CustomerReviews = ({ book }) => {
  // Sample reviews data - in real app, this would come from API
  const reviews = [
    {
      id: 1,
      user: "John D.",
      rating: 5,
      date: "2024-01-15",
      comment: "Excellent book! Very detailed and well-written. The rental service was smooth and delivery was fast.",
      helpful: 12,
      avatar: "👨‍💼"
    },
    {
      id: 2,
      user: "Sarah M.",
      rating: 4,
      date: "2024-01-10",
      comment: "Great content with practical examples. The rental process was easy, though book condition could be better.",
      helpful: 8,
      avatar: "👩‍🎓"
    },
    {
      id: 3,
      user: "Michael R.",
      rating: 5,
      date: "2024-01-08",
      comment: "Perfect for temporary reading needs. The return process is hassle-free and book quality is good.",
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
                  <button className="text-sm text-gray-500 hover:text-blue-500 transition-colors flex items-center">
                    <FaHeart className="mr-1" />
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

// Rental Policy Component
const RentalPolicy = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
        <FaFileAlt className="mr-3 text-green-500" />
        Rental Policy & Terms
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <FaClock className="text-blue-500 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Rental Duration</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Rent books for 1 week to 6 months. Extend rentals anytime before expiration.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <FaCalendarAlt className="text-green-500 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Return Process</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Return books by mail or drop-off. Digital books automatically expire at rental end.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <FaMapMarkerAlt className="text-purple-500 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Delivery & Pickup</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Free pickup at designated locations. Delivery available within city limits for $2.99.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <FaShieldAlt className="text-red-500 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Damaged/Lost Books</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Full replacement cost charged for damaged or lost books. Insurance available for $0.99/month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookRent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [userRentals, setUserRentals] = useState(new Set());
  const [exchangeRate, setExchangeRate] = useState(55);
  const [exchangeRateLoading, setExchangeRateLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rentalDuration, setRentalDuration] = useState(1); // weeks
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [returnDate, setReturnDate] = useState("");
  
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
    calculateReturnDate();
  }, [id, rentalDuration]);

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

  const fetchBookData = async () => {
    setLoading(true);
    try {
      const [bookRes, relatedRes] = await Promise.all([
        axios.get(`http://localhost:8000/api/books/${id}/`),
        axios.get(`http://localhost:8000/api/books/?category=${id}&limit=4`)
      ]);
      
      setBook(bookRes.data);
      setRelatedBooks(relatedRes.data?.results || relatedRes.data || []);
    } catch (error) {
      console.error("Error fetching book data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const savedFavorites = localStorage.getItem('marketFavorites');
      const savedRentals = localStorage.getItem('marketRentals');
      
      if (savedFavorites) {
        const favoritesSet = new Set(JSON.parse(savedFavorites));
        setFavorites(favoritesSet);
        setIsFavorite(favoritesSet.has(parseInt(id)));
      }
      
      if (savedRentals) {
        setUserRentals(new Set(JSON.parse(savedRentals)));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const calculateReturnDate = () => {
    const now = new Date();
    const returnDate = new Date(now.getTime() + (rentalDuration * 7 * 24 * 60 * 60 * 1000));
    setReturnDate(returnDate.toLocaleDateString());
  };

  const getImageUrl = (path) => {
    if (!path) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNmNGY2ZmYiLz48dGV4dCB4PSIxNTAiIHk9IjIwMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJvb2s8L3RleHQ+PC9zdmc+';
    return path.startsWith("http") ? path : `http://localhost:8000${path}`;
  };

  const getPriceInETB = (usdPrice) => {
    return (parseFloat(usdPrice || 0) * exchangeRate).toFixed(2);
  };

  const isCurrentlyRented = () => {
    return userRentals.has(parseInt(id));
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

  const getRentalPrice = () => {
    if (!book) return 0;
    const basePrice = book.rental_price || (book.price * 0.1);
    return (basePrice * rentalDuration).toFixed(2);
  };

  const getDeliveryCost = () => {
    return deliveryMethod === "delivery" ? 2.99 : 0;
  };

  const getTotalCost = () => {
    return (parseFloat(getRentalPrice()) + getDeliveryCost()).toFixed(2);
  };

  const getReturnDateInETB = () => {
    return getPriceInETB(parseFloat(getRentalPrice())).toFixed(2);
  };

  const handleRentNow = () => {
    if (isCurrentlyRented()) {
      alert("You already have an active rental for this book!");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayNow = async () => {
    if (!book) return;
    
    setPaymentProcessing(true);
    
    try {
      const paymentData = {
        book_id: book.id,
        book_title: book.title,
        payment_method: paymentMethod,
        amount_usd: getTotalCost(),
        amount_etb: getPriceInETB(parseFloat(getTotalCost())),
        phone_number: paymentDetails.phoneNumber,
        transaction_id: paymentDetails.transactionId || `TXN${Date.now()}`,
        exchange_rate: exchangeRate,
        rental_duration: rentalDuration,
        delivery_method: deliveryMethod,
        return_date: new Date(returnDate).toISOString()
      };

      const result = await paymentService.processPayment(paymentData);
      
      if (result.success) {
        setPaymentSuccess(true);
        setPaymentStep("success");
        
        const newRentals = new Set([...userRentals, book.id]);
        setUserRentals(newRentals);
        localStorage.setItem('marketRentals', JSON.stringify([...newRentals]));
        
        setTimeout(() => {
          setShowPaymentModal(false);
          setPaymentProcessing(false);
          setPaymentSuccess(false);
          setPaymentStep("method");
          setPaymentDetails({ phoneNumber: "", transactionId: "" });
          navigate('/rentals');
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

  const selectedMethod = paymentMethods.find(method => method.id === paymentMethod);

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
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaRecycle className="text-2xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    Rent Book
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Rent "{book.title}" for {rentalDuration} week{rentalDuration > 1 ? 's' : ''}
                  </p>
                </div>

                {/* Rental Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-4 mb-6">
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
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Rental Cost:</span>
                          <span className="font-semibold">${getRentalPrice()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Delivery:</span>
                          <span className="font-semibold">${getDeliveryCost().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm border-t border-gray-200 pt-1">
                          <span>Total:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">${getTotalCost()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
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
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {paymentStep === "details" && (
              <div className="p-6">
                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    Payment Details
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Complete rental payment with {selectedMethod?.name}
                  </p>
                </div>

                {/* Payment Instructions */}
                <div className="bg-blue-50 dark:bg-gray-700 rounded-2xl p-4 mb-6">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                    <FaPhone className="mr-2" />
                    Payment Instructions
                  </h4>
                  <div className="space-y-2">
                    {paymentService.getPaymentInstructions(paymentMethod).steps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{step}</p>
                      </div>
                    ))}
                    {paymentService.getPaymentInstructions(paymentMethod).note && (
                      <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mt-3">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center">
                          <FaExclamationTriangle className="mr-2" />
                          {paymentService.getPaymentInstructions(paymentMethod).note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Form */}
                <div className="space-y-4 mb-6">
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
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
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
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50"
                  >
                    {paymentProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      "Rent Now"
                    )}
                  </button>
                </div>
              </div>
            )}

            {paymentStep === "success" && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheck className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  Rental Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You have rented "{book.title}" until {returnDate}
                </p>
                <div className="text-sm text-gray-500">
                  Redirecting to your rentals...
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex items-center mb-4 sm:mb-6 lg:mb-8">
          <button
            onClick={() => navigate('/market')}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm sm:text-base"
          >
            <FaArrowLeft className="text-sm sm:text-base" />
            <span className="hidden sm:inline">Back to Market</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>

        {/* Mobile Book Header */}
        <div className="lg:hidden mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-2xl">
            <div className="flex space-x-4">
              <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={getImageUrl(book.cover_url || book.cover_image)}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyNjciIGZpbGw9IiNmNGY2ZmYiLz48dGV4dCB4PSIxMDAiIHk9IjEzMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJvb2s8L3RleHQ+PC9zdmc+';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-gray-800 dark:text-white mb-1 line-clamp-2">
                  {book.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  by {book.author}
                </p>
                <div className="flex items-center justify-between">
                  {renderStars(book.rating || 0)}
                  <div className="flex space-x-2">
                    <button
                      onClick={toggleFavorite}
                      className={`p-2 rounded-full ${
                        isFavorite
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      <FaHeart className="text-sm" />
                    </button>
                    <button className="p-2 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300">
                      <FaShare className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Book Cover and Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-2xl sticky top-4 lg:top-8">
              <div className="text-center hidden lg:block">
                <div className="relative mb-6">
                  <img
                    src={getImageUrl(book.cover_url || book.cover_image)}
                    alt={book.title}
                    className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl h-80 lg:h-96 object-cover"
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
                    {book.is_for_rent && (
                      <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                        <FaRecycle className="mr-1" />
                        FOR RENT
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
                <h1 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {book.title}
                </h1>
                
                {/* Author */}
                <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-4 flex items-center justify-center">
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

                {/* Rental Configuration */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Rental Details</h3>
                  
                  {/* Rental Duration */}
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rental Duration (weeks)
                    </label>
                    <select
                      value={rentalDuration}
                      onChange={(e) => setRentalDuration(parseInt(e.target.value))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      {[1, 2, 4, 8, 12, 24].map(weeks => (
                        <option key={weeks} value={weeks}>
                          {weeks} {weeks === 1 ? 'week' : 'weeks'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Delivery Method */}
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Delivery Method
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="delivery"
                          value="pickup"
                          checked={deliveryMethod === "pickup"}
                          onChange={(e) => setDeliveryMethod(e.target.value)}
                          className="text-blue-600"
                        />
                        <span className="text-xs sm:text-sm">Pickup (Free)</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="delivery"
                          value="delivery"
                          checked={deliveryMethod === "delivery"}
                          onChange={(e) => setDeliveryMethod(e.target.value)}
                          className="text-blue-600"
                        />
                        <span className="text-xs sm:text-sm">Delivery ($2.99)</span>
                      </label>
                    </div>
                  </div>

                  {/* Return Date */}
                  <div className="mb-3 sm:mb-4">
                    <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <FaCalendarAlt />
                      <span>Return by: {returnDate}</span>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3 sm:pt-4 space-y-1 sm:space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span>Rental Cost ({rentalDuration} week{rentalDuration > 1 ? 's' : ''}):</span>
                      <span className="font-semibold">${getRentalPrice()}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span>Delivery:</span>
                      <span className="font-semibold">${getDeliveryCost().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base sm:text-lg font-bold border-t border-gray-200 pt-2">
                      <span>Total:</span>
                      <span className="text-blue-600 dark:text-blue-400">${getTotalCost()}</span>
                    </div>
                    <div className="text-center text-xs sm:text-sm text-gray-500">
                      ≈ {getReturnDateInETB()} ETB
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {isCurrentlyRented() ? (
                    <div className="space-y-3">
                      <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-xl p-4">
                        <p className="text-green-800 dark:text-green-200 text-sm font-semibold text-center">
                          You have an active rental for this book
                        </p>
                        <button
                          onClick={() => navigate('/rentals')}
                          className="w-full mt-2 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-300"
                        >
                          View My Rentals
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleRentNow}
                      className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <FaRecycle className="text-lg" />
                      <span>Rent Now - ${getTotalCost()}</span>
                    </button>
                  )}
                </div>

                {/* Features */}
                <div className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <FaShieldAlt className="text-green-500 mr-2" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="text-blue-500 mr-2" />
                    <span>Flexible rental durations</span>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-purple-500 mr-2" />
                    <span>Pickup or delivery available</span>
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

            {/* Rental Policy */}
            <RentalPolicy />

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
                      onClick={() => navigate(`/market/book/${relatedBook.id}/rent`)}
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
                      <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        ${relatedBook.rental_price || (relatedBook.price * 0.1).toFixed(2)}/week
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

export default BookRent;