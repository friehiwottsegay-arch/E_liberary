import React, { useState, useRef, useEffect } from "react";
import { IoMdSearch, IoMdClose } from "react-icons/io";
import { FaBars, FaHome, FaBook, FaUser, FaGraduationCap, FaLanguage } from "react-icons/fa";
import { HiAcademicCap } from "react-icons/hi";
import { FiChevronRight, FiChevronLeft, FiUser, FiLogOut, FiSettings, FiGlobe } from "react-icons/fi";
import { MdContactSupport, MdInfo } from "react-icons/md";
import { RiHandHeartLine } from "react-icons/ri";
import { BsJournalBookmark } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import DarkMode from "./DarkMode";
import GoogleTranslate from "./Google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, getUserData, clearAuthData } from "../../utils/authUtils";

const Menu = [
  { id: 1, name: "Home", link: "/", icon: FaHome },
  { id: 2, name: "Books", link: "/products", icon: FaBook },
  { id: 4, name: "Market", link: "/market", icon: FaShoppingCart },
  { id: 5, name: "Exam", link: "/exam", icon: HiAcademicCap },
  { id: 6, name: "Sign Language", link: "/signlanguage", icon: RiHandHeartLine },
  { id: 7, name: "Dictionary", link: "/dictionary", icon: FaLanguage },
  { id: 8, name: "Research", link: "/project/reaserch", icon: BsJournalBookmark },

];

const SellerMenu = [
  { id: 11, name: "Seller Login", link: "/login", icon: FaUser },
  { id: 12, name: "Order Tracking", link: "/seller/tracking", icon: FaShoppingCart },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [userData, setUserData] = useState(getUserData());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const searchBoxRef = useRef(null);
  const categoriesRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const scrollCategories = (dir) => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({
        left: dir === "left" ? -150 : 150,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to fetch categories", err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowSearch(false);
      }
      if (showProfileMenu && !e.target.closest('.profile-menu')) {
        setShowProfileMenu(false);
        setShowLanguageMenu(false);
      }
    };
    if (showSearch || showProfileMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearch, showProfileMenu]);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(isAuthenticated());
      setUserData(getUserData());
    };
    
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, refresh auth status
        setIsLoggedIn(isAuthenticated());
        setUserData(getUserData());
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Periodic auth check for real-time updates
    const interval = setInterval(() => {
      setIsLoggedIn(isAuthenticated());
      setUserData(getUserData());
    }, 2000); // Check every 2 seconds
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  // Get profile photo URL (placeholder or actual photo) with role-based styling
  const getProfilePhotoUrl = () => {
    // Use actual profile photo if available
    if (userData?.profile_image) {
      return userData.profile_image.startsWith('http')
        ? userData.profile_image
        : `http://127.0.0.1:8000${userData.profile_image}`;
    }
    
    // Generate role-based dynamic avatar
    let avatarColor = '6366f1'; // Default blue
    let avatarText = 'U';
    
    if (userData?.role === 'Admin' || userData?.is_superuser) {
      avatarColor = 'dc2626'; // Red for admin
      avatarText = 'A';
    } else if (userData?.role === 'Seller') {
      avatarColor = '7c3aed'; // Purple for seller
      avatarText = 'S';
    } else if (userData?.role === 'Staff') {
      avatarColor = '059669'; // Green for staff
      avatarText = 'F';
    } else {
      avatarColor = '2563eb'; // Blue for student/buyer
      avatarText = 'U';
    }
    
    // Generate avatar with role-appropriate styling
    if (userData?.first_name && userData?.last_name) {
      const name = `${userData.first_name} ${userData.last_name}`;
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${avatarColor}&color=fff&size=100&rounded=true&bold=true`;
    } else if (userData?.username) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.username)}&background=${avatarColor}&color=fff&size=100&rounded=true&bold=true`;
    }
    
    return `https://ui-avatars.com/api/?name=${avatarText}&background=${avatarColor}&color=fff&size=100&rounded=true&bold=true`;
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    try {
      // Clear all authentication data
      clearAuthData();
      
      // Update state immediately
      setIsLoggedIn(false);
      setUserData(null);
      setShowProfileMenu(false);
      
      // Show confirmation message
      const confirmation = window.confirm("Are you sure you want to logout?");
      if (confirmation) {
        // Navigate to login page
        navigate("/login", { replace: true });
        
        // Force page refresh to clear any cached state
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still navigate even if there's an error
      navigate("/login");
    }
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setShowProfileMenu(!showProfileMenu);
    } else {
      navigate("/login");
    }
  };

  const handleDashboardClick = () => {
    if (userData?.role === 'Seller') {
      navigate("/seller/admin");
    } else if (userData?.is_superuser || userData?.role === 'Admin') {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
    setShowProfileMenu(false);
  };

  return (
    <>
      {/* Main Navbar */}
      <div className="sticky top-0 z-50 bg-white text-gray-800 shadow-sm border-b border-gray-200 dark:bg-gray-900 dark:text-white dark:border-gray-700">
        <div className="max-w-6xl mx-auto">
          {/* Top Navigation Bar */}
          <div className="flex justify-between items-center px-3 py-2">
            {/* Logo */}
            <div 
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 cursor-pointer group flex-shrink-0"
            >
              <div className="bg-gradient-to-r from-blue-600  group-hover:scale-105 transition duration-300">
               <img src="/assets/logo/logo.jpg" alt="E-Library Logo" className="w-12 h-12" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  E-Library                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">Digital Library</p>
              </div>
            </div>

            {/* Desktop Menu - Text Only */}
            <nav className="hidden lg:flex items-center space-x-0 mx-4">
              {Menu.map((item) => (
                <a
                  key={item.id}
                  href={item.link}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Search Button */}
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition duration-300"
                aria-label="Search"
              >
                <IoMdSearch className="text-lg" />
              </button>

              {/* User Profile */}
              <div className="profile-menu hidden sm:block relative">
                <button
                  onClick={handleProfileClick}
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition duration-300 ${isLoggedIn ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                  aria-label={isLoggedIn ? "User Profile" : "Login"}
                >
                  {isLoggedIn ? (
                    <img
                      src={getProfilePhotoUrl()}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'block';
                      }}
                    />
                  ) : (
                    <FiUser className="text-lg" />
                  )}
                  {/* Fallback icon */}
                  <FiUser className={`text-lg ${isLoggedIn ? 'hidden' : ''}`} />
                  
                  {/* Online Status Indicator */}
                  {isLoggedIn && isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
                  )}
                </button>
                
                {/* Enhanced Profile Dropdown Menu */}
                {isLoggedIn && showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-600 py-3 z-50">
                    {/* Profile Header */}
                    <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={getProfilePhotoUrl()}
                            alt="Profile"
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500 dark:ring-blue-400"
                          />
                          {/* Online Status Badge */}
                          {isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-bold text-gray-800 dark:text-white">
                            {userData?.first_name ? `${userData.first_name} ${userData.last_name || ''}` : userData?.username || 'Student'}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                              userData?.role === 'Seller'
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200'
                                : userData?.is_superuser || userData?.role === 'Admin'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200'
                                : userData?.role === 'Staff'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200'
                            }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
                              <span>{userData?.role || 'Student'}</span>
                            </span>
                            {isOnline && (
                              <span className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ring-1 ring-green-400 ring-opacity-50"></div>
                                <span>Online</span>
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {userData?.email || 'student@example.com'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={handleDashboardClick}
                        className="w-full text-left px-5 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200 flex items-center space-x-3"
                      >
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <FaUser className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium">
                          {userData?.role === 'Seller' ? 'Seller Dashboard' : 'Dashboard'}
                        </span>
                      </button>
                      
                      <button
                        onClick={() => {
                          // For now, show a settings modal or navigate to settings
                          setShowProfileMenu(false);
                          alert('Settings functionality will be implemented soon. For now, you can manage your account through the dashboard.');
                        }}
                        className="w-full text-left px-5 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200 flex items-center space-x-3"
                      >
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <FiSettings className="text-gray-600 dark:text-gray-400" />
                        </div>
                        <span className="font-medium">Settings</span>
                      </button>
                      
                      <hr className="my-2 border-gray-200 dark:border-gray-600" />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-5 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition duration-200 flex items-center space-x-3"
                      >
                        <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                          <FiLogOut className="text-red-600 dark:text-red-400" />
                        </div>
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden sm:block">
                <DarkMode />
              </div>
              
              <div className="hidden sm:block">
                <GoogleTranslate />
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={toggleMenu}
                className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition duration-300"
                aria-label="Menu"
              >
                <FaBars className="text-lg" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div
              ref={searchBoxRef}
              className="px-3 pb-2"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 p-2">
                <div className="flex items-center">
                  <IoMdSearch className="text-blue-500 ml-2 text-lg" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearch}
                    placeholder="Search books, authors, categories..."
                    className="w-full px-2 py-1 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-500 text-sm"
                    autoFocus
                  />
                  <button 
                    onClick={() => setShowSearch(false)}
                    className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300"
                  >
                    <IoMdClose className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Sidebar Menu - Full Screen Design */}
        <div className={`lg:hidden fixed inset-0 z-50 bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <FaGraduationCap className="text-white text-xl" />
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  READmore
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Digital Library</p>
              </div>
            </div>
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-300"
            >
              <IoMdClose className="text-xl" />
            </button>
          </div>

          {/* Enhanced User Info Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-6 border-b border-gray-200 dark:border-gray-700">
            {isLoggedIn ? (
              <div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={getProfilePhotoUrl()}
                      alt="Profile"
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500 dark:ring-blue-400"
                    />
                    {isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                      {userData?.first_name ? `${userData.first_name} ${userData.last_name || ''}` : userData?.username || 'Student'}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                        userData?.role === 'Seller'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200'
                          : userData?.is_superuser || userData?.role === 'Admin'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200'
                          : userData?.role === 'Staff'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
                        <span>{userData?.role || 'Student'}</span>
                      </span>
                      {isOnline && (
                        <span className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ring-1 ring-green-400 ring-opacity-50"></div>
                          <span>Online</span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {userData?.email || 'student@example.com'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition duration-300"
                    aria-label="Logout"
                  >
                    <FiLogOut className="text-lg" />
                  </button>
                </div>
                
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => {
                      handleDashboardClick();
                      toggleMenu();
                    }}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition duration-300 shadow-lg flex items-center justify-center space-x-2"
                  >
                    <FaUser className="text-sm" />
                    <span>{userData?.role === 'Seller' ? 'Seller Dashboard' : 'Dashboard'}</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      // For now, show a settings alert
                      alert('Settings functionality will be implemented soon. For now, you can manage your account through the dashboard.');
                      toggleMenu();
                    }}
                    className="w-full py-3 px-4 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition duration-300 shadow-lg flex items-center justify-center space-x-2"
                  >
                    <FiSettings className="text-sm" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                  <FiUser className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white text-lg">Welcome Guest</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sign in to access more features</p>
                </div>
              </div>
            )}
            
            {!isLoggedIn && (
              <button
                onClick={() => {
                  navigate("/login");
                  toggleMenu();
                }}
                className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition duration-300 shadow-lg flex items-center justify-center space-x-2"
              >
                <FaUser className="text-sm" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Menu Items with Icons */}
          <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-220px)]">
            {/* Regular Menu Items */}
            <div className="mb-4">
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Main Menu</h3>
              {Menu.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.link}
                    onClick={toggleMenu}
                    className="flex items-center space-x-4 p-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 transition duration-300 group"
                  >
                    <div className="p-2 bg-white dark:bg-gray-700 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition duration-300 shadow-sm">
                      <IconComponent className="text-lg text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white">{item.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Seller Menu Items */}
            <div>
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Seller Portal</h3>
              {SellerMenu.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.link}
                    onClick={toggleMenu}
                    className="flex items-center space-x-4 p-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-800 transition duration-300 group"
                  >
                    <div className="p-2 bg-white dark:bg-gray-700 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition duration-300 shadow-sm">
                      <IconComponent className="text-lg text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white">{item.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <DarkMode />
                <GoogleTranslate />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                v1.0.0
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/30 z-40"
            onClick={toggleMenu}
          />
        )}
      </div>

      {/* Bottom Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 dark:bg-gray-900/95 dark:border-gray-700 lg:hidden">
        <div className="flex justify-around items-center h-14 px-1">
          {Menu.slice(0, 4).map((item) => {
            const IconComponent = item.icon;
            return (
              <a
                key={item.id}
                href={item.link}
                className="flex flex-col items-center justify-center w-14 h-12 rounded-xl text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300"
              >
                <IconComponent className="text-lg mb-0.5" />
                <span className="text-[10px] font-medium">{item.name.split(' ')[0]}</span>
              </a>
            );
          })}
          {/* Add tracking icon for mobile */}
          <a
            href="/seller/tracking"
            className="flex flex-col items-center justify-center w-14 h-12 rounded-xl text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition duration-300"
          >
            <FaShoppingCart className="text-lg mb-0.5" />
            <span className="text-[10px] font-medium">Track</span>
          </a>
        </div>
      </div>

      {/* Add padding for bottom nav on mobile */}
      <div className="pb-14 lg:pb-0"></div>
    </>
  );
};

export default Navbar;