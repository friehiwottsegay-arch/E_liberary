// src/pages/Home.js
import React, { useState, useEffect, useRef } from "react";
import Subscribe from "../Subscribe/Subscribe";
import Testimonials from "../Testimonials/Testimonials";
import Hero from "../Hero/Hero";
import Products from "../Products/Products";
import TopProducts from "../TopProducts/TopProducts";
import Popup from "../Popup/Popup";
import AOS from "aos";
import "aos/dist/aos.css";
import apiClient, { API_ENDPOINTS } from "../../config/apiConfig";

const Home = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const autoScrollRef = useRef(null);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(API_ENDPOINTS.CATEGORIES);
        setCategories(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch categories", err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  // Auto-scroll functionality - scrolls every 3 seconds
  useEffect(() => {
    if (!scrollContainerRef.current || categories.length === 0) return;

    const scrollContainer = scrollContainerRef.current;
    let currentIndex = 0;
    const scrollInterval = 3000; // 3 seconds

    const autoScroll = () => {
      if (scrollContainer) {
        const containerWidth = scrollContainer.clientWidth;
        const itemWidth = 192; // w-48 = 192px
        const gap = 16; // space-x-4 = 16px
        const scrollAmount = itemWidth + gap;
        
        // Calculate max scroll
        const maxScroll = scrollContainer.scrollWidth - containerWidth;
        const currentScroll = scrollContainer.scrollLeft;
        
        // If reached end, reset to start
        if (currentScroll >= maxScroll - 10) {
          scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
          currentIndex = 0;
        } else {
          // Scroll to next item
          scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          currentIndex++;
        }
      }
    };

    // Start auto-scroll
    autoScrollRef.current = setInterval(autoScroll, scrollInterval);

    // Cleanup on unmount
    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [categories]);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };

  // Resume auto-scroll when mouse leaves
  const handleMouseLeave = () => {
    if (scrollContainerRef.current && categories.length > 0) {
      const scrollInterval = 3000;
      autoScrollRef.current = setInterval(() => {
        const scrollContainer = scrollContainerRef.current;
        const containerWidth = scrollContainer.clientWidth;
        const itemWidth = 192;
        const gap = 16;
        const scrollAmount = itemWidth + gap;
        const maxScroll = scrollContainer.scrollWidth - containerWidth;
        const currentScroll = scrollContainer.scrollLeft;
        
        if (currentScroll >= maxScroll - 10) {
          scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }, scrollInterval);
    }
  };

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'book': '📚',
      'fiction': '📚',
      'science': '🔬',
      'history': '📜',
      'technology': '💻',
      'biography': '👤',
      'business': '💼',
      'children': '🧒',
      'cooking': '🍳',
      'art': '🎨',
      'travel': '✈️',
      'religion': '🛐',
      'health': '🏥',
      'sports': '⚽',
      'default': '📖'
    };
    
    const lowerName = categoryName.toLowerCase();
    return iconMap[lowerName] || iconMap.default;
  };

  const getCategoryColor = (categoryName) => {
    const colorMap = {
      'book': 'from-blue-500 to-blue-600',
      'fiction': 'from-blue-500 to-blue-600',
      'science': 'from-green-500 to-green-600',
      'history': 'from-amber-500 to-amber-600',
      'technology': 'from-purple-500 to-purple-600',
      'biography': 'from-indigo-500 to-indigo-600',
      'business': 'from-gray-500 to-gray-600',
      'children': 'from-pink-500 to-pink-600',
      'cooking': 'from-red-500 to-red-600',
      'art': 'from-yellow-500 to-yellow-600',
      'travel': 'from-teal-500 to-teal-600',
      'default': 'from-blue-500 to-blue-600'
    };
    
    const lowerName = categoryName.toLowerCase();
    return colorMap[lowerName] || colorMap.default;
  };

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 overflow-hidden">
      <Hero handleOrderPopup={handleOrderPopup} />
      
      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center" data-aos="fade-up">
          <div className="p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
            <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">10K+</div>
            <div className="text-sm md:text-base text-gray-600 dark:text-gray-300">Digital Books</div>
          </div>
          <div className="p-4 md:p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
            <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">5K+</div>
            <div className="text-sm md:text-base text-gray-600 dark:text-gray-300">Documents</div>
          </div>
          <div className="p-4 md:p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
            <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">2K+</div>
            <div className="text-sm md:text-base text-gray-600 dark:text-gray-300">Audio Books</div>
          </div>
          <div className="p-4 md:p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
            <div className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400">50K+</div>
            <div className="text-sm md:text-base text-gray-600 dark:text-gray-300">Active Readers</div>
          </div>
        </div>
      </div>  

      <Products />
      
      {/* Featured Documents Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12" data-aos="fade-up">Featured Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8" data-aos="fade-up">
          {[
            { 
              title: "Research Papers", 
              count: "1,234", 
              icon: "📄", 
              bg: "bg-blue-50 dark:bg-blue-900/20",
              border: "border-blue-200 dark:border-blue-800",
              color: "text-blue-600"
            },
            { 
              title: "Academic Journals", 
              count: "856", 
              icon: "📑", 
              bg: "bg-green-50 dark:bg-green-900/20",
              border: "border-green-200 dark:border-green-800",
              color: "text-green-600"
            },
            { 
              title: "Thesis Papers", 
              count: "432", 
              icon: "📝", 
              bg: "bg-purple-50 dark:bg-purple-900/20",
              border: "border-purple-200 dark:border-purple-800",
              color: "text-purple-600"
            },
          ].map((doc, index) => (
            <div 
              key={index} 
              className={`${doc.bg} ${doc.border} rounded-xl p-6 shadow-sm border-2 transition-all duration-300 hover:shadow-md hover:scale-105`}
            >
              <div className={`text-4xl mb-4 ${doc.color}`}>{doc.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{doc.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{doc.count} documents available</p>
              <button className="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition duration-300 w-full">
                Explore
              </button>
            </div>
          ))}
        </div>
      </div>

      <Subscribe />
      <Testimonials />
      <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
    </div>
  );
};

export default Home;