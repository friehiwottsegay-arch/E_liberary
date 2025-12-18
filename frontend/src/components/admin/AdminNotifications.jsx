import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiBell, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiInfo, 
  FiAlertTriangle,
  FiX,
  FiRefreshCw,
  FiSettings,
  FiMarkAsRead,
  FiTrash2,
  FiMail,
  FiUser,
  FiDatabase,
  FiActivity,
  FiHeart,
  FiTrendingUp,
  FiFilter,
  FiSearch,
  FiMoreVertical
} from 'react-icons/fi';

const API_URL = 'http://127.0.0.1:8000/api';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [displayNotifications, setDisplayNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  // Settings
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    desktop: true,
    sound: true,
    autoMarkRead: true,
    retentionDays: 30,
    categories: {
      user: true,
      system: true,
      security: true,
      performance: true,
      content: true
    }
  });

  // Real-time metrics
  const [metrics, setMetrics] = useState({
    total: 0,
    unread: 0,
    today: 0,
    thisWeek: 0,
    urgent: 0
  });

  useEffect(() => {
    loadNotifications();
    loadMetrics();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      loadMetrics();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, filterType, filterStatus, searchTerm]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      // For now, use mock data
      setNotifications(generateMockNotifications());
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async () => {
    try {
      // Mock metrics calculation
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const total = notifications.length;
      const unread = notifications.filter(n => !n.read).length;
      const todayCount = notifications.filter(n => new Date(n.timestamp) >= today).length;
      const weekCount = notifications.filter(n => new Date(n.timestamp) >= thisWeek).length;
      const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.read).length;

      setMetrics({
        total,
        unread,
        today: todayCount,
        thisWeek: weekCount,
        urgent: urgentCount
      });
    } catch (error) {
      console.error('Failed to load metrics:', error);
    }
  };

  const generateMockNotifications = () => {
    const types = [
      { type: 'user', icon: FiUser, color: 'blue' },
      { type: 'system', icon: FiDatabase, color: 'gray' },
      { type: 'security', icon: FiAlertTriangle, color: 'red' },
      { type: 'performance', icon: FiActivity, color: 'yellow' },
      { type: 'content', icon: FiHeart, color: 'green' }
    ];

    const messages = [
      'New user registered: john.doe@example.com',
      'System backup completed successfully',
      'Failed login attempts detected from IP 192.168.1.100',
      'High CPU usage detected on server',
      'New book uploaded: "Advanced Mathematics"',
      'User "jane.smith" completed profile setup',
      'Database optimization completed',
      'Security scan found 3 potential issues',
      'New subject created: "Quantum Physics"',
      'System health check passed',
      'User activity spike detected',
      'Content moderation required for uploaded file'
    ];

    return Array.from({ length: 25 }, (_, i) => {
      const type = types[Math.floor(Math.random() * types.length)];
      const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      const priority = Math.random() > 0.8 ? 'urgent' : Math.random() > 0.6 ? 'high' : 'normal';
      const read = Math.random() > 0.7;
      
      return {
        id: i + 1,
        type: type.type,
        title: messages[Math.floor(Math.random() * messages.length)],
        message: `Detailed message for notification ${i + 1}`,
        timestamp: timestamp.toISOString(),
        read,
        priority,
        actionUrl: `/admin/notifications/${i + 1}`,
        metadata: {
          userId: Math.floor(Math.random() * 1000),
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          additional: Math.random() > 0.5 ? { reason: 'Automated system notification' } : null
        }
      };
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const filterNotifications = () => {
    let filtered = [...notifications];

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(notification => notification.type === filterType);
    }

    // Apply status filter
    if (filterStatus === 'unread') {
      filtered = filtered.filter(notification => !notification.read);
    } else if (filterStatus === 'read') {
      filtered = filtered.filter(notification => notification.read);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setDisplayNotifications(filtered);
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(`${API_URL}/notifications/${notificationId}/mark-read/`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`${API_URL}/notifications/mark-all-read/`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${API_URL}/notifications/${notificationId}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const deleteSelected = async () => {
    if (selectedNotifications.length === 0) return;

    try {
      const token = localStorage.getItem('access_token');
      await Promise.all(
        selectedNotifications.map(id =>
          axios.delete(`${API_URL}/notifications/${id}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        )
      );

      setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
      setSelectedNotifications([]);
    } catch (error) {
      console.error('Failed to delete selected notifications:', error);
    }
  };

  const handleNotificationSelect = (notificationId) => {
    setSelectedNotifications(prev =>
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const selectAll = () => {
    if (selectedNotifications.length === displayNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(displayNotifications.map(n => n.id));
    }
  };

  const getNotificationIcon = (type, priority) => {
    const iconProps = {
      className: `h-5 w-5 ${
        type === 'user' ? 'text-blue-600' :
        type === 'system' ? 'text-gray-600' :
        type === 'security' ? 'text-red-600' :
        type === 'performance' ? 'text-yellow-600' :
        'text-green-600'
      }`
    };

    const iconMap = {
      user: FiUser,
      system: FiDatabase,
      security: FiAlertTriangle,
      performance: FiActivity,
      content: FiHeart
    };

    const IconComponent = iconMap[type] || FiBell;
    return <IconComponent {...iconProps} />;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'border-l-gray-300 bg-white dark:bg-gray-800';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - time) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Notifications
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor system alerts, user activities, and important events
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button
              onClick={() => setShowSettings(true)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FiSettings className="mr-2 h-4 w-4 inline" />
              Settings
            </button>
            
            <button
              onClick={() => {
                loadNotifications();
                loadMetrics();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiRefreshCw className="mr-2 h-4 w-4 inline" />
              Refresh
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <FiBell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900">
                <FiAlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Unread</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics.unread}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                <FiCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Today</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics.today}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                <FiTrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">This Week</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics.thisWeek}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
                <FiAlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Urgent</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics.urgent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Bulk Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={selectAll}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                {selectedNotifications.length === displayNotifications.length ? 'Deselect All' : 'Select All'}
              </button>
              
              <button
                onClick={markAllAsRead}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                disabled={selectedNotifications.length === 0}
              >
                <FiMarkAsRead className="mr-1 h-4 w-4 inline" />
                Mark Read
              </button>
              
              <button
                onClick={deleteSelected}
                className="px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 dark:bg-gray-700 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
                disabled={selectedNotifications.length === 0}
              >
                <FiTrash2 className="mr-1 h-4 w-4 inline" />
                Delete
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="user">User</option>
                <option value="system">System</option>
                <option value="security">Security</option>
                <option value="performance">Performance</option>
                <option value="content">Content</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <FiRefreshCw className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Loading notifications...</p>
            </div>
          ) : displayNotifications.length === 0 ? (
            <div className="text-center py-12">
              <FiBell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">No notifications found</p>
            </div>
          ) : (
            displayNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 border-gray-200 dark:border-gray-700 ${getPriorityColor(notification.priority)} p-6 ${
                  !notification.read ? 'ring-2 ring-blue-100 dark:ring-blue-900/20' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => handleNotificationSelect(notification.id)}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex-shrink-0 mr-4">
                    {getNotificationIcon(notification.type, notification.priority)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            notification.type === 'user' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : notification.type === 'system'
                              ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                              : notification.type === 'security'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : notification.type === 'performance'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {notification.type}
                          </span>
                          
                          {notification.priority !== 'normal' && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              notification.priority === 'urgent'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {notification.priority}
                            </span>
                          )}
                          
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Mark as read"
                          >
                            <FiCheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete notification"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowSettings(false)}></div>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notification Settings</h3>
              </div>
              
              <div className="px-6 py-4 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Delivery Methods</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.email}
                        onChange={(e) => setNotificationSettings(prev => ({ ...prev, email: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Email notifications</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.push}
                        onChange={(e) => setNotificationSettings(prev => ({ ...prev, push: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Push notifications</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.desktop}
                        onChange={(e) => setNotificationSettings(prev => ({ ...prev, desktop: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Desktop notifications</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Notification Categories</h4>
                  <div className="space-y-2">
                    {Object.entries(notificationSettings.categories).map(([category, enabled]) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => setNotificationSettings(prev => ({
                            ...prev,
                            categories: {
                              ...prev.categories,
                              [category]: e.target.checked
                            }
                          }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Retention Period (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={notificationSettings.retentionDays}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, retentionDays: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notificationSettings.autoMarkRead}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, autoMarkRead: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Automatically mark as read after viewing</span>
                </label>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save settings logic here
                    setShowSettings(false);
                    // Show success message
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;