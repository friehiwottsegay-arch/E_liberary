import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit, FiSave, FiX, FiTrash2, FiUpload } from 'react-icons/fi';

const API_BASE = 'http://127.0.0.1:8000/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('about');
  
  // AboutUs state
  const [about, setAbout] = useState(null);
  const [aboutForm, setAboutForm] = useState(null);
  const [aboutEditing, setAboutEditing] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  // Testimonials state
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialForm, setTestimonialForm] = useState({ name: '', quote: '', role: '' });
  const [testimonialEditingId, setTestimonialEditingId] = useState(null);

  // TeamMembers state
  const [team, setTeam] = useState([]);
  const [teamForm, setTeamForm] = useState({ name: '', role: '', bio: '' });
  const [teamPhotoFile, setTeamPhotoFile] = useState(null);
  const [teamEditingId, setTeamEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data on mount and tab change
  useEffect(() => {
    setError(null);
    if (activeTab === 'about') {
      fetchAbout();
    } else if (activeTab === 'testimonials') {
      fetchTestimonials();
    } else if (activeTab === 'team') {
      fetchTeam();
    }
  }, [activeTab]);

  // Helper function to upload files
  const uploadFile = async (file, endpoint) => {
    if (!file) return null;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(`${API_BASE}/${endpoint}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  // Fetch AboutUs
  const fetchAbout = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/aboutus/`);
      if (res.data.length > 0) {
        setAbout(res.data[0]);
        setAboutForm(res.data[0]);
      } else {
        setAbout(null);
        setAboutForm(null);
      }
    } catch (e) {
      setError('Failed to fetch About Us data.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch testimonials
  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/testimonials/`);
      setTestimonials(res.data);
    } catch {
      setError('Failed to fetch testimonials.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch team members
  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/team-members/`);
      setTeam(res.data);
    } catch {
      setError('Failed to fetch team members.');
    } finally {
      setLoading(false);
    }
  };

  // Handle AboutUs form changes
  const handleAboutChange = (e) => {
    const { name, value } = e.target;
    setAboutForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle logo file change
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setError('Please select an image file for the logo.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('Logo file size should be less than 2MB.');
        return;
      }
      setLogoFile(file);
    }
  };

  // Handle banner file change
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setError('Please select an image file for the banner.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Banner file size should be less than 5MB.');
        return;
      }
      setBannerFile(file);
    }
  };

  // Save or create AboutUs
  const saveAbout = async () => {
    setLoading(true);
    setError(null);
    try {
      let logoUrl = aboutForm?.logo || '';
      let bannerUrl = aboutForm?.image || '';
      
      if (logoFile) {
        logoUrl = await uploadFile(logoFile, 'upload-logo');
        if (!logoUrl) throw new Error('Failed to upload logo');
      }
      
      if (bannerFile) {
        bannerUrl = await uploadFile(bannerFile, 'upload-banner');
        if (!bannerUrl) throw new Error('Failed to upload banner');
      }
      
      const formData = {
        ...aboutForm,
        logo: logoUrl,
        image: bannerUrl
      };

      if (about) {
        await axios.put(`${API_BASE}/aboutus/${about.id}/`, formData);
      } else {
        await axios.post(`${API_BASE}/aboutus/`, formData);
      }
      
      setAboutEditing(false);
      setLogoFile(null);
      setBannerFile(null);
      fetchAbout();
    } catch (e) {
      setError(e.message || 'Failed to save About Us data.');
    } finally {
      setLoading(false);
    }
  };

  // Handle testimonial form changes
  const handleTestimonialChange = (e) => {
    const { name, value } = e.target;
    setTestimonialForm(prev => ({ ...prev, [name]: value }));
  };

  // Add or update testimonial
  const saveTestimonial = async () => {
    setLoading(true);
    setError(null);
    try {
      if (testimonialEditingId) {
        await axios.put(`${API_BASE}/testimonials/${testimonialEditingId}/`, testimonialForm);
      } else {
        await axios.post(`${API_BASE}/testimonials/`, testimonialForm);
      }
      setTestimonialForm({ name: '', quote: '', role: '' });
      setTestimonialEditingId(null);
      fetchTestimonials();
    } catch {
      setError('Failed to save testimonial.');
    } finally {
      setLoading(false);
    }
  };

  // Edit testimonial
  const editTestimonial = (item) => {
    setTestimonialForm({ name: item.name, quote: item.quote, role: item.role });
    setTestimonialEditingId(item.id);
  };

  // Cancel testimonial editing
  const cancelTestimonialEdit = () => {
    setTestimonialForm({ name: '', quote: '', role: '' });
    setTestimonialEditingId(null);
  };

  // Delete testimonial
  const deleteTestimonial = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE}/testimonials/${id}/`);
      fetchTestimonials();
    } catch {
      setError('Failed to delete testimonial.');
    } finally {
      setLoading(false);
    }
  };

  // Handle team form changes
  const handleTeamChange = (e) => {
    const { name, value } = e.target;
    setTeamForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle team photo change
  const handleTeamPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setError('Please select an image file for the team member photo.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('Team photo file size should be less than 2MB.');
        return;
      }
      setTeamPhotoFile(file);
    }
  };

  // Add or update team member
  const saveTeamMember = async () => {
    setLoading(true);
    setError(null);
    try {
      let photoUrl = teamForm?.photo || '';
      
      if (teamPhotoFile) {
        photoUrl = await uploadFile(teamPhotoFile, 'upload-team-photo');
        if (!photoUrl) throw new Error('Failed to upload team photo');
      }
      
      const formData = {
        ...teamForm,
        photo: photoUrl
      };

      if (teamEditingId) {
        await axios.put(`${API_BASE}/team-members/${teamEditingId}/`, formData);
      } else {
        await axios.post(`${API_BASE}/team-members/`, formData);
      }
      
      setTeamForm({ name: '', role: '', bio: '' });
      setTeamPhotoFile(null);
      setTeamEditingId(null);
      fetchTeam();
    } catch (e) {
      setError(e.message || 'Failed to save team member.');
    } finally {
      setLoading(false);
    }
  };

  // Edit team member
  const editTeamMember = (item) => {
    setTeamForm({ name: item.name, role: item.role, bio: item.bio });
    setTeamEditingId(item.id);
  };

  // Cancel team editing
  const cancelTeamEdit = () => {
    setTeamForm({ name: '', role: '', bio: '' });
    setTeamPhotoFile(null);
    setTeamEditingId(null);
  };

  // Delete team member
  const deleteTeamMember = async (id) => {
    if (!window.confirm('Delete this team member?')) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE}/team-members/${id}/`);
      fetchTeam();
    } catch {
      setError('Failed to delete team member.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Admin Panel</h1>

      <nav className="mb-8 flex space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {['about', 'testimonials', 'team'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 text-center font-medium rounded-md transition-all ${
              activeTab === tab
                ? 'bg-white dark:bg-gray-800 shadow text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            {tab === 'about' ? 'About Us' : tab === 'testimonials' ? 'Testimonials' : 'Team Members'}
          </button>
        ))}
      </nav>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg flex items-center">
          <FiX className="mr-2 cursor-pointer" onClick={() => setError(null)} />
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* About Us Section */}
      {activeTab === 'about' && (
        <div>
          {!aboutEditing ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">About Us</h2>
                <button
                  onClick={() => setAboutEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <FiEdit className="mr-2" /> {about ? 'Edit' : 'Create About Us'}
                </button>
              </div>

              {about ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block font-medium text-gray-700 dark:text-gray-300">Name</label>
                      <p className="mt-1">{about.name}</p>
                    </div>
                    {about.logo && (
                      <div>
                        <label className="block font-medium text-gray-700 dark:text-gray-300">Logo</label>
                        <img src={about.logo} alt="Logo" className="h-16 mt-1" />
                      </div>
                    )}
                    {about.image && (
                      <div>
                        <label className="block font-medium text-gray-700 dark:text-gray-300">Banner</label>
                        <img src={about.image} alt="Banner" className="w-full h-48 object-cover rounded-lg mt-1" />
                      </div>
                    )}
                    <div>
                      <label className="block font-medium text-gray-700 dark:text-gray-300">Website</label>
                      <p className="mt-1">{about.website}</p>
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 dark:text-gray-300">Email</label>
                      <p className="mt-1">{about.email}</p>
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 dark:text-gray-300">Phone</label>
                      <p className="mt-1">{about.phone}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block font-medium text-gray-700 dark:text-gray-300">Address</label>
                      <p className="mt-1">{about.address}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium text-gray-700 dark:text-gray-300">Region</label>
                        <p className="mt-1">{about.region}</p>
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 dark:text-gray-300">City</label>
                        <p className="mt-1">{about.city}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 dark:text-gray-300">Title</label>
                      <p className="mt-1">{about.title}</p>
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 dark:text-gray-300">Subtitle</label>
                      <p className="mt-1">{about.subtitle}</p>
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 dark:text-gray-300">Mission</label>
                      <p className="mt-1">{about.mission}</p>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className="block font-medium text-gray-700 dark:text-gray-300">Why Choose Us</label>
                      <p className="mt-1">{about.why_choose_us}</p>
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 dark:text-gray-300">Description</label>
                      <p className="mt-1">{about.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-medium text-gray-700 dark:text-gray-300">Services</label>
                        <p className="mt-1">{about.services}</p>
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 dark:text-gray-300">Recognition</label>
                        <p className="mt-1">{about.recognition}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 dark:text-gray-300">Established Year</label>
                      <p className="mt-1">{about.established_year}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">No About Us data found.</p>
                  <button
                    onClick={() => setAboutEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
                  >
                    <FiPlus className="mr-2" /> Create About Us
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault();
                saveAbout();
              }}
              className="space-y-6"
            >
              {aboutForm && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Name*
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={aboutForm.name || ''}
                          onChange={handleAboutChange}
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Logo
                        </label>
                        <div className="flex items-center">
                          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center transition-colors">
                            <FiUpload className="mr-2" />
                            {logoFile ? logoFile.name : 'Upload Logo'}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoChange}
                              className="hidden"
                            />
                          </label>
                          {logoFile && (
                            <button
                              type="button"
                              onClick={() => setLogoFile(null)}
                              className="ml-2 text-red-600 hover:text-red-800"
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                        {aboutForm.logo && !logoFile && (
                          <div className="mt-2">
                            <p className="text-sm mb-1">Current logo:</p>
                            <img 
                              src={aboutForm.logo} 
                              alt="Current logo" 
                              className="h-16 object-contain" 
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Banner Image
                        </label>
                        <div className="flex items-center">
                          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center transition-colors">
                            <FiUpload className="mr-2" />
                            {bannerFile ? bannerFile.name : 'Upload Banner'}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleBannerChange}
                              className="hidden"
                            />
                          </label>
                          {bannerFile && (
                            <button
                              type="button"
                              onClick={() => setBannerFile(null)}
                              className="ml-2 text-red-600 hover:text-red-800"
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                        {aboutForm.image && !bannerFile && (
                          <div className="mt-2">
                            <p className="text-sm mb-1">Current banner:</p>
                            <img 
                              src={aboutForm.image} 
                              alt="Current banner" 
                              className="h-32 w-full object-cover rounded-lg" 
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Website
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={aboutForm.website || ''}
                          onChange={handleAboutChange}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Email*
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={aboutForm.email || ''}
                          onChange={handleAboutChange}
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Phone
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={aboutForm.phone || ''}
                          onChange={handleAboutChange}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Address*
                        </label>
                        <textarea
                          name="address"
                          value={aboutForm.address || ''}
                          onChange={handleAboutChange}
                          required
                          rows={2}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Region
                          </label>
                          <input
                            type="text"
                            name="region"
                            value={aboutForm.region || ''}
                            onChange={handleAboutChange}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                          />
                        </div>
                        <div>
                          <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={aboutForm.city || ''}
                            onChange={handleAboutChange}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={aboutForm.title || ''}
                          onChange={handleAboutChange}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Subtitle
                        </label>
                        <textarea
                          name="subtitle"
                          value={aboutForm.subtitle || ''}
                          onChange={handleAboutChange}
                          rows={2}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Mission
                        </label>
                        <textarea
                          name="mission"
                          value={aboutForm.mission || ''}
                          onChange={handleAboutChange}
                          rows={3}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Why Choose Us
                      </label>
                      <textarea
                        name="why_choose_us"
                        value={aboutForm.why_choose_us || ''}
                        onChange={handleAboutChange}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={aboutForm.description || ''}
                        onChange={handleAboutChange}
                        rows={4}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Services (comma-separated)
                        </label>
                        <textarea
                          name="services"
                          value={aboutForm.services || ''}
                          onChange={handleAboutChange}
                          rows={3}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Recognition (awards, certificates)
                        </label>
                        <textarea
                          name="recognition"
                          value={aboutForm.recognition || ''}
                          onChange={handleAboutChange}
                          rows={3}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Established Year
                      </label>
                      <input
                        type="number"
                        name="established_year"
                        value={aboutForm.established_year || ''}
                        onChange={handleAboutChange}
                        className="w-full md:w-1/3 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center transition-colors shadow-md"
                    >
                      <FiSave className="mr-2" /> Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAboutEditing(false);
                        setLogoFile(null);
                        setBannerFile(null);
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg flex items-center transition-colors"
                    >
                      <FiX className="mr-2" /> Cancel
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      )}

      {/* Testimonials Section */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Testimonials</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-700 p-5 rounded-lg shadow">
              <form onSubmit={saveTestimonial} className="space-y-4">
                <h3 className="font-medium text-lg mb-2">
                  {testimonialEditingId ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h3>
                
                <div>
                  <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={testimonialForm.name}
                    onChange={handleTestimonialChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    placeholder="Role"
                    value={testimonialForm.role}
                    onChange={handleTestimonialChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Quote*
                  </label>
                  <textarea
                    name="quote"
                    placeholder="Quote"
                    value={testimonialForm.quote}
                    onChange={handleTestimonialChange}
                    rows={4}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg flex items-center transition-colors flex-1 justify-center"
                  >
                    <FiSave className="mr-2" />
                    {testimonialEditingId ? 'Update' : 'Add'}
                  </button>
                  {testimonialEditingId && (
                    <button
                      type="button"
                      onClick={cancelTestimonialEdit}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg flex items-center transition-colors"
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="font-medium">Existing Testimonials</h3>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                  {testimonials.map(item => (
                    <li key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-white">
                            {item.name} {item.role && <span className="text-gray-600 dark:text-gray-300 font-normal">- {item.role}</span>}
                          </p>
                          <p className="italic text-gray-600 dark:text-gray-300 mt-1">"{item.quote}"</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editTestimonial(item)}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-600"
                            title="Edit"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => deleteTestimonial(item.id)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 dark:hover:bg-gray-600"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Members Section */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Team Members</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-700 p-5 rounded-lg shadow">
              <form onSubmit={saveTeamMember} className="space-y-4">
                <h3 className="font-medium text-lg mb-2">
                  {teamEditingId ? 'Edit Team Member' : 'Add New Team Member'}
                </h3>
                
                <div>
                  <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={teamForm.name}
                    onChange={handleTeamChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Role*
                  </label>
                  <input
                    type="text"
                    name="role"
                    placeholder="Role"
                    value={teamForm.role}
                    onChange={handleTeamChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    placeholder="Bio"
                    value={teamForm.bio}
                    onChange={handleTeamChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Photo
                  </label>
                  <div className="flex items-center">
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center transition-colors flex-1">
                      <FiUpload className="mr-2" />
                      {teamPhotoFile ? teamPhotoFile.name : 'Upload Photo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleTeamPhotoChange}
                        className="hidden"
                      />
                    </label>
                    {teamPhotoFile && (
                      <button
                        type="button"
                        onClick={() => setTeamPhotoFile(null)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                  {teamEditingId && team.find(m => m.id === teamEditingId)?.photo && !teamPhotoFile && (
                    <div className="mt-2">
                      <p className="text-sm mb-1">Current photo:</p>
                      <img 
                        src={team.find(m => m.id === teamEditingId).photo} 
                        alt="Current team member" 
                        className="h-16 rounded-lg" 
                      />
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg flex items-center transition-colors flex-1 justify-center"
                  >
                    <FiSave className="mr-2" />
                    {teamEditingId ? 'Update' : 'Add'}
                  </button>
                  {teamEditingId && (
                    <button
                      type="button"
                      onClick={cancelTeamEdit}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg flex items-center transition-colors"
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="font-medium">Existing Team Members</h3>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                  {team.map(item => (
                    <li key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          {item.photo && (
                            <img 
                              src={item.photo} 
                              alt={item.name} 
                              className="h-16 w-16 rounded-lg object-cover border" 
                            />
                          )}
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white">{item.name}</p>
                            <p className="text-gray-600 dark:text-gray-300">{item.role}</p>
                            <p className="text-gray-700 dark:text-gray-200 mt-2">{item.bio}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editTeamMember(item)}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-600"
                            title="Edit"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => deleteTeamMember(item.id)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 dark:hover:bg-gray-600"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;