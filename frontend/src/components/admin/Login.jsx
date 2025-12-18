import React, { useState, useEffect } from 'react';
import {
  FiBook, FiEye, FiEyeOff, FiLock, FiUser, FiMail, FiKey, FiShield,
  FiAlertCircle, FiCheckCircle, FiLoader, FiHeart, FiStar, FiGlobe,
  FiRefreshCw, FiArrowRight, FiUserCheck, FiUserX, FiLock as FiLockIcon,
  FiSmartphone, FiMonitor, FiTablet, FiUserPlus, FiShoppingBag, FiCalendar,
  FiCreditCard, FiSettings, FiBell, FiHome, FiPhone, FiMapPin, FiBriefcase
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  storeAuthData,
  getToken,
  isAuthenticated,
  getUserData,
  isAdmin,
  isSeller,
  getDashboardUrl
} from '../../utils/authUtils';

const API_BASE = 'http://127.0.0.1:8000';

// Subscription plans configuration
const SUBSCRIPTION_PLANS = [
  {
    id: 'monthly',
    name: 'Monthly Plan',
    price: '$9.99/month',
    duration: 30,
    features: ['Access to all books', 'Basic analytics', 'Email support']
  },
  {
    id: 'yearly',
    name: 'Yearly Plan',
    price: '$99.99/year',
    duration: 365,
    popular: true,
    savings: 'Save 17%',
    features: ['Access to all books', 'Advanced analytics', 'Priority support', 'Mobile app']
  },
  {
    id: 'decade',
    name: '10-Year Plan',
    price: '$799.99',
    duration: 3650,
    premium: true,
    savings: 'Save 33%',
    features: ['Lifetime access', 'Premium analytics', '24/7 support', 'Mobile app', 'API access', 'Custom branding']
  }
];

