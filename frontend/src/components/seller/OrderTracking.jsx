import React, { useState, useEffect } from "react";
import {
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaArrowLeft,
  FaShoppingCart
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');
      
      // Mock order data for demonstration
      const mockOrders = [
        {
          id: 'ORD-001',
          bookTitle: 'Advanced Mathematics',
          bookCover: 'http://127.0.0.1:8000/media/books/covers/cover_UV3Thzr.png',
          sellerName: 'Math Books Store',
          totalAmount: 25.99,
          orderDate: '2025-11-01',
          status: 'delivered',
          estimatedDelivery: '2025-11-03',
          actualDelivery: '2025-11-03',
          trackingNumber: 'TRK123456789',
          deliveryAddress: 'Addis Ababa, Ethiopia',
          paymentMethod: 'Credit Card',
          items: [
            { name: 'Advanced Mathematics', price: 25.99, quantity: 1 }
          ]
        },
        {
          id: 'ORD-002',
          bookTitle: 'Physics Fundamentals',
          bookCover: 'http://127.0.0.1:8000/media/books/covers/cover_UV3Thzr.png',
          sellerName: 'Science Books Ltd',
          totalAmount: 22.99,
          orderDate: '2025-11-03',
          status: 'shipped',
          estimatedDelivery: '2025-11-06',
          trackingNumber: 'TRK987654321',
          deliveryAddress: 'Addis Ababa, Ethiopia',
          paymentMethod: 'PayPal',
          items: [
            { name: 'Physics Fundamentals', price: 22.99, quantity: 1 }
          ]
        },
        {
          id: 'ORD-003',
          bookTitle: 'Chemistry for Students',
          bookCover: 'http://127.0.0.1:8000/media/books/covers/cover_UV3Thzr.png',
          sellerName: 'Chemistry Corner',
          totalAmount: 19.99,
          orderDate: '2025-11-04',
          status: 'processing',
          estimatedDelivery: '2025-11-07',
          trackingNumber: null,
          deliveryAddress: 'Addis Ababa, Ethiopia',
          paymentMethod: 'Mobile Money',
          items: [
            { name: 'Chemistry for Students', price: 19.99, quantity: 1 }
          ]
        }
      ];

      setOrders(mockOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <FaClock className="text-yellow-500" />;
      case 'shipped':
        return <FaTruck className="text-blue-500" />;
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            >
              <FaArrowLeft className="mr-2" />
              Back to Home
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
              <p className="text-gray-600">Track your book orders and delivery status</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/market')}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaShoppingCart className="mr-2" />
            Continue Shopping
          </button>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Found</h3>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/market')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2 capitalize">{order.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={order.bookCover}
                      alt={order.bookTitle}
                      className="w-16 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{order.bookTitle}</h4>
                      <p className="text-sm text-gray-600">by {order.sellerName}</p>
                      <p className="text-lg font-bold text-green-600 mt-1">${order.totalAmount}</p>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <FaMapMarkerAlt className="mr-2" />
                        {order.deliveryAddress}
                      </div>
                      <div className="text-right">
                        {order.trackingNumber && (
                          <p className="text-gray-600">Track: {order.trackingNumber}</p>
                        )}
                        <p className="text-gray-500">
                          Expected: {formatDate(order.estimatedDelivery)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order #{selectedOrder.id}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Order Status */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIcon(selectedOrder.status)}
                      <span className="ml-2 font-semibold text-gray-900 capitalize">
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedOrder.actualDelivery && (
                        <span>Delivered on {formatDate(selectedOrder.actualDelivery)}</span>
                      )}
                      {selectedOrder.status !== 'delivered' && (
                        <span>Expected by {formatDate(selectedOrder.estimatedDelivery)}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-6">
                  {/* Book Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Book Details</h3>
                    <div className="flex items-center space-x-4">
                      <img
                        src={selectedOrder.bookCover}
                        alt={selectedOrder.bookTitle}
                        className="w-20 h-24 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{selectedOrder.bookTitle}</h4>
                        <p className="text-gray-600">by {selectedOrder.sellerName}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          ${selectedOrder.totalAmount} • Qty: 1
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Delivery Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Delivery Address</p>
                        <p className="font-medium">{selectedOrder.deliveryAddress}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Payment Method</p>
                        <p className="font-medium">{selectedOrder.paymentMethod}</p>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div>
                          <p className="text-gray-600">Tracking Number</p>
                          <p className="font-medium">{selectedOrder.trackingNumber}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-600">Order Date</p>
                        <p className="font-medium">{formatDate(selectedOrder.orderDate)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total Amount</span>
                      <span className="text-green-600">${selectedOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Seller Button */}
                <div className="mt-6 pt-6 border-t">
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors">
                    Contact Seller
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;