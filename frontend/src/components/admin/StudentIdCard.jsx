import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeaders, clearAuthData } from '../../utils/authUtils';
import {
  FiBook,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiFolder,
  FiSearch,
  FiFilter,
  FiEye,
  FiUsers,
  FiFileText,
  FiBarChart2,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiMoreVertical
} from 'react-icons/fi';

const API_URL = 'http://127.0.0.1:8000/api';

const SubjectCategoryManagement = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  // Categories state
  const [categories, setCategories] = useState([]);
  const [displayCategories, setDisplayCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Subjects state
  const [subjects, setSubjects] = useState([]);
  const [displaySubjects, setDisplaySubjects] = useState([]);
  const [subjectSearchTerm, setSubjectSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modals
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form data
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    is_active: true
  });

  const [subjectForm, setSubjectForm] = useState({
    name: '',
    description: '',
    QCategory: '',
    is_active: true
  });

  // Statistics
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalSubjects: 0,
    activeCategories: 0,
    activeSubjects: 0,
    averageSubjectsPerCategory: 0,
    mostPopularCategory: '',
    leastUsedCategory: ''
  });

  useEffect(() => {
    fetchCategories();
    fetchSubjects();
    fetchStatistics();
  }, []);

  useEffect(() => {
    filterAndSortCategories();
  }, [categories, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    filterAndSortSubjects();
  }, [subjects, subjectSearchTerm, selectedCategory]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_URL}/qcategories/`, { headers });

      if (response.data.results) {
        setCategories(response.data.results);
      } else {
        setCategories(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      if (error.response && error.response.status === 401) {
        clearAuthData();
        window.location.href = '/login';
        return;
      }
      setCategories([]);
      setMessage({ type: 'error', content: 'Failed to load categories from server' });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_URL}/subjects/`, { headers });

      if (response.data.results) {
        setSubjects(response.data.results);
      } else {
        setSubjects(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      if (error.response && error.response.status === 401) {
        clearAuthData();
        window.location.href = '/login';
        return;
      }
      setSubjects([]);
      setMessage({ type: 'error', content: 'Failed to load subjects from server' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      // Calculate statistics from real data
      setStats({
        totalCategories: categories.length,
        totalSubjects: subjects.length,
        activeCategories: categories.filter(c => c.is_active !== false).length, // Default to active if not specified
        activeSubjects: subjects.filter(s => s.is_active !== false).length, // Default to active if not specified
        averageSubjectsPerCategory: categories.length > 0 ? (subjects.length / categories.length).toFixed(1) : 0,
        mostPopularCategory: categories.length > 0 ? categories[0].name : 'N/A',
        leastUsedCategory: categories.length > 0 ? categories[categories.length - 1].name : 'N/A'
      });
    } catch (error) {
      console.error('Failed to calculate statistics:', error);
      setStats({
        totalCategories: 0,
        totalSubjects: 0,
        activeCategories: 0,
        activeSubjects: 0,
        averageSubjectsPerCategory: 0,
        mostPopularCategory: 'N/A',
        leastUsedCategory: 'N/A'
      });
    }
  };


  const filterAndSortCategories = () => {
    let filtered = [...categories];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setDisplayCategories(filtered);
  };

  const filterAndSortSubjects = () => {
    let filtered = [...subjects];

    // Apply search filter
    if (subjectSearchTerm) {
      filtered = filtered.filter(subject =>
        subject.name.toLowerCase().includes(subjectSearchTerm.toLowerCase()) ||
        subject.description?.toLowerCase().includes(subjectSearchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(subject => subject.QCategory.toString() === selectedCategory);
    }

    setDisplaySubjects(filtered);
  };

  const handleCreateCategory = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${API_URL}/qcategories/`, categoryForm, { headers });

      showMessage('success', 'Category created successfully');
      setShowCategoryModal(false);
      resetCategoryForm();
      fetchCategories();
    } catch (error) {
      console.error('Failed to create category:', error);
      if (error.response && error.response.status === 401) {
        clearAuthData();
        window.location.href = '/login';
        return;
      }
      showMessage('error', 'Failed to create category');
    }
  };

  const handleUpdateCategory = async () => {
    try {
      const headers = await getAuthHeaders();
      await axios.put(`${API_URL}/qcategories/${editingCategory.id}/`, categoryForm, { headers });

      showMessage('success', 'Category updated successfully');
      setShowCategoryModal(false);
      setEditingCategory(null);
      resetCategoryForm();
      fetchCategories();
    } catch (error) {
      console.error('Failed to update category:', error);
      if (error.response && error.response.status === 401) {
        clearAuthData();
        window.location.href = '/login';
        return;
      }
      showMessage('error', 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This will also delete all associated subjects.')) return;

    try {
      const headers = await getAuthHeaders();
      await axios.delete(`${API_URL}/qcategories/${categoryId}/`, { headers });

      showMessage('success', 'Category deleted successfully');
      fetchCategories();
      fetchSubjects();
    } catch (error) {
      console.error('Failed to delete category:', error);
      if (error.response && error.response.status === 401) {
        clearAuthData();
        window.location.href = '/login';
        return;
      }
      showMessage('error', 'Failed to delete category');
    }
  };

  const handleCreateSubject = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${API_URL}/subjects/`, {
        ...subjectForm,
        QCategory: parseInt(subjectForm.QCategory)
      }, { headers });

      showMessage('success', 'Subject created successfully');
      setShowSubjectModal(false);
      resetSubjectForm();
      fetchSubjects();
    } catch (error) {
      console.error('Failed to create subject:', error);
      if (error.response && error.response.status === 401) {
        clearAuthData();
        window.location.href = '/login';
        return;
      }
      showMessage('error', 'Failed to create subject');
    }
  };

  const handleUpdateSubject = async () => {
    try {
      const headers = await getAuthHeaders();
      await axios.put(`${API_URL}/subjects/${editingSubject.id}/`, {
        ...subjectForm,
        QCategory: parseInt(subjectForm.QCategory)
      }, { headers });

      showMessage('success', 'Subject updated successfully');
      setShowSubjectModal(false);
      setEditingSubject(null);
      resetSubjectForm();
      fetchSubjects();
    } catch (error) {
      console.error('Failed to update subject:', error);
      if (error.response && error.response.status === 401) {
        clearAuthData();
        window.location.href = '/login';
        return;
      }
      showMessage('error', 'Failed to update subject');
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;

    try {
      const headers = await getAuthHeaders();
      await axios.delete(`${API_URL}/subjects/${subjectId}/`, { headers });

      showMessage('success', 'Subject deleted successfully');
      fetchSubjects();
    } catch (error) {
      console.error('Failed to delete subject:', error);
      if (error.response && error.response.status === 401) {
        clearAuthData();
        window.location.href = '/login';
        return;
      }
      showMessage('error', 'Failed to delete subject');
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      is_active: true
    });
  };

  const resetSubjectForm = () => {
    setSubjectForm({
      name: '',
      description: '',
      QCategory: '',
      is_active: true
    });
  };

  const showMessage = (type, content) => {
    setMessage({ type, content });
    setTimeout(() => setMessage({ type: '', content: '' }), 5000);
  };

  const openCategoryModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name || '',
        description: category.description || '',
        is_active: category.is_active
      });
    } else {
      setEditingCategory(null);
      resetCategoryForm();
    }
    setShowCategoryModal(true);
  };

  const openSubjectModal = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);
      setSubjectForm({
        name: subject.name || '',
        description: subject.description || '',
        QCategory: subject.QCategory?.toString() || '',
        is_active: subject.is_active
      });
    } else {
      setEditingSubject(null);
      resetSubjectForm();
    }
    setShowSubjectModal(true);
  };

  const openDetailModal = (item, type) => {
    setSelectedItem({ ...item, type });
    setShowDetailModal(true);
  };

  const getSubjectsForCategory = (categoryId) => {
    return subjects.filter(subject => subject.QCategory?.toString() === categoryId?.toString());
  };

  const getCategoryById = (id) => {
    return categories.find(category => category.id === id);
  };

  const tabs = [
    { id: 'categories', name: 'Categories', icon: FiFolder },
    { id: 'subjects', name: 'Subjects', icon: FiBook },
    { id: 'analytics', name: 'Analytics', icon: FiBarChart2 }
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen overflow-x-auto">
      <div className="max-w-7xl mx-auto min-w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Subject & Category Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Organize and manage educational categories and subjects
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button
              onClick={() => {
                fetchCategories();
                fetchSubjects();
                fetchStatistics();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiRefreshCw className="mr-2 h-4 w-4 inline" />
              Refresh
            </button>
          </div>
        </div>

        {/* Message */}
        {message.content && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {message.type === 'success' ? <FiCheckCircle className="mr-2" /> : <FiAlertCircle className="mr-2" />}
            {message.content}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <FiFolder className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Categories</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalCategories}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                <FiBook className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Subjects</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalSubjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                <FiBarChart2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Subjects/Category</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.averageSubjectsPerCategory}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                <FiUsers className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Categories</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.activeCategories}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="mr-2 h-4 w-4 inline" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {/* Categories Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="name">Name</option>
                  <option value="created_at">Created Date</option>
                  <option value="enrolled">Enrollment</option>
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>

              <button
                onClick={() => openCategoryModal()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="mr-2 h-4 w-4 inline" />
                Add Category
              </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <FiRefreshCw className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">Loading categories...</p>
                </div>
              ) : displayCategories.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <FiFolder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">No categories found</p>
                </div>
              ) : (
                displayCategories.map((category) => (
                  <div key={category.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                          <FiFolder className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                          <div className="flex items-center mt-1">
                            {category.is_active ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                <FiCheckCircle className="mr-1 h-3 w-3" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                <FiXCircle className="mr-1 h-3 w-3" />
                                Inactive
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <FiMoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {category.description || 'No description available'}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {getSubjectsForCategory(category.id).length}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Subjects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {category.enrolled || 0}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Enrolled</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => openDetailModal(category, 'category')}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                      >
                        <FiEye className="mr-1 h-4 w-4 inline" />
                        View Details
                      </button>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openCategoryModal(category)}
                          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Subjects Tab */}
        {activeTab === 'subjects' && (
          <div className="space-y-6">
            {/* Subjects Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search subjects..."
                    value={subjectSearchTerm}
                    onChange={(e) => setSubjectSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => openSubjectModal()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="mr-2 h-4 w-4 inline" />
                Add Subject
              </button>
            </div>

            {/* Subjects Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Questions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="flex items-center justify-center">
                            <FiRefreshCw className="animate-spin h-5 w-5 text-blue-600 mr-2" />
                            Loading subjects...
                          </div>
                        </td>
                      </tr>
                    ) : displaySubjects.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                          No subjects found
                        </td>
                      </tr>
                    ) : (
                      displaySubjects.map((subject) => (
                        <tr key={subject.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                                <FiBook className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {subject.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {subject.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {getCategoryById(subject.QCategory)?.name || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {subject.questions_count || 0}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              subject.is_active
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {subject.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => openDetailModal(subject, 'subject')}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                title="View Details"
                              >
                                <FiEye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openSubjectModal(subject)}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                title="Edit Subject"
                              >
                                <FiEdit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteSubject(subject.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                title="Delete Subject"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Distribution</h3>
                <div className="space-y-4">
                  {categories.slice(0, 5).map((category) => {
                    const subjectCount = getSubjectsForCategory(category.id).length;
                    const percentage = stats.totalSubjects > 0 ? (subjectCount / stats.totalSubjects * 100) : 0;
                    
                    return (
                      <div key={category.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                          <span className="text-gray-600 dark:text-gray-400">{subjectCount} subjects ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Performing Categories */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Categories</h3>
                <div className="space-y-4">
                  {categories
                    .sort((a, b) => (b.enrolled || 0) - (a.enrolled || 0))
                    .slice(0, 5)
                    .map((category, index) => (
                      <div key={category.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' : 
                            index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {category.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {getSubjectsForCategory(category.id).length} subjects
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {category.enrolled || 0} enrolled
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCategoryModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {editingCategory ? 'Edit Category' : 'Create Category'}
                </h3>
              </div>
              
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={categoryForm.is_active}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Active</span>
                </label>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowSubjectModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {editingSubject ? 'Edit Subject' : 'Create Subject'}
                </h3>
              </div>
              
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={subjectForm.name}
                    onChange={(e) => setSubjectForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    value={subjectForm.description}
                    onChange={(e) => setSubjectForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={subjectForm.QCategory}
                    onChange={(e) => setSubjectForm(prev => ({ ...prev, QCategory: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={subjectForm.is_active}
                    onChange={(e) => setSubjectForm(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Active</span>
                </label>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
                <button
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={editingSubject ? handleUpdateSubject : handleCreateSubject}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {editingSubject ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectCategoryManagement;