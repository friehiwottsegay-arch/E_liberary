import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaStar,
  FaRegStar,
  FaEye,
  FaBook,
  FaHeart,
  FaFilter,
  FaSort,
  FaTh,
  FaList,
  FaChevronDown,
  FaTruck,
  FaShieldAlt,
  FaHeadset,
  FaShippingFast
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Market = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("popular");
  const [favorites, setFavorites] = useState(new Set());
  const [cart, setCart] = useState(new Set());
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showQuickView, setShowQuickView] = useState(null);
  const exchangeRate = 55;

  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    loadUserData();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/books/");
      setBooks(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = () => {
    try {
      const savedFavorites = localStorage.getItem('marketFavorites');
      const savedCart = localStorage.getItem('marketCart');
      if (savedFavorites) setFavorites(new Set(JSON.parse(savedFavorites)));
      if (savedCart) setCart(new Set(JSON.parse(savedCart)));
      const savedPriceRange = localStorage.getItem('marketPriceRange');
      if (savedPriceRange) setPriceRange(JSON.parse(savedPriceRange));
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/categories/");
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyNjciIGZpbGw9IiNmNGY2ZmYiLz48dGV4dCB4PSIxMDAiIHk9IjEzMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJvb2s8L3RleHQ+PC9zdmc+';
    return path.startsWith("http") ? path : `http://127.0.0.1:8000${path}`;
  };

  const getPriceInETB = (usdPrice) => {
    return (parseFloat(usdPrice || 0) * exchangeRate).toFixed(0);
  };

  const toggleFavorite = (bookId, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(bookId)) {
        newFavorites.delete(bookId);
      } else {
        newFavorites.add(bookId);
      }
      localStorage.setItem('marketFavorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  };

  const handleAddToCart = (book, e) => {
    e.stopPropagation();
    setCart(prev => {
      const newCart = new Set(prev);
      if (newCart.has(book.id)) {
        newCart.delete(book.id);
      } else {
        newCart.add(book.id);
      }
      localStorage.setItem('marketCart', JSON.stringify([...newCart]));
      return newCart;
    });
  };

  const handleBookClick = (book) => {
    navigate(`/market/book/${book.id}/sell`);
  };

  const renderRating = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? 
            <FaStar key={star} className="text-yellow-400 text-xs" /> : 
            <FaRegStar key={star} className="text-gray-300 text-xs" />
        ))}
        <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">({rating})</span>
      </div>
    );
  };

  const filteredBooks = books.filter(book => {
    if (!book) return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        (book.title?.toLowerCase() || '').includes(query) ||
        (book.author?.toLowerCase() || '').includes(query) ||
        (book.description?.toLowerCase() || '').includes(query)
      );
      if (!matchesSearch) return false;
    }
    
    // Price range filter
    const bookPrice = parseFloat(book.price || 0);
    if (bookPrice < priceRange[0] || bookPrice > priceRange[1]) {
      return false;
    }
    
    // Category filter
    if (selectedCategories.length > 0) {
      const bookCategory = book.category?.toLowerCase() || '';
      const matchesCategory = selectedCategories.some(cat =>
        bookCategory.includes(cat.toLowerCase())
      );
      if (!matchesCategory) return false;
    }
    
    return true;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortOption) {
      case "title":
        return (a.title || '').localeCompare(b.title || '');
      case "author":
        return (a.author || '').localeCompare(b.author || '');
      case "price_low":
        return (a.price || 0) - (b.price || 0);
      case "price_high":
        return (b.price || 0) - (a.price || 0);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "newest":
        return new Date(b.created_at || '2020-01-01') - new Date(a.created_at || '2020-01-01');
      case "popular":
      default:
        return (b.views || 0) - (a.views || 0);
    }
  });

  const SimpleBookCard = ({ book }) => {
    const isFavorite = favorites.has(book.id);
    const inCart = cart.has(book.id);
    const discount = Math.floor(Math.random() * 30) + 5; // Mock discount for demo

    return (
      <div
        onClick={() => handleBookClick(book)}
        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden relative border border-gray-100"
      >
        {/* Enhanced Badges */}
        <div className="absolute top-2 left-2 z-10 sm:top-3 sm:left-3 flex flex-col space-y-1">
          {book.is_for_sale && (
            <div className="bg-green-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold shadow-sm">
              <span className="hidden sm:inline">FOR SALE</span>
              <span className="sm:hidden">SALE</span>
            </div>
          )}
          {discount > 15 && (
            <div className="bg-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold shadow-sm">
              -{discount}% OFF
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <div className="absolute top-2 right-2 z-10 sm:top-3 sm:right-3">
          <button
            onClick={(e) => toggleFavorite(book.id, e)}
            className={`p-1.5 sm:p-2 rounded-full transition-colors ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <FaHeart className="text-xs sm:text-sm" />
          </button>
        </div>

        {/* Book Image - Fixed height for consistency */}
        <div className="h-48 sm:h-64 lg:h-80 bg-gray-100 overflow-hidden">
          <img
            src={getImageUrl(book.cover_url || book.cover_image)}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyNjciIGZpbGw9IiNmNGY2ZmYiLz48dGV4dCB4PSIxMDAiIHk9IjEzMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJvb2s8L3RleHQ+PC9zdmc+';
            }}
          />
        </div>

        <div className="p-3 sm:p-4">
          {/* Title */}
          <h3 className="font-bold text-gray-800 line-clamp-2 mb-1 sm:mb-2 text-sm sm:text-base">
            {book.title || "Untitled"}
          </h3>

          {/* Author */}
          {book.author && (
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              by {book.author}
            </p>
          )}

          {/* Rating */}
          {book.rating > 0 && (
            <div className="mb-2 sm:mb-3">
              {renderRating(book.rating)}
            </div>
          )}

          {/* Price - Stack on mobile */}
          <div className="mb-2 sm:mb-3">
            <div className="text-lg sm:text-xl font-bold text-green-600">
              ${book.price}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              ≈ {getPriceInETB(book.price)} ETB
            </div>
          </div>

          {/* Stats - Hidden on very small screens */}
          <div className="hidden sm:flex items-center justify-between text-sm text-gray-500 mb-3">
            {book.page_count > 0 && (
              <span className="flex items-center">
                <FaBook className="mr-1" />
                {book.page_count}p
              </span>
            )}
            {book.views > 0 && (
              <span className="flex items-center">
                <FaEye className="mr-1" />
                {book.views}
              </span>
            )}
          </div>

          {/* Mobile Stats - Show basic info */}
          <div className="sm:hidden flex items-center justify-between text-xs text-gray-500 mb-3">
            {(book.page_count > 0 || book.views > 0) && (
              <>
                {book.page_count > 0 && (
                  <span className="flex items-center">
                    <FaBook className="mr-1" />
                    {book.page_count}p
                  </span>
                )}
                {book.views > 0 && (
                  <span className="flex items-center">
                    <FaEye className="mr-1" />
                    {book.views}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Add to Cart Button - More compact on mobile */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(book, e);
            }}
            className={`w-full py-2 sm:py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base ${
              inCart
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <FaShoppingCart className="text-xs sm:text-sm" />
            <span className="hidden xs:inline">{inCart ? 'Added to Cart' : 'Add to Cart'}</span>
            <span className="xs:hidden">{inCart ? 'Added' : 'Add'}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Ecommerce Header */}
      <div className="bg-white shadow-sm border-b">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <FaShippingFast className="mr-1" />
                  Free shipping on orders over $50
                </span>
                <span className="hidden md:flex items-center">
                  <FaShieldAlt className="mr-1" />
                  Secure payment
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="hidden md:flex items-center">
                  <FaHeadset className="mr-1" />
                  24/7 Support
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-start lg:space-y-0">
            {/* Title */}
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center justify-center lg:justify-start">
                <FaBook className="mr-2 sm:mr-3 text-blue-500 text-xl sm:text-2xl" />
                <span className="text-lg sm:text-2xl lg:text-3xl">READmore Bookstore</span>
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Discover thousands of books at unbeatable prices
              </p>
              <div className="flex items-center justify-center lg:justify-start mt-2 space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  In Stock
                </span>
                <span className="flex items-center">
                  <FaTruck className="mr-1" />
                  Fast Delivery
                </span>
                <span className="flex items-center">
                  <FaShieldAlt className="mr-1" />
                  Quality Guaranteed
                </span>
              </div>
            </div>

            {/* Enhanced Controls */}
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-3 lg:space-x-4">
              {/* Search */}
              <div className="relative flex-1 sm:flex-none sm:w-64 lg:w-80">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search books, authors, ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <FaFilter className="text-gray-500" />
                <span>Filters</span>
                {(selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 100) && (
                  <span className="bg-blue-500 text-white rounded-full w-2 h-2"></span>
                )}
              </button>

              {/* Sort and View Mode */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="title">A-Z</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                  <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                </div>

                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded transition-colors ${viewMode === "grid" ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                    title="Grid View"
                  >
                    <FaTh className="text-xs sm:text-sm" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded transition-colors ${viewMode === "list" ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                    title="List View"
                  >
                    <FaList className="text-xs sm:text-sm" />
                  </button>
                </div>
              </div>

              {/* Cart Button */}
              <div className="relative">
                {cart.size > 0 && (
                  <button
                    onClick={() => navigate('/market/cart')}
                    className="relative bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors text-sm"
                  >
                    <FaShoppingCart className="text-sm" />
                    <span className="hidden sm:inline">Cart</span>
                    <span className="bg-white text-green-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {cart.size}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const newRange = [priceRange[0], parseInt(e.target.value)];
                        setPriceRange(newRange);
                        localStorage.setItem('marketPriceRange', JSON.stringify(newRange));
                      }}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([...selectedCategories, category.name]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(cat => cat !== category.name));
                            }
                          }}
                          className="mr-2 rounded"
                        />
                        {category.name}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setPriceRange([0, 100]);
                      setSelectedCategories([]);
                      localStorage.removeItem('marketPriceRange');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-gray-300"></div>
                <div className="p-3 sm:p-4">
                  <div className="h-3 sm:h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-2 sm:h-3 bg-gray-300 rounded mb-3 w-3/4"></div>
                  <div className="h-5 sm:h-6 bg-gray-300 rounded mb-3 w-1/2"></div>
                  <div className="h-8 sm:h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Search Results */}
            {searchQuery && (
              <div className="mb-4 sm:mb-6">
                <p className="text-gray-600 text-sm sm:text-base">
                  Found {sortedBooks.length} books for "{searchQuery}"
                </p>
              </div>
            )}

            {/* Books Grid */}
            {sortedBooks.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="text-gray-400 text-4xl sm:text-6xl mb-4">📚</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                  {searchQuery ? "No books found" : "No books available"}
                </h3>
                <p className="text-gray-500 text-sm sm:text-base">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Check back later for new books"
                  }
                </p>
              </div>
            ) : (
              <div className={`grid gap-3 sm:gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}>
                {sortedBooks.map((book) => (
                  <SimpleBookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Market;