const Login = () => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [userType, setUserType] = useState('buyer'); // 'buyer' or 'seller'
  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    businessName: '',
    businessType: '',
    subscriptionPlan: 'monthly',
    remember: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [phoneCountry, setPhoneCountry] = useState('+1'); // Default to US/Canada
  
  const navigate = useNavigate();
  const location = useLocation();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Enhanced redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    
    if (token && (location.pathname === '/login' || location.pathname === '/admin/login')) {
      const userData = getUserData();
      
      if (userData) {
        let redirectTo = '/dashboard';
        
        if (isAdmin()) {
          redirectTo = '/admin';
        } else if (isSeller()) {
          redirectTo = '/seller/admin';
        } else {
          redirectTo = getDashboardUrl();
        }
        
        navigate(redirectTo, { replace: true });
      }
    }
  }, [navigate, location]);

  const validateForm = () => {
    const errors = {};
    
    if (mode === 'register') {
      // Registration validation
      if (!credentials.firstName.trim()) {
        errors.firstName = 'First name is required';
      }
      
      if (!credentials.lastName.trim()) {
        errors.lastName = 'Last name is required';
      }
      
      if (!credentials.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
        errors.email = 'Please enter a valid email address';
      }
      
      if (userType === 'seller') {
        if (!credentials.businessName.trim()) {
          errors.businessName = 'Business name is required for sellers';
        }
        
        if (!credentials.businessType.trim()) {
          errors.businessType = 'Business type is required for sellers';
        }
        
        if (!credentials.address.trim()) {
          errors.address = 'Business address is required for sellers';
        }
      }
      
      // Phone validation (both buyers and sellers, but less strict for buyers)
      if (credentials.phone.trim()) {
        const phoneValidation = validatePhoneNumber(credentials.phone, phoneCountry);
        if (phoneValidation) {
          errors.phone = phoneValidation;
        }
      } else if (userType === 'seller') {
        errors.phone = 'Phone number is required for sellers';
      }
    } else {
      // Login validation
      if (!credentials.username.trim()) {
        errors.username = 'Username or email is required';
      }
    }
    
    if (!credentials.password) {
      errors.password = 'Password is required';
    } else {
      if (credentials.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      if (mode === 'register' && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(credentials.password)) {
        errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }
    }
    
    if (mode === 'register') {
      if (!credentials.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (credentials.password !== credentials.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Update subscription plan when user type changes
    if (name === 'subscriptionPlan') {
      setSelectedPlan(value);
    }
    
    // Clear errors when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general error
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!isOnline) {
      setError('No internet connection. Please check your network and try again.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let response;
      let userData;
      
      if (mode === 'register') {
        // Registration endpoint
        response = await axios.post(`${API_BASE}/api/register/`, {
          username: credentials.username,
          email: credentials.email,
          password: credentials.password,
          first_name: credentials.firstName,
          last_name: credentials.lastName,
          user_type: userType,
          phone_number: `${phoneCountry}${credentials.phone.replace(/\D/g, '')}`,
          address: credentials.address,
          business_name: credentials.businessName,
          business_type: credentials.businessType,
          subscription_plan: credentials.subscriptionPlan
        });
        
        // For registration, extract user data from response or create basic userData
        if (response.data && response.data.user) {
          userData = response.data.user;
        } else {
          userData = {
            id: response.data?.id || null,
            username: credentials.username,
            email: credentials.email,
            role: userType === 'seller' ? 'Seller' : 'Buyer',
            user_type: userType,
            is_superuser: false
          };
        }
        
        response.data.message = 'Registration successful!';
        
      } else {
      // Login endpoint (using custom login endpoint with role-based redirect)
      response = await axios.post(`${API_BASE}/api/login/`, {
        username: credentials.username,
        password: credentials.password
      });
      
      const { access, refresh, user, redirect_url } = response.data;
      
      // Prepare user data with role information from response
      userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        is_superuser: user.is_superuser,
        is_staff: user.is_staff,
        user_type: user.user_type || 'buyer',
        student_admin_id: user.student_admin_id
      };

      // Use unified token management
      storeAuthData({
        access,
        refresh,
        user: userData
      }, credentials.remember);

      // Set common localStorage items for backward compatibility
      const storage = credentials.remember ? localStorage : sessionStorage;
      storage.setItem('user_id', user.id);
      storage.setItem('username', user.username);
      storage.setItem('user_role', userData.role);
      storage.setItem('user_email', user.email);
      storage.setItem('user_type', userData.user_type);
      storage.setItem('user_first_name', user.first_name || '');
      storage.setItem('user_last_name', user.last_name || '');
      storage.setItem('student_admin_id', user.student_admin_id || '');
      storage.setItem('subscription_plan', credentials.subscriptionPlan);
      storage.setItem('login_time', new Date().toISOString());

      // Store redirect URL for immediate use
      storage.setItem('redirect_url', redirect_url);

      response.data.user = userData;
      response.data.message = 'Login successful! Redirecting to your dashboard...';
    }

    const { user, message, redirect_url } = response.data;

    setSuccess(message || `${mode === 'register' ? 'Registration' : 'Login'} successful! Redirecting...`);

    // Use role-based redirect URL from backend response or determine based on user role
    let redirectPath = redirect_url;
    
    // If no redirect URL provided by backend, determine based on user role
    if (!redirectPath) {
      if (isSeller() || userData.role === 'Seller') {
        redirectPath = '/seller/admin';
      } else if (isAdmin() || userData.is_superuser || userData.role === 'Admin') {
        redirectPath = '/admin';
      } else {
        redirectPath = getDashboardUrl() || '/dashboard';
      }
    }

    // Show success message briefly before redirect
    setTimeout(() => {
      navigate(redirectPath, { replace: true });
    }, 1500);

    } catch (err) {
      console.error(`${mode} error:`, err);
      
      let errorMessage = `${mode === 'register' ? 'Registration' : 'Login'} failed. Please try again.`;
      
      if (err.response) {
        const { data } = err.response;
        if (data.error) {
          errorMessage = data.error;
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        }
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // This would typically open a modal or redirect to a forgot password page
    alert('Forgot password functionality would be implemented here');
  };

  const handleDemoLogin = async (role = 'user') => {
    // Demo login removed - users should register manually
    setError('Please register manually or use the registration form to create an account.');
  };

  const getCurrentGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return 0;
    if (password.length < 8) return 1;
    if (password.length < 10) return 2;
    if (password.length >= 10 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return 4;
    return 3;
  };

  const getPasswordStrengthColor = (strength) => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    return colors[strength] || 'bg-gray-300';
  };

  const getPasswordStrengthText = (strength) => {
    const texts = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return texts[strength] || '';
  };

  // Phone number utilities
  const formatPhoneNumber = (value, countryCode) => {
    const cleaned = value.replace(/\D/g, '');
    
    // Ethiopian numbers
    if (countryCode === '+251') {
      if (cleaned.length <= 9) {
        return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{0,3})/, (_, a, b, c, d) => {
          if (d) return `${a} ${b} ${c} ${d}`;
          if (c) return `${a} ${b} ${c}`;
          if (b) return `${a} ${b}`;
          return a;
        });
      }
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{0,3})/, (_, a, b, c, d) => {
        if (d) return `${a} ${b} ${c} ${d}`;
        return `${a} ${b} ${c}`;
      });
    }
    
    // US/Canada numbers
    if (countryCode === '+1') {
      if (cleaned.length <= 3) return cleaned;
      if (cleaned.length <= 6) return `${cleaned.slice(0,3)}-${cleaned.slice(3)}`;
      return `${cleaned.slice(0,3)}-${cleaned.slice(3,6)}-${cleaned.slice(6,10)}`;
    }
    
    // Default international format
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0,3)} ${cleaned.slice(3)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0,3)} ${cleaned.slice(3,6)} ${cleaned.slice(6)}`;
    return `${cleaned.slice(0,3)} ${cleaned.slice(3,6)} ${cleaned.slice(6,8)} ${cleaned.slice(8,12)}`;
  };

  const getCountryCode = (phoneNumber) => {
    if (!phoneNumber) return '+1';
    if (phoneNumber.startsWith('+251')) return '+251';
    if (phoneNumber.startsWith('+44')) return '+44';
    if (phoneNumber.startsWith('+49')) return '+49';
    if (phoneNumber.startsWith('+33')) return '+33';
    return '+1';
  };

  const getCountryFlag = (countryCode) => {
    const flags = {
      '+1': '🇺🇸',
      '+251': '🇪🇹',
      '+44': '🇬🇧',
      '+49': '🇩🇪',
      '+33': '🇫🇷'
    };
    return flags[countryCode] || '🇺🇸';
  };

  const validatePhoneNumber = (phoneNumber, countryCode) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (!cleaned) return 'Phone number is required';
    
    // Ethiopia: 10 digits total (country code not included in cleaned)
    if (countryCode === '+251' && cleaned.length !== 10) {
      return 'Ethiopian phone numbers must be 10 digits (without country code)';
    }
    
    // US/Canada: 10 digits
    if (countryCode === '+1' && cleaned.length !== 10) {
      return 'US/Canada phone numbers must be 10 digits';
    }
    
    // Default: at least 8 digits, at most 15 digits
    if (cleaned.length < 8 || cleaned.length > 15) {
      return 'Phone number must be between 8 and 15 digits';
    }
    
    return null;
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatPhoneNumber(value, phoneCountry);
    
    setCredentials(prev => ({
      ...prev,
      phone: formattedValue
    }));
    
    // Clear phone errors
    if (formErrors.phone) {
      setFormErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleCountryCodeChange = (newCountryCode) => {
    setPhoneCountry(newCountryCode);
    
    // Reformat existing phone number
    if (credentials.phone) {
      const cleaned = credentials.phone.replace(/\D/g, '');
      const formattedValue = formatPhoneNumber(cleaned, newCountryCode);
      
      setCredentials(prev => ({
        ...prev,
        phone: formattedValue
      }));
    }
  };

  const resetForm = () => {
    setCredentials({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      businessName: '',
      businessType: '',
      subscriptionPlan: 'monthly',
      remember: false
    });
    setPhoneCountry('+1');
    setFormErrors({});
    setError('');
    setSuccess('');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-4">
      <div className="w-full max-w-4xl flex bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Panel - Branding & Info */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 flex-col justify-between text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute bottom-20 left-20 w-16 h-16 bg-white rounded-full"></div>
            <div className="absolute bottom-40 right-10 w-20 h-20 bg-white rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 mr-4">
               <img src="/assets/logo/logo.jpg" alt="E-Library Logo" className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">E-Library</h2>
                <p className="text-blue-100">Digital Learning </p>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-4">{getCurrentGreeting()}!</h3>
              <p className="text-blue-100 text-lg leading-relaxed">
                {mode === 'login' 
                  ? 'Welcome back to your learning journey. Access thousands of educational resources, courses, and interactive content designed to help you grow and succeed.'
                  : 'Join our educational platform today and unlock access to thousands of resources, courses, and interactive content designed to help you grow and succeed.'
                }
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <FiUserCheck className="mb-2" size={24} />
                <h4 className="font-semibold">10,000+</h4>
                <p className="text-sm text-blue-100">Active Students</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <FiBook className="mb-2" size={24} />
                <h4 className="font-semibold">5,000+</h4>
                <p className="text-sm text-blue-100">Educational Resources</p>
              </div>
            </div>

            {/* User Type Benefits */}
            {mode === 'register' && (
              <div className="mb-8">
                <h4 className="font-semibold mb-3">Choose Your Path:</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <FiShoppingBag className="mr-2" size={16} />
                    <span>Buyer: Browse, purchase, and access premium content</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FiBriefcase className="mr-2" size={16} />
                    <span>Seller: List products/services and grow your business</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative z-10 text-center">
            <p className="text-blue-100 text-sm">
          © 2025 E-Library Ethiopia. Empowering minds through education.
            </p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <FiUser className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {mode === 'login' ? 'Sign in to access your E-Library dashboard' : 'Join our educational platform today'}
            </p>
            
            {/* Connection Status */}
            <div className="flex items-center justify-center mt-3">
              <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
              <FiAlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <p className="text-red-800 dark:text-red-200 font-medium">
                  {mode === 'register' ? 'Registration Failed' : 'Login Failed'}
                </p>
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start">
              <FiCheckCircle className="text-green-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <p className="text-green-800 dark:text-green-200 font-medium">Success!</p>
                <p className="text-green-700 dark:text-green-300 text-sm">{success}</p>
              </div>
            </div>
          )}

          {/* User Type Selection for Registration */}
          {mode === 'register' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('buyer')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    userType === 'buyer'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <FiShoppingBag className="mx-auto mb-2" size={24} />
                  <p className="font-medium">Buyer</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Browse & purchase</p>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('seller')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    userType === 'seller'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <FiBriefcase className="mx-auto mb-2" size={24} />
                  <p className="font-medium">Seller</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">List products/services</p>
                </button>
              </div>
            </div>
          )}

          {/* Registration Form */}
          {mode === 'register' && (
            <div className="space-y-6 mb-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={credentials.firstName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 transition-colors ${
                        formErrors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="First name"
                      required
                    />
                  </div>
                  {formErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={credentials.lastName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 transition-colors ${
                        formErrors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Last name"
                      required
                    />
                  </div>
                  {formErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={credentials.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 transition-colors ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>

              {/* Phone Number Field (for both buyers and sellers) */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number {userType === 'buyer' && '(Optional)'}
                </label>
                <div className="flex space-x-2">
                  {/* Country Code Selector */}
                  <div className="relative">
                    <select
                      value={phoneCountry}
                      onChange={(e) => handleCountryCodeChange(e.target.value)}
                      className="w-24 px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 transition-colors text-sm"
                    >
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+251">🇪🇹 +251</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+33">🇫🇷 +33</option>
                    </select>
                  </div>
                  
                  {/* Phone Number Input */}
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={credentials.phone}
                      onChange={handlePhoneChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 transition-colors ${
                        formErrors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder={
                        phoneCountry === '+251'
                          ? "91 234 5678"
                          : phoneCountry === '+1'
                          ? "555-123-4567"
                          : "123 456 7890"
                      }
                      required={userType === 'seller'}
                    />
                  </div>
                </div>
                
                {/* Phone Format Hint */}
                <p className="mt-1 text-xs text-gray-500">
                  {phoneCountry === '+251' && "Format: 91 234 5678 (10 digits)"}
                  {phoneCountry === '+1' && "Format: 555-123-4567 (10 digits)"}
                  {!['+251', '+1'].includes(phoneCountry) && "Format: 123 456 7890"}
                  {userType === 'buyer' && " • Optional for buyers"}
                </p>
                
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                )}
              </div>

              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={credentials.username}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 transition-colors ${
                      formErrors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Choose a username"
                    required
                  />
                </div>
                {formErrors.username && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                )}
              </div>

              {/* Seller-specific fields */}
              {userType === 'seller' && (
                <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-medium text-purple-800 dark:text-purple-200 flex items-center">
                    <FiBriefcase className="mr-2" size={20} />
                    Business Information
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Business Name
                      </label>
                      <input
                        id="businessName"
                        name="businessName"
                        type="text"
                        value={credentials.businessName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 transition-colors ${
                          formErrors.businessName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Your business name"
                        required
                      />
                      {formErrors.businessName && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.businessName}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Business Type
                      </label>
                      <select
                        id="businessType"
                        name="businessType"
                        value={credentials.businessType}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 transition-colors ${
                          formErrors.businessType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        required
                      >
                        <option value="">Select business type</option>
                        <option value="individual">Individual Seller</option>
                        <option value="company">Company</option>
                        <option value="publisher">Publisher</option>
                        <option value="bookstore">Bookstore</option>
                        <option value="educational">Educational Institution</option>
                        <option value="other">Other</option>
                      </select>
                      {formErrors.businessType && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.businessType}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        value={credentials.address}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 transition-colors ${
                          formErrors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Your business address"
                        required
                      />
                    </div>
                    {formErrors.address && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Subscription Plan Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Choose Your Plan
                </label>
                <div className="space-y-3">
                  {SUBSCRIPTION_PLANS.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPlan === plan.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => {
                        setSelectedPlan(plan.id);
                        setCredentials(prev => ({ ...prev, subscriptionPlan: plan.id }));
                      }}
                    >
                      {plan.popular && (
                        <div className="absolute -top-2 left-4 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Most Popular
                        </div>
                      )}
                      {plan.premium && (
                        <div className="absolute -top-2 left-4 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                          Premium
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{plan.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{plan.price}</p>
                          {plan.savings && (
                            <p className="text-xs text-green-600">{plan.savings}</p>
                          )}
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="subscriptionPlan"
                            value={plan.id}
                            checked={selectedPlan === plan.id}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600"
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <FiCheckCircle size={12} className="mr-1 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Login Form Fields (for both modes) */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username/Email Field for Login */}
            {mode === 'login' && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={credentials.username}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 transition-colors ${
                      formErrors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter your username or email"
                    required
                    autoComplete="username"
                  />
                </div>
                {formErrors.username && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                )}
              </div>
            )}

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {mode === 'register' ? 'Create Password' : 'Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 transition-colors ${
                    formErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder={mode === 'register' ? 'Create a strong password' : 'Enter your password'}
                  required
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {credentials.password && mode === 'register' && (
                <div className="mt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 w-8 rounded ${
                            getPasswordStrength(credentials.password) >= level
                              ? getPasswordStrengthColor(getPasswordStrength(credentials.password))
                              : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {getPasswordStrengthText(getPasswordStrength(credentials.password))}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Must contain uppercase, lowercase, and numbers
                  </p>
                </div>
              )}
              
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>

            {/* Confirm Password Field for Registration */}
            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={credentials.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 transition-colors ${
                      formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Remember Me & Forgot Password (Login only) */}
            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={credentials.remember}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isOnline}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all transform ${
                loading || !isOnline
                  ? 'bg-gray-400 cursor-not-allowed'
                  : mode === 'register'
                  ? 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 hover:scale-105 active:scale-95'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 active:scale-95'
              } flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin mr-2" size={20} />
                  {mode === 'register' ? 'Creating account...' : 'Signing in...'}
                </>
              ) : (
                <>
                  {mode === 'register' ? 'Create Account' : 'Sign In'}
                  <FiArrowRight className="ml-2" size={20} />
                </>
              )}
            </button>
          </form>

          {/* Demo Login Buttons - Removed per user request */}
          {mode === 'login' && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
              </p>
            </div>
          )}

          {/* Mode Toggle */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              </p>
              <button
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                {mode === 'login' ? (
                  <>
                    <FiUserPlus className="mr-2" size={16} />
                    Create New Account
                  </>
                ) : (
                  <>
                    <FiUser className="mr-2" size={16} />
                    Sign In Instead
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Account Management Links */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-3 text-center">
              <button className="flex items-center justify-center px-3 py-2 text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                <FiSettings className="mr-1" size={14} />
                Account Settings
              </button>
              <button className="flex items-center justify-center px-3 py-2 text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                <FiBell className="mr-1" size={14} />
                Notifications
              </button>
            </div>
          </div>

          {/* System Info */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <FiMonitor className="mr-1" size={14} />
                Web App
              </span>
              <span>•</span>
              <span>{currentTime.toLocaleTimeString()}</span>
              <span>•</span>
              <span>Secure Login</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
