import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaArrowLeft,
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaHeart,
  FaCreditCard,
  FaGift,
  FaShieldAlt,
  FaLock,
  FaPhone,
  FaMobile,
  FaUniversity,
  FaExclamationTriangle,
  FaSync,
  FaTag,
  FaTruck,
  FaPercent,
  FaInfo,
  FaCheck,
  FaEye,
  FaDownload,
  FaBook,
  FaSearch,
  FaArrowRight,
  FaCrown
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
      // For Chapa payments, use the new Chapa API
      if (paymentData.payment_method === 'chapa') {
        return await this.processChapaPayment(paymentData);
      } else {
        // Use existing payment processor for other methods
        const response = await axios.post('http://localhost:8000/api/payments/process/', paymentData);
        return response.data;
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Payment processing failed');
    }
  },

  async processChapaPayment(paymentData) {
    try {
      // Convert USD to ETB
      const exchangeRate = paymentData.exchange_rate || 55;
      const etbAmount = (parseFloat(paymentData.amount_usd) * exchangeRate).toFixed(2);
      
      // Get current user info (if authenticated)
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userEmail = user.email || paymentData.customer_email || 'customer@example.com';
      const userName = user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : 'Customer';
      
      // Prepare Chapa payment request
      const chapaRequest = {
        book_id: paymentData.items[0]?.id, // Take first book for now
        payment_type: 'purchase_soft',
        amount: etbAmount,
        currency: 'ETB',
        customer_email: userEmail,
        customer_name: userName,
        phone_number: paymentData.phone_number || '',
        description: `Purchase: ${paymentData.items.map(item => item.title).join(', ')}`
      };

      const response = await axios.post('http://localhost:8000/api/payments/chapa/', chapaRequest);
      const responseData = response.data;

      if (responseData.success) {
        // Store payment info for success page
        localStorage.setItem('lastChapaPayment', JSON.stringify({
          tx_ref: responseData.data.tx_ref,
          amount: responseData.data.amount,
          currency: responseData.data.currency,
          book_id: paymentData.items[0]?.id,
          book_titles: paymentData.items.map(item => item.title)
        }));

        // Redirect to Chapa checkout
        window.location.href = responseData.data.checkout_url;
        
        return {
          success: true,
          redirect_url: responseData.data.checkout_url,
          tx_ref: responseData.data.tx_ref
        };
      } else {
        throw new Error(responseData.message || 'Chapa payment failed');
      }
    } catch (error) {
      console.error('Chapa payment error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Chapa payment processing failed');
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
      cbe_bir: {
        steps: [
          "Dial *889# on your registered phone",
          "Select 'Transfer'",
          "Choose 'CBE Birr'",
          "Enter recipient number: 0912345678",
          "Enter amount and confirm"
        ],
        note: "Service available 24/7"
      },
      chapa: {
        steps: [
          "You will be redirected to Chapa checkout",
          "Select your preferred payment method",
          "Enter your payment details",
          "Confirm payment with PIN/SMS code",
          "Complete authentication"
        ],
        note: "Secure payment gateway supporting all Ethiopian banks and mobile money"
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
    id: "chapa",
    name: "Chapa",
    icon: FaCreditCard,
    description: "Chapa Payment Gateway",
    supportedNetworks: ["All Networks"],
    type: "gateway",
    popular: true
  },
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
    id: "cbe_bir",
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

const ShoppingCart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [exchangeRate, setExchangeRate] = useState(55);
  const [exchangeRateLoading, setExchangeRateLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
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
    loadCartData();
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

  const loadCartData = async () => {
    setLoading(true);
    try {
      const cartIds = JSON.parse(localStorage.getItem('marketCart') || '[]');
      if (cartIds.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const books = await Promise.all(
        cartIds.map(id => axios.get(`http://localhost:8000/api/books/${id}/`))
      );
      
      setCartItems(books.map(res => ({ ...res.data, quantity: 1 })));
      
      // Select all items by default
      const allIds = new Set(books.map(res => res.data.id));
      setSelectedItems(allIds);
    } catch (error) {
      console.error("Error loading cart data:", error);
      setCartItems([]);
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
    if (!path) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNmNGY2ZmYiLz48dGV4dCB4PSIxNTAiIHk9IjIwMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJvb2s8L3RleHQ+PC9zdmc+';
    return path.startsWith("http") ? path : `http://localhost:8000${path}`;
  };

  const getPriceInETB = (usdPrice) => {
    return (parseFloat(usdPrice || 0) * exchangeRate).toFixed(2);
  };

  const updateQuantity = (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => prev.map(item => 
      item.id === bookId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (bookId) => {
    const newCartItems = cartItems.filter(item => item.id !== bookId);
    setCartItems(newCartItems);
    
    const newCartIds = newCartItems.map(item => item.id);
    localStorage.setItem('marketCart', JSON.stringify(newCartIds));
    
    // Update selected items
    const newSelectedItems = new Set(selectedItems);
    newSelectedItems.delete(bookId);
    setSelectedItems(newSelectedItems);
  };

  const moveToFavorites = (bookId) => {
    const item = cartItems.find(item => item.id === bookId);
    if (!item) return;

    const newFavorites = new Set([...favorites, bookId]);
    setFavorites(newFavorites);
    localStorage.setItem('marketFavorites', JSON.stringify([...newFavorites]));
    
    // Remove from cart
    removeFromCart(bookId);
  };

  const toggleItemSelection = (bookId) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(bookId)) {
      newSelectedItems.delete(bookId);
    } else {
      newSelectedItems.add(bookId);
    }
    setSelectedItems(newSelectedItems);
  };

  const selectAllItems = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      const allIds = new Set(cartItems.map(item => item.id));
      setSelectedItems(allIds);
    }
  };

  const applyCoupon = () => {
    // Sample coupons - in real app, this would come from API
    const coupons = {
      'SAVE10': { type: 'percentage', value: 10, description: '10% off your order' },
      'WELCOME20': { type: 'fixed', value: 20, description: '$20 off orders over $100' },
      'STUDENT15': { type: 'percentage', value: 15, description: '15% student discount' }
    };

    const coupon = coupons[couponCode.toUpperCase()];
    if (coupon) {
      setAppliedCoupon({ code: couponCode.toUpperCase(), ...coupon });
    } else {
      alert('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  // Calculate totals
  const getSubtotal = () => {
    return cartItems
      .filter(item => selectedItems.has(item.id))
      .reduce((total, item) => total + (item.price * item.quantity), 0)
      .toFixed(2);
  };

  const getDiscount = () => {
    if (!appliedCoupon) return 0;
    
    const subtotal = parseFloat(getSubtotal());
    if (appliedCoupon.type === 'percentage') {
      return (subtotal * appliedCoupon.value / 100).toFixed(2);
    } else if (appliedCoupon.type === 'fixed') {
      return subtotal >= 100 ? appliedCoupon.value.toFixed(2) : 0;
    }
    return 0;
  };

  const getTotal = () => {
    const subtotal = parseFloat(getSubtotal());
    const discount = parseFloat(getDiscount());
    return (subtotal - discount).toFixed(2);
  };

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      alert('Please select at least one item to checkout');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayNow = async () => {
    setPaymentProcessing(true);
    
    try {
      const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id));
      const totalAmount = getTotal();
      
      const paymentData = {
        items: selectedCartItems.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity
        })),
        payment_method: paymentMethod,
        amount_usd: totalAmount,
        amount_etb: getPriceInETB(parseFloat(totalAmount)),
        phone_number: paymentDetails.phoneNumber,
        transaction_id: paymentDetails.transactionId || `TXN${Date.now()}`,
        exchange_rate: exchangeRate,
        coupon: appliedCoupon
      };

      const result = await paymentService.processPayment(paymentData);
      
      if (result.success) {
        setPaymentSuccess(true);
        setPaymentStep("success");
        
        // Remove purchased items from cart
        const remainingItems = cartItems.filter(item => !selectedItems.has(item.id));
        setCartItems(remainingItems);
        localStorage.setItem('marketCart', JSON.stringify(remainingItems.map(item => item.id)));
        
        setTimeout(() => {
          setShowPaymentModal(false);
          setPaymentProcessing(false);
          setPaymentSuccess(false);
          setPaymentStep("method");
          setPaymentDetails({ phoneNumber: "", transactionId: "" });
          setSelectedItems(new Set());
          setAppliedCoupon(null);
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

  const selectedMethod = paymentMethods.find(method => method.id === paymentMethod);
  const priceInETB = getPriceInETB(parseFloat(getTotal()));
  const paymentInstructions = paymentService.getPaymentInstructions(paymentMethod);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your cart...</p>
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
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCreditCard className="text-2xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    Checkout
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Complete your purchase
                  </p>
                </div>

                {/* Order Summary */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-4 mb-6">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-3">Order Summary</h4>
                  <div className="space-y-2">
                    {cartItems.filter(item => selectedItems.has(item.id)).map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {item.title} × {item.quantity}
                        </span>
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {appliedCoupon && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Coupon ({appliedCoupon.code})</span>
                        <span>-${getDiscount()}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">${getTotal()}</span>
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
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-teal-600"
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
                    Complete payment with {selectedMethod?.name}
                  </p>
                </div>

                {/* Payment Instructions */}
                <div className="bg-blue-50 dark:bg-gray-700 rounded-2xl p-4 mb-6">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                    <FaPhone className="mr-2" />
                    Payment Instructions
                  </h4>
                  <div className="space-y-2">
                    {paymentInstructions.steps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{step}</p>
                      </div>
                    ))}
                    {paymentInstructions.note && (
                      <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mt-3">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center">
                          <FaExclamationTriangle className="mr-2" />
                          {paymentInstructions.note}
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

                {/* Total */}
                <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${getTotal()}
                      </div>
                      <div className="text-sm text-gray-500">
                        ≈ {priceInETB} ETB
                      </div>
                    </div>
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
                  Your books have been purchased successfully
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6 sm:mb-8">
          {/* Back Button */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/market')}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm sm:text-base"
            >
              <FaArrowLeft className="text-sm sm:text-base" />
              <span className="hidden sm:inline">Continue Shopping</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>
          
          {/* Title */}
          <div className="text-center sm:text-right">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center sm:justify-end">
              <FaShoppingCart className="mr-2 sm:mr-3 text-blue-500 text-lg sm:text-xl" />
              <span className="text-lg sm:text-2xl">Shopping Cart</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{cartItems.length} items in your cart</p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <FaShoppingCart className="text-2xl sm:text-4xl text-gray-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Your cart is empty</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto px-4">
              Looks like you haven't added any books to your cart yet. Browse our market to find great books!
            </p>
            <button
              onClick={() => navigate('/market')}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 mx-auto text-sm sm:text-base"
            >
              <span>Start Shopping</span>
              <FaArrowRight />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Select All */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-2xl">
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === cartItems.length}
                      onChange={selectAllItems}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm sm:text-lg font-semibold text-gray-800 dark:text-white">
                      <span className="sm:hidden">Select All</span>
                      <span className="hidden sm:inline">Select All ({selectedItems.size} of {cartItems.length})</span>
                    </span>
                  </label>
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    ${getSubtotal()} USD
                  </span>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-3 sm:space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white dark:bg-gray-800 rounded-2xl p-3 sm:p-6 shadow-2xl transition-all duration-300 ${
                      selectedItems.has(item.id) ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-blue-500 mt-1"
                      />

                      {/* Book Cover */}
                      <div className="w-16 h-20 sm:w-20 sm:h-28 bg-gray-200 dark:bg-gray-700 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={getImageUrl(item.cover_url || item.cover_image)}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyNjciIGZpbGw9IiNmNGY2ZmYiLz48dGV4dCB4PSIxMDAiIHk9IjEzMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJvb2s8L3RleHQ+PC9zdmc+';
                          }}
                        />
                      </div>

                      {/* Book Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-lg font-bold text-gray-800 dark:text-white line-clamp-2 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                          by {item.author}
                        </p>
                        
                        {/* Badges */}
                        <div className="flex items-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
                          {item.is_premium && (
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-bold flex items-center">
                              <FaCrown className="mr-0.5 sm:mr-1 text-xs" />
                              <span className="hidden sm:inline">PREMIUM</span>
                              <span className="sm:hidden">PREM</span>
                            </span>
                          )}
                          {item.is_for_sale && (
                            <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-bold">
                              <span className="hidden sm:inline">FOR SALE</span>
                              <span className="sm:hidden">SALE</span>
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm">
                          <button
                            onClick={() => moveToFavorites(item.id)}
                            className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <FaHeart />
                            <span className="hidden sm:inline">Move to Favorites</span>
                            <span className="sm:hidden">Favorites</span>
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <FaTrash />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Quantity and Price */}
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center justify-end space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <span className="w-6 sm:w-8 text-center font-semibold text-sm sm:text-base">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>
                        
                        <div className="text-sm sm:text-lg font-bold text-green-600 dark:text-green-400">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          ≈ {getPriceInETB(item.price * item.quantity)} ETB
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-2xl sticky top-4 lg:top-8">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 flex items-center">
                  <FaGift className="mr-2 sm:mr-3 text-purple-500" />
                  <span>Order Summary</span>
                </h2>

                {/* Coupon Section */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm sm:text-base">Coupon Code</h3>
                  {appliedCoupon ? (
                    <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-green-800 dark:text-green-200 text-sm">
                            {appliedCoupon.code}
                          </span>
                          <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">
                            {appliedCoupon.description}
                          </p>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <button
                        onClick={applyCoupon}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition duration-300 text-sm whitespace-nowrap"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal ({selectedItems.size} items):</span>
                    <span className="font-semibold">${getSubtotal()}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600 text-sm sm:text-base">
                      <span>Discount ({appliedCoupon.code}):</span>
                      <span>-${getDiscount()}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-2 sm:pt-3 flex justify-between text-base sm:text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600 dark:text-green-400">${getTotal()}</span>
                  </div>
                  
                  <div className="text-center text-xs sm:text-sm text-gray-500">
                    ≈ {getPriceInETB(parseFloat(getTotal()))} ETB
                    <button
                      onClick={fetchExchangeRate}
                      disabled={exchangeRateLoading}
                      className="ml-2 text-blue-500 hover:text-blue-600"
                    >
                      <FaSync className={`text-xs ${exchangeRateLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={selectedItems.size === 0}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-sm sm:text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-1 sm:space-x-2 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  <FaCreditCard className="text-sm sm:text-lg" />
                  <span>Checkout ${getTotal()}</span>
                </button>

                {/* Features - Hidden on mobile to save space */}
                <div className="hidden sm:mt-6 sm:space-y-2 sm:text-sm sm:text-gray-600 sm:dark:text-gray-400">
                  <div className="flex items-center">
                    <FaShieldAlt className="text-green-500 mr-2" />
                    <span>Secure SSL encryption</span>
                  </div>
                  <div className="flex items-center">
                    <FaLock className="text-blue-500 mr-2" />
                    <span>Instant access after purchase</span>
                  </div>
                  <div className="flex items-center">
                    <FaDownload className="text-purple-500 mr-2" />
                    <span>Downloadable PDFs included</span>
                  </div>
                </div>

                {/* Recommended Coupons - Hidden on mobile */}
                <div className="hidden sm:mt-6 sm:p-4 sm:bg-gray-50 sm:dark:bg-gray-700 sm:rounded-xl">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <FaGift className="mr-2" />
                    Available Coupons
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">SAVE10</span>
                      <span className="text-green-600">10% off</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">WELCOME20</span>
                      <span className="text-green-600">$20 off $100+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">STUDENT15</span>
                      <span className="text-green-600">15% student discount</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;