import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiUsers, 
  FiBook, 
  FiFileText, 
  FiDollarSign, 
  FiTrendingUp,
  FiActivity,
  FiClock,
  FiDatabase,
  FiServer,
  FiAlertCircle,
  FiCheckCircle,
  FiRefreshCw,
  FiEye,
  FiDownload,
  FiCalendar,
  FiBarChart3,
  FiPieChart,
  FiTrendingDown,
  FiZap,
  FiGlobe
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const API_URL = 'http://127.0.0.1:8000/api';

const AdminDashboard = ({ user, handleLogout }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [dateRange, setDateRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  // Dashboard data state
  const [dashboardData, setDashboardData] = useState({
    users: {
      total: 0,
      active: 0,
      newToday: 0,
      growth: 0,
      byRole: {}
    },
    content: {
      totalBooks: 0,
      totalExams: 0,
      totalProjects: 0,
      totalDownloads: 0,
      growth: 0
    },
    revenue: {
      total: 0,
      thisMonth: 0,
      growth: 0,
      byCategory: {}
    },
    system: {
      health: 100,
      uptime: '99.9%',
      responseTime: 150,
      errorRate: 0.1,
      memoryUsage: 45,
      cpuUsage: 32,
      diskUsage: 23
    },
    activities: [],
    recentUsers: [],
    popularContent: [],
    systemAlerts: []
  });

  // Chart data
  const [chartData, setChartData] = useState({
    userGrowth: [],
    revenueTrend: [],
    contentUploads: [],
    trafficData: [],
    deviceBreakdown: []
  });

  // Real-time metrics
  const [realtimeData, setRealtimeData] = useState({
    onlineUsers: 0,
    currentVisitors: 0,
    apiCallsPerMinute: 0,
    memoryUsage: 0,
    cpuLoad: 0
  });

  // Payment data state
  const [paymentData, setPaymentData] = useState({
    totalPayments: 0,
    successfulPayments: 0,
    failedPayments: 0,
    pendingPayments: 0,
    totalRevenue: 0,
    chapAPayments: 0,
    chapASuccessRate: 0,
    paymentMethods: [],
    recentPayments: [],
    paymentTrends: []
  });

  const ERROR_STATES = {
    NETWORK_ERROR: 'Failed to connect to server. Please check your internet connection.',
    AUTH_ERROR: 'Authentication failed. Please log in again.',
    PERMISSION_ERROR: 'You do not have permission to access this data.',
    SERVER_ERROR: 'Server error occurred. Please try again later.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
  };

  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      updateRealtimeMetrics();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [dateRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      await Promise.all([
        loadOverviewData(token),
        loadChartData(token),
        loadRealTimeData(token),
        loadSystemHealth(token),
        loadPaymentData(token)
      ]);
      setMessage({ type: 'success', content: 'Dashboard data loaded successfully' });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadOverviewData = async (token) => {
    try {
      // Load dashboard stats
      const statsResponse = await axios.get(`${API_URL}/dashboard/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const stats = statsResponse.data;
      
      // Mock additional data for demonstration
      const mockData = generateMockOverviewData(stats);
      setDashboardData(prev => ({
        ...prev,
        ...mockData
      }));

    } catch (error) {
      if (error.response?.status === 401) {
        throw { type: 'AUTH_ERROR', error };
      } else if (error.response?.status >= 500) {
        throw { type: 'SERVER_ERROR', error };
      } else {
        throw { type: 'NETWORK_ERROR', error };
      }
    }
  };

  const loadChartData = async (token) => {
    try {
      // Generate chart data based on date range
      const chartData = generateChartData(dateRange);
      setChartData(chartData);
    } catch (error) {
      console.error('Failed to load chart data:', error);
      // Don't throw error for chart data, use fallback
      setChartData(generateChartData(dateRange));
    }
  };

  const loadRealTimeData = async (token) => {
    try {
      // Simulate real-time data updates
      const realtime = generateRealtimeData();
      setRealtimeData(realtime);
    } catch (error) {
      console.error('Failed to load real-time data:', error);
      // Use fallback data
      setRealtimeData(generateRealtimeData());
    }
  };

  const loadSystemHealth = async (token) => {
    try {
      // Mock system health data
      const healthData = generateSystemHealthData();
      setDashboardData(prev => ({
        ...prev,
        system: healthData
      }));
    } catch (error) {
      console.error('Failed to load system health:', error);
    }
  };

  const loadPaymentData = async (token) => {
    try {
      // Load payment statistics
      const paymentsResponse = await axios.get(`${API_URL}/admin/analytics/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const analytics = paymentsResponse.data;
      
      // Mock Chapa-specific payment data
      const mockPaymentData = generatePaymentData();
      setPaymentData(mockPaymentData);

    } catch (error) {
      console.error('Failed to load payment data:', error);
      // Use fallback data
      setPaymentData(generatePaymentData());
    }
  };

  const updateRealtimeMetrics = async () => {
    try {
      const newRealtime = generateRealtimeData();
      setRealtimeData(newRealtime);
    } catch (error) {
      console.error('Failed to update realtime metrics:', error);
    }
  };

  const generateMockOverviewData = (stats) => {
    return {
      users: {
        total: stats.active_students || 156,
        active: Math.floor((stats.active_students || 156) * 0.8),
        newToday: Math.floor((stats.active_students || 156) * 0.1),
        growth: 12.5,
        byRole: {
          student: Math.floor((stats.active_students || 156) * 0.8),
          teacher: Math.floor((stats.active_students || 156) * 0.15),
          admin: Math.floor((stats.active_students || 156) * 0.05)
        }
      },
      content: {
        totalBooks: stats.total_books || 245,
        totalExams: stats.total_exams || 128,
        totalProjects: stats.ongoing_projects || 34,
        totalDownloads: Math.floor((stats.total_books || 245) * 3.2),
        growth: 8.3
      },
      revenue: {
        total: Math.floor((stats.total_books || 245) * 29.99),
        thisMonth: Math.floor((stats.total_books || 245) * 3.99),
        growth: 15.7,
        byCategory: {
          books: 65,
          courses: 25,
          projects: 10
        }
      },
      activities: generateRecentActivities(),
      recentUsers: generateRecentUsers(),
      popularContent: generatePopularContent(),
      systemAlerts: generateSystemAlerts()
    };
  };

  const generateChartData = (range) => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        users: 50 + Math.floor(Math.random() * 30),
        revenue: 100 + Math.floor(Math.random() * 200),
        downloads: 30 + Math.floor(Math.random() * 50),
        traffic: 200 + Math.floor(Math.random() * 100)
      });
    }

    return {
      userGrowth: data,
      revenueTrend: data,
      contentUploads: data,
      trafficData: data,
      deviceBreakdown: [
        { name: 'Desktop', value: 45, color: '#3B82F6' },
        { name: 'Mobile', value: 35, color: '#10B981' },
        { name: 'Tablet', value: 15, color: '#F59E0B' },
        { name: 'Other', value: 5, color: '#6B7280' }
      ]
    };
  };

  const generateRealtimeData = () => {
    return {
      onlineUsers: Math.floor(Math.random() * 50) + 20,
      currentVisitors: Math.floor(Math.random() * 30) + 10,
      apiCallsPerMinute: Math.floor(Math.random() * 100) + 50,
      memoryUsage: Math.floor(Math.random() * 20) + 60,
      cpuLoad: Math.floor(Math.random() * 30) + 20
    };
  };

  const generateSystemHealthData = () => {
    return {
      health: 95 + Math.random() * 5,
      uptime: '99.9%',
      responseTime: 100 + Math.random() * 100,
      errorRate: Math.random() * 2,
      memoryUsage: 40 + Math.random() * 20,
      cpuUsage: 25 + Math.random() * 15,
      diskUsage: 20 + Math.random() * 10
    };
  };

  const generateRecentActivities = () => {
    return [
      {
        id: 1,
        type: 'user_registration',
        description: 'New user registered',
        user: 'john.doe@example.com',
        timestamp: new Date(Date.now() - 300000).toISOString()
      },
      {
        id: 2,
        type: 'content_upload',
        description: 'Book uploaded',
        user: 'admin@library.com',
        timestamp: new Date(Date.now() - 600000).toISOString()
      },
      {
        id: 3,
        type: 'exam_completion',
        description: 'Exam completed',
        user: 'jane.smith@example.com',
        timestamp: new Date(Date.now() - 900000).toISOString()
      }
    ];
  };

  const generateRecentUsers = () => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      joinedAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
      status: 'active'
    }));
  };

  const generatePopularContent = () => {
    return [
      { id: 1, title: 'Advanced Mathematics', type: 'Book', views: 1250 },
      { id: 2, title: 'Physics Basics', type: 'Exam', views: 890 },
      { id: 3, title: 'Data Science Project', type: 'Project', views: 645 }
    ];
  };

  const generateSystemAlerts = () => {
    return [
      {
        id: 1,
        type: 'warning',
        message: 'High CPU usage detected',
        timestamp: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: 2,
        type: 'info',
        message: 'Daily backup completed',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  };

  const generatePaymentData = () => {
    return {
      totalPayments: 245,
      successfulPayments: 220,
      failedPayments: 15,
      pendingPayments: 10,
      totalRevenue: 12500.00,
      chapAPayments: 180,
      chapASuccessRate: 92.5,
      paymentMethods: [
        { name: 'Chapa', count: 180, amount: 8500.00, color: '#4F46E5' },
        { name: 'Telebir', count: 35, amount: 1800.00, color: '#10B981' },
        { name: 'CBE Bir', count: 20, amount: 1200.00, color: '#F59E0B' },
        { name: 'Stripe', count: 10, amount: 1000.00, color: '#EF4444' }
      ],
      recentPayments: [
        {
          id: 1,
          user: 'john@example.com',
          book: 'Advanced Mathematics',
          amount: 45.00,
          method: 'Chapa',
          status: 'success',
          timestamp: new Date(Date.now() - 300000).toISOString()
        },
        {
          id: 2,
          user: 'jane@example.com',
          book: 'Physics Basics',
          amount: 35.00,
          method: 'Telebir',
          status: 'success',
          timestamp: new Date(Date.now() - 600000).toISOString()
        },
        {
          id: 3,
          user: 'bob@example.com',
          book: 'Data Science',
          amount: 55.00,
          method: 'Chapa',
          status: 'failed',
          timestamp: new Date(Date.now() - 900000).toISOString()
        }
      ],
      paymentTrends: generatePaymentTrends()
    };
  };

  const generatePaymentTrends = () => {
    const days = 7;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        total: 30 + Math.floor(Math.random() * 20),
        successful: 25 + Math.floor(Math.random() * 15),
        failed: 2 + Math.floor(Math.random() * 5),
        revenue: 1500 + Math.floor(Math.random() * 1000)
      });
    }
    return data;
  };

  const handleError = (error) => {
    let errorMessage = ERROR_STATES.UNKNOWN_ERROR;
    
    if (error.type) {
      errorMessage = ERROR_STATES[error.type] || ERROR_STATES.UNKNOWN_ERROR;
    } else if (error.response?.status === 401) {
      errorMessage = ERROR_STATES.AUTH_ERROR;
    } else if (error.response?.status >= 500) {
      errorMessage = ERROR_STATES.SERVER_ERROR;
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      errorMessage = ERROR_STATES.NETWORK_ERROR;
    }
    
    setMessage({ type: 'error', content: errorMessage });
    
    // Auto-hide error messages
    setTimeout(() => {
      setMessage({ type: '', content: '' });
    }, 5000);
  };

  const showMessage = (type, content) => {
    setMessage({ type, content });
    setTimeout(() => setMessage({ type: '', content: '' }), 5000);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadDashboardData();
      showMessage('success', 'Dashboard refreshed successfully');
    } catch (error) {
      handleError(error);
    } finally {
      setRefreshing(false);
    }
  };

  const exportData = async (format) => {
    try {
      // Simulate export
      showMessage('success', `Exporting dashboard data as ${format.toUpperCase()}...`);
    } catch (error) {
      handleError(error);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getHealthColor = (health) => {
    if (health >= 90) return 'text-green-600';
    if (health >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registration': return FiUsers;
      case 'content_upload': return FiBook;
      case 'exam_completion': return FiFileText;
      default: return FiActivity;
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ErrorState = ({ message, onRetry }) => (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
      <FiAlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
      <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Error Loading Dashboard</h3>
      <p className="text-red-600 dark:text-red-400 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        <FiRefreshCw className="mr-2 h-4 w-4 inline" />
        Retry
      </button>
    </div>
  );

  const statsCards = [
    {
      title: 'Total Users',
      value: formatNumber(dashboardData.users.total),
      change: `+${dashboardData.users.growth}%`,
      changeType: 'positive',
      icon: FiUsers,
      color: 'blue',
      description: `${dashboardData.users.active} active users`
    },
    {
      title: 'Total Books',
      value: formatNumber(dashboardData.content.totalBooks),
      change: `+${dashboardData.content.growth}%`,
      changeType: 'positive',
      icon: FiBook,
      color: 'green',
      description: `${formatNumber(dashboardData.content.totalDownloads)} downloads`
    },
    {
      title: 'Total Revenue',
      value: `$${formatNumber(dashboardData.revenue.total)}`,
      change: `+${dashboardData.revenue.growth}%`,
      changeType: 'positive',
      icon: FiDollarSign,
      color: 'purple',
      description: `$${dashboardData.revenue.thisMonth} this month`
    },
    {
      title: 'System Health',
      value: `${Math.round(dashboardData.system.health)}%`,
      change: dashboardData.system.health >= 90 ? 'Excellent' : 'Good',
      changeType: dashboardData.system.health >= 90 ? 'positive' : 'neutral',
      icon: FiActivity,
      color: 'emerald',
      description: `${dashboardData.system.uptime} uptime`
    }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FiBarChart3 },
    { id: 'users', name: 'Users', icon: FiUsers },
    { id: 'content', name: 'Content', icon: FiBook },
    { id: 'payments', name: 'Payments', icon: FiDollarSign },
    { id: 'revenue', name: 'Revenue', icon: FiTrendingUp }
  ];

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome back, {user?.first_name}! Here's what's happening with your library.
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            
            <button
              onClick={() => exportData('csv')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiDownload className="mr-2 h-4 w-4 inline" />
              Export
            </button>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <FiRefreshCw className={`mr-2 h-4 w-4 inline ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Message */}
        {message.content && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {message.type === 'success' ? <FiCheckCircle className="mr-2" /> : <FiAlertCircle className="mr-2" />}
            {message.content}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="mr-2 h-4 w-4 inline" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                <FiUsers className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Online Users</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{realtimeData.onlineUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <FiEye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Visitors</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{realtimeData.currentVisitors}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                <FiZap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300">API Calls/min</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{realtimeData.apiCallsPerMinute}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900">
                <FiServer className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Memory</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{realtimeData.memoryUsage}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
                <FiActivity className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300">CPU Load</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{realtimeData.cpuLoad}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-600' :
                      stat.changeType === 'negative' ? 'text-red-600' :
                      'text-gray-500'
                    }`}>
                      {stat.changeType === 'positive' && <FiTrendingUp className="mr-1 h-3 w-3" />}
                      {stat.changeType === 'negative' && <FiTrendingDown className="mr-1 h-3 w-3" />}
                      {stat.change}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* User Growth Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Growth</h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={chartData.userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="label" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: 'none', 
                          borderRadius: '6px',
                          color: '#F9FAFB'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#3B82F6" 
                        fill="#3B82F6"
                        fillOpacity={0.1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Revenue Trend */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={chartData.revenueTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="label" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: 'none', 
                          borderRadius: '6px',
                          color: '#F9FAFB'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Activities */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h3>
                <div className="space-y-3">
                  {dashboardData.activities.slice(0, 5).map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div key={activity.id} className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                          <Icon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{activity.user}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* System Health */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Health</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">CPU Usage</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{dashboardData.system.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${dashboardData.system.cpuUsage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Memory Usage</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{dashboardData.system.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${dashboardData.system.memoryUsage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Disk Usage</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{dashboardData.system.diskUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full" 
                      style={{ width: `${dashboardData.system.diskUsage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Popular Content */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Content</h3>
                <div className="space-y-3">
                  {dashboardData.popularContent.map((content) => (
                    <div key={content.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{content.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{content.type}</p>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{content.views} views</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* Payment Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <FiDollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Payments</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{paymentData.totalPayments}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">All time</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                    <FiCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Successful</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{paymentData.successfulPayments}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{Math.round((paymentData.successfulPayments / paymentData.totalPayments) * 100)}% success rate</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                    <FiTrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Chapa Payments</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{paymentData.chapAPayments}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{paymentData.chapASuccessRate}% success rate</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900">
                    <FiDollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">${paymentData.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">All time</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Methods</h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={paymentData.paymentMethods}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {paymentData.paymentMethods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} payments`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Trends</h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={paymentData.paymentTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="label" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#F9FAFB'
                        }}
                      />
                      <Bar dataKey="successful" fill="#10B981" />
                      <Bar dataKey="failed" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Payments</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Book
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {paymentData.recentPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {payment.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {payment.book}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${payment.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {payment.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            payment.status === 'success'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : payment.status === 'failed'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(payment.timestamp).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab !== 'overview' && activeTab !== 'payments' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <FiBarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{tabs.find(t => t.id === activeTab)?.name} Analytics</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Detailed {activeTab} analytics and insights coming soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;