import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStore,
  FaUserCog,
  FaShoppingCart,
  FaChartBar,
  FaCog,
  FaEye,
  FaBook,
  FaDollarSign,
  FaUsers,
  FaBox,
  FaTachometerAlt,
  FaPlus,
  FaList,
  FaClipboardList,
  FaBell,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaDownload,
  FaUpload,
  FaClock,
  FaCheck,
  FaStar,
  FaGift,
  FaHome,
  FaInbox,
  FaQuestionCircle,
  FaPhone,
  FaEnvelope,
  FaCreditCard,
  FaTag,
  FaFileAlt,
  FaCalendarAlt,
  FaChartLine,
  FaMoneyBillWave,
  FaUserFriends,
  FaShippingFast,
  FaWarehouse,
  FaPercentage,
  FaCrown,
  FaCoins,
  FaRocket,
  FaBriefcase,
  FaUserTie,
  FaHandshake,
  FaLightbulb,
  FaTools,
  FaShieldAlt,
  FaUserPlus,
  FaComments,
  FaFileInvoice,
  FaChartPie,
  FaTrophy,
  FaGraduationCap,
  FaBookOpen,
  FaNewspaper,
  FaShare
} from "react-icons/fa";
import axios from "axios";
import { getToken, getUserData, isAuthenticated, clearAuthData, isSeller } from "../../utils/authUtils";
import SellerNavbar from "./SellerNavbar";

const SellerAdminDashboard = () => {
  const [selectedView, setSelectedView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const API_BASE = 'http://127.0.0.1:8000/api';

  useEffect(() => {
    checkSellerAuth();
  }, []);

  const checkSellerAuth = async () => {
    try {
      // Check if user is authenticated and has seller role
      if (!isAuthenticated()) {
        clearAuthData();
        navigate('/login', { replace: true });
        return;
      }

      const userData = getUserData();
      if (!userData) {
        clearAuthData();
        navigate('/login', { replace: true });
        return;
      }

      // Use unified seller detection from authUtils
      if (!isSeller()) {
        navigate('/unauthorized', { replace: true });
        return;
      }

      const token = getToken();
      if (!token) {
        clearAuthData();
        navigate('/login', { replace: true });
        return;
      }

      // Get seller profile with graceful error handling
      try {
        const profileResponse = await axios.get(`${API_BASE}/seller/profile/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setSellerInfo(profileResponse.data);
      } catch (profileError) {
        console.warn('Seller profile not available:', profileError.message);
        // Continue without profile data - not critical for dashboard functionality
      }

      // Get dashboard stats with graceful error handling
      try {
        const statsResponse = await axios.get(`${API_BASE}/seller-books/dashboard_stats/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setDashboardStats(statsResponse.data);
      } catch (statsError) {
        console.warn('Dashboard stats not available:', statsError.message);
        // Continue without stats data - not critical for dashboard functionality
        setDashboardStats({
          total_books: 0,
          total_orders: 0,
          total_sales: 0,
          monthly_revenue: 0
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading seller data:", error);
      if (error.response?.status === 401) {
        clearAuthData();
        navigate('/login');
      } else {
        navigate('/unauthorized');
      }
    }
  };

  // ENHANCED SELLER MENU - Better organized and more functional
  const mainMenuItems = [
    { 
      id: 'overview', 
      title: 'Dashboard', 
      icon: FaTachometerAlt, 
      description: 'Business overview',
      badge: null,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'my-books', 
      title: 'My Books', 
      icon: FaBookOpen, 
      description: 'Book inventory',
      badge: dashboardStats?.total_books || 0,
      color: 'from-green-500 to-green-600'
    },
    { 
      id: 'my-orders', 
      title: 'Orders', 
      icon: FaShoppingCart, 
      description: 'Customer orders',
      badge: dashboardStats?.total_orders || 0,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'my-sales', 
      title: 'Sales', 
      icon: FaChartLine, 
      description: 'Sales reports',
      badge: null,
      color: 'from-orange-500 to-orange-600'
    },
    { 
      id: 'my-revenue', 
      title: 'Revenue', 
      icon: FaDollarSign, 
      description: 'Financial reports',
      badge: null,
      color: 'from-emerald-500 to-emerald-600'
    }
  ];

  const businessMenuItems = [
    { 
      id: 'my-customers', 
      title: 'Customers', 
      icon: FaUserFriends, 
      description: 'Customer management',
      badge: null,
      color: 'from-cyan-500 to-cyan-600'
    },
    { 
      id: 'my-inventory', 
      title: 'Inventory', 
      icon: FaWarehouse, 
      description: 'Stock management',
      badge: null,
      color: 'from-indigo-500 to-indigo-600'
    },
    { 
      id: 'my-promotions', 
      title: 'Promotions', 
      icon: FaGift, 
      description: 'Marketing campaigns',
      badge: 3,
      color: 'from-pink-500 to-pink-600'
    },
    { 
      id: 'my-marketing', 
      title: 'Marketing', 
      icon: FaLightbulb, 
      description: 'Marketing tools',
      badge: null,
      color: 'from-yellow-500 to-yellow-600'
    },
    { 
      id: 'my-analytics', 
      title: 'Analytics', 
      icon: FaChartPie, 
      description: 'Business insights',
      badge: null,
      color: 'from-teal-500 to-teal-600'
    }
  ];

  const supportMenuItems = [
    { 
      id: 'my-support', 
      title: 'Support', 
      icon: FaComments, 
      description: 'Customer support',
      badge: 5,
      color: 'from-red-500 to-red-600'
    },
    { 
      id: 'my-shipping', 
      title: 'Shipping', 
      icon: FaShippingFast, 
      description: 'Delivery management',
      badge: null,
      color: 'from-slate-500 to-slate-600'
    },
    { 
      id: 'help', 
      title: 'Help Center', 
      icon: FaQuestionCircle, 
      description: 'Get help',
      badge: null,
      color: 'from-violet-500 to-violet-600'
    }
  ];

  const accountMenuItems = [
    { 
      id: 'my-profile', 
      title: 'Profile', 
      icon: FaUserCog, 
      description: 'Account settings',
      badge: null,
      color: 'from-gray-500 to-gray-600'
    },
    { 
      id: 'my-tools', 
      title: 'Tools', 
      icon: FaTools, 
      description: 'Business tools',
      badge: null,
      color: 'from-sky-500 to-sky-600'
    },
    { 
      id: 'my-contracts', 
      title: 'Contracts', 
      icon: FaFileInvoice, 
      description: 'Agreements',
      badge: null,
      color: 'from-amber-500 to-amber-600'
    },
    { 
      id: 'my-security', 
      title: 'Security', 
      icon: FaShieldAlt, 
      description: 'Account security',
      badge: null,
      color: 'from-rose-500 to-rose-600'
    }
  ];

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  const handleProfileMenuAction = (action) => {
    switch(action) {
      case 'profile':
        setSelectedView('my-profile');
        break;
      case 'settings':
        setSelectedView('my-settings');
        break;
      case 'help':
        setSelectedView('help');
        break;
      case 'logout':
        handleLogout();
        break;
    }
    setShowProfileMenu(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Your Seller Admin Dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Preparing your business tools</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex flex-col overflow-hidden">
      {/* FIXED TOP NAVIGATION - NO SCROLL */}
      <div className="bg-white shadow-lg border-b border-purple-200 flex-shrink-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-purple-600 hover:bg-purple-50 transition-colors"
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <FaStore className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Seller Portal</h1>
                <p className="text-sm text-purple-600">My Business Management</p>
              </div>
            </div>
          </div>
          
          {/* SELLER-FOCUSED SEARCH */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-purple-400" />
              <input
                type="text"
                placeholder="Search my books, orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* SELLER QUICK ACTIONS */}
            <button
              onClick={() => setSelectedView('my-books')}
              className="p-2 rounded-md text-purple-600 hover:bg-purple-50 transition-colors"
              title="Add New Book"
            >
              <FaPlus />
            </button>
            <button
              onClick={() => setSelectedView('my-analytics')}
              className="p-2 rounded-md text-purple-600 hover:bg-purple-50 transition-colors"
              title="View Analytics"
            >
              <FaChartBar />
            </button>
            <button
              onClick={() => setSelectedView('my-tools')}
              className="p-2 rounded-md text-purple-600 hover:bg-purple-50 transition-colors"
              title="Business Tools"
            >
              <FaTools />
            </button>
            
            {/* SELLER NOTIFICATIONS */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-md text-purple-600 hover:bg-purple-50 relative transition-colors"
              >
                <FaBell />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-purple-200 z-50">
                  <div className="p-4 border-b border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-900">My Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map((notification, index) => (
                      <div key={index} className="p-4 border-b border-gray-100 hover:bg-purple-50">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-gray-500">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    )) : (
                      <div className="p-4 text-center text-gray-500">
                        <p>No new notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* SELLER PROFILE MENU */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-purple-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {sellerInfo?.first_name?.[0] || 'S'}
                  </span>
                </div>
                <div className="text-sm text-left">
                  <p className="font-semibold text-gray-900">{sellerInfo?.first_name || 'Seller'}</p>
                  <p className="text-purple-500 text-xs">{sellerInfo?.business_name || 'My Business'}</p>
                </div>
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-purple-200 z-50">
                  <div className="p-4 border-b border-purple-200">
                    <p className="font-semibold text-gray-900">{sellerInfo?.first_name} {sellerInfo?.last_name}</p>
                    <p className="text-sm text-gray-500">{sellerInfo?.email}</p>
                    <p className="text-xs text-purple-600 font-medium">{sellerInfo?.business_type?.toUpperCase()} SELLER</p>
                  </div>
                  <div className="py-2">
                    <button onClick={() => handleProfileMenuAction('profile')} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center space-x-2">
                      <FaUserCog />
                      <span>My Profile</span>
                    </button>
                    <button onClick={() => handleProfileMenuAction('settings')} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center space-x-2">
                      <FaCog />
                      <span>My Settings</span>
                    </button>
                    <button onClick={() => handleProfileMenuAction('help')} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center space-x-2">
                      <FaQuestionCircle />
                      <span>Help & Support</span>
                    </button>
                    <hr className="my-2" />
                    <button onClick={() => handleProfileMenuAction('logout')} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA - SIDEBAR AND CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* SCROLLABLE SIDEBAR - INDEPENDENT SCROLLING */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex-shrink-0`}>
          <nav className="h-full overflow-y-auto p-4">
            {/* MAIN BUSINESS SECTION */}
            {sidebarOpen && (
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-3 flex items-center sticky top-0 bg-white z-10">
                  <FaStore className="mr-2" />
                  Business
                </h3>
                <ul className="space-y-2">
                  {mainMenuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => setSelectedView(item.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group hover:scale-105 ${
                            selectedView === item.id
                              ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              selectedView === item.id
                                ? 'bg-white/20'
                                : 'bg-gray-100 group-hover:bg-gray-200'
                            }`}>
                              <IconComponent className="text-sm" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-sm">{item.title}</p>
                              <p className="text-xs opacity-75">{item.description}</p>
                            </div>
                          </div>
                          {item.badge !== null && item.badge > 0 && (
                            <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                              selectedView === item.id
                                ? 'bg-white text-gray-700'
                                : 'bg-purple-500 text-white'
                            }`}>
                              {item.badge > 99 ? '99+' : item.badge}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* BUSINESS OPERATIONS SECTION */}
            {sidebarOpen && (
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3 flex items-center sticky top-0 bg-white z-10">
                  <FaBriefcase className="mr-2" />
                  Operations
                </h3>
                <ul className="space-y-2">
                  {businessMenuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => setSelectedView(item.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group hover:scale-105 ${
                            selectedView === item.id
                              ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              selectedView === item.id
                                ? 'bg-white/20'
                                : 'bg-gray-100 group-hover:bg-gray-200'
                            }`}>
                              <IconComponent className="text-sm" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-sm">{item.title}</p>
                              <p className="text-xs opacity-75">{item.description}</p>
                            </div>
                          </div>
                          {item.badge !== null && item.badge > 0 && (
                            <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                              selectedView === item.id
                                ? 'bg-white text-gray-700'
                                : 'bg-red-500 text-white'
                            }`}>
                              {item.badge > 99 ? '99+' : item.badge}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* SUPPORT SECTION */}
            {sidebarOpen && (
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-3 flex items-center sticky top-0 bg-white z-10">
                  <FaComments className="mr-2" />
                  Support
                </h3>
                <ul className="space-y-2">
                  {supportMenuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => setSelectedView(item.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group hover:scale-105 ${
                            selectedView === item.id
                              ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              selectedView === item.id
                                ? 'bg-white/20'
                                : 'bg-gray-100 group-hover:bg-gray-200'
                            }`}>
                              <IconComponent className="text-sm" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-sm">{item.title}</p>
                              <p className="text-xs opacity-75">{item.description}</p>
                            </div>
                          </div>
                          {item.badge !== null && item.badge > 0 && (
                            <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                              selectedView === item.id
                                ? 'bg-white text-gray-700'
                                : 'bg-red-500 text-white'
                            }`}>
                              {item.badge > 99 ? '99+' : item.badge}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* ACCOUNT SECTION */}
            {sidebarOpen && (
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 flex items-center sticky top-0 bg-white z-10">
                  <FaUserTie className="mr-2" />
                  Account
                </h3>
                <ul className="space-y-2">
                  {accountMenuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => setSelectedView(item.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group hover:scale-105 ${
                            selectedView === item.id
                              ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              selectedView === item.id
                                ? 'bg-white/20'
                                : 'bg-gray-100 group-hover:bg-gray-200'
                            }`}>
                              <IconComponent className="text-sm" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-sm">{item.title}</p>
                              <p className="text-xs opacity-75">{item.description}</p>
                            </div>
                          </div>
                          {item.badge !== null && item.badge > 0 && (
                            <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                              selectedView === item.id
                                ? 'bg-white text-gray-700'
                                : 'bg-red-500 text-white'
                            }`}>
                              {item.badge > 99 ? '99+' : item.badge}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* COLLAPSED SIDEBAR - ENHANCED QUICK STATS */}
            {!sidebarOpen && (
              <div className="mt-6 space-y-4">
                <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{dashboardStats?.total_books || 0}</div>
                  <div className="text-xs text-purple-500">Books</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">${dashboardStats?.total_sales?.toFixed(0) || '0'}</div>
                  <div className="text-xs text-green-500">Revenue</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{dashboardStats?.total_orders || 0}</div>
                  <div className="text-xs text-blue-500">Orders</div>
                </div>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="w-full p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                  title="Expand Sidebar"
                >
                  <FaBars className="mx-auto" />
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* SCROLLABLE MAIN CONTENT - INDEPENDENT SCROLLING */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedView === 'overview' && <SellerOverview stats={dashboardStats} />}
          {selectedView === 'my-books' && <MyBooks />}
          {selectedView === 'my-orders' && <MyOrders />}
          {selectedView === 'my-sales' && <MySales />}
          {selectedView === 'my-inventory' && <MyInventory />}
          {selectedView === 'my-revenue' && <MyRevenue />}
          {selectedView === 'my-customers' && <MyCustomers />}
          {selectedView === 'my-promotions' && <MyPromotions />}
          {selectedView === 'my-marketing' && <MyMarketing />}
          {selectedView === 'my-shipping' && <MyShipping />}
          {selectedView === 'my-support' && <MySupport />}
          {selectedView === 'my-analytics' && <MyAnalytics />}
          {selectedView === 'my-profile' && <MyProfile sellerInfo={sellerInfo} />}
          {selectedView === 'my-settings' && <MySettings />}
          {selectedView === 'my-tools' && <MyTools />}
          {selectedView === 'my-contracts' && <MyContracts />}
          {selectedView === 'my-security' && <MySecurity />}
          {selectedView === 'help' && <SellerHelp />}
        </div>
      </div>
    </div>
  );
};

// SELLER OVERVIEW DASHBOARD
const SellerOverview = ({ stats }) => {
  if (!stats) {
    return <div className="text-center py-8">Loading my business data...</div>;
  }

  const myStatCards = [
    { 
      title: 'My Books', 
      value: stats.total_books, 
      icon: FaBook, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    { 
      title: 'My Orders', 
      value: stats.total_orders || 0, 
      icon: FaShoppingCart, 
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    },
    { 
      title: 'My Revenue', 
      value: `$${stats.total_sales?.toFixed(2) || '0.00'}`, 
      icon: FaDollarSign, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    },
    { 
      title: 'My Views', 
      value: stats.total_views, 
      icon: FaEye, 
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Business Dashboard</h2>
        <p className="text-gray-600">Welcome back! Here's your business performance overview.</p>
      </div>

      {/* MY STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {myStatCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className={`bg-gradient-to-r ${stat.bgColor} rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-full shadow-lg`}>
                  <IconComponent className="text-white text-xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MY RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaBook className="mr-2 text-purple-600" />
              My Recent Books
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recent_books?.slice(0, 5).map((book, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{book.title}</p>
                    <p className="text-sm text-gray-500">
                      Added {new Date(book.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    book.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {book.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              )) || <p className="text-gray-500">No recent books</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaStar className="mr-2 text-yellow-500" />
              My Top Performing Books
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.top_performing?.slice(0, 5).map((book, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{book.title}</p>
                    <p className="text-sm text-gray-500">{book.views} views</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-yellow-600">#{index + 1}</p>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 text-xs mr-1" />
                      <span className="text-xs text-gray-500">Top Rated</span>
                    </div>
                  </div>
                </div>
              )) || <p className="text-gray-500">No performance data</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// MY BOOKS COMPONENT
const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      const token = getToken();
      const response = await axios.get('http://127.0.0.1:8000/api/seller-books/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching my books:", error);
      setLoading(false);
    }
  };

  const toggleBookStatus = async (bookId, currentStatus) => {
    try {
      const token = getToken();
      await axios.patch(
        `http://127.0.0.1:8000/api/seller-books/${bookId}/`,
        { is_active: !currentStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      fetchMyBooks(); // Refresh the list
    } catch (error) {
      console.error("Error updating book status:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading my books...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaBook className="mr-2 text-purple-600" />
            My Books
          </h2>
          <p className="text-gray-600">Manage your book inventory and listings</p>
        </div>
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg">
          <FaPlus />
          <span>Add New Book</span>
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-3 text-purple-400" />
            <input
              type="text"
              placeholder="Search my books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button className="px-6 py-3 border border-purple-200 rounded-lg flex items-center space-x-2 hover:bg-purple-50 transition-colors">
            <FaFilter />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* MY BOOKS TABLE */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-indigo-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 uppercase">My Book</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 uppercase">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 uppercase">My Price</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 uppercase">My Views</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {books.filter(book => 
                book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author?.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((book) => (
                <tr key={book.id} className="hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
                        <FaBook className="text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                        <div className="text-sm text-gray-500">{book.author}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                      {book.book_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    ${book.hard_price || '0.00'} / ${book.soft_price || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      book.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {book.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {book.views || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-purple-600 hover:text-purple-900 p-2 rounded-lg hover:bg-purple-100 transition-colors">
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => toggleBookStatus(book.id, book.is_active)}
                        className={`p-2 rounded-lg transition-colors ${
                          book.is_active 
                            ? 'text-red-600 hover:text-red-900 hover:bg-red-100' 
                            : 'text-green-600 hover:text-green-900 hover:bg-green-100'
                        }`}
                      >
                        {book.is_active ? <FaTrash /> : <FaEye />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// MY ORDERS COMPONENT
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const token = getToken();
      const response = await axios.get('http://127.0.0.1:8000/api/seller-books/order_management/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setOrders(response.data.orders || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching my orders:", error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = getToken();
      await axios.post(
        `http://127.0.0.1:8000/api/seller-books/${orderId}/update_order_status/`,
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      fetchMyOrders(); // Refresh the list
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading my orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaShoppingCart className="mr-2 text-purple-600" />
          My Orders
        </h2>
        <p className="text-gray-600">Track and manage my customer orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <FaShoppingCart className="text-blue-500 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(order => order.status === 'pending').length}
              </p>
            </div>
            <FaClock className="text-yellow-500 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Completed Orders</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(order => order.status === 'completed').length}
              </p>
            </div>
            <FaCheck className="text-green-500 text-2xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-indigo-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 uppercase">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 uppercase">My Book</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 uppercase">My Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 uppercase">My Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.book_title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customer_email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                    ${order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// MY SALES COMPONENT
const MySales = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMySales();
  }, []);

  const fetchMySales = async () => {
    try {
      const token = getToken();
      const response = await axios.get('http://127.0.0.1:8000/api/seller-books/sales_analytics/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAnalyticsData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching my sales:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading my sales data...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaChartBar className="mr-2 text-purple-600" />
          My Sales
        </h2>
        <p className="text-gray-600">My detailed sales reports and performance insights</p>
      </div>

      {analyticsData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${analyticsData.total_revenue?.toFixed(2) || '0.00'}</p>
                </div>
                <FaDollarSign className="text-green-500 text-2xl" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Orders This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.orders_this_month || 0}</p>
                </div>
                <FaShoppingCart className="text-blue-500 text-2xl" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">${analyticsData.average_order_value?.toFixed(2) || '0.00'}</p>
                </div>
                <FaChartBar className="text-purple-500 text-2xl" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Orders (7 days)</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.orders_last_7_days || 0}</p>
                </div>
                <FaTachometerAlt className="text-orange-500 text-2xl" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaStar className="mr-2 text-yellow-500" />
                My Top Earning Books
              </h3>
              <div className="space-y-3">
                {analyticsData.top_earning_books?.map((book, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm text-gray-600">{book.book__title || 'Unknown'}</span>
                    <span className="text-sm font-semibold text-gray-900">${book.total_sales?.toFixed(2) || '0.00'}</span>
                  </div>
                )) || <p className="text-gray-500">No data available</p>}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaCreditCard className="mr-2 text-purple-600" />
                My Payment Type Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(analyticsData.revenue_by_payment_type || {}).map(([type, amount]) => (
                  <div key={type} className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm text-gray-600 capitalize">{type.replace('_', ' ')}</span>
                    <span className="text-sm font-semibold text-gray-900">${amount?.toFixed(2) || '0.00'}</span>
                  </div>
                )) || <p className="text-gray-500">No data available</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// MY INVENTORY COMPONENT
const MyInventory = () => {
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyInventory();
  }, []);

  const fetchMyInventory = async () => {
    try {
      const token = getToken();
      const response = await axios.get('http://127.0.0.1:8000/api/seller/inventory/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setInventoryData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching my inventory:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading my inventory...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaBox className="mr-2 text-purple-600" />
          My Inventory
        </h2>
        <p className="text-gray-600">Track and manage my book inventory</p>
      </div>

      {inventoryData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Total Books</p>
                  <p className="text-2xl font-bold text-gray-900">{inventoryData.total_books}</p>
                </div>
                <FaBox className="text-blue-500 text-2xl" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Active Books</p>
                  <p className="text-2xl font-bold text-green-600">{inventoryData.inventory_by_status?.active || 0}</p>
                </div>
                <FaEye className="text-green-500 text-2xl" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Featured Books</p>
                  <p className="text-2xl font-bold text-purple-600">{inventoryData.inventory_by_status?.featured || 0}</p>
                </div>
                <FaStar className="text-purple-500 text-2xl" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Free Books</p>
                  <p className="text-2xl font-bold text-orange-600">{inventoryData.inventory_by_status?.free || 0}</p>
                </div>
                <FaGift className="text-orange-500 text-2xl" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaBook className="mr-2 text-blue-600" />
                My Books by Type
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-600">My Hard Copy Books</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {inventoryData.inventory_by_type?.hard_copy || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-600">My Soft Copy Books</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {inventoryData.inventory_by_type?.soft_copy || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-gray-600">My Both Available</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {inventoryData.inventory_by_type?.both || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm text-gray-600">My Rental Books</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {inventoryData.inventory_by_type?.rental || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaClock className="mr-2 text-gray-500" />
                My Recent Updates
              </h3>
              <div className="space-y-3">
                {inventoryData.recent_updates?.slice(0, 5).map((book, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{book.title}</p>
                      <p className="text-xs text-gray-500">
                        Updated {new Date(book.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      book.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {book.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                )) || <p className="text-gray-500">No recent updates</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// MY REVENUE COMPONENT
const MyRevenue = () => {
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    profitMargin: 0,
    monthlyGrowth: 0,
    expenses: 0
  });

  useEffect(() => {
    // Simulate fetching revenue data
    setRevenueData({
      totalRevenue: 15420.50,
      profitMargin: 28.5,
      monthlyGrowth: 12.8,
      expenses: 3210.00
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaDollarSign className="mr-2 text-purple-600" />
            My Revenue
          </h2>
          <p className="text-gray-600">My financial reports and revenue tracking</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg">
            <FaDownload />
            <span>Export PDF</span>
          </button>
          <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg">
            <FaDownload />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${revenueData.totalRevenue.toFixed(2)}</p>
            </div>
            <FaMoneyBillWave className="text-green-500 text-2xl" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-green-600 font-medium">+{revenueData.monthlyGrowth}% this month</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Profit Margin</p>
              <p className="text-2xl font-bold text-gray-900">{revenueData.profitMargin}%</p>
            </div>
            <FaPercentage className="text-blue-500 text-2xl" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-blue-600 font-medium">Above average!</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">${revenueData.expenses.toFixed(2)}</p>
            </div>
            <FaCoins className="text-red-500 text-2xl" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-red-600 font-medium">18% of revenue</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Net Profit</p>
              <p className="text-2xl font-bold text-gray-900">${(revenueData.totalRevenue - revenueData.expenses).toFixed(2)}</p>
            </div>
            <FaCrown className="text-purple-500 text-2xl" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-purple-600 font-medium">This month</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FaChartBar className="mr-2 text-blue-600" />
            My Revenue Breakdown
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-600">My Hard Copy Sales</span>
              <span className="text-sm font-semibold text-gray-900">$9,200 (59.6%)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-600">My Digital Sales</span>
              <span className="text-sm font-semibold text-gray-900">$4,150 (26.9%)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm text-gray-600">My Rental Income</span>
              <span className="text-sm font-semibold text-gray-900">$1,070 (6.9%)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-sm text-gray-600">My Subscription</span>
              <span className="text-sm font-semibold text-gray-900">$1,000 (6.5%)</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-green-600" />
            My Top Revenue Months
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-600">January 2024</span>
              <span className="text-sm font-semibold text-gray-900">$15,420</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-600">December 2023</span>
              <span className="text-sm font-semibold text-gray-900">$13,680</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm text-gray-600">November 2023</span>
              <span className="text-sm font-semibold text-gray-900">$12,150</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-sm text-gray-600">October 2023</span>
              <span className="text-sm font-semibold text-gray-900">$11,890</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// MY CUSTOMERS COMPONENT
const MyCustomers = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaUserFriends className="mr-2 text-purple-600" />
            My Customers
          </h2>
          <p className="text-gray-600">Manage my customer relationships</p>
        </div>
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg">
          <FaPlus />
          <span>Add Customer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
            <FaUsers className="text-blue-500 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Active Customers</p>
              <p className="text-2xl font-bold text-green-600">892</p>
            </div>
            <FaUserCog className="text-green-500 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My VIP Customers</p>
              <p className="text-2xl font-bold text-purple-600">156</p>
            </div>
            <FaCrown className="text-purple-500 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Customer Rating</p>
              <p className="text-2xl font-bold text-orange-600">4.8/5</p>
            </div>
            <FaStar className="text-orange-500 text-2xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Customer List</h3>
        <div className="text-center py-8 text-gray-500">
          <FaUserFriends className="text-6xl mx-auto mb-4 text-gray-300" />
          <p>My customer management features will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

// MY PROMOTIONS COMPONENT
const MyPromotions = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaPercentage className="mr-2 text-purple-600" />
            My Promotions
          </h2>
          <p className="text-gray-600">Create and manage my promotional campaigns</p>
        </div>
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg">
          <FaPlus />
          <span>Create Promotion</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Active Promotions</p>
              <p className="text-2xl font-bold text-green-600">3</p>
            </div>
            <FaPercentage className="text-green-500 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Avg Discount</p>
              <p className="text-2xl font-bold text-blue-600">15%</p>
            </div>
            <FaStar className="text-blue-500 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Redemptions</p>
              <p className="text-2xl font-bold text-purple-600">124</p>
            </div>
            <FaGift className="text-purple-500 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Revenue Impact</p>
              <p className="text-2xl font-bold text-orange-600">$2.3K</p>
            </div>
            <FaMoneyBillWave className="text-orange-500 text-2xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Active Promotions</h3>
        <div className="text-center py-8 text-gray-500">
          <FaPercentage className="text-6xl mx-auto mb-4 text-gray-300" />
          <p>My promotional campaign management will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

// MY MARKETING COMPONENT
const MyMarketing = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaLightbulb className="mr-2 text-purple-600" />
            My Marketing
          </h2>
          <p className="text-gray-600">My marketing tools and campaign management</p>
        </div>
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg">
          <FaPlus />
          <span>New Campaign</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Email Campaigns</p>
              <p className="text-2xl font-bold text-blue-600">8</p>
            </div>
            <FaEnvelope className="text-blue-500 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Social Media</p>
              <p className="text-2xl font-bold text-green-600">5</p>
            </div>
            <FaShare className="text-green-500 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Conversion Rate</p>
              <p className="text-2xl font-bold text-purple-600">12.3%</p>
            </div>
            <FaChartLine className="text-purple-500 text-2xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Marketing Campaigns</h3>
        <div className="text-center py-8 text-gray-500">
          <FaLightbulb className="text-6xl mx-auto mb-4 text-gray-300" />
          <p>My marketing campaign tools will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

// MY SHIPPING COMPONENT
const MyShipping = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaShippingFast className="mr-2 text-purple-600" />
            My Shipping
          </h2>
          <p className="text-gray-600">Manage my delivery and shipping</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg">
            <FaShippingFast />
            <span>Print Labels</span>
          </button>
          <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg">
            <FaDownload />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Pending Shipments</p>
              <p className="text-2xl font-bold text-yellow-600">5</p>
            </div>
            <FaClock className="text-yellow-500 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Shipped Today</p>
              <p className="text-2xl font-bold text-blue-600">12</p>
            </div>
            <FaShippingFast className="text-blue-500 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Delivered This Week</p>
              <p className="text-2xl font-bold text-green-600">48</p>
            </div>
            <FaCheck className="text-green-500 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Avg Delivery Time</p>
              <p className="text-2xl font-bold text-purple-600">3.2d</p>
            </div>
            <FaTachometerAlt className="text-purple-500 text-2xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Shipping Management</h3>
        <div className="text-center py-8 text-gray-500">
          <FaShippingFast className="text-6xl mx-auto mb-4 text-gray-300" />
          <p>My shipping management tools will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

// MY SUPPORT COMPONENT
const MySupport = () => {
  const [supportTickets, setSupportTickets] = useState([
    { id: 1, customer: 'john.doe@email.com', subject: 'Order not received', status: 'open', priority: 'high', date: '2024-01-15' },
    { id: 2, customer: 'jane.smith@email.com', subject: 'Book quality issue', status: 'in_progress', priority: 'medium', date: '2024-01-14' },
    { id: 3, customer: 'mike.johnson@email.com', subject: 'Payment problem', status: 'resolved', priority: 'low', date: '2024-01-13' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaUsers className="mr-2 text-purple-600" />
            My Support
          </h2>
          <p className="text-gray-600">Manage my customer inquiries and support requests</p>
        </div>
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg">
          <FaPlus />
          <span>Add Support Agent</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Open Tickets</p>
              <p className="text-2xl font-bold text-red-600">12</p>
            </div>
            <FaClock className="text-red-500 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">5</p>
            </div>
            <FaUserCog className="text-yellow-500 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Resolved Today</p>
              <p className="text-2xl font-bold text-green-600">8</p>
            </div>
            <FaCheck className="text-green-500 text-2xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-indigo-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 uppercase">My Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 uppercase">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 uppercase">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {supportTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ticket.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                      ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      ticket.status === 'open' ? 'bg-red-100 text-red-800' :
                      ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-purple-600 hover:text-purple-900 p-2 rounded-lg hover:bg-purple-100 transition-colors">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// MY ANALYTICS COMPONENT
const MyAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaChartLine className="mr-2 text-purple-600" />
            My Analytics
          </h2>
          <p className="text-gray-600">My business insights and performance analytics</p>
        </div>
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg">
          <FaChartLine />
          <span>Run Analysis</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Performance Rank</p>
              <p className="text-2xl font-bold text-blue-600">#3</p>
            </div>
            <FaTachometerAlt className="text-blue-500 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Market Share</p>
              <p className="text-2xl font-bold text-green-600">22%</p>
            </div>
            <FaPercentage className="text-green-500 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Monthly Revenue</p>
              <p className="text-2xl font-bold text-purple-600">$28K</p>
            </div>
            <FaMoneyBillWave className="text-purple-500 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Customer Rating</p>
              <p className="text-2xl font-bold text-yellow-600">4.0/5</p>
            </div>
            <FaStar className="text-yellow-500 text-2xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Business Analytics</h3>
        <div className="text-center py-8 text-gray-500">
          <FaChartLine className="text-6xl mx-auto mb-4 text-gray-300" />
          <p>My detailed analytics and insights will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

// MY PROFILE COMPONENT
const MyProfile = ({ sellerInfo }) => {
  const [formData, setFormData] = useState({
    first_name: sellerInfo?.first_name || '',
    last_name: sellerInfo?.last_name || '',
    phone_number: sellerInfo?.phone_number || '',
    business_name: sellerInfo?.business_name || '',
    business_type: sellerInfo?.business_type || '',
    address: sellerInfo?.address || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      await axios.put('http://127.0.0.1:8000/api/seller/profile/update/', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('My profile updated successfully!');
    } catch (error) {
      console.error("Error updating my profile:", error);
      alert('Error updating my profile');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaUserCog className="mr-2 text-purple-600" />
          My Profile
        </h2>
        <p className="text-gray-600">Manage my seller account information</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">My First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">My Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">My Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">My Business Name</label>
              <input
                type="text"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">My Business Type</label>
              <select
                name="business_type"
                value={formData.business_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select my business type</option>
                <option value="individual">Individual Seller</option>
                <option value="company">Company</option>
                <option value="publisher">Publisher</option>
                <option value="bookstore">Bookstore</option>
                <option value="educational">Educational Institution</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">My Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              Save My Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// MY SETTINGS COMPONENT
const MySettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaCog className="mr-2 text-purple-600" />
          My Settings
        </h2>
        <p className="text-gray-600">My business preferences and account settings</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Account Settings</h3>
        <div className="text-center py-8 text-gray-500">
          <FaCog className="text-6xl mx-auto mb-4 text-gray-300" />
          <p>My business settings and preferences will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

// MY TOOLS COMPONENT
const MyTools = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaTools className="mr-2 text-purple-600" />
          My Tools
        </h2>
        <p className="text-gray-600">My business tools and integrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <FaUpload className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">My Bulk Upload</h3>
              <p className="text-sm text-gray-600">Upload my multiple books at once</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <FaDownload className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">My Export Data</h3>
              <p className="text-sm text-gray-600">Download my reports and data</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
              <FaCog className="text-purple-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">My Automation</h3>
              <p className="text-sm text-gray-600">Set up my automated workflows</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center">
              <FaBriefcase className="text-yellow-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">My Integrations</h3>
              <p className="text-sm text-gray-600">Connect my external tools</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-red-200 rounded-lg flex items-center justify-center">
              <FaRocket className="text-red-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">My Marketing</h3>
              <p className="text-sm text-gray-600">My email campaigns and social media</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center">
              <FaUserFriends className="text-indigo-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">My Team</h3>
              <p className="text-sm text-gray-600">Manage my team members</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Recent Tool Usage</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaUpload className="text-blue-600" />
              <span className="text-sm text-gray-900">I bulk uploaded 25 books</span>
            </div>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaDownload className="text-green-600" />
              <span className="text-sm text-gray-900">I exported sales report (January 2024)</span>
            </div>
            <span className="text-xs text-gray-500">1 day ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaCog className="text-purple-600" />
              <span className="text-sm text-gray-900">I set up automatic price updates</span>
            </div>
            <span className="text-xs text-gray-500">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// MY CONTRACTS COMPONENT
const MyContracts = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaHandshake className="mr-2 text-purple-600" />
          My Contracts
        </h2>
        <p className="text-gray-600">My agreements and contracts</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Active Contracts</h3>
        <div className="text-center py-8 text-gray-500">
          <FaHandshake className="text-6xl mx-auto mb-4 text-gray-300" />
          <p>My contract management will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

// MY SECURITY COMPONENT
const MySecurity = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaShieldAlt className="mr-2 text-purple-600" />
          My Security
        </h2>
        <p className="text-gray-600">My account security settings</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Security Settings</h3>
        <div className="text-center py-8 text-gray-500">
          <FaShieldAlt className="text-6xl mx-auto mb-4 text-gray-300" />
          <p>My security management will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

// SELLER HELP COMPONENT
const SellerHelp = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaQuestionCircle className="mr-2 text-purple-600" />
          Help & Support
        </h2>
        <p className="text-gray-600">Get help with my seller account</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My FAQ</h3>
          <div className="space-y-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">How do I add a new book?</p>
              <p className="text-sm text-gray-600">Go to My Books section and click "Add New Book"</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">How do I track my sales?</p>
              <p className="text-sm text-gray-600">Check My Sales section for detailed reports</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">How do I manage orders?</p>
              <p className="text-sm text-gray-600">Visit My Orders to view and update order status</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-purple-600" />
              <span className="text-sm text-gray-900">support@bookmarket.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaPhone className="text-purple-600" />
              <span className="text-sm text-gray-900">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaClock className="text-purple-600" />
              <span className="text-sm text-gray-900">24/7 Support Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerAdminDashboard;
