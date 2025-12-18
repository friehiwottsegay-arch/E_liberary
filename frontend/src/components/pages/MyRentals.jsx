import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaArrowLeft,
  FaRecycle,
  FaClock,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBook,
  FaUser,
  FaEye,
  FaDownload,
  FaHeart,
  FaCreditCard,
  FaPlus,
  FaMinus,
  FaCalendarPlus,
  FaCheck,
  FaExclamationTriangle,
  FaInfo,
  FaSearch,
  FaFilter,
  FaSort,
  FaGift,
  FaPercentage,
  FaTimes,
  FaFilePdf,
  FaPlay,
  FaPause,
  FaSync,
  FaStar,
  FaRegStar,
  FaCrown,
  FaGem
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
    icon: "FaMobile",
    description: "Ethio Telecom Mobile Money",
    type: "mobile",
    popular: true
  },
  {
    id: "cbeBir",
    name: "CBE Birr",
    icon: "FaUniversity",
    description: "Commercial Bank of Ethiopia",
    type: "bank",
    popular: true
  }
];

const MyRentals = () => {
  const navigate = useNavigate();
  const [rentalItems, setRentalItems] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [exchangeRate, setExchangeRate] = useState(55);
  const [exchangeRateLoading, setExchangeRateLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, expired, returning
  const [sortBy, setSortBy] = useState("due_date"); // due_date, start_date, title
  const [searchQuery, setSearchQuery] = useState("");
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [rentalToExtend, setRentalToExtend] = useState(null);
  const [extendDuration, setExtendDuration] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("telebir");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    phoneNumber: "",
    transactionId: ""
  });

  useEffect(() => {
    loadRentalData();
    loadUserData();
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

  const loadRentalData = async () => {
    setLoading(true);
    try {
      const rentalIds = JSON.parse(localStorage.getItem('marketRentals') || '[]');
      if (rentalIds.length === 0) {
        setRentalItems([]);
        setLoading(false);
        return;
      }

      const rentals = rentalIds.map(id => ({
        id,
        book_id: id,
        start_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random date in last 30 days
        due_date: new Date(Date.now() + Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString(), // Random date in next 15 days
        extended: Math.random() > 0.7,
        status: Math.random() > 0.1 ? 'active' : 'expired',
        delivery_method: Math.random() > 0.5 ? 'pickup' : 'delivery',
        total_cost: (Math.random() * 20 + 5).toFixed(2)
      }));

      const books = await Promise.all(
        rentalIds.map(id => axios.get(`http://localhost:8000/api/books/${id}/`).catch(() => ({ data: null })))
      );

      const combinedRentals = rentals.map((rental, index) => ({
        ...rental,
        book: books[index].data
      })).filter(rental => rental.book);

      setRentalItems(combinedRentals);
    } catch (error) {
      console.error("Error loading rental data:", error);
      setRentalItems([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const savedFavorites = localStorage.getItem('marketFavorites');
      if (savedFavorites) {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyNjciIGZpbGw9IiNmNGY2ZmYiLz48dGV4dCB4PSIxMDAiIHk9IjEzMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJvb2s8L3RleHQ+PC9zdmc+';
    return path.startsWith("http") ? path : `http://localhost:8000${path}`;
  };

  const getPriceInETB = (usdPrice) => {
    return (parseFloat(usdPrice || 0) * exchangeRate).toFixed(2);
  };

  const getDaysRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRentalStatus = (rental) => {
    const daysRemaining = getDaysRemaining(rental.due_date);
    if (daysRemaining < 0) return 'expired';
    if (daysRemaining <= 3) return 'expiring_soon';
    return 'active';
  };

  const extendRental = (rental) => {
    setRentalToExtend(rental);
    setShowExtendModal(true);
  };

  const handleExtendRental = async () => {
    if (!rentalToExtend) return;
    
    setPaymentProcessing(true);
    
    try {
      const weeklyRate = parseFloat(rentalToExtend.book.rental_price || (rentalToExtend.book.price * 0.1));
      const extensionCost = (weeklyRate * extendDuration).toFixed(2);
      
      const paymentData = {
        rental_id: rentalToExtend.id,
        book_title: rentalToExtend.book.title,
        payment_method: paymentMethod,
        amount_usd: extensionCost,
        amount_etb: getPriceInETB(parseFloat(extensionCost)),
        phone_number: paymentDetails.phoneNumber,
        transaction_id: paymentDetails.transactionId || `TXN${Date.now()}`,
        exchange_rate: exchangeRate,
        extension_duration: extendDuration
      };

      const result = await paymentService.processPayment(paymentData);
      
      if (result.success) {
        // Update rental due date
        const newDueDate = new Date(rentalToExtend.due_date);
        newDueDate.setDate(newDueDate.getDate() + (extendDuration * 7));
        
        const updatedRentals = rentalItems.map(item =>
          item.id === rentalToExtend.id
            ? { ...item, due_date: newDueDate.toISOString(), extended: true }
            : item
        );
        
        setRentalItems(updatedRentals);
        setShowExtendModal(false);
        setRentalToExtend(null);
        setPaymentDetails({ phoneNumber: "", transactionId: "" });
        setExtendDuration(1);
        
        alert('Rental extended successfully!');
      } else {
        throw new Error(result.message || 'Extension failed');
      }
      
    } catch (error) {
      console.error("Extension error:", error);
      alert(`Extension failed: ${error.message}`);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const returnRental = (rental) => {
    if (confirm(`Are you sure you want to return "${rental.book.title}"?`)) {
      const updatedRentals = rentalItems.filter(item => item.id !== rental.id);
      setRentalItems(updatedRentals);
      
      // Update localStorage
      const remainingIds = updatedRentals.map(item => item.book_id);
      localStorage.setItem('marketRentals', JSON.stringify(remainingIds));
      
      alert('Rental returned successfully!');
    }
  };

  const moveToFavorites = (rental) => {
    const newFavorites = new Set([...favorites, rental.book_id]);
    setFavorites(newFavorites);
    localStorage.setItem('marketFavorites', JSON.stringify([...newFavorites]));
    
    alert('Book moved to favorites!');
  };

  const filterAndSortRentals = () => {
    let filtered = rentalItems;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(rental => {
        const status = getRentalStatus(rental);
        if (filterStatus === "active") return status === 'active';
        if (filterStatus === "expiring") return status === 'expiring_soon';
        if (filterStatus === "expired") return status === 'expired';
        return true;
      });
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(rental => 
        rental.book?.title?.toLowerCase().includes(query) ||
        rental.book?.author?.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "due_date":
          return new Date(a.due_date) - new Date(b.due_date);
        case "start_date":
          return new Date(b.start_date) - new Date(a.start_date);
        case "title":
          return (a.book?.title || '').localeCompare(b.book?.title || '');
        default:
          return 0;
      }
    });

    return filtered;
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= (rating || 0) ? 
            <FaStar key={star} className="text-yellow-400 text-sm" /> : 
            <FaRegStar key={star} className="text-gray-300 text-sm" />
        ))}
      </div>
    );
  };

  const renderRentalStatus = (rental) => {
    const status = getRentalStatus(rental);
    const daysRemaining = getDaysRemaining(rental.due_date);

    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <FaCheck className="mr-1" />
            {daysRemaining} days left
          </span>
        );
      case 'expiring_soon':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <FaExclamationTriangle className="mr-1" />
            {daysRemaining} days left (Expiring Soon!)
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <FaExclamationTriangle className="mr-1" />
            {Math.abs(daysRemaining)} days overdue
          </span>
        );
      default:
        return null;
    }
  };

  const weeklyRate = rentalToExtend ? (rentalToExtend.book?.rental_price || (rentalToExtend.book?.price * 0.1)) : 0;
  const extensionCost = (weeklyRate * extendDuration).toFixed(2);
  const extensionCostInETB = getPriceInETB(parseFloat(extensionCost));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your rentals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Extend Rental Modal */}
      {showExtendModal && rentalToExtend && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-500 scale-100 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCalendarPlus className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  Extend Rental
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Extend "{rentalToExtend.book?.title}" rental
                </p>
              </div>

              {/* Book Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={getImageUrl(rentalToExtend.book?.cover_url || rentalToExtend.book?.cover_image)}
                    alt={rentalToExtend.book?.title}
                    className="w-16 h-20 object-cover rounded-xl shadow-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 dark:text-white line-clamp-2">
                      {rentalToExtend.book?.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      by {rentalToExtend.book?.author}
                    </p>
                    <div className="mt-2 text-sm text-gray-500">
                      Due: {new Date(rentalToExtend.due_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Extension Duration */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Extension Duration
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 4, 8].map(weeks => (
                    <button
                      key={weeks}
                      onClick={() => setExtendDuration(weeks)}
                      className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                        extendDuration === weeks
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-semibold text-gray-800 dark:text-white">
                        {weeks} {weeks === 1 ? 'week' : 'weeks'}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${(weeklyRate * weeks).toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Cost Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Weekly rate:</span>
                    <span>${weeklyRate.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{extendDuration} {extendDuration === 1 ? 'week' : 'weeks'}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-green-200 pt-2">
                    <span>Extension cost:</span>
                    <span>${extensionCost}</span>
                  </div>
                  <div className="text-center text-xs text-green-600">
                    ≈ {extensionCostInETB} ETB
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Payment Method
                </h4>
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <label key={method.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-blue-600"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-4 mb-6">
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
                  onClick={() => {
                    setShowExtendModal(false);
                    setRentalToExtend(null);
                    setExtendDuration(1);
                    setPaymentDetails({ phoneNumber: "", transactionId: "" });
                  }}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExtendRental}
                  disabled={paymentProcessing || !paymentDetails.phoneNumber}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50"
                >
                  {paymentProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Extend for $${extensionCost}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/market')}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <FaArrowLeft />
              <span>Back to Market</span>
            </button>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
              <FaRecycle className="mr-3 text-blue-500" />
              My Rentals
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{rentalItems.length} active rentals</p>
          </div>
        </div>

        {rentalItems.length === 0 ? (
          /* Empty Rentals */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaRecycle className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">No rentals yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              You haven't rented any books yet. Browse our market to find books you'd like to rent!
            </p>
            <button
              onClick={() => navigate('/market')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <span>Browse Rentals</span>
              <FaRecycle />
            </button>
          </div>
        ) : (
          <>
            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search rentals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Filter by Status */}
                <div className="relative">
                  <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="all">All Rentals</option>
                    <option value="active">Active</option>
                    <option value="expiring">Expiring Soon</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                {/* Sort */}
                <div className="relative">
                  <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="due_date">Sort by Due Date</option>
                    <option value="start_date">Sort by Start Date</option>
                    <option value="title">Sort by Title</option>
                  </select>
                </div>

                {/* Summary */}
                <div className="flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg px-4 py-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {filterAndSortRentals().length} of {rentalItems.length} rentals
                  </span>
                </div>
              </div>
            </div>

            {/* Rentals List */}
            <div className="space-y-6">
              {filterAndSortRentals().map((rental) => {
                const status = getRentalStatus(rental);
                const daysRemaining = getDaysRemaining(rental.due_date);
                
                return (
                  <div
                    key={rental.id}
                    className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
                      status === 'expired' ? 'border-l-4 border-red-500' :
                      status === 'expiring_soon' ? 'border-l-4 border-yellow-500' :
                      'border-l-4 border-green-500'
                    }`}
                  >
                    <div className="flex items-start space-x-6">
                      {/* Book Cover */}
                      <div className="w-24 h-32 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={getImageUrl(rental.book?.cover_url || rental.book?.cover_image)}
                          alt={rental.book?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Book Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                              {rental.book?.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                              <FaUser className="mr-2" />
                              by {rental.book?.author}
                            </p>
                            {rental.book?.rating > 0 && (
                              <div className="flex items-center space-x-2 mb-3">
                                {renderStars(rental.book.rating)}
                                <span className="text-sm text-gray-500">
                                  ({rental.book.rating}) • {rental.book?.views || 0} views
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Status Badge */}
                          <div>
                            {renderRentalStatus(rental)}
                          </div>
                        </div>

                        {/* Rental Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                              <FaCalendarAlt className="mr-2" />
                              Rental Period
                            </h4>
                            <div className="text-sm space-y-1">
                              <div>
                                <span className="text-gray-500">Started:</span>
                                <span className="font-semibold text-gray-800 dark:text-white ml-2">
                                  {new Date(rental.start_date).toLocaleDateString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Due:</span>
                                <span className="font-semibold text-gray-800 dark:text-white ml-2">
                                  {new Date(rental.due_date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                              <FaMapMarkerAlt className="mr-2" />
                              Delivery
                            </h4>
                            <div className="text-sm">
                              <div className="font-semibold text-gray-800 dark:text-white">
                                {rental.delivery_method === 'pickup' ? '📍 Pickup Location' : '🚚 Home Delivery'}
                              </div>
                              <div className="text-gray-500">
                                ${rental.delivery_method === 'pickup' ? '0.00' : '2.99'} delivery fee
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                              <FaCreditCard className="mr-2" />
                              Payment
                            </h4>
                            <div className="text-sm">
                              <div className="font-semibold text-gray-800 dark:text-white">
                                ${rental.total_cost} paid
                              </div>
                              <div className="text-gray-500">
                                ≈ {getPriceInETB(parseFloat(rental.total_cost))} ETB
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-3">
                          {status === 'active' && (
                            <button
                              onClick={() => extendRental(rental)}
                              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 text-sm font-semibold"
                            >
                              <FaCalendarPlus />
                              <span>Extend Rental</span>
                            </button>
                          )}
                          
                          {status !== 'expired' && (
                            <button
                              onClick={() => returnRental(rental)}
                              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition duration-300 text-sm font-semibold"
                            >
                              <FaArrowLeft />
                              <span>Return Book</span>
                            </button>
                          )}

                          <button
                            onClick={() => navigate(`/market/book/${rental.book_id}/rent`)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 text-sm font-semibold"
                          >
                            <FaEye />
                            <span>View Details</span>
                          </button>

                          <button
                            onClick={() => moveToFavorites(rental)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 text-sm font-semibold"
                          >
                            <FaHeart />
                            <span>Add to Favorites</span>
                          </button>

                          {rental.extended && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                              <FaCrown className="mr-1" />
                              Extended
                            </span>
                          )}

                          {status === 'expired' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              <FaExclamationTriangle className="mr-1" />
                              Please return immediately
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyRentals;