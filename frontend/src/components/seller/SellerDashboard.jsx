import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaStore, 
  FaUserCog, 
  FaShoppingCart, 
  FaChartBar, 
  FaCog,
  FaEye,
  FaLock
} from "react-icons/fa";
import axios from "axios";

const SellerDashboard = () => {
  const [sellerInfo, setSellerInfo] = useState(null);
  const [selectedView, setSelectedView] = useState(null);
  const [userType, setUserType] = useState(null); // 'seller' or 'normal'
  const navigate = useNavigate();

  useEffect(() => {
    // Check user type and authentication
    checkUserType();
  }, []);

  const checkUserType = () => {
    const isSeller = localStorage.getItem('isSeller');
    const isAuthenticated = localStorage.getItem('authToken');
    
    if (isSeller === 'true') {
      setUserType('seller');
      fetchSellerInfo();
    } else if (isAuthenticated) {
      setUserType('normal');
    } else {
      // Not authenticated
      navigate('/login');
    }
  };

  const fetchSellerInfo = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://127.0.0.1:8000/api/seller/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSellerInfo(response.data);
    } catch (error) {
      console.error("Error fetching seller info:", error);
    }
  };

  const sellerViews = [
    {
      id: 'overview',
      title: 'Dashboard Overview',
      icon: FaChartBar,
      description: 'Sales analytics and key metrics',
      path: '/seller/dashboard/overview'
    },
    {
      id: 'products',
      title: 'Product Management',
      icon: FaStore,
      description: 'Add, edit, and manage your books',
      path: '/seller/dashboard/products'
    },
    {
      id: 'orders',
      title: 'Order Management',
      icon: FaShoppingCart,
      description: 'View and process customer orders',
      path: '/seller/dashboard/orders'
    },
    {
      id: 'analytics',
      title: 'Sales Analytics',
      icon: FaChartBar,
      description: 'Detailed sales reports and insights',
      path: '/seller/dashboard/analytics'
    },
    {
      id: 'settings',
      title: 'Account Settings',
      icon: FaCog,
      description: 'Manage your seller account',
      path: '/seller/dashboard/settings'
    }
  ];

  const normalUserViews = [
    {
      id: 'tracking',
      title: 'Order Tracking',
      icon: FaEye,
      description: 'Track your orders and deliveries',
      path: '/seller/tracking'
    }
  ];

  const handleViewSelect = (view) => {
    if (userType === 'normal' && view.id !== 'tracking') {
      // Normal users can only access tracking
      alert('You do not have seller privileges. Contact support to upgrade your account.');
      return;
    }
    
    // For sellers, redirect to the appropriate path
    if (userType === 'seller') {
      if (view.id === 'overview') {
        navigate('/seller/admin');
      } else if (view.id === 'products') {
        navigate('/seller/admin?section=books');
      } else if (view.id === 'orders') {
        navigate('/seller/admin?section=orders');
      } else if (view.id === 'analytics') {
        navigate('/seller/admin?section=analytics');
      } else if (view.id === 'settings') {
        navigate('/seller/admin?section=profile');
      }
    } else {
      navigate(view.path);
    }
  };

  if (!selectedView && userType) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {userType === 'seller' ? 'Seller Dashboard' : 'Order Tracking'}
            </h1>
            <p className="text-gray-600">
              {userType === 'seller'
                ? 'Manage your bookstore and monitor sales performance'
                : 'Track your orders and delivery status'
              }
            </p>
          </div>

          {/* User Type Badge */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
              userType === 'seller'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
            }`}>
              <FaLock className="mr-2" />
              {userType === 'seller' ? 'Seller Account' : 'Customer Account'}
            </div>
          </div>

          {/* Seller Info */}
          {userType === 'seller' && sellerInfo && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FaStore className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {sellerInfo.business_name || 'Your Bookstore'}
                  </h2>
                  <p className="text-gray-600">{sellerInfo.email}</p>
                  <p className="text-sm text-gray-500">
                    Member since {new Date(sellerInfo.date_joined).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Views Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(userType === 'seller' ? sellerViews : normalUserViews).map((view) => {
              const IconComponent = view.icon;
              return (
                <div
                  key={view.id}
                  onClick={() => handleViewSelect(view)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group p-6 border border-gray-100 hover:border-blue-200"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="text-white text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {view.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {view.description}
                    </p>
                    {userType === 'normal' && view.id !== 'tracking' && (
                      <div className="mt-3 px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        Limited Access
                      </div>
                    )}
                    {userType === 'seller' && (
                      <div className="mt-3 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Click to Manage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Action for Sellers */}
          {userType === 'seller' && (
            <div className="mt-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white text-center">
              <h3 className="text-xl font-semibold mb-2">Ready to Manage Your Bookstore?</h3>
              <p className="mb-4">
                Access your comprehensive seller admin dashboard to manage books, orders, and analytics.
              </p>
              <button
                onClick={() => navigate('/seller/admin')}
                className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Go to Seller Admin Dashboard
              </button>
            </div>
          )}

          {/* Call to Action for Normal Users */}
          {userType === 'normal' && (
            <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white text-center">
              <h3 className="text-xl font-semibold mb-2">Want to Become a Seller?</h3>
              <p className="mb-4">
                Join our marketplace and start selling your books to thousands of customers.
              </p>
              <button
                onClick={() => navigate('/seller/upgrade')}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Upgrade to Seller Account
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default SellerDashboard;