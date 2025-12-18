import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar2 from "./SidebarExam";
import {
  Clock, BookOpen, Play, ArrowLeft, Star, Users, Target,
  Zap, Search, Filter, CheckCircle, Trophy, Award,
  BarChart3, Calendar, RefreshCw, Menu
} from "lucide-react";

const ExamList = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Simple data fetching
  const fetchData = async () => {
    try {
      setLoading(true);
      const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      
      const [categoriesRes, subjectsRes] = await Promise.all([
        fetch(`${baseURL}/api/qcategory/`),
        fetch(`${baseURL}/api/subjects/`)
      ]);

      if (!categoriesRes.ok || !subjectsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const categoriesData = await categoriesRes.json();
      const subjectsData = await subjectsRes.json();

      setCategories(categoriesData);
      setSubjects(subjectsData);
      setFilteredSubjects(subjectsData);
    } catch (err) {
      setError("Failed to load exams. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter exams based on search and difficulty
  useEffect(() => {
    let filtered = subjects;

    if (categoryId) {
      filtered = filtered.filter(sub => sub.QCategory === Number(categoryId));
    }

    if (searchTerm) {
      filtered = filtered.filter(subject =>
        subject.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(subject => {
        const difficulty = ["Beginner", "Intermediate", "Advanced", "Expert"][subject.id % 4];
        return difficulty === selectedDifficulty;
      });
    }

    setFilteredSubjects(filtered);
  }, [subjects, categoryId, searchTerm, selectedDifficulty]);

  const handleStartExam = (subjectId) => {
    navigate(`/exam/question/${subjectId}`);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      "Beginner": "bg-green-100 text-green-800 border-green-200",
      "Intermediate": "bg-yellow-100 text-yellow-800 border-yellow-200", 
      "Advanced": "bg-orange-100 text-orange-800 border-orange-200",
      "Expert": "bg-red-100 text-red-800 border-red-200"
    };
    return colors[difficulty] || colors["Beginner"];
  };

  const getMockData = (subjectId) => {
    const difficulties = ["Beginner", "Intermediate", "Advanced", "Expert"];
    const difficulty = difficulties[subjectId % 4];
    const rating = (3.5 + (subjectId % 15) / 10).toFixed(1);
    const enrolled = Math.floor(Math.random() * 1000) + 100;
    const questions = isNaN(subjectId) ? 10 : (subjectId % 5) + 10;
    
    return {
      difficulty,
      rating,
      enrolled,
      time: subjectId % 3 === 0 ? "30" : subjectId % 3 === 1 ? "60" : "90",
      questions: questions
    };
  };

  const getCurrentCategory = () => {
    return categories.find(cat => cat.id === Number(categoryId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading exams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Exams</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentCategory = getCurrentCategory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-6 left-6 z-50">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-4 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 hover:bg-white hover:shadow-2xl transition-all duration-300"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 z-40
        w-80 h-screen bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/30
        transform transition-all duration-300 ease-in-out
        lg:transform-none lg:block
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full overflow-y-auto">
          <div className="p-6">
            <Sidebar2 />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-80 flex flex-col h-screen">
        {/* Fixed Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/30 flex-shrink-0">
          <div className="px-6 sm:px-8 lg:px-12 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {currentCategory ? currentCategory.name : 'Browse Exams'}
                </h1>
                <p className="text-gray-600 text-base">
                  {filteredSubjects.length} {filteredSubjects.length === 1 ? 'exam' : 'exams'} available
                </p>
              </div>
              <button
                onClick={() => navigate('/exam')}
                className="lg:hidden p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Fixed Filters */}
        <div className="flex-shrink-0 bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-200/50">
          <div className="px-6 sm:px-8 lg:px-12 py-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md p-4 border border-gray-200/30">
              <div className="space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search exams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                  />
                </div>

                {/* Difficulty Filter */}
                <div className="flex flex-wrap gap-2">
                  {["all", "Beginner", "Intermediate", "Advanced", "Expert"].map((diff) => (
                    <button
                      key={`difficulty-${diff}`}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                        selectedDifficulty === diff
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {diff === "all" ? "All" : diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Exam List */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
          <div className="px-6 sm:px-8 lg:px-12 py-6">
            {/* Exam Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredSubjects.map((subject) => {
                const mockData = getMockData(subject.id);
                
                return (
                  <div key={subject.id} className="group bg-white/95 backdrop-blur-xl rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/30 hover:border-blue-200/50 overflow-hidden">
                    {/* Card Header */}
                    <div className="p-5">
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2 text-base leading-tight">
                          {subject.name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {subject.desc?.replace(/<[^>]*>/g, '') || "Practice exam with detailed explanations"}
                        </p>
                      </div>
                      
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(mockData.difficulty)}`}>
                          {mockData.difficulty}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-yellow-700">{mockData.rating}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="text-center p-2 bg-gray-50/80 rounded-lg">
                          <div className="font-semibold text-gray-900 text-sm">{mockData.time}m</div>
                          <div className="text-gray-600 text-xs">Duration</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50/80 rounded-lg">
                          <div className="font-semibold text-gray-900 text-sm">{mockData.questions}</div>
                          <div className="text-gray-600 text-xs">Questions</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50/80 rounded-lg">
                          <div className="font-semibold text-gray-900 text-sm">{mockData.enrolled}</div>
                          <div className="text-gray-600 text-xs">Enrolled</div>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="px-5 pb-5">
                      <button
                        onClick={() => handleStartExam(subject.id)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 text-sm shadow-md hover:shadow-lg"
                      >
                        <Play className="w-4 h-4" />
                        Start Practice
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No Results */}
            {filteredSubjects.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <BookOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">No exams found</h3>
                <p className="text-gray-600 mb-6 text-base max-w-sm mx-auto">
                  {searchTerm ? "Try adjusting your search terms." : "No exams available in this category."}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 text-sm"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}

            {/* Bottom CTA */}
            {filteredSubjects.length > 0 && (
              <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-center text-white shadow-lg">
                <h3 className="text-xl font-bold mb-3">Ready to get certified?</h3>
                <p className="text-blue-100 mb-4 text-sm">
                  Join thousands of professionals advancing their careers
                </p>
                <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 text-sm">
                  Explore Certifications
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamList;