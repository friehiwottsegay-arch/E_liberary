import React, { useState } from 'react';
import axios from 'axios';

const REGISTER_URL = 'http://127.0.0.1:8000/api/register/';

const CreateAccount = () => {

  const initialForm = {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    sex: 'M',
    age: '',
    grade: '',
    role: 'Student',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    username: '',
    password: '',
  };

  const roleOptions = [
    { value: 'Student', label: 'Student' },
    { value: 'Staff', label: 'Staff' },
    { value: 'Admin', label: 'Admin' },
  ];
  const sexOptions = [
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' },
    { value: 'O', label: 'Other' },
  ];

  // Fields for manual form and import table
  const fields = [
    'first_name', 'last_name', 'email', 'phone_number',
    'sex', 'age', 'grade', 'role',
    'emergency_contact_name', 'emergency_contact_phone',
    'username', 'password'
  ];

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Manual form change handler
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manual form submit handler
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(REGISTER_URL, formData);
      alert(`User created: ${res.data.user?.email || 'unknown'}`);
      setFormData(initialForm);
    } catch (err) {
      setError(err.response?.data?.error || JSON.stringify(err.response?.data) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Create User Accounts
        </h1>

        {/* Manual Form */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Manual Account Creation
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(field => (
              field === 'role' ? (
                <select
                  key="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                >
                  {roleOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : field === 'sex' ? (
                <select
                  key="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                >
                  {sexOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : field === 'password' ? (
                <input
                  key={field}
                  name={field}
                  type="password"
                  placeholder={field.replace('_', ' ')}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                />
              ) : (
                <input
                  key={field}
                  name={field}
                  type={field === 'age' ? 'number' : 'text'}
                  placeholder={field.replace('_', ' ')}
                  value={formData[field]}
                  onChange={handleChange}
                  required={['first_name', 'last_name', 'email', 'username', 'password'].includes(field)}
                  className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                />
              )
            ))}
            <button type="submit" disabled={loading}
              className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        </section>

      </div>
    </div>
  );
};

export default CreateAccount;
