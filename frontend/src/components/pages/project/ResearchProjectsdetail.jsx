import React, { useState, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { searchPlugin } from '@react-pdf-viewer/search';
import { useParams } from 'react-router-dom';
import PaymentPop from './PaymentPopup';  // Import PaymentPopup
import {
  FaDownload, FaStar, FaCalendarAlt, FaTags,
  FaPlus, FaMinus, FaArrowLeft, FaArrowRight,
} from 'react-icons/fa';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';

// Simulated payment processing function
const processPayment = async (selectedPlan) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      selectedPlan ? resolve('Payment successful') : reject(new Error('No plan selected'));
    }, 1500);
  });
};

const PaymentPopup = ({ onSuccess, onCancel }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setError('');
    if (!selectedPlan) {
      setError('Please select a plan to proceed.');
      return;
    }
    setIsProcessing(true);
    try {
      await processPayment(selectedPlan);
      onSuccess(selectedPlan);
    } catch (err) {
      setError(err.message || 'Payment failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-bold mb-2">Subscribe to Unlock Full Access</h2>
        <p className="mb-4">Select a plan:</p>
        <ul className="list-none mb-4 space-y-2">
          {[
            { label: '3-Day Access', price: '$4.99' },
            { label: 'Monthly Access', price: '$9.99' },
            { label: 'Annual Access', price: '$49.99' },
          ].map(({ label, price }) => (
            <li key={label}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="plan"
                  value={label}
                  onChange={() => setSelectedPlan(label)}
                  checked={selectedPlan === label}
                  disabled={isProcessing}
                />
                <span><strong>{price}</strong> - {label}</span>
              </label>
            </li>
          ))}
        </ul>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <div className="flex justify-between mt-4">
          <button
            onClick={handlePayment}
            className={`bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center min-w-[120px] ${
              isProcessing ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Proceed to Pay'}
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded"
            disabled={isProcessing}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const PDFViewer3D = () => {
  const { id } = useParams();
  const pageNavigation = pageNavigationPlugin();
  const zoom = zoomPlugin();
  const search = searchPlugin();

  const FREE_PAGES = 3;
  const MAX_DESCRIPTION_LENGTH = 300;
  const INITIAL_COMMENT_COUNT = 5;

  const [project, setProject] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [username, setUsername] = useState('');
  const [relatedProjects, setRelatedProjects] = useState([]);

  useEffect(() => {
    // Fetch main project details
    fetch(`http://127.0.0.1:8000/api/projects/${id}/`)
      .then((res) => res.json())
      .then(setProject)
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    // Fetch related projects dynamically, latest 5 only
    fetch(`http://127.0.0.1:8000/api/projects/${id}/related/`)
      .then((res) => res.json())
      .then((data) => {
        setRelatedProjects(data.slice(0, 5));
      })
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') goToPage(pageNumber - 1);
      if (e.key === 'ArrowRight') goToPage(pageNumber + 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [pageNumber, numPages]);

  const handleSubscribeClick = () => setShowPaymentPopup(true);

  const handleSubscriptionSuccess = (plan) => {
    setIsSubscribed(true);
    setShowPaymentPopup(false);
    // Optionally, show success message or redirect if needed
  };

  const handleSubscriptionCancel = () => setShowPaymentPopup(false);

  const handleDownload = () => {
    if (isSubscribed) {
      const link = document.createElement('a');
      link.href = project.pdf;
      link.download = `${project.title.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      handleSubscribeClick();
    }
  };

  const goToPage = (page) => {
    if (page < 1 || (numPages && page > numPages)) return;
    if (page <= FREE_PAGES || isSubscribed) {
      setPageNumber(page);
    } else {
      // Locked page reached, show upgrade button
      setPageNumber(page);
      setShowPaymentPopup(true);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          text: newComment.trim(),
          date: new Date(),
          username: username.trim() || 'Anonymous',
        },
      ]);
      setNewComment('');
      setShowAllComments(true);
    }
  };

  const displayedComments = showAllComments
    ? comments
    : comments.slice(0, INITIAL_COMMENT_COUNT);

  if (!project) return <div className="p-4 text-center">Loading project details...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <main className="flex-1 max-w-6xl mx-auto p-4">
        <header className="flex justify-between items-center mb-4 flex-wrap">
          <h2 className="text-xl font-semibold">{project.title}</h2>
          <div className="text-sm">
            Page {pageNumber} / {numPages || '?'}
            {!isSubscribed && pageNumber > FREE_PAGES && (
              <span className="ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded">PREMIUM</span>
            )}
          </div>
        </header>

        <div className="flex flex-wrap gap-6">
          {/* Sidebar */}
          <aside className="flex-1 min-w-[280px] max-h-[600px] bg-blue-50 dark:bg-gray-800 p-4 rounded-lg overflow-hidden">
            <p className="mb-2">
              {showFullDescription || project.full_description.length <= MAX_DESCRIPTION_LENGTH
                ? project.full_description
                : `${project.full_description.slice(0, MAX_DESCRIPTION_LENGTH)}...`}
            </p>
            {project.full_description.length > MAX_DESCRIPTION_LENGTH && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-600 hover:underline text-sm"
              >
                {showFullDescription ? 'See less' : 'See more'}
              </button>
            )}
            <div className="flex items-center gap-4 my-4">
              <img
                src={`https://ui-avatars.com/api/?name=${project.profile_username}`}
                alt="avatar"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h4 className="font-semibold">{project.profile_username}</h4>
                <p className="text-sm flex items-center gap-1">
                  <FaCalendarAlt /> {new Date(project.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold flex items-center gap-1">
                <FaTags /> Tags
              </h4>
              <div className="mt-1 flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 dark:bg-gray-700 px-2 py-1 rounded text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span>
                <FaStar color="#f4c150" /> {project.rating}/5
              </span>
              <button
                onClick={handleDownload}
                className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
              >
                <FaDownload /> Download
              </button>
            </div>
          </aside>

          {/* PDF Viewer */}
          <div className="flex-1 min-w-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-lg relative overflow-hidden h-[500px]">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <div className="flex justify-center items-center gap-2 p-3 border-b dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <button onClick={() => goToPage(pageNumber - 1)} disabled={pageNumber <= 1}>
                  <FaArrowLeft />
                </button>
                <button onClick={() => goToPage(pageNumber + 1)} disabled={numPages ? pageNumber >= numPages : false}>
                  <FaArrowRight />
                </button>
                <button onClick={() => zoom.ZoomIn()}>
                  <FaPlus />
                </button>
                <button onClick={() => zoom.ZoomOut()}>
                  <FaMinus />
                </button>
              </div>

              <div className="h-full overflow-auto relative flex flex-col items-center justify-center p-4">
                {(pageNumber <= FREE_PAGES || isSubscribed) ? (
                  <Viewer
                    fileUrl={project.pdf}
                    plugins={[pageNavigation, search, zoom]}
                    onPageChange={(e) => setPageNumber(e.currentPage + 1)}
                    onDocumentLoad={(e) => setNumPages(e.doc.numPages)}
                  />
                ) : (
                  <div className="flex flex-col items-center text-center text-gray-600 dark:text-gray-400 space-y-4">
                    <p className="text-lg font-semibold">Page content is locked.</p>
                    <button
                      onClick={handleSubscribeClick}
                      className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
                    >
                      Upgrade / Subscribe
                    </button>
                  </div>
                )}
              </div>
            </Worker>
          </div>
        </div>

        {/* Bottom Section: Comments (left) + Related Projects (right) */}
        <div className="mt-8 flex flex-col md:flex-row gap-6">
          {/* Comments */}
          <div className="w-full md:w-2/3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Comments</h3>
            <input
              type="text"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mb-2 px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <textarea
              rows="2"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleAddComment}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
            <div className="mt-4 max-h-64 overflow-auto">
              {displayedComments.map((c, i) => (
                <div
                  key={i}
                  className="mb-3 border-b pb-2 border-gray-200 dark:border-gray-700"
                >
                  <p className="font-semibold">{c.username}</p>
                  <p className="text-sm">{c.text}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(c.date).toLocaleString()}
                  </p>
                </div>
              ))}
              {comments.length > INITIAL_COMMENT_COUNT && !showAllComments && (
                <button
                  onClick={() => setShowAllComments(true)}
                  className="text-blue-600 hover:underline text-sm mt-2"
                >
                  View all comments
                </button>
              )}
            </div>
          </div>

          {/* Related Projects */}
          <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md max-h-[400px] overflow-hidden">
            <h3 className="text-lg font-semibold mb-3">Related Projects</h3>
            {relatedProjects.length === 0 && (
              <p className="text-sm text-gray-500">No related projects found.</p>
            )}
            {relatedProjects.map((relProj) => (
              <div
                key={relProj.id}
                className="flex items-center gap-3 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700"
              >
                <img
                  src={relProj.image || 'https://via.placeholder.com/50'}
                  alt={relProj.title}
                  className="w-12 h-12 rounded"
                />
                <div>
                  <h4 className="text-sm font-semibold">{relProj.title}</h4>
                  <p className="text-xs text-gray-500">
                    by {relProj.author_name || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(relProj.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showPaymentPopup && (
        <PaymentPopup
          onSuccess={handleSubscriptionSuccess}
          onCancel={handleSubscriptionCancel}
        />
      )}
    </div>
  );
};

export default PDFViewer3D;
