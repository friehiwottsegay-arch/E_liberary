import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaArrowLeft,
  FaTachometerAlt,
  FaBox,
  FaShoppingBag,
  FaRecycle,
  FaUsers,
  FaChartBar,
  FaCog,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaDownload,
  FaFilter,
  FaSearch,
  FaSort,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaClock,
  FaStar,
  FaCrown,
  FaGem,
  FaBuilding,
  FaNewspaper,
  FaHashtag,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaLockOpen,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCreditCard,
  FaTruck,
  FaFilePdf,
  FaChartPie,
  FaArrowUp,
  FaDollarSign,
  FaSync,
  FaBell,
  FaUserShield,
  FaStore,
  FaMoneyBillWave,
  FaUserFriends,
  FaChartLine,
  FaPercentage,
  FaCalendarCheck,
  FaChevronDown,
  FaChevronUp,
  FaHandshake,
  FaTrophy,
  FaRocket,
  FaBriefcase
} from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

const API_URL = 'http://127.0.0.1:8000/api';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [dateRange, setDateRange] = useState('30d');

  // Seller-specific stats
  const [sellerStats, setSellerStats] = useState({
    totalRevenue: 8750.00,
    totalSales: 234,
    activeListings: 89,
    pendingOrders: 12,
    averageOrderValue: 37.50,
    conversionRate: 4.2,
    totalCustomers: 156,
    monthlyGrowth: 18.5,
    topSellingBook: "Advanced Mathematics",
    lowestStockItems: 5,
    viewsThisMonth: 1247,
    clickThroughRate: 6.8
  });

  // Sample data
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    loadSellerData();
  }, [dateRange]);

  const loadSellerData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      
      // Load seller profile
      const profileResponse = await axios.get(`${API_URL}/seller/profile/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSellerProfile(profileResponse.data);

      // Load seller analytics and books
      await loadSellerAnalytics(token);
      await loadBooks(token);
      await loadOrders(token);
      await loadSalesAnalytics(token);

    } catch (error) {
      console.error("Error loading seller data:", error);
      // Use sample data if API fails
      loadSampleData();
    } finally {
      setLoading(false);
    }
  };

  const loadSellerAnalytics = async (token) => {
    try {
      // Load dashboard stats from real backend
      const statsResponse = await axios.get(`${API_URL}/seller-books/dashboard_stats/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSellerStats(statsResponse.data);
    } catch (error) {
      console.error("Error loading analytics:", error);
      // Use sample data as fallback
      const analytics = generateSellerAnalytics();
      setSellerStats(analytics);
    }
  };

  const loadBooks = async (token) => {
    try {
      // Try to load from seller-books endpoint
      const booksResponse = await axios.get(`${API_URL}/seller-books/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setBooks(booksResponse.data || []);
    } catch (error) {
      console.error("Error loading books from seller-books:", error);
      try {
        // Try to load from inventory endpoint
        const inventoryResponse = await axios.get(`${API_URL}/seller/inventory/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // Convert inventory data to book format if needed
        const inventoryBooks = inventoryResponse.data.recent_updates || [];
        setBooks(inventoryBooks);
      } catch (inventoryError) {
        console.error("Error loading inventory:", inventoryError);
        // Use sample books data
        setBooks(generateSampleBooks());
      }
    }
  };

  const loadOrders = async (token) => {
    try {
      const ordersResponse = await axios.get(`${API_URL}/seller-books/order_management/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setOrders(ordersResponse.data.orders || []);
    } catch (error) {
      console.error("Error loading orders:", error);
      // Use sample orders data
      setOrders(generateSampleOrders());
    }
  };

  const loadSalesAnalytics = async (token) => {
    try {
      const analyticsResponse = await axios.get(`${API_URL}/seller-books/sales_analytics/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAnalyticsData(analyticsResponse.data || []);
    } catch (error) {
      console.error("Error loading sales analytics:", error);
      // Use sample data as fallback
      setAnalyticsData(generateSalesChartData());
    }
  };

  const generateSellerAnalytics = () => ({
    totalRevenue: 8750.00,
    totalSales: 234,
    activeListings: 89,
    pendingOrders: 12,
    averageOrderValue: 37.50,
    conversionRate: 4.2,
    totalCustomers: 156,
    monthlyGrowth: 18.5,
    topSellingBook: "Advanced Mathematics",
    lowestStockItems: 5,
    viewsThisMonth: 1247,
    clickThroughRate: 6.8
  });

  const generateSampleBooks = () => [
    {
      id: 1,
      title: "Advanced Mathematics",
      author: "Dr. Sarah Johnson",
      price: 29.99,
      rental_price: 5.99,
      stock_quantity: 15,
      total_sold: 45,
      revenue: 1349.55,
      views: 234,
      clicks: 18,
      status: "active"
    },
    {
      id: 2,
      title: "Ethiopian History",
      author: "Prof. Abebe Kebede",
      price: 19.99,
      rental_price: 3.99,
      stock_quantity: 8,
      total_sold: 32,
      revenue: 639.68,
      views: 156,
      clicks: 12,
      status: "active"
    },
    {
      id: 3,
      title: "Modern Programming",
      author: "Jane Smith",
      price: 35.00,
      stock_quantity: 0,
      total_sold: 28,
      revenue: 980.00,
      views: 189,
      clicks: 15,
      status: "out_of_stock"
    }
  ];

  const generateSampleOrders = () => [
    {
      id: "ORD-001",
      customer_name: "John Doe",
      customer_email: "john@example.com",
      book_title: "Advanced Mathematics",
      quantity: 1,
      amount: 29.99,
      status: "processing",
      order_date: "2024-11-15",
      payment_status: "paid",
      shipping_status: "pending"
    },
    {
      id: "ORD-002",
      customer_name: "Mary Johnson",
      customer_email: "mary@example.com",
      book_title: "Ethiopian History",
      quantity: 2,
      amount: 39.98,
      status: "shipped",
      order_date: "2024-11-14",
      payment_status: "paid",
      shipping_status: "in_transit"
    },
    {
      id: "ORD-003",
      customer_name: "Alex Smith",
      customer_email: "alex@example.com",
      book_title: "Modern Programming",
      quantity: 1,
      amount: 35.00,
      status: "delivered",
      order_date: "2024-11-13",
      payment_status: "paid",
      shipping_status: "delivered"
    }
  ];

  const generateSampleCustomers = () => [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+251912345678",
      total_orders: 5,
      total_spent: 145.50,
      last_order: "2024-11-15",
      status: "active"
    },
    {
      id: 2,
      name: "Mary Johnson",
      email: "mary@example.com",
      phone: "+251923456789",
      total_orders: 3,
      total_spent: 89.99,
      last_order: "2024-11-14",
      status: "active"
    },
    {
      id: 3,
      name: "Alex Smith",
      email: "alex@example.com",
      phone: "+251934567890",
      total_orders: 8,
      total_spent: 245.00,
      last_order: "2024-11-13",
      status: "vip"
    }
  ];

  const loadSampleData = () => {
    setBooks(generateSampleBooks());
    setOrders(generateSampleOrders());
    setSellerStats(generateSellerAnalytics());
    setAnalyticsData(generateSalesChartData());
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: FaCheck, text: "Active" },
      processing: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", icon: FaClock, text: "Processing" },
      shipped: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", icon: FaTruck, text: "Shipped" },
      delivered: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: FaCheck, text: "Delivered" },
      out_of_stock: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: FaExclamationTriangle, text: "Out of Stock" },
      vip: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", icon: FaCrown, text: "VIP" }
    };

    const config = statusConfig[status] || statusConfig.active;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="mr-1" />
        {config.text}
      </span>
    );
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Seller Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold">${sellerStats.totalRevenue.toLocaleString()}</p>
              <p className="text-green-100 text-sm mt-1">+{sellerStats.monthlyGrowth}% this month</p>
            </div>
            <FaMoneyBillWave className="text-4xl text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Sales</p>
              <p className="text-3xl font-bold">{sellerStats.totalSales}</p>
              <p className="text-blue-100 text-sm mt-1">Orders this month</p>
            </div>
            <FaShoppingBag className="text-4xl text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Active Listings</p>
              <p className="text-3xl font-bold">{sellerStats.activeListings}</p>
              <p className="text-purple-100 text-sm mt-1">{sellerStats.lowestStockItems} low stock</p>
            </div>
            <FaBox className="text-4xl text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Avg Order Value</p>
              <p className="text-3xl font-bold">${sellerStats.averageOrderValue}</p>
              <p className="text-orange-100 text-sm mt-1">{sellerStats.conversionRate}% conversion rate</p>
            </div>
            <FaChartLine className="text-4xl text-orange-200" />
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <FaChartLine className="mr-2" />
              Sales Performance
            </h3>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={generateSalesChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <FaRocket className="mr-2" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <FaPlus />
              <span>Add New Book</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <FaEye />
              <span>View Analytics</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
              <FaDownload />
              <span>Export Reports</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
              <FaCog />
              <span>Store Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Performing Books & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Books */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <FaTrophy className="mr-2 text-yellow-500" />
            Top Performing Books
          </h3>
          <div className="space-y-4">
            {books.slice(0, 5).map((book, index) => (
              <div key={book.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">{book.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{book.total_sold} sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 dark:text-white">${book.revenue.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{book.views} views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <FaShoppingBag className="mr-2" />
            Recent Orders
          </h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">{order.customer_name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{order.book_title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{order.order_date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 dark:text-white">${order.amount}</p>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const InventoryTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Inventory Management</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 font-semibold">
          <FaPlus />
          <span>Add New Book</span>
        </button>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
              <FaCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">In Stock</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{books.filter(b => b.stock_quantity > 0).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
              <FaExclamationTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Out of Stock</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{books.filter(b => b.stock_quantity === 0).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900">
              <FaClock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Low Stock</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{books.filter(b => b.stock_quantity > 0 && b.stock_quantity <= 5).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <FaBox className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Total Value</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">${books.reduce((sum, book) => sum + (book.price * book.stock_quantity), 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Book</th>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Price</th>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Stock</th>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Sold</th>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Revenue</th>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-4 px-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">{book.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{book.author}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-gray-800 dark:text-white">${book.price}</div>
                    {book.rental_price && (
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        Rent: ${book.rental_price}/week
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-semibold ${book.stock_quantity === 0 ? 'text-red-600' : book.stock_quantity <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
                      {book.stock_quantity} copies
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-800 dark:text-white">{book.total_sold}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-800 dark:text-white">${book.revenue.toFixed(2)}</span>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(book.status)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <FaEdit />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                        <FaEye />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <FaTrash />
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
  );

  const OrdersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Order Management</h2>
        <span className="text-gray-600 dark:text-gray-400">{orders.length} orders</span>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900">
              <FaClock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Processing</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{orders.filter(o => o.status === 'processing').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <FaTruck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Shipped</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{orders.filter(o => o.status === 'shipped').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
              <FaCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Delivered</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{orders.filter(o => o.status === 'delivered').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
              <FaDollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Total Value</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">${orders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{order.id}</h3>
                <p className="text-gray-600 dark:text-gray-400">{order.customer_name} • {order.customer_email}</p>
              </div>
              <div className="text-right">
                {getStatusBadge(order.status)}
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{order.order_date}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <span className="text-gray-500 text-sm">Book:</span>
                <p className="font-semibold text-gray-800 dark:text-white">{order.book_title}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Quantity:</span>
                <p className="font-semibold text-gray-800 dark:text-white">{order.quantity}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Amount:</span>
                <p className="font-semibold text-gray-800 dark:text-white">${order.amount}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Payment:</span>
                <p className="font-semibold text-gray-800 dark:text-white capitalize">{order.payment_status}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 text-sm font-semibold">
                Update Status
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 text-sm font-semibold">
                Print Invoice
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300 text-sm font-semibold">
                Contact Customer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CustomersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Customer Management</h2>
        <span className="text-gray-600 dark:text-gray-400">{orders.length} customers</span>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <FaUsers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Total Customers</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{new Set(orders.map(o => o.customer_email)).size}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
              <FaCrown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Active Customers</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{new Set(orders.map(o => o.customer_email)).size}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
              <FaDollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">${orders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
              <FaPercentage className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Avg Order Value</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">${(orders.reduce((sum, order) => sum + order.amount, 0) / orders.length).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Customer</th>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Book</th>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Amount</th>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Date</th>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-4 px-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">{order.customer_name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{order.customer_email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-800 dark:text-white">{order.book_title}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-800 dark:text-white">${order.amount}</span>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-600 dark:text-gray-400">{order.order_date}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <FaEye />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                        <FaEnvelope />
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
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">Sales Analytics</h2>
      
      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={generateSalesChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Sales by Category</h3>
          <div className="space-y-4">
            {[
              { category: "Mathematics", sales: 4500, percentage: 35 },
              { category: "History", sales: 3200, percentage: 25 },
              { category: "Technology", sales: 2560, percentage: 20 },
              { category: "Literature", sales: 1920, percentage: 15 },
              { category: "Others", sales: 640, percentage: 5 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">{item.category}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-800 dark:text-white">${item.sales}</div>
                  <div className="text-sm text-gray-500">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{sellerStats.monthlyGrowth}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Growth</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{sellerStats.conversionRate}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{sellerStats.viewsThisMonth}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Views This Month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{sellerStats.clickThroughRate}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Click Through Rate</div>
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">Store Settings</h2>
      
      {/* Store Profile */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Store Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Store Name</label>
            <input
              type="text"
              value={sellerProfile?.business_name || "My Book Store"}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Type</label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="individual">Individual Seller</option>
              <option value="company">Company</option>
              <option value="publisher">Publisher</option>
              <option value="bookstore">Bookstore</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Describe your store and what makes it special..."
            ></textarea>
          </div>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Payment Settings</h3>
        <div className="space-y-4">
          {[
            { name: 'Chapa', enabled: true, fee: '2.5%' },
            { name: 'Telebir', enabled: true, fee: '1.5%' },
            { name: 'CBE Bir', enabled: false, fee: '2.0%' },
            { name: 'Stripe', enabled: true, fee: '2.9%' }
          ].map((method, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <FaCreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">{method.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fee: {method.fee}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={method.enabled} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 font-semibold">
          Save Settings
        </button>
      </div>
    </div>
  );

  const generateSalesChartData = () => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.floor(Math.random() * 500) + 200,
        orders: Math.floor(Math.random() * 10) + 5
      });
    }
    return data;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading seller dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/market')}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-4"
            >
              <FaArrowLeft />
              <span>Back to Market</span>
            </button>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                <FaStore className="mr-3 text-blue-500" />
                Seller Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your bookstore and sales</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.location.reload()}
              disabled={refreshing}
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <FaSync className={`${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
              <FaBell className="mr-2" />
              Notifications
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl mb-8 overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { id: "overview", label: "Overview", icon: FaTachometerAlt },
              { id: "inventory", label: "Inventory", icon: FaBox },
              { id: "orders", label: "Orders", icon: FaShoppingBag },
              { id: "customers", label: "Customers", icon: FaUsers },
              { id: "analytics", label: "Analytics", icon: FaChartBar },
              { id: "settings", label: "Settings", icon: FaCog }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-4 font-semibold transition-all duration-300 text-sm ${
                  activeTab === id
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <Icon />
                <span className="hidden lg:block">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "inventory" && <InventoryTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "customers" && <CustomersTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;