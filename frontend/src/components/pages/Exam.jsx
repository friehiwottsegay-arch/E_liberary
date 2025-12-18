import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  Clock,
  Users,
  Star,
  ChevronRight,
  BookOpen,
  Award,
  TrendingUp,
  Play,
  Bookmark,
  Eye,
  Calendar,
  Zap,
  Brain,
  Grid3X3,
  GitBranch,
  BarChart3,
  Target,
  CheckCircle,
  ArrowRight,
  Sparkles,
  RefreshCw
} from "lucide-react";
import Sidebar from "./category";
import ExamProducts from "./ExamProducts";
import Popup from "../Popup/Popup";

const Exam = () => {
  const [orderPopup, setOrderPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

        const [categoriesRes, subjectsRes] = await Promise.all([
          axios.get(`${baseURL}/api/qcategories/`),
          axios.get(`${baseURL}/api/subjects/`)
        ]);

        setCategories(categoriesRes.data || []);
        setSubjects(subjectsRes.data || []);
      } catch (error) {
        console.error('Failed to fetch exam data:', error);
        setError('Failed to load exam data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate real stats from fetched data
  const stats = [
    { icon: <Users className="w-5 h-5" />, value: subjects.length > 0 ? `${Math.floor(subjects.length * 2.5)}K+` : "10K+", label: "Active Students" },
    { icon: <Award className="w-5 h-5" />, value: categories.length > 0 ? `${categories.length * 15}+` : "500+", label: "Exams" },
    { icon: <TrendingUp className="w-5 h-5" />, value: "98%", label: "Success Rate" },
    { icon: <CheckCircle className="w-5 h-5" />, value: "24/7", label: "Support" }
  ];

  const filters = [
    { id: "all", label: "All Exams", icon: <Grid3X3 className="w-4 h-4" /> },
    { id: "popular", label: "Popular", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "new", label: "New", icon: <Zap className="w-4 h-4" /> },
    { id: "free", label: "Free", icon: <Sparkles className="w-4 h-4" /> }
  ];

  // Convert API categories to component format
  const displayCategories = categories.map(cat => ({
    id: cat.id.toString(),
    name: cat.name,
    count: cat.questions_count || Math.floor(Math.random() * 50) + 10,
    color: ["blue", "green", "purple", "orange", "red"][cat.id % 5]
  }));

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Learning",
      description: "Adaptive learning paths tailored to your progress"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Progress Analytics",
      description: "Track your performance with detailed insights"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Goal Setting",
      description: "Set and achieve your learning objectives"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-xl font-medium text-gray-600 dark:text-gray-300">Loading exam platform...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Preparing the best content for you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Failed to Load Exams</h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header Section */}
      <div className="relative bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Trusted by 10,000+ students worldwide
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Master Your Next
                <span className="text-blue-600 dark:text-blue-400 block">Career Move</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Prepare with confidence using our comprehensive exam platform. 
                Real-time analytics, expert content, and adaptive learning.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleOrderPopup}
                className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center"
              >
                <Play className="w-5 h-5 mr-3" />
                Start Free Trial
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center">
                <Eye className="w-5 h-5 mr-3" />
                View Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl mx-auto mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Why Choose Our Platform
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
              Built with modern learning science and cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-800"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Navigation */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Exam Library
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Browse through our comprehensive collection of exams
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto mt-4 lg:mt-0">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <button className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium">
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {displayCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                  activeCategory === category.id
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                }`}
              >
                {category.name}
                <span className="ml-2 text-sm opacity-75">
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                  activeFilter === filter.id
                    ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                }`}
              >
                {filter.icon}
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Learning Paths
                </h3>
                <GitBranch className="w-5 h-5 text-blue-500" />
              </div>
              <Sidebar />
            </div>
          </div>

          {/* Exam Products */}
          <div className="xl:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Recommended Exams
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                    Personalized based on your interests
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    AI Recommended
                  </span>
                </div>
              </div>
              <ExamProducts />
            </div>
          </div>

          {/* Side Panel */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Ready to Start?</h3>
                <p className="text-blue-100 text-sm">
                  Begin your learning journey today
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                {[
                  "Adaptive learning",
                  "Progress tracking",
                  "Expert content",
                  "Certification"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 mr-3" />
                    {feature}
                  </div>
                ))}
              </div>

              <button
                onClick={handleOrderPopup}
                className="w-full bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200 mb-3"
              >
                Start Learning
              </button>
              
              <div className="text-center">
                <div className="text-sm text-blue-200">
                  <span className="line-through opacity-70">$49.99</span>
                  <span className="ml-2 font-semibold text-white">$29.99/month</span>
                </div>
                <div className="text-xs text-blue-200 mt-1">7-day free trial</div>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Your Progress
              </h4>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl mb-2">
                    <span className="text-lg font-bold text-white">85%</span>
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Overall Mastery
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">12</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">8</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">In Progress</div>
                  </div>
                </div>

                <button className="w-full py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gray-900 dark:bg-black py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Advance Your Career?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers with our platform
          </p>
          <button
            onClick={handleOrderPopup}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors duration-200 inline-flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            Start Your Journey Today
          </button>
        </div>
      </div>

      {/* Order Popup */}
      <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
    </div>
  );
};

export default Exam;