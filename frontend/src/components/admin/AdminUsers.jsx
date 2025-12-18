import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // for redirect

const PAGE_SIZE = 5;
const USERS_URL = 'http://127.0.0.1:8000/api/users/'; // change your API url

const AdminUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [editUser, setEditUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone_number: '',
    role: '',
    password: '',
  });

  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(USERS_URL);
      setAllUsers(data || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
      alert('Could not load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = allUsers.filter(u =>
      u.username.toLowerCase().includes(filter.toLowerCase()) ||
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(filter.toLowerCase())
    );
    const start = (page - 1) * PAGE_SIZE;
    setDisplayUsers(filtered.slice(start, start + PAGE_SIZE));
  }, [filter, page, allUsers]);

  const totalPages = Math.ceil(
    allUsers.filter(u =>
      u.username.toLowerCase().includes(filter.toLowerCase()) ||
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(filter.toLowerCase())
    ).length / PAGE_SIZE
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`${USERS_URL}${id}/`);
      fetchUsers();
    } catch (err) {
      console.error('Delete failed', err);
      alert('Delete failed');
    }
  };

  const openForm = (user = null) => {
    if (user) {
      setEditUser(user);
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        username: user.username || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        role: user.role || '',
        password: '',
      });
      setShowForm(true);
    } else {
      setEditUser(null);
      setFormData({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        phone_number: '',
        role: '',
        password: '',
      });
      setShowForm(false);
    }
  };

  const handleFormSubmit = async () => {
    // For edit user only since Add User redirects away
    if (!formData.first_name || !formData.last_name || !formData.username || !formData.email || !formData.role) {
      alert('Please fill all required fields');
      return;
    }
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      await axios.put(`${USERS_URL}${editUser.id}/`, payload);
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      console.error('Save failed', err);
      alert('Save failed');
    }
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-gray-800 dark:text-white font-bold">Manage Users</h1>
        <button
        onClick={() => (window.location = 'users/create-account')}
          className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          {/* Removed FiPlus icon here, add if you want */}
          Add User
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by username or name..."
        value={filter}
        onChange={e => { setFilter(e.target.value); setPage(1); }}
        className="mb-4 w-full max-w-md px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
      />

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-xs uppercase">
            <tr>
              <th className="px-3 py-2">Username</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <tr><td colSpan="5" className="text-center py-6">Loading...</td></tr>
              : displayUsers.length > 0
                ? displayUsers.map(u => (
                  <tr key={u.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-2">{u.username}</td>
                    <td className="p-2">{u.first_name} {u.last_name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2 flex space-x-2 text-lg">
                      <button
                        onClick={() => openForm(u)}
                        className="text-green-600 hover:text-green-800"
                        title="Edit user"
                      > <FiEdit /> </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete user"
                      > <FiTrash2 /> </button>
                    </td>
                  </tr>
                ))
                : <tr><td colSpan="5" className="text-center py-6">No users found.</td></tr>
            }
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {Math.ceil(allUsers.filter(u =>
        u.username.toLowerCase().includes(filter.toLowerCase()) ||
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(filter.toLowerCase())
      ).length / PAGE_SIZE) > 1 && (
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

      {/* Edit User Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg p-6 rounded-lg shadow-xl relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-700 dark:text-white"
              title="Close form"
            >✕</button>
            <h2 className="text-xl text-gray-800 dark:text-white mb-4">Edit User</h2>

            <div className="grid grid-cols-2 gap-4">
              {['first_name', 'last_name', 'username', 'email', 'phone_number', 'role', 'password'].map((field, i) => (
                <input
                  key={i}
                  type={field === 'password' ? 'password' : 'text'}
                  placeholder={field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  value={formData[field] || ''}
                  onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                  className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white col-span-2"
                  autoComplete={field === 'password' ? 'new-password' : undefined}
                />
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-400 dark:bg-gray-600 text-white rounded"
              >Cancel</button>
              <button
                onClick={handleFormSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
