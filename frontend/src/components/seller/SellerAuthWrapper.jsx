import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getToken, getUserData, isSeller, getAuthHeaders, clearAuthData } from '../../utils/authUtils';

const API_URL = 'http://127.0.0.1:8000/api';

const SellerAuthWrapper = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = getToken();
    const userData = getUserData();
    
    if (!token) {
      navigate('/login', { 
        state: { 
          from: location,
          message: 'Please log in to access the seller dashboard' 
        },
        replace: true 
      });
      return;
    }

    // Check if user has seller role using stored data (unified detection)
    if (userData && isSeller()) {
      setUser(userData);
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      // Non-sellers shouldn't access seller areas - redirect to appropriate dashboard
      const dashboardPath = getDashboardPath(userData);
      navigate(dashboardPath, {
        state: {
          from: location,
          message: 'You need seller privileges to access this area'
        },
        replace: true
      });
      return;
    }
  };

  const getDashboardPath = (userData) => {
    if (!userData) return '/dashboard';
    
    // Admin and superuser redirect to admin dashboard
    if (userData.is_superuser || userData.role === 'Admin') {
      return '/admin';
    }
    
    // Sellers redirect to seller admin dashboard
    if (isSeller()) {
      return '/seller/admin';
    }
    
    // Regular users redirect to user dashboard
    return '/dashboard';
  };

  const handleLogout = () => {
    clearAuthData();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600 dark:text-gray-300">Checking seller authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return React.cloneElement(children, { 
    user, 
    handleLogout,
    isAuthenticated 
  });
};

export default SellerAuthWrapper;