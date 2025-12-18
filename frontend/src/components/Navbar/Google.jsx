import React, { useEffect, useState } from "react";
import { FiGlobe } from "react-icons/fi";

const GoogleTranslate = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "am", name: "Amharic", flag: "🇪🇹" },
    { code: "ti", name: "Tigrinya", flag: "🇪🇷" },
    { code: "or", name: "Oromo", flag: "🇪🇹" },
    { code: "so", name: "Somali", flag: "🇸🇴" },
    { code: "sw", name: "Swahili", flag: "🇰🇪" },
    { code: "zu", name: "Zulu", flag: "🇿🇦" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "zh-CN", name: "中文", flag: "🇨🇳" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ];

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    
    // Wait for Google Translate to be ready
    const translatePage = () => {
      const selectElement = document.querySelector('.goog-te-combo');
      if (selectElement) {
        selectElement.value = langCode;
        selectElement.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Show success message
        const currentLang = languages.find(lang => lang.code === langCode);
        console.log(`Language changed to: ${currentLang?.name}`);
      } else {
        // Retry after a short delay if element not found
        setTimeout(translatePage, 500);
      }
    };
    
    translatePage();
    setIsVisible(false);
  };

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: languages.map(lang => lang.code).join(','),
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    if (!document.querySelector("script[src*='translate_a/element.js']")) {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }

    return () => {
      delete window.googleTranslateElementInit;
    };
  }, []);

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsVisible(!isVisible)}
        aria-label="Toggle Language Selector"
        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <FiGlobe className="text-sm" />
        <span className="text-sm font-medium">{currentLang.flag}</span>
        <span className="text-xs hidden sm:block">{currentLang.name}</span>
      </button>

      {/* Modern Language Dropdown */}
      {isVisible && (
        <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-50 w-64 max-h-80 overflow-y-auto">
          <div className="p-3 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Select Language</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Choose your preferred language</p>
          </div>
          
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200 ${
                  currentLanguage === lang.code
                    ? 'bg-blue-50 dark:bg-blue-900/30 border-r-2 border-blue-500'
                    : ''
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className={`text-sm font-medium ${
                  currentLanguage === lang.code
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {lang.name}
                </span>
                {currentLanguage === lang.code && (
                  <span className="ml-auto text-blue-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hidden Google Translate Element */}
      <div
        id="google_translate_element"
        className="hidden"
      />

      <style>{`
        .goog-logo-link,
        .goog-te-banner-frame,
        iframe.goog-te-banner-frame,
        .goog-te-balloon-frame {
          display: none !important;
        }

        .goog-te-gadget {
          font-size: 0 !important;
        }

        .goog-te-gadget .goog-te-combo {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default GoogleTranslate;
