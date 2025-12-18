import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiPlus, FiEdit, FiTrash2, FiX, FiSearch, FiFilter, FiGrid, FiList,
  FiDownload, FiUpload, FiEye, FiImage, FiVideo, FiPlay, FiPause,
  FiMaximize2, FiMinimize2, FiExternalLink, FiRefreshCw, FiUsers,
  FiTag, FiClock, FiCalendar, FiTrendingUp, FiAward, FiGift,
  FiFile, FiFileText, FiCheck, FiAlertCircle,
  FiSave, FiTrendingDown, FiLayers, FiMoreVertical, FiCopy, FiBookmark
} from 'react-icons/fi';

const API_BASE = 'http://127.0.0.1:8000/api';
const API_URL = `${API_BASE}/signwords/`;

const AdminSignWords = () => {
  const [words, setWords] = useState([]);
  const [displayWords, setDisplayWords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('word');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedWords, setSelectedWords] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [editWord, setEditWord] = useState(null);
  const [formData, setFormData] = useState({
    word: '',
    description: '',
    category: '',
    difficulty_level: 'beginner',
    tags: '[]'
  });
  const [files, setFiles] = useState({ image: null, video: null });

  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({
    word: '',
    description: '',
    category: '',
    difficulty_level: 'beginner',
    tags: '[]'
  });
  const [uploadFiles, setUploadFiles] = useState({ image: null, video: null });
  const [uploadMsg, setUploadMsg] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    withImage: 0,
    withVideo: 0,
    categories: 0,
    recentAdditions: 0,
    avgWordsPerCategory: 0
  });

  const PAGE_SIZE = 12;

  const fetchWords = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await axios.get(API_URL, { headers });
      setWords(data || []);
      updateStats(data || []);
    } catch (err) {
      console.error('Failed to fetch words', err);
      // Fallback to mock data
      const mockWords = generateMockWords();
      setWords(mockWords);
      updateStats(mockWords);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (words) => {
    const withImage = words.filter(w => w.image_url).length;
    const withVideo = words.filter(w => w.video_url).length;
    const categories = new Set(words.map(w => w.category).filter(Boolean)).size;
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentAdditions = words.filter(w => 
      new Date(w.created_at) >= oneWeekAgo || w.created_at === undefined
    ).length;
    const avgWordsPerCategory = categories > 0 ? Math.round(words.length / categories) : 0;

    setStats({
      total: words.length,
      withImage,
      withVideo,
      categories,
      recentAdditions,
      avgWordsPerCategory
    });
  };

  const generateMockWords = () => {
    const categories = ['Basic', 'Emotions', 'Actions', 'Objects', 'Animals', 'Colors'];
    const difficulties = ['beginner', 'intermediate', 'advanced'];
    const sampleWords = [
      'Hello', 'Thank you', 'Please', 'Yes', 'No', 'Help', 'Water', 'Food',
      'House', 'Car', 'Book', 'School', 'Happy', 'Sad', 'Angry', 'Love',
      'Walk', 'Run', 'Eat', 'Sleep', 'Work', 'Play', 'Dog', 'Cat',
      'Bird', 'Tree', 'Flower', 'Red', 'Blue', 'Green', 'Yellow'
    ];

    return sampleWords.map((word, i) => ({
      id: i + 1,
      word: word,
      description: `Sign language representation for "${word}"`,
      category: categories[Math.floor(Math.random() * categories.length)],
      difficulty_level: difficulties[Math.floor(Math.random() * difficulties.length)],
      tags: ['sign', 'language', word.toLowerCase()],
      image_url: `https://picsum.photos/300/200?random=${i}`,
      video_url: `https://example.com/video${i + 1}.mp4`,
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
  };

  useEffect(() => {
    fetchWords();
  }, []);

  useEffect(() => {
    let filtered = words.filter(word => {
      const matchesSearch = 
        word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !categoryFilter || word.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'created_at') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    const start = (page - 1) * PAGE_SIZE;
    setDisplayWords(filtered.slice(start, start + PAGE_SIZE));
  }, [searchQuery, categoryFilter, sortBy, sortOrder, page, words]);

  const totalPages = Math.ceil(
    words.filter(word => {
      const matchesSearch = 
        word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !categoryFilter || word.category === categoryFilter;
      return matchesSearch && matchesCategory;
    }).length / PAGE_SIZE
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sign word? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`${API_URL}${id}/`, { headers });
      fetchWords();
      if (selectedWords.includes(id)) {
        setSelectedWords(selectedWords.filter(wordId => wordId !== id));
      }
    } catch (err) {
      console.error('Delete failed', err);
      alert('Delete failed');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedWords.length} selected words? This action cannot be undone.`)) return;
    try {
      const token = localStorage.getItem('access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await Promise.all(
        selectedWords.map(id => axios.delete(`${API_URL}${id}/`, { headers }))
      );
      fetchWords();
      setSelectedWords([]);
      setSelectAll(false);
    } catch (err) {
      console.error('Bulk delete failed', err);
      alert('Bulk delete failed');
    }
  };

  const handleEdit = (word) => {
    setEditWord(word);
    setFormData({
      word: word.word || '',
      description: word.description || '',
      category: word.category || '',
      difficulty_level: word.difficulty_level || 'beginner',
      tags: JSON.stringify(word.tags || [])
    });
    setFiles({ image: null, video: null });
  };

  const handleSave = async () => {
    if (!editWord) return;
    
    try {
      const token = localStorage.getItem('access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const fd = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val !== null && val !== undefined) {
          fd.append(key, String(val));
        }
      });
      if (files.image) fd.append('image', files.image);
      if (files.video) fd.append('video', files.video);

      await axios.put(`${API_URL}${editWord.id}/`, fd, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' },
      });

      setEditWord(null);
      fetchWords();
    } catch (err) {
      console.error('Update failed', err);
      alert('Failed to update word');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUploadInputChange = (e) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;
    
    setUploadData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleUploadFileChange = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFiles(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedWords([]);
    } else {
      setSelectedWords(displayWords.map(word => word.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectWord = (id) => {
    if (selectedWords.includes(id)) {
      setSelectedWords(selectedWords.filter(wordId => wordId !== id));
    } else {
      setSelectedWords([...selectedWords, id]);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(uploadData).forEach(([key, val]) => {
      if (val !== null && val !== undefined) {
        fd.append(key, String(val));
      }
    });
    if (uploadFiles.image) fd.append('image', uploadFiles.image);
    if (uploadFiles.video) fd.append('video', uploadFiles.video);

    try {
      const token = localStorage.getItem('access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post(API_URL, fd, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' },
      });
      
      setUploadMsg('✅ Word uploaded successfully');
      setUploadData({
        word: '',
        description: '',
        category: '',
        difficulty_level: 'beginner',
        tags: '[]'
      });
      setUploadFiles({ image: null, video: null });
      fetchWords();
      setTimeout(() => {
        setUploadMsg('');
        setShowUpload(false);
      }, 2000);
    } catch (err) {
      console.error('Upload failed:', err.response?.data || err);
      setUploadMsg('❌ Upload failed');
    }
  };

  const exportWords = () => {
    const data = selectedWords.length > 0 
      ? words.filter(word => selectedWords.includes(word.id))
      : words;
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `sign-words-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'intermediate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'advanced': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-pink-50/20 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <div className="p-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Sign Words Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage sign language words, videos, and educational content
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={exportWords}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center transition-all"
              >
                <FiDownload className="mr-2" size={16} />
                Export
              </button>
              <button
                onClick={() => setShowUpload(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-all"
              >
                <FiPlus className="mr-2" size={16} />
                Add Word
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
          {[
            { title: 'Total Words', value: stats.total, icon: <FiTag size={24} />, color: 'from-blue-500 to-cyan-500' },
            { title: 'With Images', value: stats.withImage, icon: <FiImage size={24} />, color: 'from-green-500 to-teal-500' },
            { title: 'With Videos', value: stats.withVideo, icon: <FiVideo size={24} />, color: 'from-purple-500 to-pink-500' },
            { title: 'Categories', value: stats.categories, icon: <FiLayers size={24} />, color: 'from-yellow-500 to-orange-500' },
            { title: 'This Week', value: stats.recentAdditions, icon: <FiCalendar size={24} />, color: 'from-indigo-500 to-blue-500' },
            { title: 'Avg/Category', value: stats.avgWordsPerCategory, icon: <FiTrendingUp size={24} />, color: 'from-red-500 to-pink-500' }
          ].map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg inline-block mb-4`}>
                <div className="text-white">{stat.icon}</div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search words, descriptions, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-lg bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500"
              />
              <FiSearch className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="Basic">Basic</option>
                <option value="Emotions">Emotions</option>
                <option value="Actions">Actions</option>
                <option value="Objects">Objects</option>
                <option value="Animals">Animals</option>
                <option value="Colors">Colors</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                <FiFilter size={18} />
              </button>
            </div>

            {/* View Mode */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                <FiList size={18} />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="word">Sort by Word</option>
                  <option value="created_at">Sort by Date</option>
                  <option value="category">Sort by Category</option>
                  <option value="difficulty_level">Sort by Difficulty</option>
                </select>
                
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>

                <button
                  onClick={fetchWords}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
                >
                  <FiRefreshCw className="mr-2" size={16} />
                  Refresh
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedWords.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 dark:text-blue-200 font-medium">
                {selectedWords.length} word(s) selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center"
                >
                  <FiTrash2 className="mr-2" size={16} />
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedWords([])}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Words Display */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
                <div className="bg-gray-300 dark:bg-gray-600 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 dark:bg-gray-600 h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayWords.map(word => (
              <div key={word.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all group">
                <div className="relative">
                  {word.image_url ? (
                    <img
                      src={word.image_url}
                      alt={word.word}
                      className="w-full h-48 object-cover"
                      onError={(e) => e.target.src = 'https://placehold.co/300x200'}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <FiImage className="text-gray-400" size={48} />
                    </div>
                  )}
                  
                  {/* Checkbox */}
                  <div className="absolute top-3 left-3">
                    <input
                      type="checkbox"
                      checked={selectedWords.includes(word.id)}
                      onChange={() => handleSelectWord(word.id)}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  {/* Media Indicators */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    {word.image_url && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <FiImage className="w-3 h-3 mr-1" />
                        Image
                      </span>
                    )}
                    {word.video_url && (
                      <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <FiVideo className="w-3 h-3 mr-1" />
                        Video
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {word.video_url && (
                      <button
                        onClick={() => window.open(word.video_url, '_blank')}
                        className="p-2 bg-white/90 hover:bg-white text-purple-600 rounded-full shadow-lg"
                        title="Play Video"
                      >
                        <FiPlay size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(word)}
                      className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-lg"
                      title="Edit Word"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(word.id)}
                      className="p-2 bg-white/90 hover:bg-white text-red-600 rounded-full shadow-lg"
                      title="Delete Word"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">{word.word}</h3>
                  {word.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {word.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {word.category && (
                      <span className="flex items-center">
                        <FiTag className="w-4 h-4 mr-1" />
                        {word.category}
                      </span>
                    )}
                    {word.created_at && (
                      <span className="flex items-center">
                        <FiCalendar className="w-4 h-4 mr-1" />
                        {new Date(word.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    {word.difficulty_level && (
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(word.difficulty_level)}`}>
                        {word.difficulty_level}
                      </span>
                    )}
                    {word.tags && word.tags.length > 0 && (
                      <div className="flex gap-1">
                        {word.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                        {word.tags.length > 2 && (
                          <span className="text-xs text-gray-500">+{word.tags.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleSort('word')}
                    >
                      Word
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Media
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {displayWords.map(word => (
                    <tr key={word.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedWords.includes(word.id)}
                          onChange={() => handleSelectWord(word.id)}
                          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          {word.image_url ? (
                            <img
                              src={word.image_url}
                              alt={word.word}
                              className="w-12 h-12 object-cover rounded mr-4"
                              onError={(e) => e.target.src = 'https://placehold.co/48x48'}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded mr-4 flex items-center justify-center">
                              <FiImage className="text-gray-400" size={20} />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{word.word}</div>
                            {word.tags && word.tags.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {word.tags.slice(0, 3).map((tag, index) => (
                                  <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1 py-0.5 rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        <div className="max-w-xs truncate">{word.description || 'No description'}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        {word.category || 'Uncategorized'}
                      </td>
                      <td className="px-4 py-4">
                        {word.difficulty_level && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(word.difficulty_level)}`}>
                            {word.difficulty_level}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          {word.image_url && (
                            <FiImage className="text-green-500" size={16} title="Has image" />
                          )}
                          {word.video_url && (
                            <FiVideo className="text-purple-500" size={16} title="Has video" />
                          )}
                          {!word.image_url && !word.video_url && (
                            <span className="text-gray-400 text-sm">No media</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          {word.video_url && (
                            <button
                              onClick={() => window.open(word.video_url, '_blank')}
                              className="text-purple-600 hover:text-purple-800 p-1 rounded"
                              title="Play Video"
                            >
                              <FiPlay size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(word)}
                            className="text-green-600 hover:text-green-800 p-1 rounded"
                            title="Edit Word"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(word.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded"
                            title="Delete Word"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
              Showing {((page - 1) * PAGE_SIZE) + 1} to {Math.min(page * PAGE_SIZE, words.length)} of {words.length} words
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-4 py-2 rounded-lg ${
                      page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editWord && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Sign Word</h2>
                <button
                  onClick={() => setEditWord(null)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Word *
                  </label>
                  <input
                    type="text"
                    name="word"
                    placeholder="Sign word"
                    value={formData.word}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Description of the sign"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                    >
                      <option value="">Select category</option>
                      <option value="Basic">Basic</option>
                      <option value="Emotions">Emotions</option>
                      <option value="Actions">Actions</option>
                      <option value="Objects">Objects</option>
                      <option value="Animals">Animals</option>
                      <option value="Colors">Colors</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      name="difficulty_level"
                      value={formData.difficulty_level}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags (JSON format)
                  </label>
                  <textarea
                    name="tags"
                    placeholder='["sign", "language", "word"]'
                    value={formData.tags}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'image')}
                        className="hidden"
                        id="edit-image-upload"
                      />
                      <label htmlFor="edit-image-upload" className="cursor-pointer">
                        <FiImage className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Click to upload image
                        </p>
                        {files.image && (
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                            {files.image.name}
                          </p>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Video
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange(e, 'video')}
                        className="hidden"
                        id="edit-video-upload"
                      />
                      <label htmlFor="edit-video-upload" className="cursor-pointer">
                        <FiVideo className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Click to upload video
                        </p>
                        {files.video && (
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                            {files.video.name}
                          </p>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setEditWord(null)}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-all"
                >
                  <FiSave className="mr-2" size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Sign Word</h2>
                <button
                  onClick={() => setShowUpload(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {uploadMsg && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-center text-blue-800 dark:text-blue-200">{uploadMsg}</p>
                </div>
              )}

              <form onSubmit={handleUpload} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Word *
                  </label>
                  <input
                    type="text"
                    name="word"
                    placeholder="Sign word"
                    value={uploadData.word}
                    onChange={handleUploadInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Description of the sign"
                    value={uploadData.description}
                    onChange={handleUploadInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={uploadData.category}
                      onChange={handleUploadInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                    >
                      <option value="">Select category</option>
                      <option value="Basic">Basic</option>
                      <option value="Emotions">Emotions</option>
                      <option value="Actions">Actions</option>
                      <option value="Objects">Objects</option>
                      <option value="Animals">Animals</option>
                      <option value="Colors">Colors</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      name="difficulty_level"
                      value={uploadData.difficulty_level}
                      onChange={handleUploadInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags (JSON format)
                  </label>
                  <textarea
                    name="tags"
                    placeholder='["sign", "language", "word"]'
                    value={uploadData.tags}
                    onChange={handleUploadInputChange}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Image *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadFileChange(e, 'image')}
                        className="hidden"
                        id="upload-image"
                        required
                      />
                      <label htmlFor="upload-image" className="cursor-pointer">
                        <FiImage className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Click to upload image
                        </p>
                        {uploadFiles.image && (
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                            {uploadFiles.image.name}
                          </p>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Video *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleUploadFileChange(e, 'video')}
                        className="hidden"
                        id="upload-video"
                        required
                      />
                      <label htmlFor="upload-video" className="cursor-pointer">
                        <FiVideo className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Click to upload video
                        </p>
                        {uploadFiles.video && (
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                            {uploadFiles.video.name}
                          </p>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowUpload(false)}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-all"
                  >
                    <FiUpload className="mr-2" size={16} />
                    {loading ? 'Uploading...' : 'Add Word'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSignWords;
