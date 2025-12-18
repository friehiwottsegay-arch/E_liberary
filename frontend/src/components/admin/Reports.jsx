import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiBarChart,
  FiTrendingUp,
  FiUsers, 
  FiBook, 
  FiFileText, 
  FiCalendar,
  FiDownload,
  FiFilter,
  FiRefreshCw,
  FiEye,
  FiDollarSign,
  FiActivity,
  FiAlertTriangle,
  FiCheckCircle
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const API_URL = 'http://127.0.0.1:8000/api';

const Reports = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('users');

  // Dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalExams: 0,
    totalProjects: 0,
    activeUsers: 0,
    newRegistrations: 0,
    downloads: 0,
    revenue: 0
  });

  // Charts data
  const [chartData, setChartData] = useState({
    userGrowth: [],
    bookUploads: [],
    examActivity: [],
    revenueData: []
  });

  // Real-time metrics
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    onlineUsers: 0,
    systemHealth: 100,
    responseTime: 150,
    errorRate: 0.1
  });

  // Alerts and notifications
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'High CPU Usage',
      message: 'Server CPU usage is above 80%',
      timestamp: new Date(),
      resolved: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Backup Completed',
      message: 'Daily backup completed successfully',
      timestamp: new Date(Date.now() - 3600000),
      resolved: true
    }
  ]);

  useEffect(() => {
    loadDashboardData();
    loadChartData();
    loadRealtimeMetrics();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      updateRealtimeMetrics();
    }, 5000);

    return () => clearInterval(interval);
  }, [dateRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      
      // Fetch dashboard stats
      const statsRes = await axios.get(`${API_URL}/dashboard/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const stats = statsRes.data;
      setDashboardData({
        totalUsers: stats.active_students || 0,
        totalBooks: stats.total_books || 0,
        totalExams: stats.total_exams || 0,
        totalProjects: stats.ongoing_projects || 0,
        activeUsers: Math.floor(stats.active_students * 0.3) || 0,
        newRegistrations: Math.floor(stats.active_students * 0.1) || 0,
        downloads: Math.floor(stats.total_books * 2.5) || 0,
        revenue: Math.floor(stats.total_books * 5.99) || 0
      });

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = async () => {
    try {
      // Mock data for demonstration
      const userGrowthData = generateMockData('user', 30);
      const bookUploadsData = generateMockData('book', 30);
      const examActivityData = generateMockData('exam', 30);
      const revenueData = generateMockData('revenue', 30);

      setChartData({
        userGrowth: userGrowthData,
        bookUploads: bookUploadsData,
        examActivity: examActivityData,
        revenueData: revenueData
      });
    } catch (error) {
      console.error('Failed to load chart data:', error);
    }
  };

  const loadRealtimeMetrics = async () => {
    try {
      // Mock real-time data
      setRealtimeMetrics({
        onlineUsers: Math.floor(Math.random() * 50) + 10,
        systemHealth: 95 + Math.random() * 5,
        responseTime: 100 + Math.random() * 100,
        errorRate: Math.random() * 2
      });
    } catch (error) {
      console.error('Failed to load realtime metrics:', error);
    }
  };

  const updateRealtimeMetrics = async () => {
    try {
      // Simulate real-time updates
      setRealtimeMetrics(prev => ({
        onlineUsers: prev.onlineUsers + Math.floor(Math.random() * 10) - 5,
        systemHealth: Math.max(90, Math.min(100, prev.systemHealth + (Math.random() - 0.5) * 2)),
        responseTime: Math.max(50, Math.min(300, prev.responseTime + (Math.random() - 0.5) * 20)),
        errorRate: Math.max(0, Math.min(5, prev.errorRate + (Math.random() - 0.5) * 0.5))
      }));
    } catch (error) {
      console.error('Failed to update realtime metrics:', error);
    }
  };

  const generateMockData = (type, days) => {
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      let value;
      switch (type) {
        case 'user':
          value = 20 + Math.floor(Math.random() * 10) + i * 2;
          break;
        case 'book':
          value = Math.floor(Math.random() * 5);
          break;
        case 'exam':
          value = Math.floor(Math.random() * 15) + 5;
          break;
        case 'revenue':
          value = 50 + Math.floor(Math.random() * 100) + i * 5;
          break;
        default:
          value = Math.floor(Math.random() * 50);
      }
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: value,
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    
    return data;
  };

  const exportReport = async (format) => {
    try {
      // Simulate export
      const filename = `admin-report-${activeTab}-${new Date().toISOString().split('T')[0]}.${format}`;
      console.log(`Exporting ${filename}...`);
      
      // In a real app, you'd generate and download the report
      showMessage('success', `Report exported as ${filename}`);
    } catch (error) {
      showMessage('error', 'Failed to export report');
    }
  };

  const showMessage = (type, content) => {
    console.log(`${type}: ${content}`);
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: dashboardData.totalUsers,
      change: '+12%',
      changeType: 'positive',
      icon: FiUsers,
      color: 'blue'
    },
    {
      title: 'Total Books',
      value: dashboardData.totalBooks,
      change: '+8%',
      changeType: 'positive',
      icon: FiBook,
      color: 'green'
    },
    {
      title: 'Exams Completed',
      value: dashboardData.totalExams,
      change: '+15%',
      changeType: 'positive',
      icon: FiFileText,
      color: 'purple'
    },
    {
      title: 'Active Projects',
      value: dashboardData.totalProjects,
      change: '+5%',
      changeType: 'positive',
      icon: FiActivity,
      color: 'orange'
    },
    {
      title: 'Online Users',
      value: realtimeMetrics.onlineUsers,
      change: `${realtimeMetrics.onlineUsers > 30 ? '+' : '-'}3%`,
      changeType: realtimeMetrics.onlineUsers > 30 ? 'positive' : 'negative',
      icon: FiTrendingUp,
      color: 'cyan'
    },
    {
      title: 'System Health',
      value: `${Math.round(realtimeMetrics.systemHealth)}%`,
      change: realtimeMetrics.systemHealth > 95 ? 'Excellent' : 'Good',
      changeType: realtimeMetrics.systemHealth > 95 ? 'positive' : 'neutral',
      icon: FiCheckCircle,
      color: 'emerald'
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FiBarChart },
    { id: 'users', name: 'Users', icon: FiUsers },
    { id: 'content', name: 'Content', icon: FiBook },
    { id: 'system', name: 'System Health', icon: FiActivity }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
              Analytics & Reports
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Comprehensive insights and system monitoring
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
              <option value="1y">Last year</option>
            </select>
            
            <button
              onClick={() => {
                loadDashboardData();
                loadChartData();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiRefreshCw className="mr-2 h-4 w-4 inline" />
              Refresh
            </button>
            
            <button
              onClick={() => exportReport('pdf')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiDownload className="mr-2 h-4 w-4 inline" />
              Export
            </button>
          </div>
        </div>

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-600' :
                      stat.changeType === 'negative' ? 'text-red-600' :
                      'text-gray-500'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Alerts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiAlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                  System Alerts
                </h2>
                
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                        alert.type === 'error' ? 'bg-red-50 border-red-400' :
                        'bg-blue-50 border-blue-400'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {alert.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {alert.message}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {alert.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Growth</h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={chartData.userGrowth}>
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
                        dataKey="value" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Book Uploads Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Book Uploads</h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={chartData.bookUploads}>
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
                      <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={chartData.revenueData}>
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
                        dataKey="value" 
                        stroke="#8B5CF6" 
                        strokeWidth={2}
                        dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* System Health */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Health</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">CPU Usage</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Memory Usage</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">67%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Disk Usage</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">23%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Response Time</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{Math.round(realtimeMetrics.responseTime)}ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">User Analytics</h2>
            <div className="text-center py-12">
              <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">User Analytics</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Detailed user analytics and insights coming soon.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Content Analytics</h2>
            <div className="text-center py-12">
              <FiBook className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Content Analytics</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Content performance metrics and insights coming soon.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">System Monitoring</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{realtimeMetrics.systemHealth.toFixed(1)}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">System Health</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{realtimeMetrics.onlineUsers}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Online Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{Math.round(realtimeMetrics.responseTime)}ms</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{realtimeMetrics.errorRate.toFixed(2)}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Error Rate</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;