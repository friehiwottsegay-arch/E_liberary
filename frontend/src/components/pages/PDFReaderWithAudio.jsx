import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaPlay, FaPause, FaStop, FaArrowLeft, FaVolumeUp, FaDownload,
  FaBook, FaSpinner, FaForward, FaBackward
} from 'react-icons/fa';
import axios from 'axios';

const PDFReaderWithAudio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfText, setPdfText] = useState('');
  const [selectedText, setSelectedText] = useState('');
  
  // TTS state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  
  const textRef = useRef(null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    fetchBook();
    loadVoices();
  }, [id]);

  useEffect(() => {
    // Load voices when they become available
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const loadVoices = () => {
    const availableVoices = window.speechSynthesis.getVoices();
    setVoices(availableVoices);
    // Set default voice (prefer English)
    const defaultVoice = availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
    setSelectedVoice(defaultVoice);
  };

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/api/books/${id}/`);
      setBook(response.data);
      
      // Fetch PDF text content
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
      setPdfText('Unable to load PDF text. Please ensure the PDF file is accessible.');
    }
  };

  // Handle text selection
  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text) {
      setSelectedText(text);
    }
  };

  // Speak full text
  const speakFullText = () => {
    if (!pdfText) return;
    speakText(pdfText);
  };

  // Speak selected text
  const speakSelectedText = () => {
    if (!selectedText) {
      alert('Please select some text first');
      return;
    }
    speakText(selectedText);
  };

  // Core TTS function
  const speakText = (text) => {
    if (!window.speechSynthesis) {
      alert('Text-to-speech is not supported in your browser');
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    utterance.voice = selectedVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Pause/Resume speech
  const togglePause = () => {
    if (!window.speechSynthesis) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  // Stop speech
  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  // Download audio (using backend TTS)
  const downloadAudio = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/audiobooks/generate-audio/`,
        { book_id: id },
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${book.title}-audio.mp3`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading audio:', error);
      alert('Failed to generate audio file');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/audiobook-library')}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all"
          >
            <FaArrowLeft />
            <span>Back to Library</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Paytone One, sans-serif' }}>
            <FaBook className="inline mr-3 text-purple-500" />
            {book.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Audio Controls Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sticky top-6 space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Paytone One, sans-serif' }}>
                <FaVolumeUp className="inline mr-2 text-purple-500" />
                Audio Controls
              </h3>

              {/* Play Controls */}
              <div className="space-y-3">
                <button
                  onClick={speakFullText}
                  disabled={!pdfText || isSpeaking}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <FaPlay className="mr-2" />
                  Play Full Text
                </button>

                <button
                  onClick={speakSelectedText}
                  disabled={!selectedText || isSpeaking}
                  className="w-full px-4 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <FaPlay className="mr-2" />
                  Play Selected
                </button>

                {isSpeaking && (
                  <>
                    <button
                      onClick={togglePause}
                      className="w-full px-4 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-all flex items-center justify-center"
                    >
                      {isPaused ? <FaPlay className="mr-2" /> : <FaPause className="mr-2" />}
                      {isPaused ? 'Resume' : 'Pause'}
                    </button>

                    <button
                      onClick={stopSpeech}
                      className="w-full px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all flex items-center justify-center"
                    >
                      <FaStop className="mr-2" />
                      Stop
                    </button>
                  </>
                )}
              </div>

              {/* Voice Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Voice
                </label>
                <select
                  value={selectedVoice?.name || ''}
                  onChange={(e) => {
                    const voice = voices.find(v => v.name === e.target.value);
                    setSelectedVoice(voice);
                  }}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>

              {/* Speed Control */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Speed: {speechRate.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Pitch Control */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pitch: {speechPitch.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechPitch}
                  onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Download Audio */}
              <button
                onClick={downloadAudio}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all flex items-center justify-center"
              >
                <FaDownload className="mr-2" />
                Download Audio
              </button>

              {/* Selected Text Info */}
              {selectedText && (
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-1">
                    Selected Text:
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                    {selectedText}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* PDF Text Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Paytone One, sans-serif' }}>
                  Book Content
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select text to read specific sections
                </p>
              </div>

              {pdfText ? (
                <div
                  ref={textRef}
                  onMouseUp={handleTextSelection}
                  className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap select-text"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '1.1rem',
                    lineHeight: '1.8'
                  }}
                >
                  {pdfText}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaSpinner className="text-4xl text-purple-500 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Loading PDF content...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFReaderWithAudio;
