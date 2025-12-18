import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken, getUserData } from '../../utils/authUtils';

const API_URL = 'http://127.0.0.1:8000/api/project/';
const CURRENT_USER_URL = 'http://127.0.0.1:8000/api/current_user/';

const UploadProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    full_description: '',
    badge: 'new',
    date: '',
    tags: '',
    profile: '',
  });
  const [files, setFiles] = useState({ image: null, pdf: null });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch user info from stored data on component mount
  useEffect(() => {
    const token = getToken();
    const userData = getUserData();
    
    if (!token) {
      setMessage('⚠️ No token found. Please login.');
      return;
    }
    
    if (userData && userData.id) {
      setFormData(prev => ({ ...prev, profile: userData.id }));
    } else {
      setMessage('⚠️ Unable to fetch user.');
    }
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) =>
    setFiles(prev => ({ ...prev, [field]: e.target.files[0] }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = getToken();
      if (!token) {
        setMessage('⚠️ No token found. Please login again.');
        setLoading(false);
        return;
      }

      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val) data.append(key, val);
      });
      if (files.image) data.append('image', files.image);
      if (files.pdf) data.append('pdf', files.pdf);

      await axios.post(API_URL, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('✅ Project uploaded!');
      setFormData(prev => ({
        ...prev,
        title: '',
        summary: '',
        full_description: '',
        badge: 'new',
        date: '',
        tags: '',
      }));
      setFiles({ image: null, pdf: null });
    } catch (err) {
      console.error('Upload failed:', err.response?.data || err.message);
      setMessage('❌ Upload failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-md shadow-md">
      <h2 className="text-3xl mb-6 text-gray-800 dark:text-white">📤 Upload New Project</h2>
      {message && (
        <div className="mb-4 p-3 text-center bg-blue-100 dark:bg-gray-700 text-blue-800 dark:text-white">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium">Project Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
              placeholder="Project Title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Badge</label>
            <select
              name="badge"
              value={formData.badge}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
            >
              <option value="new">🆕 New</option>
              <option value="top-rated">⭐ Top Rated</option>
              <option value="featured">📌 Featured</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Tags <span className="text-xs">(comma-separated)</span>
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g., React, AI, Design"
              className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Project Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => handleFileChange(e, 'image')}
              required
              className="mt-1 block w-full text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Project PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={e => handleFileChange(e, 'pdf')}
              required
              className="mt-1 block w-full text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Summary</label>
            <textarea
              name="summary"
              rows="3"
              value={formData.summary}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Full Description</label>
            <textarea
              name="full_description"
              rows="5"
              value={formData.full_description}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
          >
            {loading ? 'Uploading...' : '📤 Publish Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadProject;
