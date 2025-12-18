import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getToken, getUserData } from '../../utils/authUtils';
import {
  FiHome, FiBook, FiUsers, FiSettings, FiLogOut, FiBell,
  FiMessageCircle, FiActivity, FiHelpCircle, FiFileText, FiUserCheck,
  FiFolder, FiStar, FiMenu, FiMoon, FiSun, FiSearch, FiUser,
  FiBarChart, FiLayers, FiShield, FiDatabase,
  FiBookOpen, FiEdit3, FiTrash2, FiPlus, FiFilter
} from 'react-icons/fi';

const navItems = [
  { name: 'Dashboard', icon: <FiHome />, path: '/admin', color: 'text-blue-500' },
  { name: 'Books Management', icon: <FiBook />, path: '/admin/books', color: 'text-green-500' },
  { name: 'Exams & Quizzes', icon: <FiFileText />, path: '/admin/exams', color: 'text-purple-500' },
  { name: 'Users & Accounts', icon: <FiUsers />, path: '/admin/users', color: 'text-orange-500' },
  { name: 'Research Projects', icon: <FiFolder />, path: '/admin/Projects', color: 'text-indigo-500' },
  { name: 'Subjects & Categories', icon: <FiLayers />, path: '/admin/subjects', color: 'text-teal-500' },
  { name: 'Sign Language', icon: <FiUserCheck />, path: '/admin/AdminSignWords', color: 'text-pink-500' },
  { name: 'Analytics & Reports', icon: <FiBarChart />, path: '/admin/reports', color: 'text-yellow-500' },
  { name: 'System Settings', icon: <FiSettings />, path: '/admin/settings', color: 'text-gray-500' },
];

const AdminDashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Fetch user info from stored data instead of API call
    const token = getToken();
    const userData = getUserData();
    if (token && userData) {
      setUserInfo(userData);
    }

    // Load notifications
    loadNotifications();
  }, []);

  const fetchUserInfo = async () => {
    // This function is no longer needed since we use stored user data
    const userData = getUserData();
    if (userData) {
      setUserInfo(userData);
    }
  };

  const loadNotifications = () => {
    // Mock notifications - replace with real API call
    const mockNotifications = [
      { id: 1, title: 'New Book Uploaded', message: 'Mathematics Grade 12 has been uploaded', time: '2 min ago', unread: true },
      { id: 2, title: 'User Registration', message: '5 new students registered today', time: '1 hour ago', unread: true },
      { id: 3, title: 'System Update', message: 'Database maintenance completed', time: '3 hours ago', unread: false },
    ];
    setNotifications(mockNotifications);
  };

  const toggleTheme = () => {
    const newTheme = !darkMode ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleNav = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const item = navItems.find(item => item.path === currentPath);
    return item ? item.name : 'Admin Dashboard';
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Sidebar */}
      <aside className={`
        bg-white dark:bg-gray-800 w-72 h-full shadow-xl fixed lg:static z-50 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        border-r border-gray-200 dark:border-gray-700
      `}>
        {/* Logo/Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <FiShield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Library Management</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="lg:hidden text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300"
          >
            <FiMenu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <div
              key={item.name}
              onClick={() => handleNav(item.path)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 group
                ${location.pathname === item.path 
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-600 shadow-sm' 
                  : ''
                }
              `}
            >
              <div className={`
                ${item.color} group-hover:scale-110 transition-transform duration-200
                ${location.pathname === item.path ? 'text-blue-600 dark:text-blue-400' : ''}
              `}>
                {item.icon}
              </div>
              <span className={`
                font-medium transition-colors duration-200
                ${location.pathname === item.path 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                }
              `}>
                {item.name}
              </span>
              {location.pathname === item.path && (
                <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </div>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <FiUser className="text-white" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {userInfo?.username || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {userInfo?.email || 'admin@library.com'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="lg:hidden text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
              >
                <FiMenu size={24} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{getPageTitle()}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search books, users, projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-80 rounded-xl bg-gray-100 dark:bg-gray-700 text-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>

              {/* Language selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-100 dark:bg-gray-700 text-sm px-3 py-2 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="EN">EN</option>
                <option value="FR">FR</option>
                <option value="ES">ES</option>
              </select>

              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                title="Toggle Dark Mode"
              >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all relative"
                >
                  <FiBell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{notification.time}</p>
                            </div>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
                      <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <img
                    src="https://i.pravatar.cc/40"
                    alt="User"
                    className="w-9 h-9 rounded-full border-2 border-gray-200 dark:border-gray-600"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {userInfo?.username || 'Admin'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {userInfo?.role || 'Administrator'}
                    </p>
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {userInfo?.username || 'Admin User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {userInfo?.email || 'admin@library.com'}
                      </p>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => navigate('/admin/profile')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        <FiUser className="mr-3" size={16} /> Profile
                      </button>
                      <button
                        onClick={() => navigate('/admin/settings')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        <FiSettings className="mr-3" size={16} /> Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                      >
                        <FiLogOut className="mr-3" size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-auto p-6 bg-gray-50 dark:bg-gray-900">
          <div className="min-w-full">
            <Outlet />
          </div>
        </main>


      
      
      </div>
    </div>
  );
};

export default AdminDashboardLayout;

