import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaUser,
  FaShoppingBag,
  FaHeart,
  FaRecycle,
  FaBox,
  FaEye,
  FaDownload,
  FaCreditCard,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTruck,
  FaCheck,
  FaExclamationTriangle,
  FaClock,
  FaStar,
  FaCrown,
  FaCog,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFilter,
  FaSearch,
  FaSort,
  FaTimes,
  FaFilePdf,
  FaPlay,
  FaPause,
  FaSync,
  FaGem,
  FaBuilding,
  FaNewspaper,
  FaHashtag,
  FaPhone,
  FaLock,
  FaShieldAlt,
  FaFileAlt
} from "react-icons/fa";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [userProfile, setUserProfile] = useState({
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+251912345678",
    address: "Addis Ababa, Ethiopia",
    memberSince: "2024-01-15",
    totalOrders: 12,
    totalRentals: 5,
    totalSpent: 245.50,
    favoriteBooks: 18
  });
  const [orders, setOrders] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Simulate user data loading
      const sampleOrders = [
        {
          id: "ORD-001",
          book_id: 1,
          book_title: "Advanced Mathematics",
          book_author: "Dr. Sarah Johnson",
          book_image: "/api/placeholder/150/200",
          price: 29.99,
          book_type: "hard",
          status: "delivered",
          order_date: "2024-11-01",
          delivery_date: "2024-11-05",
          tracking_number: "TRK123456789",
          delivery_method: "express",
          address: "Addis Ababa, Ethiopia"
        },
        {
          id: "ORD-002",
          book_id: 2,
          book_title: "Ethiopian History",
          book_author: "Prof. Abebe Kebede",
          book_image: "/api/placeholder/150/200",
          price: 19.99,
          book_type: "soft",
          status: "shipped",
          order_date: "2024-11-10",
          estimated_delivery: "2024-11-15",
          tracking_number: "TRK987654321",
          delivery_method: "standard",
          address: "Addis Ababa, Ethiopia"
        },
        {
          id: "ORD-003",
          book_id: 3,
          book_title: "Modern Programming",
          book_author: "Jane Smith",
          book_image: "/api/placeholder/150/200",
          price: 35.00,
          book_type: "both",
          status: "processing",
          order_date: "2024-11-12",
          tracking_number: null,
          delivery_method: "pickup",
          address: "Addis Ababa, Ethiopia"
        }
      ];

      const sampleRentals = [
        {
          id: "RNT-001",
          book_id: 4,
          book_title: "Science Fundamentals",
          book_author: "Dr. Michael Brown",
          book_image: "/api/placeholder/150/200",
          rental_price: 5.99,
          book_type: "hard",
          start_date: "2024-11-01",
          due_date: "2024-11-15",
          status: "active",
          delivery_method: "express",
          security_deposit: 20.00
        },
        {
          id: "RNT-002",
          book_id: 5,
          book_title: "Business Strategy",
          book_author: "Lisa Wong",
          book_image: "/api/placeholder/150/200",
          book_type: "soft",
          rental_price: 7.99,
          start_date: "2024-10-15",
          due_date: "2024-10-29",
          status: "overdue",
          delivery_method: "pickup",
          security_deposit: 25.00
        }
      ];

      const sampleWishlist = [
        {
          id: 1,
          book_title: "Data Science Essentials",
          book_author: "Alex Chen",
          book_image: "/api/placeholder/150/200",
          book_type: "soft",
          price: 32.99,
          rental_price: 6.99,
          is_for_sale: true,
          is_for_rent: true,
          added_date: "2024-11-08"
        },
        {
          id: 2,
          book_title: "Web Development Guide",
          book_author: "Maria Garcia",
          book_image: "/api/placeholder/150/200",
          book_type: "hard",
          price: 28.50,
          rental_price: 5.50,
          is_for_sale: true,
          is_for_rent: false,
          added_date: "2024-11-05"
        }
      ];

      setOrders(sampleOrders);
      setRentals(sampleRentals);
      setWishlist(sampleWishlist);
    } catch (error) {
      console.error("Error loading user data:", error);
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
      returned: { color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200", icon: FaCheck, text: "Returned" }
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

  const OrderCard = ({ order }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-4 sm:space-y-0">
        <div className="w-20 h-24 sm:w-16 sm:h-20 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
          <img
            src={order.book_image}
            alt={order.book_title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDE1MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmNGY2ZmYiLz48dGV4dCB4PSI3NSIgeT0iMTAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Qm9vazwvdGV4dD48L3N2Zz4=';
            }}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 space-y-2 sm:space-y-0">
            <div className="text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-1">
                {order.book_title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                by {order.book_author}
              </p>
              <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
                <span className="text-base sm:text-lg font-bold text-green-600">
                  ${order.price}
                </span>
                {order.book_type && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
                    {order.book_type === "hard" ? <FaBox className="mr-1" /> : <FaFileAlt className="mr-1" />}
                    {order.book_type.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div className="text-center sm:text-right">
              {getStatusBadge(order.status)}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-4 text-xs sm:text-sm">
            <div>
              <span className="text-gray-500">Order ID:</span>
              <span className="font-semibold text-gray-800 dark:text-white ml-2">{order.id}</span>
            </div>
            <div>
              <span className="text-gray-500">Order Date:</span>
              <span className="font-semibold text-gray-800 dark:text-white ml-2">
                {new Date(order.order_date).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Delivery:</span>
              <span className="font-semibold text-gray-800 dark:text-white ml-2 capitalize">
                {order.delivery_method}
              </span>
            </div>
          </div>

          {order.tracking_number && (
            <div className="mb-4 text-xs sm:text-sm">
              <span className="text-gray-500">Tracking:</span>
              <span className="font-semibold text-gray-800 dark:text-white ml-2">{order.tracking_number}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => navigate(`/market/book/${order.book_id}/sell`)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 text-sm font-semibold"
            >
              <FaEye />
              <span>View Book</span>
            </button>
            {order.status === "delivered" && (
              <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 text-sm font-semibold">
                <FaDownload />
                <span>Download</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const RentalCard = ({ rental }) => {
    const isOverdue = new Date(rental.due_date) < new Date();
    const daysLeft = Math.ceil((new Date(rental.due_date) - new Date()) / (1000 * 60 * 60 * 24));

    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-2xl border-2 ${isOverdue ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="w-20 h-24 sm:w-16 sm:h-20 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
            <img
              src={rental.book_image}
              alt={rental.book_title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDE1MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmNGY2ZmYiLz48dGV4dCB4PSI3NSIgeT0iMTAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Qm9vazwvdGV4dD48L3N2Zz4=';
              }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 space-y-2 sm:space-y-0">
              <div className="text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-1">
                  {rental.book_title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  by {rental.book_author}
                </p>
                <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
                  <div className="text-base sm:text-lg font-bold text-blue-600">
                    ${rental.rental_price}/week
                  </div>
                  {rental.book_type && (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
                      {rental.book_type === "hard" ? <FaBox className="mr-1" /> : <FaFileAlt className="mr-1" />}
                      {rental.book_type.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-center sm:text-right">
                {getStatusBadge(rental.status)}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-4 text-xs sm:text-sm">
              <div>
                <span className="text-gray-500">Start Date:</span>
                <span className="font-semibold text-gray-800 dark:text-white ml-2">
                  {new Date(rental.start_date).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Due Date:</span>
                <span className={`font-semibold ml-2 ${isOverdue ? 'text-red-600' : 'text-gray-800 dark:text-white'}`}>
                  {new Date(rental.due_date).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Security:</span>
                <span className="font-semibold text-gray-800 dark:text-white ml-2">
                  ${rental.security_deposit}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => navigate(`/market/book/${rental.book_id}/rent`)}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 text-sm font-semibold"
              >
                <FaEye />
                <span>View Book</span>
              </button>
              {isOverdue && (
                <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 text-sm font-semibold">
                  <FaExclamationTriangle />
                  <span>Return Required</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const WishlistCard = ({ item }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-4 sm:space-y-0">
        <div className="w-20 h-24 sm:w-16 sm:h-20 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
          <img
            src={item.book_image}
            alt={item.book_title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDE1MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmNGY2ZmYiLz48dGV4dCB4PSI3NSIgeT0iMTAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Qm9vazwvdGV4dD48L3N2Zz4=';
            }}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 space-y-2 sm:space-y-0">
            <div className="text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-1">
                {item.book_title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                by {item.book_author}
              </p>
              <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-4 mb-2 flex-wrap">
                {item.is_for_sale && (
                  <div className="text-base sm:text-lg font-bold text-green-600">
                    ${item.price}
                  </div>
                )}
                {item.is_for_rent && (
                  <div className="text-base sm:text-lg font-bold text-blue-600">
                    ${item.rental_price}/week
                  </div>
                )}
                {item.book_type && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
                    {item.book_type === "hard" ? <FaBox className="mr-1" /> : <FaFileAlt className="mr-1" />}
                    {item.book_type.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div className="text-center sm:text-right">
              <button
                onClick={() => {
                  // Remove from wishlist
                  setWishlist(wishlist.filter(w => w.id !== item.id));
                }}
                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {item.is_for_sale && (
              <button
                onClick={() => navigate(`/market/book/${item.id}/sell`)}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition duration-300 text-sm font-semibold"
              >
                <FaShoppingBag />
                <span>Buy Now</span>
              </button>
            )}
            {item.is_for_rent && (
              <button
                onClick={() => navigate(`/market/book/${item.id}/rent`)}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 text-sm font-semibold"
              >
                <FaRecycle />
                <span>Rent</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 sm:p-6 text-white">
          <div className="flex flex-col items-center text-center space-y-2">
            <div>
              <p className="text-blue-100 text-xs sm:text-sm">Total Orders</p>
              <p className="text-xl sm:text-3xl font-bold">{userProfile.totalOrders}</p>
            </div>
            <FaShoppingBag className="text-2xl sm:text-4xl text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-4 sm:p-6 text-white">
          <div className="flex flex-col items-center text-center space-y-2">
            <div>
              <p className="text-green-100 text-xs sm:text-sm">Active Rentals</p>
              <p className="text-xl sm:text-3xl font-bold">{userProfile.totalRentals}</p>
            </div>
            <FaRecycle className="text-2xl sm:text-4xl text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-4 sm:p-6 text-white">
          <div className="flex flex-col items-center text-center space-y-2">
            <div>
              <p className="text-purple-100 text-xs sm:text-sm">Wishlist Items</p>
              <p className="text-xl sm:text-3xl font-bold">{userProfile.favoriteBooks}</p>
            </div>
            <FaHeart className="text-2xl sm:text-4xl text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-4 sm:p-6 text-white">
          <div className="flex flex-col items-center text-center space-y-2">
            <div>
              <p className="text-yellow-100 text-xs sm:text-sm">Total Spent</p>
              <p className="text-xl sm:text-3xl font-bold">${userProfile.totalSpent}</p>
            </div>
            <FaCreditCard className="text-2xl sm:text-4xl text-yellow-200" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-2xl">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="flex items-center justify-center sm:justify-start">
              <FaShoppingBag className="text-blue-600 text-lg" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm sm:text-base text-gray-800 dark:text-white">New order placed</p>
              <p className="text-xs sm:text-sm text-gray-500">"Ethiopian History" - $19.99</p>
            </div>
            <span className="text-xs text-gray-500 sm:ml-auto text-center">2 hours ago</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div className="flex items-center justify-center sm:justify-start">
              <FaCheck className="text-green-600 text-lg" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm sm:text-base text-gray-800 dark:text-white">Order delivered</p>
              <p className="text-xs sm:text-sm text-gray-500">"Advanced Mathematics" - $29.99</p>
            </div>
            <span className="text-xs text-gray-500 sm:ml-auto text-center">1 day ago</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <div className="flex items-center justify-center sm:justify-start">
              <FaHeart className="text-purple-600 text-lg" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm sm:text-base text-gray-800 dark:text-white">Added to wishlist</p>
              <p className="text-xs sm:text-sm text-gray-500">"Data Science Essentials"</p>
            </div>
            <span className="text-xs text-gray-500 sm:ml-auto text-center">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate('/market')}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 w-full sm:w-auto"
            >
              <FaArrowLeft />
              <span>Back to Market</span>
            </button>
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center sm:justify-start">
                <FaUser className="mr-2 sm:mr-3 text-blue-500" />
                <span>My Account</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Welcome back, {userProfile.name}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl mb-6 sm:mb-8 overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: FaUser },
              { id: "orders", label: "My Orders", icon: FaShoppingBag },
              { id: "rentals", label: "My Rentals", icon: FaRecycle },
              { id: "wishlist", label: "Wishlist", icon: FaHeart },
              { id: "profile", label: "Profile", icon: FaCog }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-6 py-3 sm:py-4 font-semibold transition-all duration-300 whitespace-nowrap text-sm sm:text-base ${
                  activeTab === id
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <Icon />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden text-xs">{label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && <OverviewTab />}
          
          {activeTab === "orders" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">My Orders</h2>
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{orders.length} orders</span>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}
          
          {activeTab === "rentals" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">My Rentals</h2>
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{rentals.length} rentals</span>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {rentals.map((rental) => (
                  <RentalCard key={rental.id} rental={rental} />
                ))}
              </div>
            </div>
          )}
          
          {activeTab === "wishlist" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">My Wishlist</h2>
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{wishlist.length} items</span>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {wishlist.map((item) => (
                  <WishlistCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
          
          {activeTab === "profile" && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">Profile Settings</h2>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userProfile.name}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={userProfile.email}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={userProfile.phone}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={userProfile.address}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 font-semibold">
                    Save Changes
                  </button>
                  <button className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300 font-semibold">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;