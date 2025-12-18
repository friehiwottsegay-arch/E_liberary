import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiAlertCircle, FiHome, FiShield, FiArrowLeft, FiUser, FiBriefcase, FiTrendingUp } from 'react-icons/fi';
import { getUserData, isSeller, isAdmin } from '../../utils/authUtils';

const Unauthorized = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    setUserData(getUserData());
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDashboard = () => {
    if (isAdmin()) {
      navigate('/admin');
    } else if (isSeller()) {
      navigate('/seller/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleUpgradeToSeller = () => {
    navigate('/seller/upgrade');
  };

  // Determine the type of access denied based on location and user role
  const getAccessDeniedInfo = () => {
    const message = location.state?.message || 'You don\'t have permission to access this area.';
    const requiredRole = location.state?.requiredRole;
    
    if (requiredRole === 'seller' && !isSeller()) {
      return {
        title: 'Seller Access Required',
        description: 'This area is exclusive to verified sellers only.',
        actionButton: {
          text: 'Become a Seller',
          action: handleUpgradeToSeller,
          icon: FiTrendingUp,
          color: 'bg-purple-600 hover:bg-purple-700'
        },
        infoBox: {
          title: 'Want to Become a Seller?',
          content: 'Upgrade your account to access seller tools, analytics, and start monetizing your content.'
        }
      };
    } else if (location.pathname.includes('/admin') && !isAdmin()) {
      return {
        title: 'Administrator Access Required',
        description: 'This area is restricted to administrators only.',
        actionButton: {
          text: 'Go to Dashboard',
          action: handleDashboard,
          icon: FiHome,
          color: 'bg-blue-600 hover:bg-blue-700'
        },
        infoBox: {
          title: 'Need Admin Access?',
          content: 'Contact your system administrator to request elevated permissions for this area.'
        }
      };
    } else {
      return {
        title: 'Access Denied',
        description: message,
        actionButton: {
          text: 'Go to Dashboard',
          action: handleDashboard,
          icon: FiHome,
          color: 'bg-blue-600 hover:bg-blue-700'
        },
        infoBox: {
          title: 'Need Help?',
          content: 'If you believe this is an error, please contact support or check your account permissions.'
        }
      };
    }
  };

  const accessInfo = getAccessDeniedInfo();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
            <FiAlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>

          {/* Error Code */}
          <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700">403</h1>
          
          {/* Title */}
          <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            {accessInfo.title}
          </h2>
          
          {/* Message */}
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            {accessInfo.description}
          </p>

          {/* User Role Info */}
          {userData && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <FiUser className="h-4 w-4" />
              <span>Current role: {userData.role || userData.user_type || 'User'}</span>
              {isSeller() && (
                <>
                  <FiBriefcase className="h-4 w-4 ml-2" />
                  <span className="text-purple-600 dark:text-purple-400">Seller</span>
                </>
              )}
              {isAdmin() && (
                <>
                  <FiShield className="h-4 w-4 ml-2" />
                  <span className="text-red-600 dark:text-red-400">Administrator</span>
                </>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FiArrowLeft className="mr-2" size={16} />
              Go Back
            </button>
            
            <button
              onClick={accessInfo.actionButton.action}
              className={`inline-flex items-center justify-center px-4 py-2 ${accessInfo.actionButton.color} text-white rounded-lg text-sm font-medium transition-colors`}
            >
              <accessInfo.actionButton.icon className="mr-2" size={16} />
              {accessInfo.actionButton.text}
            </button>
            
            <button
              onClick={handleGoHome}
              className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <FiHome className="mr-2" size={16} />
              Home
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start">
              <FiShield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-left">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                  {accessInfo.infoBox.title}
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {accessInfo.infoBox.content}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              If you believe this is an error, please contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
