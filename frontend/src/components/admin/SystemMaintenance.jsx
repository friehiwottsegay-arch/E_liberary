import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiDatabase, 
  FiDownload, 
  FiUpload, 
  FiRefreshCw, 
  FiTrash2, 
  FiSettings,
  FiHardDrive,
  FiActivity,
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiZap,
  FiFilter,
  FiSearch,
  FiCalendar,
  FiFileText,
  FiServer,
  FiCpu,
  FiMemoryStick,
  FiMonitor,
  FiGlobe,
  FiShield,
  FiTool,
  FiArchive,
  FiRotateCcw,
  FiPlay,
  FiPause,
  FiStop,
  FiBarChart3,
  FiTrendingUp,
  FiTrendingDown,
  FiAlertCircle,
  FiXCircle
} from 'react-icons/fi';

const API_URL = 'http://127.0.0.1:8000/api';

const SystemMaintenance = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [message, setMessage] = useState({ type: '', content: '' });
  const [systemStatus, setSystemStatus] = useState('unknown');

  // Backup state
  const [backups, setBackups] = useState([]);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [restoreInProgress, setRestoreInProgress] = useState(false);

  // Maintenance tasks
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    uptime: '0 days',
    lastBackup: null,
    databaseSize: '0 MB',
    totalFiles: 0,
    activeConnections: 0
  });

  // Filters
  const [logFilter, setLogFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Settings
  const [maintenanceSettings, setMaintenanceSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    retentionDays: 30,
    autoCleanup: true,
    cleanupInterval: 7,
    emailNotifications: true,
    maintenanceMode: false
  });

  useEffect(() => {
    loadSystemData();
    
    // Set up periodic updates
    const interval = setInterval(() => {
      updateSystemMetrics();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadSystemData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadBackups(),
        loadMaintenanceTasks(),
        loadLogs(),
        loadSystemMetrics()
      ]);
    } catch (error) {
      console.error('Failed to load system data:', error);
      showMessage('error', 'Failed to load system data');
    } finally {
      setLoading(false);
    }
  };

  const loadBackups = async () => {
    try {
      // Mock backup data
      const mockBackups = [
        {
          id: 1,
          name: 'manual-backup-2025-11-03',
          size: '245.7 MB',
          type: 'manual',
          createdAt: '2025-11-03T18:00:00Z',
          status: 'completed',
          location: '/backups/manual-backup-2025-11-03.sql'
        },
        {
          id: 2,
          name: 'auto-backup-2025-11-03',
          size: '244.2 MB',
          type: 'automatic',
          createdAt: '2025-11-03T06:00:00Z',
          status: 'completed',
          location: '/backups/auto-backup-2025-11-03.sql'
        },
        {
          id: 3,
          name: 'auto-backup-2025-11-02',
          size: '241.8 MB',
          type: 'automatic',
          createdAt: '2025-11-02T06:00:00Z',
          status: 'completed',
          location: '/backups/auto-backup-2025-11-02.sql'
        }
      ];
      setBackups(mockBackups);
    } catch (error) {
      console.error('Failed to load backups:', error);
    }
  };

  const loadMaintenanceTasks = async () => {
    try {
      // Mock maintenance tasks
      const mockTasks = [
        {
          id: 1,
          name: 'Database Optimization',
          description: 'Optimize database tables and indexes',
          lastRun: '2025-11-03T10:00:00Z',
          nextRun: '2025-11-04T10:00:00Z',
          status: 'completed',
          duration: '5m 23s',
          frequency: 'daily'
        },
        {
          id: 2,
          name: 'Log Cleanup',
          description: 'Clean up old log files',
          lastRun: '2025-11-03T09:00:00Z',
          nextRun: '2025-11-04T09:00:00Z',
          status: 'completed',
          duration: '2m 15s',
          frequency: 'daily'
        },
        {
          id: 3,
          name: 'Cache Clearing',
          description: 'Clear application cache',
          lastRun: '2025-11-03T12:00:00Z',
          nextRun: '2025-11-03T18:00:00Z',
          status: 'running',
          duration: '1m 45s',
          frequency: 'every 6 hours'
        },
        {
          id: 4,
          name: 'Security Scan',
          description: 'Run security vulnerability scan',
          lastRun: '2025-11-02T20:00:00Z',
          nextRun: '2025-11-09T20:00:00Z',
          status: 'scheduled',
          duration: '15m 30s',
          frequency: 'weekly'
        }
      ];
      setMaintenanceTasks(mockTasks);
    } catch (error) {
      console.error('Failed to load maintenance tasks:', error);
    }
  };

  const loadLogs = async () => {
    try {
      // Mock log data
      const mockLogs = [
        {
          id: 1,
          timestamp: '2025-11-03T20:45:00Z',
          level: 'INFO',
          source: 'django',
          message: 'User login successful',
          user: 'admin@library.com',
          ip: '192.168.1.100'
        },
        {
          id: 2,
          timestamp: '2025-11-03T20:44:30Z',
          level: 'WARNING',
          source: 'django',
          message: 'Failed login attempt',
          user: 'unknown',
          ip: '192.168.1.105'
        },
        {
          id: 3,
          timestamp: '2025-11-03T20:44:00Z',
          level: 'ERROR',
          source: 'django',
          message: 'Database connection timeout',
          user: null,
          ip: null
        },
        {
          id: 4,
          timestamp: '2025-11-03T20:43:45Z',
          level: 'INFO',
          source: 'system',
          message: 'Backup completed successfully',
          user: 'system',
          ip: null
        },
        {
          id: 5,
          timestamp: '2025-11-03T20:43:30Z',
          level: 'DEBUG',
          source: 'django',
          message: 'Cache cleared for user sessions',
          user: null,
          ip: null
        }
      ];
      setLogs(mockLogs);
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  };

  const loadSystemMetrics = async () => {
    try {
      // Mock system metrics
      setSystemMetrics({
        cpu: Math.floor(Math.random() * 50) + 20,
        memory: Math.floor(Math.random() * 40) + 40,
        disk: Math.floor(Math.random() * 30) + 30,
        uptime: '15 days, 8 hours',
        lastBackup: '2025-11-03T18:00:00Z',
        databaseSize: '847.2 MB',
        totalFiles: 15847,
        activeConnections: Math.floor(Math.random() * 20) + 5
      });
    } catch (error) {
      console.error('Failed to load system metrics:', error);
    }
  };

  const updateSystemMetrics = async () => {
    try {
      setSystemMetrics(prev => ({
        ...prev,
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
        activeConnections: Math.max(0, prev.activeConnections + Math.floor((Math.random() - 0.5) * 5))
      }));
    } catch (error) {
      console.error('Failed to update system metrics:', error);
    }
  };

  const createBackup = async () => {
    setBackupInProgress(true);
    try {
      const token = localStorage.getItem('access_token');
      // Simulate backup creation
      showMessage('success', 'Backup creation started...');
      
      // Simulate backup process
      setTimeout(() => {
        const newBackup = {
          id: backups.length + 1,
          name: `manual-backup-${new Date().toISOString().split('T')[0]}`,
          size: '250.1 MB',
          type: 'manual',
          createdAt: new Date().toISOString(),
          status: 'completed',
          location: `/backups/manual-backup-${new Date().toISOString().split('T')[0]}.sql`
        };
        setBackups(prev => [newBackup, ...prev]);
        setBackupInProgress(false);
        showMessage('success', 'Backup created successfully!');
      }, 3000);

    } catch (error) {
      console.error('Failed to create backup:', error);
      setBackupInProgress(false);
      showMessage('error', 'Failed to create backup');
    }
  };

  const restoreBackup = async (backupId) => {
    if (!window.confirm('Are you sure you want to restore this backup? This action cannot be undone.')) {
      return;
    }

    setRestoreInProgress(true);
    try {
      const token = localStorage.getItem('access_token');
      const backup = backups.find(b => b.id === backupId);
      
      showMessage('warning', `Restoring backup: ${backup.name}...`);
      
      // Simulate restore process
      setTimeout(() => {
        setRestoreInProgress(false);
        showMessage('success', `Successfully restored backup: ${backup.name}`);
      }, 5000);

    } catch (error) {
      console.error('Failed to restore backup:', error);
      setRestoreInProgress(false);
      showMessage('error', 'Failed to restore backup');
    }
  };

  const runMaintenanceTask = async (taskId) => {
    try {
      const task = maintenanceTasks.find(t => t.id === taskId);
      if (!task) return;

      showMessage('info', `Running maintenance task: ${task.name}`);
      
      // Simulate task execution
      setTimeout(() => {
        setMaintenanceTasks(prev => 
          prev.map(t => 
            t.id === taskId 
              ? { ...t, lastRun: new Date().toISOString(), status: 'completed', duration: '3m 45s' }
              : t
          )
        );
        showMessage('success', `Maintenance task completed: ${task.name}`);
      }, 2000);

    } catch (error) {
      console.error('Failed to run maintenance task:', error);
      showMessage('error', 'Failed to run maintenance task');
    }
  };

  const cleanupLogs = async () => {
    try {
      showMessage('info', 'Cleaning up old logs...');
      
      // Simulate log cleanup
      setTimeout(() => {
        const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
        setLogs(prev => prev.filter(log => new Date(log.timestamp) > cutoffDate));
        showMessage('success', 'Old logs cleaned up successfully');
      }, 1500);

    } catch (error) {
      console.error('Failed to cleanup logs:', error);
      showMessage('error', 'Failed to cleanup logs');
    }
  };

  const optimizeDatabase = async () => {
    try {
      showMessage('info', 'Starting database optimization...');
      
      // Simulate optimization
      setTimeout(() => {
        setSystemMetrics(prev => ({
          ...prev,
          databaseSize: `${(parseFloat(prev.databaseSize) * 0.95).toFixed(1)} MB`
        }));
        showMessage('success', 'Database optimization completed');
      }, 3000);

    } catch (error) {
      console.error('Failed to optimize database:', error);
      showMessage('error', 'Failed to optimize database');
    }
  };

  const toggleMaintenanceMode = async () => {
    try {
      const newMode = !maintenanceSettings.maintenanceMode;
      setMaintenanceSettings(prev => ({ ...prev, maintenanceMode: newMode }));
      
      showMessage(
        newMode ? 'warning' : 'success',
        newMode ? 'Maintenance mode enabled' : 'Maintenance mode disabled'
      );

    } catch (error) {
      console.error('Failed to toggle maintenance mode:', error);
      showMessage('error', 'Failed to toggle maintenance mode');
    }
  };

  const showMessage = (type, content) => {
    setMessage({ type, content });
    setTimeout(() => setMessage({ type: '', content: '' }), 5000);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getLogLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'error': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'warning': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'info': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'debug': return 'text-gray-600 bg-gray-50 dark:bg-gray-700';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-700';
    }
  };

  const getTaskStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FiCheckCircle className="h-4 w-4 text-green-600" />;
      case 'running': return <FiActivity className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed': return <FiXCircle className="h-4 w-4 text-red-600" />;
      case 'scheduled': return <FiClock className="h-4 w-4 text-gray-600" />;
      default: return <FiAlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredLogs = logs.filter(log => {
    if (logFilter !== 'all' && log.level.toLowerCase() !== logFilter) return false;
    if (searchTerm && !log.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FiBarChart3 },
    { id: 'backups', name: 'Backups', icon: FiArchive },
    { id: 'maintenance', name: 'Maintenance', icon: FiTool },
    { id: 'logs', name: 'Logs', icon: FiFileText },
    { id: 'settings', name: 'Settings', icon: FiSettings }
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              System Maintenance
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage backups, maintenance tasks, and system health
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button
              onClick={() => loadSystemData()}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <FiRefreshCw className={`mr-2 h-4 w-4 inline ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button
              onClick={createBackup}
              disabled={backupInProgress}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <FiDownload className="mr-2 h-4 w-4 inline" />
              {backupInProgress ? 'Creating...' : 'Create Backup'}
            </button>
          </div>
        </div>

        {/* Message */}
        {message.content && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : message.type === 'warning'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {message.type === 'success' ? <FiCheckCircle className="mr-2" /> : 
             message.type === 'warning' ? <FiAlertTriangle className="mr-2" /> :
             <FiAlertCircle className="mr-2" />}
            {message.content}
          </div>
        )}

        {/* System Status Alert */}
        {maintenanceSettings.maintenanceMode && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800">
            <div className="flex items-center">
              <FiAlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                Maintenance Mode Enabled - Some features may be unavailable
              </span>
            </div>
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

        {/* System Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* System Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <FiCpu className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">CPU Usage</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{Math.round(systemMetrics.cpu)}%</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${systemMetrics.cpu > 80 ? 'bg-red-500' : systemMetrics.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${systemMetrics.cpu}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                    <FiMemoryStick className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Memory Usage</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{Math.round(systemMetrics.memory)}%</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${systemMetrics.memory > 80 ? 'bg-red-500' : systemMetrics.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${systemMetrics.memory}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                    <FiHardDrive className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Disk Usage</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{Math.round(systemMetrics.disk)}%</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${systemMetrics.disk > 80 ? 'bg-red-500' : systemMetrics.disk > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${systemMetrics.disk}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                    <FiGlobe className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Connections</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{systemMetrics.activeConnections}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Uptime</span>
                    <span className="text-gray-900 dark:text-white font-medium">{systemMetrics.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Database Size</span>
                    <span className="text-gray-900 dark:text-white font-medium">{systemMetrics.databaseSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Total Files</span>
                    <span className="text-gray-900 dark:text-white font-medium">{systemMetrics.totalFiles.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Last Backup</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {systemMetrics.lastBackup ? formatTimestamp(systemMetrics.lastBackup) : 'Never'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={createBackup}
                    disabled={backupInProgress}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <FiDownload className="mr-2 h-4 w-4" />
                    {backupInProgress ? 'Creating Backup...' : 'Create Backup'}
                  </button>
                  
                  <button
                    onClick={optimizeDatabase}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FiDatabase className="mr-2 h-4 w-4" />
                    Optimize Database
                  </button>
                  
                  <button
                    onClick={cleanupLogs}
                    className="w-full flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <FiTrash2 className="mr-2 h-4 w-4" />
                    Clean Old Logs
                  </button>
                  
                  <button
                    onClick={toggleMaintenanceMode}
                    className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                      maintenanceSettings.maintenanceMode
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                  >
                    <FiSettings className="mr-2 h-4 w-4" />
                    {maintenanceSettings.maintenanceMode ? 'Disable' : 'Enable'} Maintenance Mode
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backups Tab */}
        {activeTab === 'backups' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Database Backups</h2>
              <button
                onClick={createBackup}
                disabled={backupInProgress}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <FiDownload className="mr-2 h-4 w-4 inline" />
                Create Backup
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Backup Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {backups.map((backup) => (
                      <tr key={backup.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{backup.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{backup.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            backup.type === 'manual' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {backup.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {backup.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatTimestamp(backup.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {backup.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => restoreBackup(backup.id)}
                              disabled={restoreInProgress}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                            >
                              <FiUpload className="h-4 w-4" />
                            </button>
                            <button
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            >
                              <FiDownload className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Maintenance Tasks */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Maintenance Tasks</h3>
                </div>
                <div className="p-6 space-y-4">
                  {maintenanceTasks.map((task) => (
                    <div key={task.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            {getTaskStatusIcon(task.status)}
                            <h4 className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{task.name}</h4>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{task.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>Last run: {formatTimestamp(task.lastRun)}</span>
                            <span>Next run: {formatTimestamp(task.nextRun)}</span>
                            <span>Frequency: {task.frequency}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => runMaintenanceTask(task.id)}
                          disabled={task.status === 'running'}
                          className="ml-4 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          Run Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Health */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Health</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Overall Health</span>
                    <span className={`text-lg font-semibold ${
                      (systemMetrics.cpu + systemMetrics.memory + systemMetrics.disk) / 3 < 70 ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {((100 - (systemMetrics.cpu + systemMetrics.memory + systemMetrics.disk) / 3)).toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>CPU</span>
                        <span>{Math.round(systemMetrics.cpu)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${systemMetrics.cpu > 80 ? 'bg-red-500' : systemMetrics.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${systemMetrics.cpu}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Memory</span>
                        <span>{Math.round(systemMetrics.memory)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${systemMetrics.memory > 80 ? 'bg-red-500' : systemMetrics.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${systemMetrics.memory}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Disk</span>
                        <span>{Math.round(systemMetrics.disk)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${systemMetrics.disk > 80 ? 'bg-red-500' : systemMetrics.disk > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${systemMetrics.disk}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            {/* Log Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <select
                    value={logFilter}
                    onChange={(e) => setLogFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Levels</option>
                    <option value="error">Error</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                  </select>
                </div>
                
                <button
                  onClick={cleanupLogs}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FiTrash2 className="mr-2 h-4 w-4 inline" />
                  Clean Old Logs
                </button>
              </div>
            </div>

            {/* Logs List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Logs</h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLogLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">{log.message}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatTimestamp(log.timestamp)}</span>
                          <span>Source: {log.source}</span>
                          {log.user && <span>User: {log.user}</span>}
                          {log.ip && <span>IP: {log.ip}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredLogs.length === 0 && (
                  <div className="p-12 text-center">
                    <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No logs found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {searchTerm || logFilter !== 'all' ? 'Try adjusting your filters' : 'System logs will appear here'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Maintenance Settings</h3>
              
              <div className="space-y-6">
                {/* Backup Settings */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Backup Settings</h4>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={maintenanceSettings.autoBackup}
                        onChange={(e) => setMaintenanceSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable automatic backups</span>
                    </label>
                    
                    {maintenanceSettings.autoBackup && (
                      <div className="ml-6 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Backup Frequency
                          </label>
                          <select
                            value={maintenanceSettings.backupFrequency}
                            onChange={(e) => setMaintenanceSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Retention Period (days)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="365"
                            value={maintenanceSettings.retentionDays}
                            onChange={(e) => setMaintenanceSettings(prev => ({ ...prev, retentionDays: parseInt(e.target.value) }))}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cleanup Settings */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Cleanup Settings</h4>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={maintenanceSettings.autoCleanup}
                        onChange={(e) => setMaintenanceSettings(prev => ({ ...prev, autoCleanup: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable automatic cleanup</span>
                    </label>
                    
                    {maintenanceSettings.autoCleanup && (
                      <div className="ml-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Cleanup Interval (days)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={maintenanceSettings.cleanupInterval}
                          onChange={(e) => setMaintenanceSettings(prev => ({ ...prev, cleanupInterval: parseInt(e.target.value) }))}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Notification Settings */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Notification Settings</h4>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={maintenanceSettings.emailNotifications}
                        onChange={(e) => setMaintenanceSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Email notifications for maintenance events</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => showMessage('success', 'Settings saved successfully')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemMaintenance;