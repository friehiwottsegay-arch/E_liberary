// src/components/Products/Products.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  StarIcon, 
  BookOpenIcon, 
  EyeIcon, 
  DocumentTextIcon,
  ClockIcon 
} from "@heroicons/react/24/outline";
import placeholderImg from "../../assets/women/FeaturedBook1.png";

const Products = () => {
  const [books, setBooks] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [trending, setTrending] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/books/");
        const allBooks = res.data || [];
        setBooks(allBooks);

        // Select random recommended books
        const shuffled = [...allBooks].sort(() => 0.5 - Math.random());
        setRecommended(shuffled.slice(0, 6));
        setTrending(shuffled.slice(0, 8));
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    fetchBooks();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return placeholderImg;
    return path.startsWith("http")
      ? path
      : `http://127.0.0.1:8000${path}`;
  };

  const getPdfUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http")
      ? path
      : `http://127.0.0.1:8000${path}`;
  };

  const handleClick = (id) => {
    navigate(`/book/read/${id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const BookCard = ({ book, variant = "default" }) => (
    <div
      onClick={() => handleClick(book.id)}
      className={`cursor-pointer group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 ${
        variant === "featured" ? "transform hover:-translate-y-2" : ""
      }`}
    >
      <div className="relative overflow-hidden">
        <div className={`${variant === "featured" ? "h-64" : "h-48"} bg-gray-100 dark:bg-gray-700`}>
          <img
            src={getImageUrl(book.cover_image)}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderImg;
            }}
          />
        </div>
        
        {/* Overlay with quick actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-3">
            <button className="bg-white rounded-full p-3 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition duration-300">
              <EyeIcon className="h-5 w-5 text-gray-700" />
            </button>
            <button className="bg-white rounded-full p-3 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition duration-300 delay-100">
              <BookOpenIcon className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Badge */}
        {book.category && (
          <div className="absolute top-3 left-3">
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              {book.category}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
          {book.title || "Untitled"}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-3">
          <span className="flex items-center">
            <DocumentTextIcon className="h-4 w-4 mr-1" />
            {book.pages || "N/A"} pages
          </span>
          <span className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            {book.published_date ? formatDate(book.published_date) : "Unknown"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
              {book.rating || "4.5"}
            </span>
          </div>
          
          {book.pdf_file && (
            <a
              href={getPdfUrl(book.pdf_file)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <DocumentTextIcon className="h-4 w-4 mr-1" />
              PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );

  const CategoryFilter = () => (
    <div className="flex flex-wrap gap-3 mb-8 justify-center" data-aos="fade-up">
      {["all", "fiction", "science", "technology", "history", "biography"].map((category) => (
        <button
          key={category}
          onClick={() => setActiveFilter(category)}
          className={`px-4 py-2 rounded-full capitalize transition duration-300 ${
            activeFilter === category
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      {/* Trending Books Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Trending Now
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the most popular books and documents in our digital library
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16" data-aos="fade-up">
          {trending.slice(0, 4).map((book, index) => (
            <BookCard key={book.id} book={book} variant="featured" />
          ))}
        </div>

        {/* Recommended Books */}
        <div className="mb-16" data-aos="fade-up">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Recommended For You</h3>
            <button className="text-blue-600 dark:text-blue-400 hover:underline">
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {recommended.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>

        
      </section>
    </div>
  );
};

export default Products;