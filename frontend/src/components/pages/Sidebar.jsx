import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  FaBook, 
  FaChevronRight, 
  FaCrown, 
  FaFilter, 
  FaStar,
  FaEye,
  FaDownload,
  FaTimes,
  FaSearch,
  FaClock,
  FaBookOpen
} from "react-icons/fa";

const Sidebar2 = ({ 
  isOpen, 
  onClose, 
  selectedCategories = [], 
  setSelectedCategories = () => {}, 
  selectedSubcategories = [], 
  setSelectedSubcategories = () => {},
  freeBooksOnly = false,
  setFreeBooksOnly = () => {}
}) => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [sortBy, setSortBy] = useState("title"); // "title", "rating", "downloads"

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [selectedCategories, selectedSubcategories, freeBooksOnly, searchTerm, books, sortBy]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch subcategories
      const subRes = await axios.get("http://127.0.0.1:8000/api/Subcategory/");
      setSubcategories(subRes.data || []);

      // Fetch categories
      const catRes = await axios.get("http://127.0.0.1:8000/api/categories/");
      setCategories(catRes.data || []);

      // Fetch books
      const booksRes = await axios.get("http://127.0.0.1:8000/api/books/");
      setBooks(booksRes.data || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      // Set fallback data for demonstration
      setSubcategories([]);
      setCategories([]);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = [...books];

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(book => 
        selectedCategories.some(cat => 
          book.category?.toLowerCase().includes(cat.toLowerCase()) ||
          book.category_name?.toLowerCase().includes(cat.toLowerCase())
        )
      );
    }

    // Filter by selected subcategories
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter(book =>
        selectedSubcategories.some(sub =>
          book.subcategory?.toLowerCase().includes(sub.toLowerCase()) ||
          book.subcategory_name?.toLowerCase().includes(sub.toLowerCase())
        )
      );
    }

    // Filter by free books
    if (freeBooksOnly) {
      filtered = filtered.filter(book => book.is_free || book.price === 0);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort books
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "downloads":
          return (b.downloads || 0) - (a.downloads || 0);
        case "title":
        default:
          return (a.title || "").localeCompare(b.title || "");
      }
    });

    setFilteredBooks(filtered);
  };

  const createSubcategoryLink = (name) =>
    `/subcategory/${encodeURIComponent(name)}`;

  const createCategoryLink = (name) =>
    `/category/${encodeURIComponent(name)}`;

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const toggleCategory = (categoryName) => {
    if (!categoryName) return;
    
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== categoryName));
    } else {
      setSelectedCategories([...selectedCategories, categoryName]);
    }
  };

  const toggleSubcategory = (subcategoryName) => {
    if (!subcategoryName) return;
    
    if (selectedSubcategories.includes(subcategoryName)) {
      setSelectedSubcategories(selectedSubcategories.filter(sub => sub !== subcategoryName));
    } else {
      setSelectedSubcategories([...selectedSubcategories, subcategoryName]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setFreeBooksOnly(false);
    setSearchTerm("");
    setSelectedBook(null);
  };

  const getCategoryName = (category) => {
    if (!category) return '';
    return category.name || category.title || category.category_name || String(category);
  };

  const getCategoryId = (category) => {
    if (!category) return Math.random();
    return category.id || category._id || Math.random();
  };

  const getSubcategoryName = (subcategory) => {
    if (!subcategory) return '';
    return subcategory.name || subcategory.title || subcategory.subcategory_name || String(subcategory);
  };

  const getSubcategoryId = (subcategory) => {
    if (!subcategory) return Math.random();
    return subcategory.id || subcategory._id || Math.random();
  };

  const getBookImage = (book) => {
    return book.image || book.cover_image || "/api/placeholder/200/300";
  };

  const getBookTitle = (book) => {
    return book.title || "Untitled Book";
  };

  const getBookAuthor = (book) => {
    return book.author || "Unknown Author";
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400 opacity-50" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`w-80 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:static lg:inset-0 fixed inset-y-0 left-0 z-50`}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FaBook className="text-white text-lg" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-800 dark:text-white">Book Filters</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">Browse & Filter</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
            >
              <FaTimes className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Navigation Content */}
          <nav className="flex-grow p-4 space-y-6 overflow-y-auto">
            {/* Search Box */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Active Filters */}
            {(selectedCategories.length > 0 || selectedSubcategories.length > 0 || freeBooksOnly || searchTerm) && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Active Filters</span>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedCategories.map(cat => (
                    <span key={cat} className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                      {cat} ×
                    </span>
                  ))}
                  {selectedSubcategories.map(sub => (
                    <span key={sub} className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                      {sub} ×
                    </span>
                  ))}
                  {freeBooksOnly && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded-full">
                      Free Only ×
                    </span>
                  )}
                  {searchTerm && (
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200 text-xs rounded-full">
                      "{searchTerm}" ×
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Free Books Filter */}
            <div>
              <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300">
                <input
                  type="checkbox"
                  checked={freeBooksOnly}
                  onChange={(e) => setFreeBooksOnly(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FaCrown className="mr-2 text-green-500" />
                  Free Books Only
                </span>
              </label>
            </div>

            {/* Main Categories Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 flex items-center">
                <span className="w-1 h-4 bg-blue-600 rounded-full mr-2"></span>
                Categories
              </h3>
              {!categories || categories.length === 0 ? (
                <div className="text-center py-2">
                  <div className="text-gray-400 text-2xl mb-1">📚</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">No categories found.</p>
                </div>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {categories.map((category) => {
                    const categoryName = getCategoryName(category);
                    const categoryId = getCategoryId(category);
                    
                    if (!categoryName) return null;
                    
                    return (
                      <label key={categoryId} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(categoryName)}
                          onChange={() => toggleCategory(categoryName)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                          {categoryName}
                        </span>
                        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                          {category.count || 0}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Subcategories Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 flex items-center">
                <span className="w-1 h-4 bg-purple-600 rounded-full mr-2"></span>
                Subcategories
              </h3>
              {!subcategories || subcategories.length === 0 ? (
                <div className="text-center py-2">
                  <div className="text-gray-400 text-2xl mb-1">📚</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">No subcategories found.</p>
                </div>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {subcategories.map((subcategory) => {
                    const subcategoryName = getSubcategoryName(subcategory);
                    const subcategoryId = getSubcategoryId(subcategory);
                    
                    if (!subcategoryName) return null;
                    
                    return (
                      <label key={subcategoryId} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300">
                        <input
                          type="checkbox"
                          checked={selectedSubcategories.includes(subcategoryName)}
                          onChange={() => toggleSubcategory(subcategoryName)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                          {subcategoryName}
                        </span>
                        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                          {subcategory.count || 0}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 flex items-center">
                <span className="w-1 h-4 bg-green-600 rounded-full mr-2"></span>
                Quick Links
              </h3>
              <div className="space-y-1">
                <Link
                  to="/books/featured"
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 transition duration-300 border border-transparent hover:border-blue-200 dark:hover:border-gray-600"
                  onClick={handleLinkClick}
                >
                  <span className="mr-2">⭐</span>
                  Featured Books
                </Link>
                <Link
                  to="/books/new"
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-600 transition duration-300 border border-transparent hover:border-green-200 dark:hover:border-gray-600"
                  onClick={handleLinkClick}
                >
                  <span className="mr-2">🆕</span>
                  New Arrivals
                </Link>
                <Link
                  to="/books/popular"
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600 transition duration-300 border border-transparent hover:border-red-200 dark:hover:border-gray-600"
                  onClick={handleLinkClick}
                >
                  <span className="mr-2">🔥</span>
                  Popular Books
                </Link>
                <Link
                  to="/books/free"
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-800 hover:text-purple-600 transition duration-300 border border-transparent hover:border-purple-200 dark:hover:border-gray-600"
                  onClick={handleLinkClick}
                >
                  <FaCrown className="mr-2 text-yellow-500" />
                  Free Books
                </Link>
              </div>
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Explore our collection
              </p>
              <div className="flex justify-center space-x-3 text-gray-400 text-xs">
                <span>📚 {categories.length}</span>
                <span>🔍 {subcategories.length}</span>
                <span>👑 {books.filter(b => b.is_free || b.price === 0).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Book Display */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Books Collection
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {filteredBooks.length} books found
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <option value="title">Sort by Title</option>
                <option value="rating">Sort by Rating</option>
                <option value="downloads">Sort by Downloads</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-blue-500 text-white" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
                >
                  ▦
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-blue-500 text-white" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
                >
                  ≡
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Books Display */}
          {!loading && (
            <>
              {filteredBooks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    No books found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500 mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                // Grid View
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredBooks.map((book, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
                      onClick={() => setSelectedBook(book)}
                    >
                      <div className="relative">
                        <img
                          src={getBookImage(book)}
                          alt={getBookTitle(book)}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/200x300/4F46E5/FFFFFF?text=${encodeURIComponent(getBookTitle(book))}`;
                          }}
                        />
                        {(book.is_free || book.price === 0) && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            FREE
                          </div>
                        )}
                        {book.is_new && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            NEW
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-1 line-clamp-2">
                          {getBookTitle(book)}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          by {getBookAuthor(book)}
                        </p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-1">
                            {renderStars(book.rating)}
                            <span className="text-xs text-gray-500 ml-1">
                              ({book.rating || "N/A"})
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span className="flex items-center">
                              <FaEye className="mr-1" />
                              {book.views || 0}
                            </span>
                            <span className="flex items-center">
                              <FaDownload className="mr-1" />
                              {book.downloads || 0}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-semibold ${
                            book.is_free || book.price === 0 ? "text-green-600" : "text-blue-600"
                          }`}>
                            {book.is_free || book.price === 0 ? "Free" : `$${book.price}`}
                          </span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // List View
                <div className="space-y-4">
                  {filteredBooks.map((book, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
                      onClick={() => setSelectedBook(book)}
                    >
                      <div className="flex">
                        <div className="w-24 h-32 flex-shrink-0">
                          <img
                            src={getBookImage(book)}
                            alt={getBookTitle(book)}
                            className="w-full h-full object-cover rounded-l-lg"
                            onError={(e) => {
                              e.target.src = `https://via.placeholder.com/200x300/4F46E5/FFFFFF?text=${encodeURIComponent(getBookTitle(book))}`;
                            }}
                          />
                        </div>
                        
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                                {getBookTitle(book)}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                by {getBookAuthor(book)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {(book.is_free || book.price === 0) && (
                                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-semibold">
                                  FREE
                                </span>
                              )}
                              <span className={`text-sm font-semibold ${
                                book.is_free || book.price === 0 ? "text-green-600" : "text-blue-600"
                              }`}>
                                {book.is_free || book.price === 0 ? "Free" : `$${book.price}`}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {book.description || "No description available."}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                {renderStars(book.rating)}
                                <span>({book.rating || "N/A"})</span>
                              </div>
                              <span className="flex items-center">
                                <FaEye className="mr-1" />
                                {book.views || 0} views
                              </span>
                              <span className="flex items-center">
                                <FaDownload className="mr-1" />
                                {book.downloads || 0} downloads
                              </span>
                              {book.pages && (
                                <span className="flex items-center">
                                  <FaBookOpen className="mr-1" />
                                  {book.pages} pages
                                </span>
                              )}
                            </div>
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                              View Details →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {getBookTitle(selectedBook)}
                </h2>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <img
                    src={getBookImage(selectedBook)}
                    alt={getBookTitle(selectedBook)}
                    className="w-full rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/300x400/4F46E5/FFFFFF?text=${encodeURIComponent(getBookTitle(selectedBook))}`;
                    }}
                  />
                </div>
                
                <div className="md:w-2/3">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Book Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">Author:</span>
                          <p className="text-gray-800 dark:text-white">{getBookAuthor(selectedBook)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">Category:</span>
                          <p className="text-gray-800 dark:text-white">{selectedBook.category || "N/A"}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">Subcategory:</span>
                          <p className="text-gray-800 dark:text-white">{selectedBook.subcategory || "N/A"}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">Price:</span>
                          <p className={`font-semibold ${
                            selectedBook.is_free || selectedBook.price === 0 ? "text-green-600" : "text-blue-600"
                          }`}>
                            {selectedBook.is_free || selectedBook.price === 0 ? "Free" : `$${selectedBook.price}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {selectedBook.description || "No description available for this book."}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center">
                          {renderStars(selectedBook.rating)}
                          <span className="ml-1">({selectedBook.rating || "N/A"})</span>
                        </span>
                        <span className="flex items-center">
                          <FaEye className="mr-1" />
                          {selectedBook.views || 0} views
                        </span>
                        <span className="flex items-center">
                          <FaDownload className="mr-1" />
                          {selectedBook.downloads || 0} downloads
                        </span>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                          Download
                        </button>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300">
                          Add to Favorites
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar2;