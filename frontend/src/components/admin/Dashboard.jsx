import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiBookOpen, FiClipboard, FiFileText, FiBarChart2, FiTrendingUp,
  FiUsers, FiBriefcase, FiCalendar, FiAward, FiDollarSign,
  FiCheckCircle, FiActivity, FiSearch, FiSun, FiMoon, FiRefreshCw,
  FiDownload, FiFilter, FiTarget, FiClock, FiAlertTriangle,
  FiUserCheck, FiBook, FiFolder, FiMessageCircle, FiStar,
  FiEye, FiShoppingCart, FiHeart, FiShare2, FiMaximize2,
  FiPieChart, FiTrendingDown, FiArrowUp, FiArrowDown
} from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line,
  PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar,
  Legend, CartesianGrid
} from 'recharts';
import { getAuthHeaders, getToken } from '../../utils/authUtils';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#f97316', '#84cc16'];

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [analytics, setAnalytics] = useState({
    monthlyUsers: [],
    bookDownloads: [],
    categoryDistribution: [],
    systemHealth: []
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [errorStats, setErrorStats] = useState(null);
  const [errorActivities, setErrorActivities] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  const mockAnalyticsData = {
    monthlyUsers: [
      { month: 'Jan', users: 1200, growth: 15 },
      { month: 'Feb', users: 1350, growth: 12.5 },
      { month: 'Mar', users: 1580, growth: 17 },
      { month: 'Apr', users: 1820, growth: 15.2 },
      { month: 'May', users: 2100, growth: 15.4 },
      { month: 'Jun', users: 2450, growth: 16.7 },
      { month: 'Jul', users: 2800, growth: 14.3 },
      { month: 'Aug', users: 3200, growth: 14.3 },
      { month: 'Sep', users: 3600, growth: 12.5 },
      { month: 'Oct', users: 4100, growth: 13.9 },
      { month: 'Nov', users: 4650, growth: 13.4 },
      { month: 'Dec', users: 5200, growth: 11.8 }
    ],
    bookDownloads: [
      { category: 'Mathematics', downloads: 1250 },
      { category: 'Science', downloads: 980 },
      { category: 'Literature', downloads: 756 },
      { category: 'History', downloads: 632 },
      { category: 'Art', downloads: 423 },
      { category: 'Programming', downloads: 892 }
    ],
    categoryDistribution: [
      { name: 'Academic Books', value: 45, color: '#6366f1' },
      { name: 'Research Papers', value: 25, color: '#8b5cf6' },
      { name: 'Course Materials', value: 20, color: '#06b6d4' },
      { name: 'Reference Materials', value: 10, color: '#10b981' }
    ],
    systemHealth: [
      { name: 'CPU Usage', value: 65, unit: '%' },
      { name: 'Memory', value: 72, unit: '%' },
      { name: 'Storage', value: 45, unit: '%' },
      { name: 'Network', value: 23, unit: '%' }
    ]
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoadingStats(true);
      setLoadingActivities(true);
      setErrorStats(null);
      setErrorActivities(null);

      const headers = await getAuthHeaders();

      // Fetch stats
      const [statsRes, activitiesRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/dashboard/', { headers }),
        axios.get('http://127.0.0.1:8000/api/recent-activities/', { headers })
      ]);

      const data = statsRes.data;
      const formattedStats = [
        { 
          title: 'Total Books', 
          value: data.total_books, 
          change: '+12.5%', 
          trend: 'up',
          icon: <FiBookOpen size={28} />,
          color: 'from-indigo-500 to-purple-600'
        },
        { 
          title: 'Active Students', 
          value: data.active_students, 
          change: '+8.2%', 
          trend: 'up',
          icon: <FiUsers size={28} />,
          color: 'from-blue-500 to-cyan-500'
        },
        { 
          title: 'Total Courses', 
          value: data.total_courses, 
          change: '+5.7%', 
          trend: 'up',
          icon: <FiClipboard size={28} />,
          color: 'from-green-400 to-teal-500'
        },
        { 
          title: 'Research Papers', 
          value: data.research_papers, 
          change: '+15.3%', 
          trend: 'up',
          icon: <FiFileText size={28} />,
          color: 'from-pink-500 to-red-500'
        },
        { 
          title: 'Ongoing Projects', 
          value: data.ongoing_projects, 
          change: '-2.1%', 
          trend: 'down',
          icon: <FiBriefcase size={28} />,
          color: 'from-violet-500 to-fuchsia-500'
        },
        { 
          title: 'Revenue', 
          value: '$12,450', 
          change: '+22.1%', 
          trend: 'up',
          icon: <FiDollarSign size={28} />,
          color: 'from-emerald-500 to-lime-500'
        }
      ];

      setStats(formattedStats);
      setActivities(activitiesRes.data);
      setAnalytics(mockAnalyticsData);

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setErrorStats('Failed to load dashboard data');
      setErrorActivities('Failed to load recent activities');
      // Use mock data as fallback
      setStats([
        { 
          title: 'Total Books', 
          value: 156, 
          change: '+12.5%', 
          trend: 'up',
          icon: <FiBookOpen size={28} />,
          color: 'from-indigo-500 to-purple-600'
        },
        { 
          title: 'Active Students', 
          value: 423, 
          change: '+8.2%', 
          trend: 'up',
          icon: <FiUsers size={28} />,
          color: 'from-blue-500 to-cyan-500'
        },
        { 
          title: 'Total Courses', 
          value: 89, 
          change: '+5.7%', 
          trend: 'up',
          icon: <FiClipboard size={28} />,
          color: 'from-green-400 to-teal-500'
        },
        { 
          title: 'Research Papers', 
          value: 67, 
          change: '+15.3%', 
          trend: 'up',
          icon: <FiFileText size={28} />,
          color: 'from-pink-500 to-red-500'
        },
        { 
          title: 'Ongoing Projects', 
          value: 34, 
          change: '-2.1%', 
          trend: 'down',
          icon: <FiBriefcase size={28} />,
          color: 'from-violet-500 to-fuchsia-500'
        },
        { 
          title: 'Revenue', 
          value: '$12,450', 
          change: '+22.1%', 
          trend: 'up',
          icon: <FiDollarSign size={28} />,
          color: 'from-emerald-500 to-lime-500'
        }
      ]);
      setAnalytics(mockAnalyticsData);
    } finally {
      setLoadingStats(false);
      setLoadingActivities(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const exportData = () => {
    const data = {
      stats: stats,
      activities: activities,
      analytics: analytics,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `dashboard-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const filteredStats = stats.filter(stat =>
    stat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 text-gray-900 dark:text-white transition-all duration-500">
      
      {/* Header Section */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                E-Library 
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Welcome back! 
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Time Range Selector */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-80 rounded-xl bg-gray-100 dark:bg-gray-700 text-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50"
                title="Refresh Data"
              >
                <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={18} />
              </button>

              <button
                onClick={exportData}
                className="p-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
                title="Export Data"
              >
                <FiDownload size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Stats Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingStats ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl h-32"></div>
            ))
          ) : errorStats ? (
            <div className="col-span-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
              <FiAlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
              <p className="text-red-700 dark:text-red-400">{errorStats}</p>
              <button 
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
              >
                Try Again
              </button>
            </div>
          ) : (
            filteredStats.map((stat, index) => (
              <div
                key={stat.title}
                className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${stat.color} p-4`}>
                  <div className="flex items-center justify-between text-white">
                    <div className="p-3 bg-white/20 rounded-lg">
                      {stat.icon}
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center text-sm ${
                        stat.trend === 'up' ? 'text-green-200' : 'text-red-200'
                      }`}>
                        {stat.trend === 'up' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
                        <span className="ml-1">{stat.change}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Growth Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                User Growth
              </h2>
              <div className="flex items-center gap-2">
                <FiTrendingUp className="text-green-500" size={18} />
                <span className="text-sm text-green-500 font-medium">+15.3% this month</span>
              </div>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={analytics.monthlyUsers}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" className="text-gray-600 dark:text-gray-400" />
                  <YAxis className="text-gray-600 dark:text-gray-400" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#6366f1" 
                    fill="url(#colorUsers)" 
                    strokeWidth={3}
                  />
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Content Distribution
              </h2>
              <FiPieChart className="text-blue-500" size={18} />
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={analytics.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analytics.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* System Health & Recent Activities */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* System Health */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                System Health
              </h2>
              <FiActivity className="text-green-500" size={18} />
            </div>
            <div className="space-y-4">
              {analytics.systemHealth.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.value}{item.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.value > 80 ? 'bg-red-500' : 
                        item.value > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Activities
              </h2>
              <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                View All
              </button>
            </div>

            {loadingActivities ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : errorActivities ? (
              <div className="text-center py-8">
                <FiAlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
                <p className="text-red-600 dark:text-red-400">{errorActivities}</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-8">
                <FiActivity className="mx-auto text-gray-400 mb-2" size={32} />
                <p className="text-gray-500 dark:text-gray-400">No recent activities found.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {activities.slice(0, 8).map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <FiActivity className="text-blue-600 dark:text-blue-400" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {activity.text || activity.type}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Just now'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: <FiBookOpen />, label: 'Add Book', color: 'bg-blue-500' },
              { icon: <FiUsers />, label: 'Add User', color: 'bg-green-500' },
              { icon: <FiFileText />, label: 'Create Exam', color: 'bg-purple-500' },
              { icon: <FiFolder />, label: 'Upload Project', color: 'bg-orange-500' },
              { icon: <FiMessageCircle />, label: 'Send Message', color: 'bg-teal-500' },
              { icon: <FiBarChart2 />, label: 'View Reports', color: 'bg-indigo-500' }
            ].map((action, index) => (
              <button
                key={index}
                className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all group"
              >
                <div className={`${action.color} text-white p-3 rounded-lg mb-2 group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
