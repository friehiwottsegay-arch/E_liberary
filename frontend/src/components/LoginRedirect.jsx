import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserData, isSeller, isAdmin, getDashboardUrl } from '../utils/authUtils';
import { FaSpinner } from 'react-icons/fa';

/**
 * LoginRedirect component that automatically redirects users to appropriate dashboard after login
 * Handles role-based routing seamlessly
 */
const LoginRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleRedirect = () => {
      // Get the intended destination or default to dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      
      // Get user data to determine role
      const userData = getUserData();
      
      if (!userData) {
        // No user data, redirect to login
        navigate('/login', { replace: true });
        return;
      }

      // Check user role and redirect accordingly
      let redirectPath;
      
      if (isAdmin()) {
        // Admin users go to admin dashboard
        redirectPath = '/admin';
      } else if (isSeller()) {
        // Seller users go to seller admin dashboard
        redirectPath = '/seller/admin';
      } else {
        // Regular users go to user dashboard or intended destination
        redirectPath = from === '/login' ? '/dashboard' : from;
      }
      
      // Navigate to appropriate dashboard
      navigate(redirectPath, { replace: true });
    };

    // Small delay to show the loading state
    const timer = setTimeout(handleRedirect, 1500);
    
    return () => clearTimeout(timer);
  }, [navigate, location]);

  // Show loading while determining redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Redirecting to your dashboard...</h2>
        <p className="text-gray-600">Please wait while we prepare your workspace</p>
        
        {/* Progress steps */}
        <div className="mt-8 flex items-center justify-center space-x-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <span className="ml-2 text-sm text-gray-600">Authenticated</span>
          </div>
          
          <div className="w-8 h-1 bg-gray-300">
            <div className="h-full bg-purple-600 animate-pulse"></div>
          </div>
          
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center animate-pulse">
              <FaSpinner className="text-purple-600 animate-spin text-sm" />
            </div>
            <span className="ml-2 text-sm text-gray-600">Redirecting</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRedirect;