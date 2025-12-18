import React from "react";

const Subscribe = () => {
  return (
    <div
      data-aos="zoom-in"
      className="mb-20 bg-gradient-to-r from-purple-600 to-blue-500 dark:from-gray-900 dark:to-gray-800 text-white rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="container py-16 px-6 sm:px-12">
        <div className="space-y-8 max-w-2xl mx-auto text-center">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Stay In The Loop
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-300 mx-auto rounded-full"></div>
          </div>
          
          <p className="text-lg sm:text-xl text-blue-100 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
            Be the first to know about new products, exclusive offers, and latest updates
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <input
              data-aos="fade-up"
              data-aos-delay="200"
              type="email"
              placeholder="Enter your email address"
              className="w-full sm:flex-1 max-w-md p-4 rounded-xl text-gray-800 bg-white/90 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-4 focus:ring-cyan-300/50 shadow-lg transition-all duration-300 placeholder-gray-500"
            />
            <button
              data-aos="fade-up"
              data-aos-delay="300"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-cyan-400/30 shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Subscribe
            </button>
          </div>
          
          <p className="text-sm text-blue-200/80 dark:text-gray-400 pt-4">
            No spam ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-400/20 rounded-full -translate-x-16 -translate-y-16 blur-xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-400/20 rounded-full translate-x-20 translate-y-20 blur-xl"></div>
    </div>
  );
};

export default Subscribe;