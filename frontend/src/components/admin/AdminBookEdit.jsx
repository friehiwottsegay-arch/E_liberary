import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AdminBookEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    axios.get(`/api/books/${id}/`).then(res => setForm(res.data));
  }, [id]);

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setForm({ ...form, [e.target.name]: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in form) data.append(key, form[key]);

    await axios.put(`/api/books/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    navigate('/admin/books');
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        <input type="text" name="author" value={form.author} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        <input type="text" name="subcategory" value={form.subcategory} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        <input type="file" name="cover_image" onChange={handleChange} className="w-full" />
        <input type="file" name="pdf_file" onChange={handleChange} className="w-full" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
};

export default AdminBookEdit;
