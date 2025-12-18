import React, { useState, useEffect } from 'react';
import {
  FaShoppingCart,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaPlus,
  FaMinus,
  FaTruck,
  FaBuilding,
  FaFile,
  FaCreditCard,
  FaCalendarTimes,
  FaCalendar,
  FaCalendarCheck,
  FaChartLine,
  FaEye,
  FaCalculator,
  FaGift,
  FaShippingFast,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUser
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MarketCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    deliveryInstructions: ''
  });
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('chapa');
  const [exchangeRate] = useState(55); // USD to ETB exchange rate
  
  const navigate = useNavigate();

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    try {
      const savedCartItems = localStorage.getItem('marketCartItems');
      if (savedCartItems) {
        setCartItems(JSON.parse(savedCartItems));
      }
      
      // Load customer info
      const savedCustomerInfo = localStorage.getItem('customerInfo');
      if (savedCustomerInfo) {
        setCustomerInfo(JSON.parse(savedCustomerInfo));
      }
    } catch (error) {
      console.error("Error loading cart items:", error);
    }
  };

  const saveCartItems = (items) => {
    setCartItems(items);
    localStorage.setItem('marketCartItems', JSON.stringify(items));
  };

  const saveCustomerInfo = (info) => {
    setCustomerInfo(info);
    localStorage.setItem('customerInfo', JSON.stringify(info));
  };

  const removeItem = (itemId) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    saveCartItems(updatedItems);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity, price: item.type === 'sale' ? item.book.price * newQuantity : item.price / item.quantity * newQuantity }
        : item
    );
    saveCartItems(updatedItems);
  };

  const updateRentalPeriod = (itemId, newPeriod) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === itemId && item.type === 'rent') {
        const basePrice = item.book.rental_price || item.book.price * 0.1;
        let totalPrice;
        
        if (newPeriod === 'daily') {
          totalPrice = basePrice * item.quantity;
        } else if (newPeriod === 'weekly') {
          totalPrice = basePrice * 7 * item.quantity * 0.95; // 5% discount
        } else if (newPeriod === 'biweekly') {
          totalPrice = basePrice * 14 * item.quantity * 0.88; // 12% discount
        }
        
        return { ...item, rentalPeriod: newPeriod, price: totalPrice };
      }
      return item;
    });
    saveCartItems(updatedItems);
  };

  const updateDeliveryMode = (itemId, newDeliveryMode) => {
    const updatedItems = cartItems.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            deliveryMode: newDeliveryMode,
            price: newDeliveryMode === 'delivery' ? item.price + 5 : item.price
          }
        : item
    );
    saveCartItems(updatedItems);
  };

  const getDeliveryIcon = (mode) => {
    switch (mode) {
      case 'digital': return FaFile;
      case 'pickup': return FaBuilding;
      case 'delivery': return FaTruck;
      default: return FaShippingFast;
    }
  };

  const getPeriodIcon = (period) => {
    switch (period) {
      case 'daily': return FaCalendarTimes;
      case 'weekly': return FaCalendar;
      case 'biweekly': return FaCalendarCheck;
      default: return FaCalendarTimes;
    }
  };

  const getDeliveryCost = (mode) => {
    switch (mode) {
      case 'delivery': return 5.00;
      case 'pickup': return 0;
      case 'digital': return 0;
      default: return 0;
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
  };

  const calculateTotalDeliveryCost = () => {
    return cartItems.reduce((sum, item) => sum + getDeliveryCost(item.deliveryMode), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTotalDeliveryCost();
  };

  const calculateSavings = () => {
    const originalPrice = cartItems.reduce((sum, item) => {
      if (item.type === 'rent' && item.rentalPeriod !== 'daily') {
        const basePrice = item.book.rental_price || item.book.price * 0.1;
        return sum + basePrice * item.quantity * (item.rentalPeriod === 'weekly' ? 7 : 14);
      }
      return sum;
    }, 0);
    
    const discountedPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
    return Math.max(0, originalPrice - discountedPrice);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Please fill in your contact information before checkout.');
      return;
    }
    
    // Save the order for checkout
    const orderData = {
      items: cartItems,
      customer: customerInfo,
      totals: {
        subtotal: calculateSubtotal(),
        deliveryCost: calculateTotalDeliveryCost(),
        total: calculateTotal(),
        savings: calculateSavings()
      },
      paymentMethod: selectedPaymentMethod,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('pendingOrder', JSON.stringify(orderData));
    navigate('/payment-confirmation');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
              <FaShoppingCart className="mr-3 text-blue-600" />
              Shopping Cart
              <span className="ml-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                {cartItems.length} items
              </span>
            </h1>
            <button
              onClick={() => navigate('/market')}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-12 text-center">
            <FaShoppingCart className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-500 mb-6">Add some books to get started!</p>
            <button
              onClick={() => navigate('/market')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => {
                const DeliveryIcon = getDeliveryIcon(item.deliveryMode);
                const PeriodIcon = getPeriodIcon(item.rentalPeriod);
                
                return (
                  <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={item.book.cover_url || '/api/placeholder/100/140'}
                          alt={item.book.title}
                          className="w-20 h-28 object-cover rounded-lg shadow-lg"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDEwMCAxNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxNDAiIGZpbGw9IiNmNGY2ZmYiLz48dGV4dCB4PSI1MCIgeT0iNzAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Cb29rPC90ZXh0Pjwvc3ZnPg==';
                          }}
                        />
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                            {item.book.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            by {item.book.author}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-4 mb-4">
                            {/* Type Badge */}
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              item.type === 'sale' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-blue-500 text-white'
                            }`}>
                              {item.type === 'sale' ? 'PURCHASE' : 'RENTAL'}
                            </span>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Qty:</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-full flex items-center justify-center text-sm font-bold"
                              >
                                <FaMinus />
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-full flex items-center justify-center text-sm font-bold"
                              >
                                <FaPlus />
                              </button>
                            </div>
                          </div>
                          
                          {/* Rental Period Selection (for rentals only) */}
                          {item.type === 'rent' && (
                            <div className="mb-4">
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                Rental Period:
                              </label>
                              <div className="flex space-x-2">
                                {[
                                  { key: 'daily', label: 'Daily', icon: FaCalendarTimes },
                                  { key: 'weekly', label: 'Weekly', icon: FaCalendar },
                                  { key: 'biweekly', label: '2-Week', icon: FaCalendarCheck }
                                ].map(({ key, label, icon: Icon }) => (
                                  <button
                                    key={key}
                                    onClick={() => updateRentalPeriod(item.id, key)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                                      item.rentalPeriod === key
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                    }`}
                                  >
                                    <Icon className="text-xs" />
                                    <span>{label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Delivery Mode Selection */}
                          <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                              Delivery Method:
                            </label>
                            <div className="flex space-x-2">
                              {[
                                { key: 'digital', label: 'Digital', icon: FaFile, cost: 0 },
                                { key: 'pickup', label: 'Pickup', icon: FaBuilding, cost: 0 },
                                { key: 'delivery', label: 'Delivery', icon: FaTruck, cost: 5 }
                              ].map(({ key, label, icon: Icon, cost }) => (
                                <button
                                  key={key}
                                  onClick={() => updateDeliveryMode(item.id, key)}
                                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                                    item.deliveryMode === key
                                      ? 'bg-green-500 text-white'
                                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                  }`}
                                >
                                  <Icon className="text-xs" />
                                  <span>{label}</span>
                                  {cost > 0 && <span className="text-xs">(+${cost})</span>}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Price and Remove */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            ${item.price.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500 mb-4">
                            ≈ {(item.price * exchangeRate).toFixed(2)} ETB
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Order Summary and Customer Info */}
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                    <FaUser className="mr-2 text-blue-600" />
                    Customer Information
                  </h3>
                  <button
                    onClick={() => setIsEditingInfo(!isEditingInfo)}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200"
                  >
                    <FaEdit className="text-sm" />
                  </button>
                </div>
                
                {isEditingInfo ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Delivery Address (if applicable)"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                    <textarea
                      placeholder="Special Instructions"
                      value={customerInfo.deliveryInstructions}
                      onChange={(e) => setCustomerInfo({...customerInfo, deliveryInstructions: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white h-20 resize-none"
                    />
                    <button
                      onClick={() => {
                        saveCustomerInfo(customerInfo);
                        setIsEditingInfo(false);
                      }}
                      className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <FaSave />
                      <span>Save Information</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <FaUser className="mr-2 text-gray-400" />
                      <span>{customerInfo.name || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2 text-gray-400" />
                      <span>{customerInfo.email || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="mr-2 text-gray-400" />
                      <span>{customerInfo.phone || 'Not provided'}</span>
                    </div>
                    {customerInfo.address && (
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="mr-2 text-gray-400 mt-1" />
                        <span>{customerInfo.address}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Order Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <FaCalculator className="mr-2 text-green-600" />
                  Order Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Costs:</span>
                    <span className="font-semibold">${calculateTotalDeliveryCost().toFixed(2)}</span>
                  </div>
                  {calculateSavings() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Total Savings:</span>
                      <span className="font-semibold">-${calculateSavings().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-500 text-right">
                      ≈ {(calculateTotal() * exchangeRate).toFixed(2)} ETB
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <FaCreditCard className="mr-2 text-blue-600" />
                  Payment Method
                </h3>
                
                <div className="space-y-2">
                  {[
                    { key: 'chapa', label: 'Chapa (Ethiopia)', icon: '🇪🇹' },
                    { key: 'stripe', label: 'Credit/Debit Card', icon: '💳' },
                    { key: 'bank', label: 'Bank Transfer', icon: '🏦' }
                  ].map(({ key, label, icon }) => (
                    <label key={key} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={key}
                        checked={selectedPaymentMethod === key}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-lg">{icon}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <FaCreditCard />
                <span>Proceed to Checkout</span>
                <span className="text-sm opacity-90">${calculateTotal().toFixed(2)}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketCart;