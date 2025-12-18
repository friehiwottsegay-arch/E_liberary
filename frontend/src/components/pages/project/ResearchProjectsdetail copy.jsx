import React, { useState, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { searchPlugin } from '@react-pdf-viewer/search';
import {
  FaDownload, FaStar, FaCalendarAlt, FaTags,
  FaPlus, FaMinus, FaArrowLeft, FaArrowRight,
} from 'react-icons/fa';

// Dummy payment processing function (replace with real one)
async function processPayment(selectedPlan) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (selectedPlan) {
        resolve('Payment successful');
      } else {
        reject(new Error('No plan selected'));
      }
    }, 1500);
  });
}

// PaymentPopup component
const PaymentPopup = ({ onConfirm, onCancel }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    if (!selectedPlan) {
      setError('Please select a plan.');
      return;
    }
    setError(null);
    setIsProcessing(true);

    try {
      await processPayment(selectedPlan);
      onConfirm(selectedPlan);
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-bold mb-2">Subscribe to Unlock Full Access</h2>
        <p className="mb-4">Select a plan:</p>
        <ul className="list-none mb-4 space-y-2">
          <li>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="plan"
                value="3-Day Access"
                onChange={() => setSelectedPlan('3-Day Access')}
                checked={selectedPlan === '3-Day Access'}
                disabled={isProcessing}
              />
              <span><strong>$4.99</strong> - 3-Day Access</span>
            </label>
          </li>
          <li>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="plan"
                value="Monthly Access"
                onChange={() => setSelectedPlan('Monthly Access')}
                checked={selectedPlan === 'Monthly Access'}
                disabled={isProcessing}
              />
              <span><strong>$9.99</strong> - Monthly Access</span>
            </label>
          </li>
          <li>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="plan"
                value="Annual Access"
                onChange={() => setSelectedPlan('Annual Access')}
                checked={selectedPlan === 'Annual Access'}
                disabled={isProcessing}
              />
              <span><strong>$49.99</strong> - Annual Access</span>
            </label>
          </li>
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
  const pageNavigation = pageNavigationPlugin();
  const zoom = zoomPlugin();
  const search = searchPlugin();

  const FREE_PAGES = 3;
  const pdfUrl = '/assets/hero/b.pdf';

  const project = {
    title: 'AI for Environmental Impact',
    fullDescription:
      'Explore how AI addresses climate change. First 3 pages are free. Subscribe to read the full paper. '.repeat(9),
    profile: {
      name: 'Dr. Alice Green',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      affiliation: 'Stanford University',
    },
    date: '2024-03-12',
    tags: ['AI', 'Environment', 'Climate Change'],
    rating: 4.9,
  };

  const relatedProjects = [
    {
      title: 'Sustainable Agriculture with AI',
      author: 'Dr. John Smith',
      date: '2024-02-20',
      image: 'https://via.placeholder.com/80?text=Agriculture',
    },
    {
      title: 'AI in Renewable Energy Systems',
      author: 'Dr. Sarah Wong',
      date: '2024-01-15',
      image: 'https://via.placeholder.com/80?text=Energy',
    },
    {
      title: 'Urban AI for Smart Cities',
      author: 'Dr. Carlos Martinez',
      date: '2023-12-10',
      image: 'https://via.placeholder.com/80?text=Smart+City',
    },
  ];

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [comments, setComments] = useState([
    { text: 'Great paper!', date: new Date('2024-04-01T10:00:00'), username: 'Alice' },
    { text: 'Very insightful.', date: new Date('2024-04-02T14:30:00'), username: null },
  ]);
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [username, setUsername] = useState('');

  const MAX_DESCRIPTION_LENGTH = 300;
  const INITIAL_COMMENT_COUNT = 5;

  const handleSubscribe = () => setShowPaymentPopup(true);

  const confirmSubscription = (plan) => {
    console.log('User subscribed with plan:', plan);
    setIsSubscribed(true);
    setShowPaymentPopup(false);
  };

  const cancelSubscription = () => setShowPaymentPopup(false);

  const handleDownload = () => {
    if (isSubscribed) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${project.title.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      handleSubscribe();
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= numPages) {
      if (page <= FREE_PAGES || isSubscribed) {
        setPageNumber(page);
      } else {
        handleSubscribe();
      }
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          text: newComment.trim(),
          date: new Date(),
          username: username.trim() || null,
        },
      ]);
      setNewComment('');
      setShowAllComments(true);
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') goToPage(pageNumber - 1);
      if (e.key === 'ArrowRight') goToPage(pageNumber + 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [pageNumber, numPages]);

  const displayedComments = showAllComments
    ? comments
    : comments.slice(0, INITIAL_COMMENT_COUNT);

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
            <div className="mb-4">
              <p className="mb-2">
                {showFullDescription || project.fullDescription.length <= MAX_DESCRIPTION_LENGTH
                  ? project.fullDescription
                  : project.fullDescription.slice(0, MAX_DESCRIPTION_LENGTH) + '...'}
              </p>
              {project.fullDescription.length > MAX_DESCRIPTION_LENGTH && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {showFullDescription ? 'See less' : 'See more'}
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 mb-4">
              <img src={project.profile.avatar} alt="avatar" className="w-12 h-12 rounded-full" />
              <div>
                <h4 className="font-semibold">{project.profile.name}</h4>
                <p className="text-sm">{project.profile.affiliation}</p>
                <p className="text-sm flex items-center gap-1">
                  <FaCalendarAlt /> {new Date(project.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold flex items-center gap-1"><FaTags /> Tags</h4>
              <div className="mt-1 flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span key={i} className="bg-blue-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">#{tag}</span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span><FaStar color="#f4c150" /> {project.rating}/5</span>
              <button onClick={handleDownload} className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1">
                <FaDownload /> Download
              </button>
            </div>
          </aside>

          {/* PDF Viewer */}
          <div className="flex-1 min-w-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-lg relative overflow-hidden h-[600px]">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <div className="flex justify-center items-center gap-2 p-3 border-b dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <button onClick={() => goToPage(pageNumber - 1)}><FaArrowLeft /></button>
                <button onClick={() => goToPage(pageNumber + 1)}><FaArrowRight /></button>
                <button onClick={() => zoom.ZoomIn()}><FaPlus /></button>
                <button onClick={() => zoom.ZoomOut()}><FaMinus /></button>
              </div>

              <div className="h-full overflow-auto relative">
                {(pageNumber <= FREE_PAGES || isSubscribed) ? (
                  <Viewer
                    fileUrl={pdfUrl}
                    plugins={[pageNavigation, search, zoom]}
                    onPageChange={(e) => setPageNumber(e.currentPage + 1)}
                    onDocumentLoad={(e) => setNumPages(e.doc.numPages)}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-lg">
                    <p>Page content is locked. Please subscribe to unlock.</p>
                  </div>
                )}

                {pageNumber > FREE_PAGES && !isSubscribed && (
                  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-6 rounded shadow text-center z-10">
                    <p className="mb-2 text-black dark:text-white">This page is locked. Please subscribe to view.</p>
                    <button onClick={handleSubscribe} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Pay to Unlock</button>
                  </div>
                )}
              </div>
            </Worker>
          </div>
        </div>

        {/* Comments and Related Projects */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Comments */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Comments</h3>

            <div className="mb-3 flex gap-2 items-center">
              <label htmlFor="username" className="text-sm w-20">Your name:</label>
              <input
                id="username"
                type="text"
                placeholder="Leave empty for Anonymous"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 px-3 py-2 border rounded text-black"
              />
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border rounded text-black"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
              />
              <button
                onClick={handleAddComment}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Post
              </button>
            </div>

            <ul className="space-y-3 max-h-64 overflow-auto">
              {displayedComments.map((comment, i) => (
                <li key={i} className="bg-gray-200 dark:bg-gray-700 p-3 rounded">
                  <p>{comment.text}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    {comment.username || 'Anonymous'} —{' '}
                    {comment.date.toLocaleDateString()}{' '}
                    {comment.date.toLocaleTimeString()}
                  </p>
                </li>
              ))}
            </ul>

            {comments.length > INITIAL_COMMENT_COUNT && !showAllComments && (
              <button
                onClick={() => setShowAllComments(true)}
                className="mt-2 text-blue-600 hover:underline text-sm"
              >
                Show all comments
              </button>
            )}
          </section>

          {/* Related Projects */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Related Projects</h3>
            <ul className="space-y-4">
              {relatedProjects.map((proj, i) => (
                <li
                  key={i}
                  className="flex gap-4 items-center p-3 bg-gray-200 dark:bg-gray-700 rounded cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-700 transition"
                  onClick={() => alert(`Navigate to project: ${proj.title}`)}
                >
                  <img src={proj.image} alt={proj.title} className="w-16 h-16 rounded object-cover" />
                  <div>
                    <h4 className="font-semibold">{proj.title}</h4>
                    <p className="text-sm">{proj.author}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{new Date(proj.date).toLocaleDateString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      {/* Payment popup overlay */}
      {showPaymentPopup && (
        <PaymentPopup onConfirm={confirmSubscription} onCancel={cancelSubscription} />
      )}
    </div>
  );
};

export default PDFViewer3D;
