import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, clearAuthData, isAdmin } from '../../utils/authUtils';

const AdminAuthTest = () => {
  const [authStatus, setAuthStatus] = useState({
    hasToken: false,
    isAdmin: false,
    userRole: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    const adminStatus = isAdmin();
    
    setAuthStatus({
      hasToken: !!token,
      isAdmin: adminStatus,
      userRole: localStorage.getItem('user_role')
    });
  }, []);

  const handleClearAuth = () => {
    clearAuthData();
    setAuthStatus({
      hasToken: false,
      isAdmin: false,
      userRole: null
    });
    navigate('/login');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Admin Authentication Test</h2>
      
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Has Token</label>
            <div className={`mt-1 px-3 py-2 rounded text-sm ${
              authStatus.hasToken ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {authStatus.hasToken ? 'Yes' : 'No'}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Is Admin</label>
            <div className={`mt-1 px-3 py-2 rounded text-sm ${
              authStatus.isAdmin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {authStatus.isAdmin ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">User Role</label>
          <div className="mt-1 px-3 py-2 bg-gray-100 rounded text-sm">
            {authStatus.userRole || 'Not set'}
          </div>
        </div>
        
        <div className="flex gap-4 pt-4">
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Admin
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Go to Login
          </button>
          
          <button
            onClick={handleClearAuth}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear Auth
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthTest;