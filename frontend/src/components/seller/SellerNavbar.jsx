import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStore,
  FaBell,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaPlus,
  FaChartBar,
  FaTools,
  FaUserCog,
  FaQuestionCircle
} from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { clearAuthData, getUserData } from "../../utils/authUtils";

const SellerNavbar = ({ sidebarOpen, setSidebarOpen, showNotifications, setShowNotifications, showProfileMenu, setShowProfileMenu }) => {
  const [notifications] = useState([
    { id: 1, title: "New Order", message: "You have a new order for 'The Great Gatsby'", time: "2 minutes ago" },
    { id: 2, title: "Book Approved", message: "Your book 'JavaScript Guide' has been approved", time: "1 hour ago" },
    { id: 3, title: "Payment Received", message: "Payment of $25.99 received", time: "3 hours ago" }
  ]);
  
  const navigate = useNavigate();
  const sellerInfo = getUserData();

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  const handleProfileMenuAction = (action) => {
    switch(action) {
      case 'profile':
        // Handle profile action
        break;
      case 'settings':
        // Handle settings action
        break;
      case 'help':
        // Handle help action
        break;
      case 'logout':
        handleLogout();
        break;
    }
    setShowProfileMenu(false);
  };

  return (
    <div className="bg-white shadow-lg border-b border-purple-200">
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

        <div className="flex items-center space-x-4">
          {/* SELLER QUICK ACTIONS */}
          <button className="p-2 rounded-md text-purple-600 hover:bg-purple-50 transition-colors" title="Add New Book">
            <FaPlus />
          </button>
          <button className="p-2 rounded-md text-purple-600 hover:bg-purple-50 transition-colors" title="View Analytics">
            <FaChartBar />
          </button>
          <button className="p-2 rounded-md text-purple-600 hover:bg-purple-50 transition-colors" title="Business Tools">
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
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-purple-50">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-gray-500">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                  ))}
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
                  <p className="text-xs text-purple-600 font-medium">SELLER</p>
                </div>
                <div className="py-2">
                  <button onClick={() => handleProfileMenuAction('profile')} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center space-x-2">
                    <FaUserCog />
                    <span>My Profile</span>
                  </button>
                  <button onClick={() => handleProfileMenuAction('settings')} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center space-x-2">
                    <FiSettings />
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
  );
};

export default SellerNavbar;