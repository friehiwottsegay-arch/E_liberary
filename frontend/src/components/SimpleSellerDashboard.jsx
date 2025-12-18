import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isAuthenticated, isSeller, getToken } from '../utils/authUtils';

const SimpleSellerDashboard = () => {
    const navigate = useNavigate();
    const [sellerData, setSellerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [businessInfo, setBusinessInfo] = useState({
        business_name: '',
        business_type: ''
    });
    const API_BASE = 'http://127.0.0.1:8000/api';

    useEffect(() => {
        // Check authentication and role
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        if (!isSeller()) {
            navigate('/unauthorized');
            return;
        }

        fetchSellerData();
    }, [navigate]);

    const fetchSellerData = async () => {
        try {
            const token = getToken();
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await apiClient.get(API_ENDPOINTS.SELLER_DASHBOARD);
            setSellerData(response.data);
            setBusinessInfo({
                business_name: response.data.seller_info.business_name,
                business_type: response.data.seller_info.business_type
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching seller data:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
            setLoading(false);
        }
    };

    const updateBusinessInfo = async () => {
        try {
            const token = getToken();
            if (!token) {
                navigate('/login');
                return;
            }

            await axios.post(`${API_BASE}/seller/dashboard/`, businessInfo, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchSellerData(); // Refresh data
            alert('Business information updated successfully!');
        } catch (error) {
            console.error('Error updating business info:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                alert('Error updating business information');
            }
        }
    };

    if (loading) {
        return <div>Loading seller dashboard...</div>;
    }

    if (!sellerData) {
        return <div>No seller data found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Simple Seller Dashboard</h1>
            
            {/* Seller Info */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Business Information</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Business Name</label>
                        <input
                            type="text"
                            value={businessInfo.business_name}
                            onChange={(e) => setBusinessInfo({...businessInfo, business_name: e.target.value})}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Business Type</label>
                        <input
                            type="text"
                            value={businessInfo.business_type}
                            onChange={(e) => setBusinessInfo({...businessInfo, business_type: e.target.value})}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                </div>
                <button
                    onClick={updateBusinessInfo}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Update Information
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <h3 className="text-2xl font-bold text-blue-600">{sellerData.stats.total_books}</h3>
                    <p className="text-gray-600">Total Books</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <h3 className="text-2xl font-bold text-green-600">{sellerData.stats.total_orders}</h3>
                    <p className="text-gray-600">Total Orders</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <h3 className="text-2xl font-bold text-purple-600">${sellerData.stats.total_revenue}</h3>
                    <p className="text-gray-600">Total Revenue</p>
                </div>
            </div>

            {/* Recent Books */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Books</h2>
                {sellerData.recent_books.length > 0 ? (
                    <div className="space-y-2">
                        {sellerData.recent_books.map((book) => (
                            <div key={book.id} className="flex justify-between items-center border-b pb-2">
                                <span>{book.title}</span>
                                <span className="text-gray-500">${book.price}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No books yet</p>
                )}
            </div>
        </div>
    );
};

export default SimpleSellerDashboard;