// src/pages/Home.js
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import Products from "../components/Products/BookList";
import Popup from "../components/Popup/Popup";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
  const [orderPopup, setOrderPopup] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 min-h-screen">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Sidebar - Hidden on mobile, shown with toggle */}
        <div className={`
          ${isSidebarOpen ? 'block' : 'hidden'} 
          lg:block lg:w-80 xl:w-96 flex-shrink-0
        `}>
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-6">
          {/* Mobile Sidebar Toggle Button */}
          <div className="lg:hidden p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Categories</span>
            </button>
          </div>

          {/* Products Section */}
          <div className="p-4 lg:p-6">
            <div data-aos="fade-up" className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                Discover Your Next <span className="text-blue-600">Favorite Book</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Explore our vast collection of books across various categories and genres
              </p>
            </div>
            
            <Products />
          </div>
        </div>
      </div>

      {/* Popup */}
      <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;