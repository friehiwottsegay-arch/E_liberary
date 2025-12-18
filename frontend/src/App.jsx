import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import Popup from "./components/Popup/Popup";
import Footer from "./components/Footer/Footer";
import AppRoutes from "./Routes";
import { isSeller } from "./utils/authUtils";
import AIAssistantApple from "./components/AIAssistant/AIAssistantApple";


// A wrapper component to use hooks like useLocation outside Router
const AppContent = () => {
  const [orderPopup, setOrderPopup] = useState(false);
  const [userContext, setUserContext] = useState({});
  const location = useLocation();

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  // Get user context for AI assistant
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserContext({
      userRole: user.role || 'Guest',
      userId: user.id,
      username: user.username,
      currentPage: location.pathname
    });
  }, [location.pathname]);

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  // Check if route is admin, login, or seller route
  const isAdminOrLogin = location.pathname.startsWith("/admin") || location.pathname === "/login";
  const isSellerRoute = location.pathname.startsWith("/seller");

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 dark:text-white duration-200">
      {/* Navbar (hidden on admin/login/seller routes) */}
      {!isAdminOrLogin && !isSellerRoute && <Navbar handleOrderPopup={handleOrderPopup} />}

      {/* Content area */}
      <main className="flex-grow">
    <AppRoutes />
       
      </main>

      {/* Footer (hidden on admin/login/seller routes) */}
      {!isAdminOrLogin && !isSellerRoute && <Footer />}

      {/* Popup (hidden on admin/login/seller routes) */}
      {!isAdminOrLogin && !isSellerRoute && (
        <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
      )}

      {/* AI Assistant with Apple-style UI */}
      {!location.pathname.includes('/ai') && !isAdminOrLogin && (
        <AIAssistantApple userContext={userContext} />
      )}
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
