import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Sidebar = ({ width = '250px', paddingLeft = '20px' }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/categories/')
      .then((res) => {
        // Extract subcategories and include their parent category name
        const allSubcategories = res.data.flatMap((category) =>
          (category.subcategories || []).map((sub) => ({
            id: sub.id,
            name: sub.name,
            parentCategory: category.name,
          }))
        );
        setSubcategories(allSubcategories);
      })
      .catch((error) => {
        console.error('Failed to fetch subcategories:', error);
      });
  }, []);

  const handleCategoryClick = (subcategory) => {
    navigate(`/Category/${subcategory.parentCategory}`);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Close Menu' : 'Open Menu'}
          className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isSidebarOpen ? '✕ Close' : '☰ Menu'}
        </button>
      </div>

      {/* Sidebar */}
     <aside
  className={`fixed top-0 left-0 h-full bg-white dark:bg-[#1c1c1c] text-gray-900 dark:text-gray-100
    border-r border-gray-200 dark:border-gray-700
    flex flex-col pt-12 pl-6 transition-transform duration-300 ease-in-out overflow-y-auto z-40
    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0 lg:static`}
  style={{ width: '12vw' }}
>

        <nav className="flex-grow">
          <ul className="space-y-3">
            {subcategories.length === 0 ? (
              <li className="text-sm text-gray-500 select-none">Loading...</li>
            ) : (
              subcategories.map((sub) => (
                <li
                  key={sub.id}
                  onClick={() => handleCategoryClick(sub)}
                  className="text-base font-medium cursor-pointer px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition select-none"
                >
                  {sub.name}
                </li>
              ))
            )}
          </ul>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
