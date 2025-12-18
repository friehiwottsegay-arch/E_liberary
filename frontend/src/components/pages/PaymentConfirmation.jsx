import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, ArrowLeft, Download, Mail, Phone } from 'lucide-react';

const PaymentConfirmation = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get transaction reference from URL params or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const txRef = urlParams.get('tx_ref') || localStorage.getItem('lastChapaPayment');
        
        if (!txRef) {
          throw new Error('No transaction reference found');
        }

        // Parse tx_ref from localStorage if it's a JSON string
        const reference = typeof txRef === 'string' && txRef.startsWith('{') 
          ? JSON.parse(txRef).tx_ref 
          : txRef;

        // Verify payment with backend
        const response = await axios.post('http://localhost:8000/api/payments/chapa/verify/', {
          tx_ref: reference
        });

        const data = response.data;
        setPaymentData(data);
        setVerificationStatus(data.success ? 'success' : 'failed');
        
        if (data.success) {
          // Clear stored payment data on successful verification
          localStorage.removeItem('lastChapaPayment');
        }

      } catch (err) {
        console.error('Payment verification error:', err);
        setError(err.message || 'Failed to verify payment');
        setVerificationStatus('failed');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, []);

  const handleDownload = async (bookId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/books/${bookId}/download/`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `book_${bookId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download book. Please contact support.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              {error || 'There was an issue with your payment. Please try again.'}
            </p>
            <div className="space-y-3">
              <Link
                to="/cart"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 inline-flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'success' && paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Success Header */}
            <div className="bg-green-50 px-6 py-8">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-600">Thank you for your purchase. Your payment has been confirmed.</p>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="px-6 py-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Transaction Reference</p>
                  <p className="font-semibold text-gray-900">{paymentData.data?.tx_ref || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="font-semibold text-gray-900">
                    {paymentData.data?.amount} {paymentData.data?.currency || 'ETB'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold text-gray-900">Chapa</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Successful
                  </span>
                </div>
              </div>

              {/* Books/Items Purchased */}
              {paymentData.data?.books && paymentData.data.books.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Your Purchased Books</h4>
                  <div className="space-y-3">
                    {paymentData.data.books.map((book, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{book.title}</h5>
                            <p className="text-sm text-gray-600">{book.author}</p>
                            {book.category && (
                              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                                {book.category}
                              </span>
                            )}
                          </div>
                          <div className="ml-4">
                            {book.file && (
                              <button
                                onClick={() => handleDownload(book.id)}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200 inline-flex items-center text-sm"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Email Confirmation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="font-medium text-blue-900">Email Confirmation</h4>
                    <p className="text-blue-700 text-sm">
                      A confirmation email with your receipt and download links has been sent to your email address.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/dashboard"
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition duration-200 text-center font-medium"
                >
                  View My Library
                </Link>
                <Link
                  to="/market"
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded hover:bg-gray-300 transition duration-200 text-center font-medium"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Contact Support */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center mb-2">
                  Need help with your purchase?
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    href="mailto:support@example.com"
                    className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email Support
                  </a>
                  <a
                    href="tel:+251911234567"
                    className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Call Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentConfirmation;