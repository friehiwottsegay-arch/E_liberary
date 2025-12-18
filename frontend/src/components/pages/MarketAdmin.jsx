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
  FaUserShield
} from "react-icons/fa";

const MarketAdmin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 12450.00,
    activeRentals: 45,
    inventoryBooks: 1250,
    totalOrders: 234,
    monthlyRevenue: 8750.00,
    activeUsers: 1890,
    pendingReturns: 12,
    lowStockItems: 25
  });
  
  // Sample data
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [users, setUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Sample books data
      const sampleBooks = [
        {
          id: 1,
          title: "Advanced Mathematics",
          author: "Dr. Sarah Johnson",
          publisher: "Academic Press",
          isbn: "978-0123456789",
          price: 29.99,
          rental_price: 5.99,
          stock_quantity: 15,
          condition: "new",
          is_for_sale: true,
          is_for_rent: true,
          is_featured: true,
          category: "Mathematics",
          created_at: "2024-11-01"
        },
        {
          id: 2,
          title: "Ethiopian History",
          author: "Prof. Abebe Kebede",
          publisher: "Addis Ababa University Press",
          isbn: "978-0123456790",
          price: 19.99,
          rental_price: 3.99,
          stock_quantity: 8,
          condition: "used",
          is_for_sale: true,
          is_for_rent: true,
          is_featured: false,
          category: "History",
          created_at: "2024-10-28"
        },
        {
          id: 3,
          title: "Modern Programming",
          author: "Jane Smith",
          publisher: "Tech Books Inc",
          isbn: "978-0123456791",
          price: 35.00,
          rental_price: 7.00,
          stock_quantity: 0,
          condition: "new",
          is_for_sale: true,
          is_for_rent: false,
          is_featured: true,
          category: "Technology",
          created_at: "2024-11-10"
        }
      ];

      // Sample orders data
      const sampleOrders = [
        {
          id: "ORD-001",
          user_name: "John Doe",
          user_email: "john@example.com",
          book_title: "Advanced Mathematics",
          book_author: "Dr. Sarah Johnson",
          price: 29.99,
          status: "delivered",
          order_date: "2024-11-01",
          delivery_date: "2024-11-05",
          tracking_number: "TRK123456789",
          payment_method: "telebir"
        },
        {
          id: "ORD-002",
          user_name: "Mary Johnson",
          user_email: "mary@example.com",
          book_title: "Ethiopian History",
          book_author: "Prof. Abebe Kebede",
          price: 19.99,
          status: "shipped",
          order_date: "2024-11-10",
          estimated_delivery: "2024-11-15",
          tracking_number: "TRK987654321",
          payment_method: "cbeBir"
        },
        {
          id: "ORD-003",
          user_name: "Alex Smith",
          user_email: "alex@example.com",
          book_title: "Modern Programming",
          book_author: "Jane Smith",
          price: 35.00,
          status: "processing",
          order_date: "2024-11-12",
          tracking_number: null,
          payment_method: "stripe"
        }
      ];

      // Sample rentals data
      const sampleRentals = [
        {
          id: "RNT-001",
          user_name: "John Doe",
          book_title: "Science Fundamentals",
          rental_price: 5.99,
          start_date: "2024-11-01",
          due_date: "2024-11-15",
          status: "active",
          security_deposit: 20.00
        },
        {
          id: "RNT-002",
          user_name: "Sarah Wilson",
          book_title: "Business Strategy",
          rental_price: 7.99,
          start_date: "2024-10-15",
          due_date: "2024-10-29",
          status: "overdue",
          security_deposit: 25.00
        }
      ];

      // Sample users data
      const sampleUsers = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "+251912345678",
          total_orders: 5,
          total_spent: 145.50,
          member_since: "2024-01-15",
          status: "active"
        },
        {
          id: 2,
          name: "Mary Johnson",
          email: "mary@example.com",
          phone: "+251923456789",
          total_orders: 3,
          total_spent: 89.99,
          member_since: "2024-03-20",
          status: "active"
        },
        {
          id: 3,
          name: "Alex Smith",
          email: "alex@example.com",
          phone: "+251934567890",
          total_orders: 1,
          total_spent: 35.00,
          member_since: "2024-11-01",
          status: "active"
        }
      ];

      setBooks(sampleBooks);
      setOrders(sampleOrders);
      setRentals(sampleRentals);
      setUsers(sampleUsers);
      setRecentOrders(sampleOrders.slice(0, 5));
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      delivered: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: FaCheck, text: "Delivered" },
      shipped: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", icon: FaTruck, text: "Shipped" },
      processing: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", icon: FaClock, text: "Processing" },
      active: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: FaCheck, text: "Active" },
      overdue: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: FaExclamationTriangle, text: "Overdue" },
      returned: { color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200", icon: FaCheck, text: "Returned" },
      blocked: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: FaLock, text: "Blocked" }
    };

    const config = statusConfig[status] || statusConfig.processing;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="mr-1" />
        {config.text}
      </span>
    );
  };

  const DashboardTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Sales</p>
              <p className="text-3xl font-bold">${stats.totalSales.toLocaleString()}</p>
            </div>
            <FaDollarSign className="text-4xl text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Active Rentals</p>
              <p className="text-3xl font-bold">{stats.activeRentals}</p>
            </div>
            <FaRecycle className="text-4xl text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Books</p>
              <p className="text-3xl font-bold">{stats.inventoryBooks}</p>
            </div>
            <FaBox className="text-4xl text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Orders</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </div>
            <FaShoppingBag className="text-4xl text-orange-200" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <FaChartBar className="mr-2" />
            Monthly Revenue
          </h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[1200, 1800, 1600, 2200, 1900, 2100, 2400, 2800, 2600, 3000, 3200, 3400].map((value, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div
                  className="w-8 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                  style={{ height: `${(value / 3500) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-500">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <FaChartPie className="mr-2" />
            Popular Categories
          </h3>
          <div className="space-y-4">
            {[
              { name: "Technology", value: 35, color: "bg-blue-500" },
              { name: "Mathematics", value: 25, color: "bg-green-500" },
              { name: "History", value: 20, color: "bg-purple-500" },
              { name: "Literature", value: 15, color: "bg-orange-500" },
              { name: "Others", value: 5, color: "bg-gray-500" }
            ].map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 ${category.color} rounded-full`}></div>
                  <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                </div>
                <span className="font-semibold text-gray-800 dark:text-white">{category.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <FaClock className="mr-2" />
          Recent Orders
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 text-gray-600 dark:text-gray-400">Order ID</th>
                <th className="text-left py-3 text-gray-600 dark:text-gray-400">Customer</th>
                <th className="text-left py-3 text-gray-600 dark:text-gray-400">Book</th>
                <th className="text-left py-3 text-gray-600 dark:text-gray-400">Amount</th>
                <th className="text-left py-3 text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left py-3 text-gray-600 dark:text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 font-medium text-gray-800 dark:text-white">{order.id}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{order.user_name}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{order.book_title}</td>
                  <td className="py-3 font-semibold text-gray-800 dark:text-white">${order.price}</td>
                  <td className="py-3">{getStatusBadge(order.status)}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const BookManagementTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Book Management</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 font-semibold">
          <FaPlus />
          <span>Add New Book</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Book</th>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Price</th>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Stock</th>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={`/api/placeholder/100/150`}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">{book.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{book.author}</p>
                        <p className="text-gray-500 dark:text-gray-500 text-xs">{book.publisher}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">${book.price}</div>
                      {book.is_for_rent && (
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          Rent: ${book.rental_price}/week
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-semibold ${book.stock_quantity === 0 ? 'text-red-600' : book.stock_quantity <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
                      {book.stock_quantity} copies
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      {book.is_for_sale && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          For Sale
                        </span>
                      )}
                      {book.is_for_rent && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          For Rent
                        </span>
                      )}
                      {book.is_featured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <FaEdit />
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

  const OrderManagementTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Order Management</h2>
        <span className="text-gray-600 dark:text-gray-400">{orders.length} orders</span>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{order.id}</h3>
                <p className="text-gray-600 dark:text-gray-400">{order.user_name} • {order.user_email}</p>
              </div>
              <div className="text-right">
                {getStatusBadge(order.status)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <span className="text-gray-500 text-sm">Book:</span>
                <p className="font-semibold text-gray-800 dark:text-white">{order.book_title}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Amount:</span>
                <p className="font-semibold text-gray-800 dark:text-white">${order.price}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Payment:</span>
                <p className="font-semibold text-gray-800 dark:text-white capitalize">{order.payment_method}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Date:</span>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {new Date(order.order_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 text-sm font-semibold">
                Update Status
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 text-sm font-semibold">
                View Details
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300 text-sm font-semibold">
                Print Invoice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const UserManagementTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">User Management</h2>
        <span className="text-gray-600 dark:text-gray-400">{users.length} users</span>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">User</th>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Orders</th>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Total Spent</th>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left py-3 px-6 text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-4 px-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">{user.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{user.email}</p>
                      <p className="text-gray-500 dark:text-gray-500 text-xs">{user.phone}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-800 dark:text-white">{user.total_orders}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-800 dark:text-white">${user.total_spent}</span>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <FaEye />
                      </button>
                      <button className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors">
                        <FaEdit />
                      </button>
                      {user.status === 'active' ? (
                        <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <FaLock />
                        </button>
                      ) : (
                        <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                          <FaLockOpen />
                        </button>
                      )}
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

  const ReportsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">Reports & Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Sales by Category</h3>
          <div className="space-y-3">
            {[
              { category: "Technology", sales: 4500, percentage: 35 },
              { category: "Mathematics", sales: 3200, percentage: 25 },
              { category: "History", sales: 2560, percentage: 20 },
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

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Monthly Performance</h3>
          <div className="space-y-4">
            {[
              { metric: "Revenue Growth", value: "+12.5%", trend: "up" },
              { metric: "New Orders", value: "45", trend: "up" },
              { metric: "Active Rentals", value: "42", trend: "stable" },
              { metric: "User Retention", value: "94%", trend: "up" }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">{item.metric}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800 dark:text-white">{item.value}</span>
                  <FaArrowUp className={`text-sm ${item.trend === 'up' ? 'text-green-500' : item.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Export Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <FaFilePdf />
            <span>Sales Report</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <FaFilePdf />
            <span>Rental Report</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <FaFilePdf />
            <span>User Report</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading admin panel...</p>
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
              onClick={() => navigate('/admin')}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-4"
            >
              <FaArrowLeft />
              <span>Back to Admin</span>
            </button>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                <FaUserShield className="mr-3 text-blue-500" />
                Market Admin
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your book marketplace</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl mb-8 overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { id: "dashboard", label: "Dashboard", icon: FaTachometerAlt },
              { id: "books", label: "Books", icon: FaBox },
              { id: "orders", label: "Orders", icon: FaShoppingBag },
              { id: "rentals", label: "Rentals", icon: FaRecycle },
              { id: "users", label: "Users", icon: FaUsers },
              { id: "reports", label: "Reports", icon: FaChartBar },
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
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "books" && <BookManagementTab />}
          {activeTab === "orders" && <OrderManagementTab />}
          {activeTab === "rentals" && (
            <div className="text-center py-12">
              <FaRecycle className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Rental Management</h3>
              <p className="text-gray-500 dark:text-gray-500">Manage active rentals and returns</p>
            </div>
          )}
          {activeTab === "users" && <UserManagementTab />}
          {activeTab === "reports" && <ReportsTab />}
          {activeTab === "settings" && (
            <div className="text-center py-12">
              <FaCog className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Settings</h3>
              <p className="text-gray-500 dark:text-gray-500">Configure marketplace settings and preferences</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketAdmin;