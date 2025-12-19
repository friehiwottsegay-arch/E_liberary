import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';
import { searchPlugin } from '@react-pdf-viewer/search';
import {
  FaArrowLeft, FaSearchPlus, FaSearchMinus, FaExpand, FaCompress,
  FaPlay, FaPause, FaStop, FaVolumeUp, FaBook, FaSpinner, FaSearch
} from 'react-icons/fa';
import axios from 'axios';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import '@react-pdf-viewer/full-screen/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';

const EnhancedPDFReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('pdf'); // 'pdf' or 'text'
  const [pdfText, setPdfText] = useState('');
  
  // PDF viewer plugins
  const zoomPluginInstance = zoomPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const fullScreenPluginInstance = fullScreenPlugin();
  const searchPluginInstance = searchPlugin();
  
  const { ZoomIn, ZoomOut, CurrentScale, ZoomTo } = zoomPluginInstance;
  const { jumpToNextPage, jumpToPreviousPage } = pageNavigationPluginInstance;
  const { EnterFullScreen } = fullScreenPluginInstance;
  const { Search } = searchPluginInstance;
  
  // TTS state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  
  // Text mode zoom
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);

  useEffect(() => {
    fetchBook();
    loadVoices();
  }, [id]);

  const loadVoices = () => {
    const availableVoices = window.speechSynthesis.getVoices();
    setVoices(availableVoices);
    const defaultVoice = availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
    setSelectedVoice(defaultVoice);
  };

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/api/audiobooks/${id}/`);
      setBook(response.data);
      
      if (response.data.pdf_file) {
        fetchPDFText(response.data.id);
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPDFText = async (bookId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/audiobooks/extract-text/${bookId}/`);
      if (response.data.success) {
        setPdfText(response.data.text);
      }
    } catch (error) {
      console.error('Error fetching PDF text:', error);
      setPdfText('Unable to load PDF text.');
    }
  };

  // TTS functions
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.voice = selectedVoice;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const togglePause = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Text zoom functions
  const zoomInText = () => setFontSize(prev => Math.min(prev + 2, 32));
  const zoomOutText = () => setFontSize(prev => Math.max(prev - 2, 12));
  const resetTextZoom = () => setFontSize(18);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '=':
          case '+':
            e.preventDefault();
            if (viewMode === 'pdf') {
              ZoomIn();
            } else {
              zoomInText();
            }
            break;
          case '-':
            e.preventDefault();
            if (viewMode === 'pdf') {
              ZoomOut();
            } else {
              zoomOutText();
            }
            break;
          case '0':
            e.preventDefault();
            if (viewMode === 'pdf') {
              ZoomTo(SpecialZoomLevel.ActualSize);
            } else {
              resetTextZoom();
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [viewMode, ZoomIn, ZoomOut, ZoomTo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading book...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-xl mb-4">Book not found</p>
          <button
            onClick={() => navigate('/audiobook-library')}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/audiobook-library')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <FaArrowLeft />
                <span>Back</span>
              </button>
              
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <FaBook className="mr-3 text-purple-500" />
                {book.title}
              </h1>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('pdf')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'pdf'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                PDF View
              </button>
              <button
                onClick={() => setViewMode('text')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'text'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Text View
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={viewMode === 'pdf' ? ZoomOut : zoomOutText}
                className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                title="Zoom Out (Ctrl + -)"
              >
                <FaSearchMinus />
              </button>
              
              <span className="text-sm font-medium min-w-16 text-center text-gray-700 dark:text-gray-300">
                {viewMode === 'pdf' ? (
                  <CurrentScale>
                    {(scale) => scale ? `${Math.round(scale * 100)}%` : '100%'}
                  </CurrentScale>
                ) : (
                  `${fontSize}px`
                )}
              </span>
              
              <button
                onClick={viewMode === 'pdf' ? ZoomIn : zoomInText}
                className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                title="Zoom In (Ctrl + +)"
              >
                <FaSearchPlus />
              </button>
              
              <button
                onClick={() => {
                  if (viewMode === 'pdf') {
                    ZoomTo(SpecialZoomLevel.ActualSize);
                  } else {
                    resetTextZoom();
                  }
                }}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                Reset
              </button>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => speakText(viewMode === 'text' ? pdfText : 'PDF content')}
                disabled={isSpeaking}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center"
              >
                <FaPlay className="mr-2" />
                Read Aloud
              </button>
              
              {isSpeaking && (
                <>
                  <button
                    onClick={togglePause}
                    className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    {isPaused ? <FaPlay /> : <FaPause />}
                  </button>
                  
                  <button
                    onClick={stopSpeech}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <FaStop />
                  </button>
                </>
              )}
            </div>

            {/* Additional Controls */}
            <div className="flex items-center space-x-2">
              {viewMode === 'pdf' && (
                <>
                  <div className="flex items-center">
                    <Search>
                      {(renderSearchProps) => (
                        <div className="flex items-center space-x-2">
                          {renderSearchProps.children}
                        </div>
                      )}
                    </Search>
                  </div>
                  
                  <EnterFullScreen>
                    {(props) => (
                      <button
                        {...props}
                        className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                        title="Fullscreen"
                      >
                        <FaExpand />
                      </button>
                    )}
                  </EnterFullScreen>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4">
        {viewMode === 'pdf' && book.pdf_file ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-[calc(100vh-200px)]">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={book.pdf_file}
                plugins={[
                  zoomPluginInstance,
                  pageNavigationPluginInstance,
                  fullScreenPluginInstance,
                  searchPluginInstance,
                ]}
                defaultScale={SpecialZoomLevel.PageFit}
              />
            </Worker>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {book.title}
            </h2>
            
            {pdfText ? (
              <div
                className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 whitespace-pre-wrap select-text transition-all duration-300"
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: `${fontSize}px`,
                  lineHeight: lineHeight,
                }}
              >
                {pdfText}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaSpinner className="text-4xl text-purple-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading content...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 text-xs text-gray-600 dark:text-gray-400 max-w-xs">
        <h4 className="font-semibold mb-2">Keyboard Shortcuts</h4>
        <div className="space-y-1">
          <div>Ctrl + Plus: Zoom In</div>
          <div>Ctrl + Minus: Zoom Out</div>
          <div>Ctrl + 0: Reset Zoom</div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPDFReader;