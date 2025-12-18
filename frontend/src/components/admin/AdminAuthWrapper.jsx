import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getToken, getUserData, isAdmin, getAuthHeaders, clearAuthData } from '../../utils/authUtils';

const API_URL = 'http://127.0.0.1:8000/api';

const AdminAuthWrapper = ({ children }) => {
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
      navigate('/login');
      return;
    }

    // Check if user is admin/superuser using stored data
    if (userData && (userData.role === 'Admin' || userData.is_superuser)) {
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      // Regular users shouldn't access admin
      navigate('/unauthorized');
      return;
    }
    
    setIsLoading(false);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-300">Checking authentication...</p>
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

export default AdminAuthWrapper;