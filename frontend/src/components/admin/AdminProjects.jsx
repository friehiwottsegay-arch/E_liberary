import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiPlus, FiEdit, FiTrash2, FiX, FiSearch, FiFilter, FiGrid, FiList,
  FiDownload, FiUpload, FiEye, FiStar, FiHeart, FiShare2, FiBook,
  FiUser, FiCalendar, FiClock, FiBarChart, FiCheck, FiRefreshCw,
  FiMoreVertical, FiMaximize2, FiFileText, FiImage, FiFolder, FiTag,
  FiArrowUp, FiArrowDown, FiAlertCircle, FiSave,
  FiTrendingUp, FiDollarSign, FiUsers, FiTarget, FiAward, FiGift,
  FiExternalLink, FiCopy, FiBookmark, FiTrendingDown, FiLayers
} from 'react-icons/fi';

const API_BASE = 'http://127.0.0.1:8000/api';
const API_URL = `${API_BASE}/project/`;

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [badgeFilter, setBadgeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [editProject, setEditProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    full_description: '',
    badge: 'new',
    is_featured: false,
    rating: 0.0,
    views: 0,
    date: '',
    tags: '[]',
    category: '',
    difficulty_level: 'beginner',
    estimated_time: '',
    author_name: '',
    status: 'draft'
  });

  const [files, setFiles] = useState({ image: null, pdf: null });
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    featured: 0,
    new: 0,
    thisMonth: 0,
    avgRating: 0,
    totalViews: 0
  });

  const PAGE_SIZE = 12;

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await axios.get(API_URL, { headers });
      setProjects(data || []);
      updateStats(data || []);
    } catch (err) {
      console.error('Failed to fetch projects', err);
      // Fallback to mock data
      const mockProjects = generateMockProjects();
      setProjects(mockProjects);
      updateStats(mockProjects);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (projects) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const featured = projects.filter(p => p.is_featured).length;
    const newProjects = projects.filter(p => p.badge === 'new').length;
    const thisMonthProjects = projects.filter(p => 
      new Date(p.created_at) >= thisMonth
    ).length;
    const totalViews = projects.reduce((sum, p) => sum + (p.views || 0), 0);
    const avgRating = projects.length > 0 
      ? projects.reduce((sum, p) => sum + (p.rating || 0), 0) / projects.length
      : 0;

    setStats({
      total: projects.length,
      featured,
      new: newProjects,
      thisMonth: thisMonthProjects,
      avgRating: Math.round(avgRating * 10) / 10,
      totalViews
    });
  };

  const generateMockProjects = () => {
    const badges = ['new', 'top-rated', 'featured', 'trending'];
    const categories = ['Technology', 'Healthcare', 'Education', 'Finance', 'Environment'];
    const difficulties = ['beginner', 'intermediate', 'advanced'];
    const statuses = ['draft', 'published', 'archived'];
    
    return Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      title: `Research Project ${i + 1}`,
      summary: 'This is a sample project summary that describes the research work.',
      full_description: 'Detailed description of the research project including methodology, findings, and conclusions.',
      badge: badges[Math.floor(Math.random() * badges.length)],
      is_featured: Math.random() > 0.7,
      rating: Math.round((Math.random() * 5) * 10) / 10,
      views: Math.floor(Math.random() * 1000),
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['research', 'innovation', 'technology'],
      category: categories[Math.floor(Math.random() * categories.length)],
      difficulty_level: difficulties[Math.floor(Math.random() * difficulties.length)],
      estimated_time: `${Math.floor(Math.random() * 12) + 1} months`,
      author_name: `Author ${i + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      image_url: `https://picsum.photos/300/200?random=${i}`,
      pdf_url: '#'
    }));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.author_name?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBadge = !badgeFilter || project.badge === badgeFilter;
      const matchesStatus = !statusFilter || 
        (statusFilter === 'featured' && project.is_featured) ||
        (statusFilter === 'new' && project.badge === 'new') ||
        (statusFilter === 'draft' && project.status === 'draft');
      
      return matchesSearch && matchesBadge && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'created_at' || sortBy === 'date') {
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
    setDisplayProjects(filtered.slice(start, start + PAGE_SIZE));
  }, [searchQuery, badgeFilter, statusFilter, sortBy, sortOrder, page, projects]);

  const totalPages = Math.ceil(
    projects.filter(project => {
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.summary?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBadge = !badgeFilter || project.badge === badgeFilter;
      const matchesStatus = !statusFilter || 
        (statusFilter === 'featured' && project.is_featured) ||
        (statusFilter === 'new' && project.badge === 'new') ||
        (statusFilter === 'draft' && project.status === 'draft');
      return matchesSearch && matchesBadge && matchesStatus;
    }).length / PAGE_SIZE
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`${API_URL}${id}/`, { headers });
      fetchProjects();
      if (selectedProjects.includes(id)) {
        setSelectedProjects(selectedProjects.filter(projectId => projectId !== id));
      }
    } catch (err) {
      console.error('Delete failed', err);
      alert('Delete failed');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedProjects.length} selected projects? This action cannot be undone.`)) return;
    try {
      const token = localStorage.getItem('access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await Promise.all(
        selectedProjects.map(id => axios.delete(`${API_URL}${id}/`, { headers }))
      );
      fetchProjects();
      setSelectedProjects([]);
      setSelectAll(false);
    } catch (err) {
      console.error('Bulk delete failed', err);
      alert('Bulk delete failed');
    }
  };

  const handleEdit = (project) => {
    setEditProject(project);
    setFormData({
      title: project.title || '',
      summary: project.summary || '',
      full_description: project.full_description || '',
      badge: project.badge || 'new',
      is_featured: project.is_featured || false,
      rating: project.rating || 0.0,
      views: project.views || 0,
      date: project.date || '',
      tags: JSON.stringify(project.tags || []),
      category: project.category || '',
      difficulty_level: project.difficulty_level || 'beginner',
      estimated_time: project.estimated_time || '',
      author_name: project.author_name || '',
      status: project.status || 'draft'
    });
    setFiles({ image: null, pdf: null });
  };

  const handleSave = async () => {
    if (!editProject) return;
    
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
      if (files.pdf) fd.append('pdf', files.pdf);

      await axios.put(`${API_URL}${editProject.id}/`, fd, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' },
      });

      setEditProject(null);
      fetchProjects();
    } catch (err) {
      console.error('Update failed', err);
      alert('Failed to update project');
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

  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(displayProjects.map(project => project.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectProject = (id) => {
    if (selectedProjects.includes(id)) {
      setSelectedProjects(selectedProjects.filter(projectId => projectId !== id));
    } else {
      setSelectedProjects([...selectedProjects, id]);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const exportProjects = () => {
    const data = selectedProjects.length > 0 
      ? projects.filter(project => selectedProjects.includes(project.id))
      : projects;
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `projects-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getBadgeColor = (badge) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'top-rated': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'featured': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'trending': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    return colors[badge] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getStatusColor = (status) => {
    const colors = {
      'published': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'draft': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'archived': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="p-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Research Projects Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage research projects, publications, and academic content
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={exportProjects}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center transition-all"
              >
                <FiDownload className="mr-2" size={16} />
                Export
              </button>
              <button
                onClick={() => window.location.href = '/admin/projects/upload'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-all"
              >
                <FiPlus className="mr-2" size={16} />
                Add Project
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-6">
          {[
            { title: 'Total Projects', value: stats.total, icon: <FiFolder size={24} />, color: 'from-blue-500 to-cyan-500' },
            { title: 'Featured', value: stats.featured, icon: <FiStar size={24} />, color: 'from-yellow-500 to-orange-500' },
            { title: 'New This Month', value: stats.thisMonth, icon: <FiGift size={24} />, color: 'from-green-500 to-teal-500' },
            { title: 'Avg Rating', value: stats.avgRating, icon: <FiAward size={24} />, color: 'from-purple-500 to-pink-500' },
            { title: 'Total Views', value: stats.totalViews, icon: <FiEye size={24} />, color: 'from-indigo-500 to-blue-500' },
            { title: 'Categories', value: new Set(projects.map(p => p.category)).size, icon: <FiLayers size={24} />, color: 'from-red-500 to-pink-500' }
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
                placeholder="Search projects by title, summary, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-lg bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500"
              />
              <FiSearch className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={badgeFilter}
                onChange={(e) => setBadgeFilter(e.target.value)}
                className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Badges</option>
                <option value="new">New</option>
                <option value="top-rated">Top Rated</option>
                <option value="featured">Featured</option>
                <option value="trending">Trending</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="featured">Featured</option>
                <option value="new">New</option>
                <option value="draft">Draft</option>
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
                  <option value="created_at">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="views">Sort by Views</option>
                  <option value="author_name">Sort by Author</option>
                </select>
                
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>

                <button
                  onClick={fetchProjects}
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
        {selectedProjects.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 dark:text-blue-200 font-medium">
                {selectedProjects.length} project(s) selected
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
                  onClick={() => setSelectedProjects([])}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Projects Display */}
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
            {displayProjects.map(project => (
              <div key={project.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all group">
                <div className="relative">
                  <img
                    src={project.image_url || 'https://placehold.co/300x200'}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => e.target.src = 'https://placehold.co/300x200'}
                  />
                  
                  {/* Checkbox */}
                  <div className="absolute top-3 left-3">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => handleSelectProject(project.id)}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(project.badge)}`}>
                      {project.badge}
                    </span>
                    {project.is_featured && (
                      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <FiStar className="w-3 h-3 mr-1" />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => window.open(project.pdf_url || '#', '_blank')}
                      className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-lg"
                      title="View PDF"
                    >
                      <FiEye size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-lg"
                      title="Edit Project"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 bg-white/90 hover:bg-white text-red-600 rounded-full shadow-lg"
                      title="Delete Project"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {project.summary}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center">
                      <FiUser className="w-4 h-4 mr-1" />
                      {project.author_name || 'Unknown'}
                    </span>
                    <span className="flex items-center">
                      <FiCalendar className="w-4 h-4 mr-1" />
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="flex items-center text-yellow-500">
                        {Array.from({ length: 5 }, (_, i) => (
                          <FiStar
                            key={i}
                            size={14}
                            className={i < Math.floor(project.rating) ? 'fill-current' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-1">({project.rating})</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiEye className="w-4 h-4 mr-1" />
                      {project.views || 0}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {project.category}
                    </span>
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
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center">
                        Project
                        {sortBy === 'title' && (
                          sortOrder === 'asc' ? <FiArrowUp className="ml-1" size={14} /> : <FiArrowDown className="ml-1" size={14} />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleSort('rating')}
                    >
                      <div className="flex items-center">
                        Rating
                        {sortBy === 'rating' && (
                          sortOrder === 'asc' ? <FiArrowUp className="ml-1" size={14} /> : <FiArrowDown className="ml-1" size={14} />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Badge
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleSort('views')}
                    >
                      <div className="flex items-center">
                        Views
                        {sortBy === 'views' && (
                          sortOrder === 'asc' ? <FiArrowUp className="ml-1" size={14} /> : <FiArrowDown className="ml-1" size={14} />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {displayProjects.map(project => (
                    <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProjects.includes(project.id)}
                          onChange={() => handleSelectProject(project.id)}
                          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <img
                            src={project.image_url || 'https://placehold.co/60x40'}
                            alt={project.title}
                            className="w-16 h-12 object-cover rounded mr-4"
                            onError={(e) => e.target.src = 'https://placehold.co/60x40'}
                          />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white line-clamp-1">{project.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{project.summary}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        {project.author_name || 'Unknown'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        {project.category || 'Uncategorized'}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="flex items-center text-yellow-500 mr-2">
                            {Array.from({ length: 5 }, (_, i) => (
                              <FiStar
                                key={i}
                                size={12}
                                className={i < Math.floor(project.rating) ? 'fill-current' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">({project.rating})</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(project.badge)}`}>
                          {project.badge}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        {project.views || 0}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => window.open(project.pdf_url || '#', '_blank')}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded"
                            title="View PDF"
                          >
                            <FiEye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(project)}
                            className="text-green-600 hover:text-green-800 p-1 rounded"
                            title="Edit Project"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded"
                            title="Delete Project"
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
              Showing {((page - 1) * PAGE_SIZE) + 1} to {Math.min(page * PAGE_SIZE, projects.length)} of {projects.length} projects
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
      {editProject && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Project</h2>
                <button
                  onClick={() => setEditProject(null)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Project title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Author Name
                    </label>
                    <input
                      type="text"
                      name="author_name"
                      placeholder="Author name"
                      value={formData.author_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Badge
                      </label>
                      <select
                        name="badge"
                        value={formData.badge}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                      >
                        <option value="new">New</option>
                        <option value="top-rated">Top Rated</option>
                        <option value="featured">Featured</option>
                        <option value="trending">Trending</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rating
                      </label>
                      <input
                        type="number"
                        name="rating"
                        min="0"
                        max="5"
                        step="0.1"
                        value={formData.rating}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Views
                      </label>
                      <input
                        type="number"
                        name="views"
                        min="0"
                        value={formData.views}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        name="category"
                        placeholder="Project category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                      />
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
                      Estimated Time
                    </label>
                    <input
                      type="text"
                      name="estimated_time"
                      placeholder="e.g., 6 months"
                      value={formData.estimated_time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                    />
                  </div>

                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Featured Project</span>
                    </label>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Summary
                    </label>
                    <textarea
                      name="summary"
                      placeholder="Brief summary of the project"
                      value={formData.summary}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Description
                    </label>
                    <textarea
                      name="full_description"
                      placeholder="Detailed description of the project"
                      value={formData.full_description}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags (JSON format)
                    </label>
                    <textarea
                      name="tags"
                      placeholder='["research", "innovation", "technology"]'
                      value={formData.tags}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Project Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'image')}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <FiImage className="mx-auto text-gray-400 mb-2" size={32} />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Click to upload project image
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
                        Project PDF
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleFileChange(e, 'pdf')}
                          className="hidden"
                          id="pdf-upload"
                        />
                        <label htmlFor="pdf-upload" className="cursor-pointer">
                          <FiFileText className="mx-auto text-gray-400 mb-2" size={32} />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Click to upload project PDF
                          </p>
                          {files.pdf && (
                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                              {files.pdf.name}
                            </p>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setEditProject(null)}
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
    </div>
  );
};

export default AdminProjects;
