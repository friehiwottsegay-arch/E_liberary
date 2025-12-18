import React, { useState, useEffect } from "react";
import { FaUpload, FaSave, FaTimes, FaBook, FaImage, FaFilePdf } from "react-icons/fa";
import { bookApi, fileUploadHelper } from '../../services/sellerApi';

const BookUploadModal = ({ isOpen, onClose, onSuccess, editBook = null }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    book_type: 'both',
    hard_price: '',
    soft_price: '',
    rental_price_per_week: '',
    category: '',
    subcategory: '',
    is_for_sale: true,
    is_for_rent: false,
    is_free: false,
    is_featured: false,
    is_premium: false,
    language: 'English',
    grade_level: '',
    tags: ''
  });
  
  const [files, setFiles] = useState({
    pdfFile: null,
    coverImage: null
  });

  const [filePreviews, setFilePreviews] = useState({
    coverImage: null
  });

  // Initialize form with edit data
  useEffect(() => {
    if (editBook) {
      setFormData({
        title: editBook.title || '',
        author: editBook.author || '',
        description: editBook.description || '',
        book_type: editBook.book_type || 'both',
        hard_price: editBook.hard_price || '',
        soft_price: editBook.soft_price || '',
        rental_price_per_week: editBook.rental_price_per_week || '',
        category: editBook.category?.id || '',
        subcategory: editBook.sub_category?.id || '',
        is_for_sale: editBook.is_for_sale || true,
        is_for_rent: editBook.is_for_rent || false,
        is_free: editBook.is_free || false,
        is_featured: editBook.is_featured || false,
        is_premium: editBook.is_premium || false,
        language: editBook.language || 'English',
        grade_level: editBook.grade_level || '',
        tags: editBook.tags || ''
      });
    } else {
      // Reset form for new book
      setFormData({
        title: '',
        author: '',
        description: '',
        book_type: 'both',
        hard_price: '',
        soft_price: '',
        rental_price_per_week: '',
        category: '',
        subcategory: '',
        is_for_sale: true,
        is_for_rent: false,
        is_free: false,
        is_featured: false,
        is_premium: false,
        language: 'English',
        grade_level: '',
        tags: ''
      });
    }
    setErrors({});
  }, [editBook, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    const file = fileList[0];
    
    if (file) {
      // Validate file
      const allowedTypes = name === 'pdfFile' 
        ? ['application/pdf']
        : ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
      if (!fileUploadHelper.validateFile(file, allowedTypes)) {
        setErrors(prev => ({
          ...prev,
          [name]: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`
        }));
        return;
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [name]: 'File size must be less than 10MB'
        }));
        return;
      }
      
      setFiles(prev => ({ ...prev, [name]: file }));
      
      // Create preview for images
      if (name === 'coverImage') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreviews(prev => ({ ...prev, coverImage: e.target.result }));
        };
        reader.readAsDataURL(file);
      }
      
      // Clear error
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    
    if (formData.book_type === 'hard' || formData.book_type === 'both') {
      if (!formData.hard_price || parseFloat(formData.hard_price) <= 0) {
        newErrors.hard_price = 'Valid hard copy price is required';
      }
    }
    
    if (formData.book_type === 'soft' || formData.book_type === 'both') {
      if (!formData.soft_price || parseFloat(formData.soft_price) <= 0) {
        newErrors.soft_price = 'Valid soft copy price is required';
      }
    }
    
    if (formData.is_for_rent) {
      if (!formData.rental_price_per_week || parseFloat(formData.rental_price_per_week) <= 0) {
        newErrors.rental_price_per_week = 'Valid rental price is required';
      }
    }
    
    if (!editBook) {
      // Only require files for new books
      if (!files.pdfFile) {
        newErrors.pdfFile = 'PDF file is required for new books';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const uploadData = fileUploadHelper.createBookFormData(formData, files);
      
      let result;
      if (editBook) {
        result = await bookApi.updateBook(editBook.id, uploadData);
      } else {
        result = await bookApi.uploadBook(uploadData);
      }
      
      if (result.success) {
        onSuccess(result.book);
        onClose();
      } else {
        setErrors({ general: result.error || 'Upload failed' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({ general: error.error || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <FaBook className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {editBook ? 'Edit Book' : 'Upload New Book'}
              </h2>
              <p className="text-sm text-gray-500">
                {editBook ? 'Update book information' : 'Add a new book to your inventory'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter book title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.author ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter author name"
              />
              {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter book description"
            />
          </div>

          {/* Book Type and Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Type
              </label>
              <select
                name="book_type"
                value={formData.book_type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="both">Both Hard & Soft</option>
                <option value="hard">Hard Copy Only</option>
                <option value="soft">Soft Copy Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hard Copy Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                name="hard_price"
                value={formData.hard_price}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.hard_price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
                disabled={formData.book_type === 'soft'}
              />
              {errors.hard_price && <p className="text-red-500 text-sm mt-1">{errors.hard_price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Soft Copy Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                name="soft_price"
                value={formData.soft_price}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.soft_price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
                disabled={formData.book_type === 'hard'}
              />
              {errors.soft_price && <p className="text-red-500 text-sm mt-1">{errors.soft_price}</p>}
            </div>
          </div>

          {/* Rental Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rental Price per Week ($)
              </label>
              <input
                type="number"
                step="0.01"
                name="rental_price_per_week"
                value={formData.rental_price_per_week}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.rental_price_per_week ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.rental_price_per_week && <p className="text-red-500 text-sm mt-1">{errors.rental_price_per_week}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF File {!editBook && '*'}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FaFilePdf className="mx-auto text-red-500 text-3xl mb-2" />
                <input
                  type="file"
                  name="pdfFile"
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium"
                >
                  Click to upload PDF
                </label>
                {files.pdfFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    {files.pdfFile.name} ({fileUploadHelper.getFileSize(files.pdfFile)} MB)
                  </p>
                )}
              </div>
              {errors.pdfFile && <p className="text-red-500 text-sm mt-1">{errors.pdfFile}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {filePreviews.coverImage ? (
                  <img
                    src={filePreviews.coverImage}
                    alt="Cover preview"
                    className="w-24 h-32 object-cover rounded mx-auto mb-2"
                  />
                ) : (
                  <FaImage className="mx-auto text-gray-400 text-3xl mb-2" />
                )}
                <input
                  type="file"
                  name="coverImage"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="cover-upload"
                />
                <label
                  htmlFor="cover-upload"
                  className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium"
                >
                  {filePreviews.coverImage ? 'Change Image' : 'Click to upload'}
                </label>
                {files.coverImage && (
                  <p className="text-sm text-gray-600 mt-2">
                    {files.coverImage.name} ({fileUploadHelper.getFileSize(files.coverImage)} MB)
                  </p>
                )}
              </div>
              {errors.coverImage && <p className="text-red-500 text-sm mt-1">{errors.coverImage}</p>}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_for_sale"
                checked={formData.is_for_sale}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">For Sale</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_for_rent"
                checked={formData.is_for_rent}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">For Rent</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_free"
                checked={formData.is_free}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">Free</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">Featured</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <FaSave />
              )}
              <span>{editBook ? 'Update Book' : 'Upload Book'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookUploadModal;