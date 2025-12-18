import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Search,
  Filter,
  Home,
  TrendingUp,
  Star,
  Clock,
  Users,
  Award,
  Zap,
  Brain,
  Code,
  Calculator,
  FlaskRound,
  Briefcase,
  Languages,
  Menu,
  X,
  Sparkles,
  Bookmark,
  History,
  Settings,
  HelpCircle,
  Crown
} from 'lucide-react';

const Sidebar2 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [qCategories, setQCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { categoryId } = useParams();

  // Category icons mapping
  const categoryIcons = {
    programming: <Code className="w-5 h-5" />,
    mathematics: <Calculator className="w-5 h-5" />,
    science: <FlaskRound className="w-5 h-5" />,
    business: <Briefcase className="w-5 h-5" />,
    language: <Languages className="w-5 h-5" />,
    default: <BookOpen className="w-5 h-5" />
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get('http://127.0.0.1:8000/api/qcategory/');
        setQCategories(res.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Set active category based on URL params
  useEffect(() => {
    if (categoryId) {
      setActiveCategory(parseInt(categoryId));
    }
  }, [categoryId]);

  const handleCategoryClick = (category) => {
    console.log("Navigating to /Exam/:id with", category);
    if (category && category.id) {
      setActiveCategory(category.id);
      navigate(`/Exam/${category.id}`);
      // Close sidebar on mobile after selection
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    } else {
      console.warn("Category missing ID", category);
    }
  };

  const handleAllExamsClick = () => {
    setActiveCategory(null);
    navigate('/exams');
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const getCategoryIcon = (categoryName) => {
    if (!categoryName) return categoryIcons.default;
    
    const name = categoryName.toLowerCase();
    if (name.includes('program') || name.includes('code')) return categoryIcons.programming;
    if (name.includes('math') || name.includes('calc')) return categoryIcons.mathematics;
    if (name.includes('science') || name.includes('chem') || name.includes('phy')) return categoryIcons.science;
    if (name.includes('business') || name.includes('finance') || name.includes('eco')) return categoryIcons.business;
    if (name.includes('language') || name.includes('english') || name.includes('spanish')) return categoryIcons.language;
    
    return categoryIcons.default;
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  // Filter categories based on search
  const filteredCategories = qCategories.filter(category =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Quick stats for demonstration
  const quickStats = [
    { icon: <BookOpen className="w-4 h-4" />, label: 'Total Exams', value: qCategories.length * 5 },
    { icon: <Users className="w-4 h-4" />, label: 'Active Learners', value: '2.5K+' },
    { icon: <Award className="w-4 h-4" />, label: 'Certifications', value: '15+' }
  ];

  if (loading) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen overflow-y-auto">
        <div className="p-6 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      


      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl text-gray-900 dark:text-gray-100
          border-r border-gray-200/50 dark:border-gray-700/50
          flex flex-col transition-all duration-300 ease-in-out overflow-y-auto z-40
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
          ${isCollapsed ? 'w-20' : 'w-80'}`}
      >
 
  
        {/* Search Bar - Only show when not collapsed */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {/* Quick Actions */}
          {!isCollapsed && (
            <div className="mb-6">
              <button
                onClick={handleAllExamsClick}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-2 ${
                  !activeCategory 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Home className="w-4 h-4" />
                All Exams
              </button>
            </div>
          )}

          {/* Categories Section */}
          <div className="mb-4">
            {!isCollapsed && (
              <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categories
                </h3>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                  {filteredCategories.length}
                </span>
              </div>
            )}

            <ul className="space-y-1">
              {error ? (
                <li className="text-sm text-red-500 dark:text-red-400 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  {error}
                </li>
              ) : filteredCategories.length === 0 ? (
                <li className="text-sm text-gray-500 dark:text-gray-400 px-3 py-3 text-center rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  {searchTerm ? 'No categories found' : 'No categories available'}
                </li>
              ) : (
                filteredCategories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                        activeCategory === category.id
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-100'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                    >
                      <div className={`transition-transform duration-200 group-hover:scale-110 ${
                        activeCategory === category.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                      }`}>
                        {getCategoryIcon(category.name)}
                      </div>
                      
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left truncate">{category.name}</span>
                          <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                            activeCategory === category.id ? 'translate-x-0 opacity-100' : 'translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                          }`} />
                        </>
                      )}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Quick Stats - Only show when not collapsed */}
          {!isCollapsed && (
            <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Platform Stats
              </h4>
              <div className="space-y-2">
                {quickStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      {stat.icon}
                      <span>{stat.label}</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Navigation - Only icons when collapsed */}
          <div className={`mt-auto pt-6 border-t border-gray-200/50 dark:border-gray-700/50 ${
            isCollapsed ? 'space-y-2' : 'space-y-1'
          }`}>
            {[
              { icon: <Bookmark className="w-5 h-5" />, label: 'Bookmarks', onClick: () => {} },
              { icon: <History className="w-5 h-5" />, label: 'History', onClick: () => {} },
              { icon: <Settings className="w-5 h-5" />, label: 'Settings', onClick: () => {} },
              { icon: <HelpCircle className="w-5 h-5" />, label: 'Help', onClick: () => {} }
            ].map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 ${
                  isCollapsed ? 'justify-center' : ''
                }`}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </div>
        </nav>

      
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar2;