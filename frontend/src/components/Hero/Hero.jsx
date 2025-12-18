// src/components/Hero/Hero.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaBook, FaStar, FaArrowUp, FaEye, FaDownload } from "react-icons/fa";

const Hero = () => {
  const [searchInput, setSearchInput] = useState("");
  const [bookList, setBookList] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/books/")
      .then((res) => {
        setBookList(res.data);
        const shuffled = [...res.data].sort(() => 0.5 - Math.random());
        setTrendingBooks(shuffled.slice(0, 4));
        setFeaturedBooks(shuffled.slice(0, 3));
      })
      .catch((err) => console.error("Failed to fetch books", err));
  }, []);

  useEffect(() => {
    const q = searchInput.trim().toLowerCase();
    if (!q) {
      setFilteredBooks([]);
      setShowPopup(false);
      return;
    }
    setFilteredBooks(
      bookList.filter(
        ({ title = "", author = "", description = "" }) =>
          title.toLowerCase().includes(q) ||
          author.toLowerCase().includes(q) ||
          description.toLowerCase().includes(q)
      )
    );
    setShowPopup(true);
  }, [searchInput, bookList]);

  const handleSelectBook = (id) => {
    setShowPopup(false);
    setSearchInput("");
    navigate(`/book/read/${id}`);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/img/hero/hero-book.png";
    return imagePath.startsWith("http") ? imagePath : `http://127.0.0.1:8000${imagePath}`;
  };

  return (
    <section className="relative bg-gradient-to-br from-cyan-900 via-teal-900 to-blue-900 py-16 md:py-24 px-6 md:px-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container mx-auto relative z-10 flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Left side text */}
        <div className="flex-1 text-left max-w-2xl w-full">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <FaStar className="text-cyan-300 mr-2" />
            <span className="text-white text-sm font-medium">Digital Library 3.0</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
            Discover Your Next
            <span className="bg-gradient-to-r from-cyan-300 to-teal-400 bg-clip-text text-transparent">
              {" "}Favorite Book
            </span>
          </h1>
          
          <p className="text-cyan-100 text-lg mb-8 max-w-lg leading-relaxed">
            Explore thousands of digital books, research papers, and documents in our modern library ecosystem.
          </p>

          {/* Search Bar */}
          <div className="relative w-full max-w-2xl mb-8 z-20">
            <div className="flex items-center bg-white/10 backdrop-blur-md border-2 border-white/20 focus-within:border-cyan-300 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:bg-white/15">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search books, authors, research papers..."
                className="flex-grow px-6 py-4 text-white text-lg bg-transparent outline-none placeholder-cyan-200"
              />
              <button className="p-4 text-cyan-300 hover:text-cyan-100 transition duration-300 hover:scale-110">
                <FaSearch size={22} />
              </button>
            </div>

            {/* Search Popup */}
            {showPopup && (
              <div className="absolute top-full mt-3 w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-h-80 overflow-y-auto border border-white/20 z-30">
                {filteredBooks.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <FaSearch className="mx-auto text-gray-400 mb-2" size={24} />
                    <p>No books found. Try different keywords.</p>
                  </div>
                ) : (
                  filteredBooks.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => handleSelectBook(b.id)}
                      className="flex items-start gap-4 p-4 hover:bg-cyan-50 cursor-pointer border-b border-gray-100 last:border-none transition duration-200"
                    >
                      <img
                        src={getImageUrl(b.cover_image)}
                        alt={b.title}
                        className="w-12 h-16 object-cover rounded-lg flex-shrink-0 shadow-md"
                        onError={(e) => { e.currentTarget.src = "/assets/img/hero/hero-book.png"; }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">
                          {b.title}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {b.description || "No description available."}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <FaBook className="mr-1" size={10} />
                          <span>{b.pages || "Unknown"} pages</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Explore Library
              <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white/30 hover:border-white text-white font-semibold rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              Browse All
            </button>
          </div>

          {/* Trending Books */}
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-4">
              <FaArrowUp className="text-cyan-300" />
              <span className="text-white font-semibold">Trending Now</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {trendingBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleSelectBook(book.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 cursor-pointer transition duration-300"
                >
                  <img
                    src={getImageUrl(book.cover_image)}
                    alt={book.title}
                    className="w-6 h-8 object-cover rounded"
                    onError={(e) => { e.currentTarget.src = "/assets/img/hero/hero-book.png"; }}
                  />
                  <span className="text-white text-sm truncate max-w-32">
                    {book.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Featured Books Stack */}
        <div className="flex-1 flex justify-center w-full max-w-lg">
          <div className="relative w-full max-w-md">
            {/* Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
            
            {/* Featured Books Stack */}
            <div className="relative space-y-6">
              {featuredBooks.map((book, index) => (
                <div
                  key={book.id}
                  className={`relative group cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                    index === 0 ? "rotate-3" : index === 1 ? "-rotate-2" : "rotate-1"
                  }`}
                  style={{
                    zIndex: featuredBooks.length - index,
                    marginLeft: index * 8,
                    marginTop: index * -15
                  }}
                  onClick={() => handleSelectBook(book.id)}
                >
                  {/* Book Card */}
                  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-white/20">
                    <div className="flex">
                      {/* Book Cover */}
                      <div className="w-32 h-48 bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center">
                        <img
                          src={getImageUrl(book.cover_image)}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          onError={(e) => { e.currentTarget.src = "/assets/img/hero/hero-book.png"; }}
                        />
                      </div>
                      
                      {/* Book Info */}
                      <div className="flex-1 p-4">
                        <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-2">
                          {book.title}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                          {book.description || "Discover this amazing book..."}
                        </p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full">
                            {book.category || "Fiction"}
                          </span>
                          <div className="flex items-center text-yellow-500">
                            <FaStar className="w-3 h-3 fill-current" />
                            <span className="text-xs text-gray-600 ml-1">4.5</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button className="flex-1 flex items-center justify-center px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-xs rounded-lg transition duration-300">
                            <FaEye className="w-3 h-3 mr-1" />
                            Read
                          </button>
                          <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-lg transition duration-300">
                            <FaDownload className="w-3 h-3 mr-1" />
                            PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-2xl blur-md opacity-0 group-hover:opacity-20 transition duration-300 -z-10"></div>
                </div>
              ))}
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-cyan-400 rounded-2xl rotate-12 shadow-2xl flex items-center justify-center">
              <FaBook className="text-white text-2xl" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-teal-400 rounded-2xl -rotate-12 shadow-2xl flex items-center justify-center">
              <FaStar className="text-white text-xl" />
            </div>

            {/* Stats Badge */}
            <div className="absolute -bottom-6 right-10 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">10K+</div>
                <div className="text-xs text-gray-600">Books Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg className="relative block w-full h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-white"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-white"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-white"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;