import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserData, getToken, getRefreshToken, isSeller } from '../utils/authUtils';
import { FiAlertCircle, FiLoader } from 'react-icons/fi';

// Enhanced RouteGuard with JWT support and role-based access control
const RouteGuard = ({
  requiredRole = null,
  requireAuth = true,
  redirectTo = '/login',
  children,
  showLoading = true,
  fallbackComponent = null
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Check authentication status and load user data
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const currentUserData = getUserData();
      const currentToken = getToken();
      
      setUserData(currentUserData);
      setToken(currentToken);
      setIsLoading(false);
      
      return {
        isAuthenticated: authenticated,
        userData: currentUserData,
        token: currentToken
      };
    };

    checkAuth();
  }, [location.pathname]);

  // Show loading spinner while checking authentication
  if (isLoading && showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FiLoader className="animate-spin mx-auto text-blue-600 mb-4" size={32} />
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const isLoggedIn = isAuthenticated() && token && userData;

  // Require authentication
  if (requireAuth && !isLoggedIn) {
    return (
      <Navigate
        to={redirectTo}
        state={{
          from: location,
          message: 'Please log in to access this page'
        }}
        replace
      />
    );
  }

  // If not requiring auth but user is logged in and trying to access auth pages
  if (!requireAuth && isLoggedIn && (location.pathname === '/login' || location.pathname === '/register')) {
    // Redirect to appropriate dashboard based on user role
    const dashboardPath = getDashboardPath(userData);
    return <Navigate to={dashboardPath} replace />;
  }

  // Check role-based access if required
  if (requiredRole && isLoggedIn) {
    const hasRequiredRole = checkUserRole(userData, requiredRole);
    
    if (!hasRequiredRole) {
      // Special handling for sellers - redirect to seller admin instead of unauthorized
      if (requiredRole === 'seller' && !checkUserRole(userData, 'seller')) {
        // User is not a seller, but this is a seller-only page
        const dashboardPath = getDashboardPath(userData);
        return (
          <Navigate
            to={dashboardPath}
            state={{
              from: location,
              message: 'You need seller privileges to access this page. Please upgrade your account or contact support.',
              requiredRole: 'seller'
            }}
            replace
          />
        );
      }
      
      if (fallbackComponent) {
        return fallbackComponent;
      }
      
      return (
        <Navigate
          to="/unauthorized"
          state={{
            from: location,
            message: 'You do not have permission to access this page',
            requiredRole
          }}
          replace
        />
      );
    }
  }

  // If not logged in but not requiring auth, render children or outlet
  if (!requireAuth && !isLoggedIn) {
    return children ? children : <Outlet />;
  }

  // All checks passed, render protected content
  return children ? children : <Outlet />;
};

// Helper function to get dashboard path based on user role
const getDashboardPath = (userData) => {
  if (!userData) return '/dashboard';
  
  // Admin and superuser redirect to admin dashboard
  if (userData.is_superuser || userData.role === 'Admin') {
    return '/admin';
  }
  
  // Seller redirect to seller admin panel (using unified detection)
  if (isSeller()) {
    return '/seller/admin';
  }
  
  // Staff and regular users redirect to user dashboard
  return '/dashboard';
};

// Helper function to check if user has required role
const checkUserRole = (userData, requiredRole) => {
  if (!userData) return false;
  
  switch (requiredRole) {
    case 'admin':
      return userData.is_superuser || userData.role === 'Admin';
    
    case 'seller':
      return isSeller(); // Use unified seller detection
    
    case 'staff':
      return userData.role === 'Staff' || userData.is_staff;
    
    case 'user':
    case 'buyer':
    case 'student':
      return !userData.is_superuser &&
             userData.role !== 'Admin' &&
             userData.role !== 'Seller' &&
             userData.role !== 'Staff';
    
    case 'any':
      return true; // Any authenticated user
    
    default:
      // If requiredRole is a specific role string
      return userData.role === requiredRole;
  }
};

export default RouteGuard;

// Export utility functions for use in other components
export { checkUserRole, getDashboardPath };