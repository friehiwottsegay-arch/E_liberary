import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders, clearAuthData } from "../../utils/authUtils";
import {
  Search,
  Filter,
  Users,
  Star,
  ChevronRight,
  Loader,
  Clock,
  Award,
  TrendingUp,
  Shield,
  BookOpen,
  Zap,
  Target,
  BarChart3,
  Crown,
  Play,
  Sparkles,
  RefreshCw,
} from "lucide-react";

const ExamProducts = () => {
  const [qCategories, setQCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

        // Try with auth headers first, fallback to public access
        let res;
        try {
          const headers = await getAuthHeaders();
          res = await axios.get(`${baseURL}/api/qcategories/`, { headers });
        } catch (authError) {
          // Fallback to public access if auth fails
          res = await axios.get(`${baseURL}/api/qcategories/`);
        }

        if (!res.data || !Array.isArray(res.data)) {
          throw new Error('Invalid response format');
        }

        setQCategories(res.data);
        setFilteredCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);

        // Enhanced error handling
        if (error.response) {
          if (error.response.status === 404) {
            setError("Exam categories not found. Please check your connection.");
          } else if (error.response.status >= 500) {
            setError("Server error. Please try again later.");
          } else {
            setError(`Server error (${error.response.status}). Please try again.`);
          }
        } else if (error.request) {
          setError("Network error. Please check your internet connection.");
        } else {
          setError("Failed to load exams. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = qCategories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedFilter === "popular") {
      filtered = filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    } else if (selectedFilter === "new") {
      filtered = filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (selectedFilter === "rating") {
      filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (selectedFilter === "beginner") {
      filtered = filtered.filter(cat => cat.difficulty === "Beginner");
    } else if (selectedFilter === "intermediate") {
      filtered = filtered.filter(cat => cat.difficulty === "Intermediate");
    } else if (selectedFilter === "advanced") {
      filtered = filtered.filter(cat => cat.difficulty === "Advanced");
    }

    setFilteredCategories(filtered);
  }, [searchTerm, selectedFilter, qCategories]);

  const handleCategoryClick = async (cat) => {
    try {
      setIsLoading(true);
      const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

      // Try to enroll if user is authenticated
      try {
        const headers = await getAuthHeaders();
        const res = await axios.post(`${baseURL}/api/qcategories/${cat.id}/enroll/`, {}, { headers });

        if (res.data) {
          const updatedCategories = qCategories.map((c) =>
            c.id === cat.id ? res.data : c
          );
          setQCategories(updatedCategories);
        }
      } catch (authError) {
        // If enrollment fails due to auth, just proceed to exam page
        console.log("User not authenticated, proceeding to exam page");
      }

      navigate(`/exam/${cat.id}`);
    } catch (error) {
      console.error("Failed to process exam selection:", error);
      setError("Failed to load exam. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);

    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

      // Try with auth headers first, fallback to public access
      let res;
      try {
        const headers = await getAuthHeaders();
        res = await axios.get(`${baseURL}/api/qcategories/`, { headers });
      } catch (authError) {
        // Fallback to public access if auth fails
        res = await axios.get(`${baseURL}/api/qcategories/`);
      }

      if (!res.data || !Array.isArray(res.data)) {
        throw new Error('Invalid response format');
      }

      setQCategories(res.data);
      setFilteredCategories(res.data);
    } catch (error) {
      console.error("Failed to refresh categories:", error);
      setError("Failed to refresh exams. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Trusted Content",
      description: "Curated by industry experts and certified professionals",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Save Time",
      description: "Focused preparation materials that target exam objectives",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Track Progress",
      description: "Detailed analytics and performance insights",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Get Certified",
      description: "Validate your skills with industry-recognized certifications",
      color: "from-orange-500 to-orange-600"
    },
  ];

  const filters = [
    { key: "all", label: "All Exams", icon: <BookOpen className="w-4 h-4" /> },
    { key: "popular", label: "Most Popular", icon: <TrendingUp className="w-4 h-4" /> },
    { key: "new", label: "Newest", icon: <Zap className="w-4 h-4" /> },
    { key: "rating", label: "Highest Rated", icon: <Star className="w-4 h-4" /> },
    { key: "beginner", label: "Beginner", icon: <Target className="w-4 h-4" /> },
    { key: "intermediate", label: "Intermediate", icon: <BarChart3 className="w-4 h-4" /> },
    { key: "advanced", label: "Advanced", icon: <Crown className="w-4 h-4" /> },
  ];

  if (isLoading && qCategories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="relative">
          <Loader className="w-12 h-12 animate-spin text-blue-500" />
          <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-blue-400 animate-pulse" />
        </div>
        <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300">Loading exams...</p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Preparing the best content for you</p>
      </div>
    );
  }

  if (error && qCategories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <Zap className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h3>
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={handleRefresh}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <section className="mb-12">
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                  selectedFilter === filter.key
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700"
                }`}
              >
                {filter.icon}
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        {/* Exam Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              onMouseEnter={() => setHoveredCard(cat.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="relative h-48 overflow-hidden">
                {cat.cover_image ? (
                  <img
                    src={cat.cover_image}
                    alt={cat.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      hoveredCard === cat.id ? "scale-110" : "scale-100"
                    }`}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white opacity-80" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(cat.difficulty)}`}>
                    {cat.difficulty || "Intermediate"}
                  </span>
                  <span className="px-3 py-1 bg-black/70 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {cat.questions_count || 0} Qs
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {cat.description || "Practice questions with detailed explanations."}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{formatNumber(cat.enrolled)} enrolled</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{cat.rating || "4.8"}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleCategoryClick(cat)}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium hover:from-blue-600 hover:to-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg group/btn"
                >
                  {isLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Start Practice
                      <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No exams found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedFilter("all");
              }}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Features Section */}
        <section className="py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We provide the tools and resources you need to succeed in your certification journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all group"
              >
                <div className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-r ${feature.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to accelerate your career?</h2>
            <p className="text-blue-100 mb-6 text-lg">
              Join thousands of professionals who have certified with our platform
            </p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl">
              Explore All Certifications
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExamProducts;