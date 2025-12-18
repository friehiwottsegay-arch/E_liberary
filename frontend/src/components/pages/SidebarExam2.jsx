import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Icons
const FolderIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
  </svg>
);

const DocumentIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10M7 11h10M7 15h7" />
  </svg>
);

const Sidebar2 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [qCategories, setQCategories] = useState([]);
  const [expandedCats, setExpandedCats] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/qcategory/');
      setQCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('Failed to load categories');
    }
  }, []);

  const fetchSubjects = useCallback(async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/subjects/");
      if (!res.ok) throw new Error("Failed to fetch subjects");
      const data = await res.json();
      setSubjects(data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setError(err.message || "Failed to load subjects");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([fetchCategories(), fetchSubjects()]).finally(() => setLoading(false));
  }, [fetchCategories, fetchSubjects]);

  useEffect(() => {
    const expandedIds = Object.keys(expandedCats)
      .filter(catId => expandedCats[catId])
      .map(id => Number(id));

    if (expandedIds.length === 0) {
      setFilteredSubjects([]);
      return;
    }

    const filtered = subjects.filter(sub => expandedIds.includes(sub.QCategory));
    setFilteredSubjects(filtered);
  }, [expandedCats, subjects]);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const toggleCategory = (catId) => {
    setExpandedCats(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const handleStartExam = (subject) => {
    if (subject && subject.id) {
      navigate(`/exam/question/${subject.id}`);
    } else {
      console.warn("Subject missing ID", subject);
    }
  };

  const isActiveSub = (subId) => location.pathname === `/Exam/${subId}`;

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Close Menu' : 'Open Menu'}
          className="p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition"
        >
          {isSidebarOpen ? '✕ Close' : '☰ Menu'}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-[#1c1c1c] text-gray-900 dark:text-gray-100
          border-r border-gray-200 dark:border-gray-700
          flex flex-col p-6 pt-6 transition-transform duration-300 ease-in-out overflow-y-auto z-40
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static`}
        style={{ width: '19vw', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
      >
        <h2 className="sticky top-0 bg-white dark:bg-[#1c1c1c] text-base font-bold pt-1 mb-3 border-b border-gray-300 dark:border-gray-700 pb-2 z-10">
          Categories
        </h2>

        <nav className="flex-grow">
          <ul className="space-y-4">
            {loading ? (
              <li className="text-xs text-gray-500 select-none">Loading categories...</li>
            ) : error ? (
              <li className="text-xs text-red-500 select-none">{error}</li>
            ) : qCategories.length === 0 ? (
              <li className="text-xs text-gray-500 select-none">No categories found.</li>
            ) : (
              qCategories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-800 dark:text-gray-200
                      px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <span className="flex items-center gap-2">
                      <FolderIcon className="w-5 h-5" />
                      {category.name}
                    </span>
                  </button>

                  {expandedCats[category.id] && (
                    <ul className="ml-6 mt-2 space-y-2 border-l border-gray-300 dark:border-gray-700 pl-4">
                      {filteredSubjects
                        .filter(sub => sub.QCategory === category.id)
                        .map((sub) => (
                          <li key={sub.id}>
                            <button
                              onClick={() => handleStartExam(sub)}
                              className={`flex items-center gap-2 w-full text-left text-xs
                                px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition
                                focus:outline-none focus:ring-2 focus:ring-indigo-400
                                ${
                                  isActiveSub(sub.id)
                                    ? 'bg-indigo-500 text-white dark:bg-indigo-600'
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}
                            >
                              <DocumentIcon className="w-4 h-4" />
                              {sub.name}
                            </button>
                          </li>
                      ))}
                      {filteredSubjects.filter(sub => sub.QCategory === category.id).length === 0 && (
                        <li className="text-xs text-gray-500 dark:text-gray-400 select-none px-3 py-2">
                          No subjects available.
                        </li>
                      )}
                    </ul>
                  )}
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
        />
      )}
    </>
  );
};

export default Sidebar2;
