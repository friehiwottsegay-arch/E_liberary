import React, { useState, useEffect } from 'react';
import {
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaCreditCard,
  FaTruck,
  FaFile
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MarketCartSimple = () => {
  const [cartItems, setCartItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const navigate = useNavigate();
  const exchangeRate = 55;

  useEffect(() => {
    const savedCartItems = localStorage.getItem('marketCartItems');
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
  }, []);

  const removeItem = (itemId) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    localStorage.setItem('marketCartItems', JSON.stringify(updatedItems));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity, price: item.book.price * newQuantity }
        : item
    );
    setCartItems(updatedItems);
    localStorage.setItem('marketCartItems', JSON.stringify(updatedItems));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Cart is empty!');
      return;
    }
    
    if (!customerInfo.name || !customerInfo.email) {
      alert('Please fill name and email.');
      return;
    }
    
    const orderData = {
      items: cartItems,
      customer: customerInfo,
      total: calculateTotal()
    };
    
    localStorage.setItem('pendingOrder', JSON.stringify(orderData));
    navigate('/payment-confirmation');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaShoppingCart className="mr-2" />
              Cart ({cartItems.length})
            </h1>
            <button
              onClick={() => navigate('/market')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaShoppingCart className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl text-gray-600 mb-4">Your cart is empty</h2>
            <button
              onClick={() => navigate('/market')}
              className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.book.cover_url || '/api/placeholder/80/100'}
                      alt={item.book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.book.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        by {item.book.author}
                      </p>
                      <p className="text-green-600 font-bold">
                        ${item.price.toFixed(2)}
                      </p>
                      <p className="text-gray-500 text-sm">
                        ≈ {(item.price * exchangeRate).toFixed(0)} ETB
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                      >
                        <FaMinus />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Summary */}
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Customer Info</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-green-600">${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-500 text-right">
                      ≈ {(calculateTotal() * exchangeRate).toFixed(0)} ETB
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FaCreditCard className="mr-2" />
                  Payment
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="payment" value="chapa" defaultChecked />
                    <span>🇪🇹 Chapa (Ethiopia)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="payment" value="card" />
                    <span>💳 Card Payment</span>
                  </label>
                </div>
              </div>
              
              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 flex items-center justify-center space-x-2"
              >
                <FaCreditCard />
                <span>Checkout ${calculateTotal().toFixed(2)}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketCartSimple;