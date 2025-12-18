import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaTimes, FaComments } from 'react-icons/fa';

const FloatingAIButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/ai-assistant');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap animate-fade-in">
          Need help? Ask our AI Assistant!
          <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
      >
        {/* Pulse Animation */}
        <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></span>
        
        {/* Icon */}
        <FaRobot className="relative text-white text-2xl group-hover:rotate-12 transition-transform duration-300" />
        
        {/* Notification Badge */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
          AI
        </span>
      </button>

      {/* Ripple Effect */}
      <div className="absolute inset-0 rounded-full bg-blue-400 opacity-0 group-hover:opacity-20 animate-pulse"></div>
    </div>
  );
};

export default FloatingAIButton;
