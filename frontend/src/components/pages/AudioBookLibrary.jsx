import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaHeadphones, FaMicrophone, FaPlay, FaSearch } from 'react-icons/fa';
import axios from 'axios';

const AudioBookLibrary = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/books/');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'audio' && book.has_audio) ||
                         (filterType === 'pdf' && book.pdf_file);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center">
            <FaHeadphones className="mr-3 text-purple-500" />
            Audio Book Library
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Generate AI audio from PDFs or record your own voice
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterType === 'all'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('audio')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterType === 'audio'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <FaHeadphones className="inline mr-2" />
                Has Audio
              </button>
              <button
                onClick={() => setFilterType('pdf')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterType === 'pdf'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <FaBook className="inline mr-2" />
                Has PDF
              </button>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => navigate(`/audiobook-detail/${book.id}`)}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden"
            >
              {/* Book Cover */}
              <div className="h-64 bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center relative">
                {book.cover_image ? (
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaBook className="text-white text-6xl opacity-50" />
                )}
                
                {/* Badges */}
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  {book.has_audio && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full flex items-center">
                      <FaHeadphones className="mr-1" />
                      Audio
                    </span>
                  )}
                  {book.pdf_file && (
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full flex items-center">
                      <FaBook className="mr-1" />
                      PDF
                    </span>
                  )}
                </div>
              </div>

              {/* Book Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  by {book.author}
                </p>
                
                {book.description && (
                  <p className="text-gray-500 dark:text-gray-500 text-xs line-clamp-2 mb-3">
                    {book.description}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pdf-reader/${book.id}`);
                    }}
                    className="flex-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <FaPlay className="mr-2" />
                    Read & Listen
                  </button>
                  {book.pdf_file && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/audiobook-detail/${book.id}`);
                      }}
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <FaMicrophone />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <FaBook className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No books found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioBookLibrary;
