import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPlus, FiEye, FiEdit, FiTrash2, FiX } from 'react-icons/fi';

const PAGE_SIZE = 5;
const API_URL = 'http://127.0.0.1:8000/api/adminbooks/';
const CATS_URL = 'http://127.0.0.1:8000/api/categories/';

const AdminBooks = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [displayBooks, setDisplayBooks] = useState([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [editBook, setEditBook] = useState(null);
  const [editData, setEditData] = useState({
    title: '',
    author: '',
    category_id: '',
    sub_category_id: '',
    description: '',
    book_type: 'both',
  });
  const [editFiles, setEditFiles] = useState({ cover: null, pdf: null });

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_URL);
      setAllBooks(data || []);
    } catch (err) {
      console.error('Failed to fetch books', err);
      alert('Could not load books');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(CATS_URL);
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to fetch categories', err);
      alert('Could not load categories');
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = allBooks.filter(book =>
      book.title.toLowerCase().includes(filter.toLowerCase()) ||
      book.author.toLowerCase().includes(filter.toLowerCase())
    );
    const start = (page - 1) * PAGE_SIZE;
    setDisplayBooks(filtered.slice(start, start + PAGE_SIZE));
  }, [filter, page, allBooks]);

  const totalPages = Math.ceil(
    allBooks.filter(book =>
      book.title.toLowerCase().includes(filter.toLowerCase()) ||
      book.author.toLowerCase().includes(filter.toLowerCase())
    ).length / PAGE_SIZE
  );

  const handleDelete = async id => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await axios.delete(`${API_URL}${id}/`);
      fetchBooks();
    } catch (err) {
      console.error('Delete failed', err);
      alert('Delete failed');
    }
  };

  const handleEditClick = book => {
    setEditBook(book);
    setEditData({
      title: book.title,
      author: book.author,
      category_id: book.category_id || '',
      sub_category_id: book.sub_category_id || '',
      description: book.description || '',
      book_type: book.book_type || 'both',
    });
    setEditFiles({ cover: null, pdf: null });

    const cat = categories.find(c => c.id === book.category_id);
    setSubcategories(cat?.subcategories || []);
  };

  const handleEditSave = async () => {
    try {
      const fd = new FormData();
      Object.entries(editData).forEach(([k, v]) => fd.append(k, v));
      if (editFiles.cover) fd.append('cover_image', editFiles.cover);
      if (editFiles.pdf) fd.append('pdf_file', editFiles.pdf);

      await axios.put(`${API_URL}${editBook.id}/`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setEditBook(null);
      fetchBooks();
    } catch (err) {
      console.error('Update failed', err);
      alert('Update failed');
    }
  };

  const handleFileChange = (e, type) => {
    setEditFiles(prev => ({ ...prev, [type]: e.target.files[0] }));
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-gray-800 dark:text-white font-bold">Manage Books</h1>
        <button
          onClick={() => window.location = '/admin/books/upload'}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          <FiPlus className="mr-2" /> Upload Book
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by title or author..."
        value={filter}
        onChange={e => { setFilter(e.target.value); setPage(1); }}
        className="mb-4 w-full max-w-md px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
      />

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-xs uppercase">
            <tr>
              <th className="px-3 py-2">Cover</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Author</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Subcategory</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <tr><td colSpan="7" className="text-center py-6">Loading...</td></tr>
              : displayBooks.length > 0
                ? displayBooks.map(book => (
                    <tr key={book.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="p-2">
                        <img
                          src={book.cover_image_url}
                          alt={book.title}
                          className="w-10 h-14 object-cover rounded"
                          onError={e => e.target.src = 'https://placehold.co/50x70'}
                        />
                      </td>
                      <td className="p-2">{book.title}</td>
                      <td className="p-2">{book.author}</td>
                      <td className="p-2">{book.category_name || '—'}</td>
                      <td className="p-2">{book.sub_category_name || '—'}</td>
                      <td className="p-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          book.book_type === 'hard' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          book.book_type === 'soft' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        }`}>
                          {book.book_type === 'both' ? '📚 Both' : 
                           book.book_type === 'hard' ? '📦 Hard' : '📄 Soft'}
                        </span>
                      </td>
                      <td className="p-2 flex space-x-2 text-lg">
                        <button
                          onClick={() => window.open(`http://127.0.0.1:8000${book.pdf_url}`, '_blank')}
                          className="text-blue-600 hover:text-blue-800"
                        ><FiEye /></button>
                        <button
                          onClick={() => handleEditClick(book)}
                          className="text-green-600 hover:text-green-800"
                        ><FiEdit /></button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="text-red-600 hover:text-red-800"
                        ><FiTrash2 /></button>
                      </td>
                    </tr>
                  ))
                : <tr><td colSpan="7" className="text-center py-6">No books found.</td></tr>
            }
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>
          <div className="space-x-2">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page <= 1}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded disabled:opacity-50"
            >Prev</button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded disabled:opacity-50"
            >Next</button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editBook && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl p-6 rounded-lg shadow-xl relative">
            <button
              onClick={() => setEditBook(null)}
              className="absolute top-4 right-4 text-gray-700 dark:text-white"
            ><FiX size={20} /></button>
            <h2 className="text-xl text-gray-800 dark:text-white mb-4">Edit Book</h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={editData.title}
                onChange={e => setEditData({ ...editData, title: e.target.value })}
                className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="Author"
                value={editData.author}
                onChange={e => setEditData({ ...editData, author: e.target.value })}
                className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              />

              <label className="text-sm text-gray-700 dark:text-white">
                Category:
                <select
                  value={editData.category_id}
                  onChange={e => {
                    const cid = +e.target.value;
                    const cat = categories.find(c => c.id === cid);
                    setEditData({ ...editData, category_id: cid, sub_category_id: '' });
                    setSubcategories(cat?.subcategories || []);
                  }}
                  className="mt-1 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white w-full"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-gray-700 dark:text-white">
                Subcategory:
                <select
                  value={editData.sub_category_id}
                  onChange={e => setEditData({ ...editData, sub_category_id: +e.target.value })}
                  className="mt-1 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white w-full"
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map(sc => (
                    <option key={sc.id} value={sc.id}>{sc.name}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-gray-700 dark:text-white">
                Book Type:
                <select
                  value={editData.book_type}
                  onChange={e => setEditData({ ...editData, book_type: e.target.value })}
                  className="mt-1 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white w-full"
                >
                  <option value="both">📚 Both (Hard & Soft)</option>
                  <option value="hard">📦 Hard Cover Only</option>
                  <option value="soft">📄 Soft Cover Only</option>
                </select>
              </label>

              <div>
                <label className="text-sm text-gray-700 dark:text-white">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleFileChange(e, 'cover')}
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 dark:text-white">PDF File</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={e => handleFileChange(e, 'pdf')}
                />
              </div>

              <textarea
                placeholder="Description"
                value={editData.description}
                onChange={e => setEditData({ ...editData, description: e.target.value })}
                className="col-span-2 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                rows={3}
              />
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setEditBook(null)}
                className="px-4 py-2 bg-gray-400 dark:bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBooks;
