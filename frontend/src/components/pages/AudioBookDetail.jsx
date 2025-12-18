import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaPlay, FaPause, FaStop, FaMicrophone, FaDownload, FaBook,
  FaRobot, FaUser, FaArrowLeft, FaSpinner, FaVolumeUp, FaForward, FaBackward
} from 'react-icons/fa';
import axios from 'axios';

const AudioBookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // AI Audio state
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiAudioUrl, setAiAudioUrl] = useState(null);
  const [aiAudioPlaying, setAiAudioPlaying] = useState(false);
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Playback state
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  
  const aiAudioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/api/books/${id}/`);
      setBook(response.data);
      
      // Check if AI audio already exists
      if (response.data.audio_file) {
        setAiAudioUrl(response.data.audio_file);
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      // Sample data
      setBook({
        id: 1,
        title: "Sample Book",
        author: "Author Name",
        description: "Book description...",
        pdf_file: "/sample.pdf",
        cover_image: null
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate AI Audio from PDF
  const generateAIAudio = async () => {
    setGeneratingAI(true);
    try {
      // Call backend API to generate audio from PDF
      const response = await axios.post(
        `http://127.0.0.1:8000/api/audiobooks/generate-audio/`,
        { book_id: id }
      );
      
      if (response.data.success) {
        setAiAudioUrl(response.data.audio_url);
        alert('AI audio generated successfully! You can now play it.');
        // Refresh book data to get updated audio file
        fetchBook();
      }
    } catch (error) {
      console.error('Error generating AI audio:', error);
      const errorMsg = error.response?.data?.error || 'Failed to generate audio. Please try again.';
      alert(`Error: ${errorMsg}`);
    } finally {
      setGeneratingAI(false);
    }
  };

  // Play/Pause AI Audio
  const toggleAIAudio = () => {
    if (aiAudioRef.current) {
      if (aiAudioPlaying) {
        aiAudioRef.current.pause();
      } else {
        aiAudioRef.current.play();
      }
      setAiAudioPlaying(!aiAudioPlaying);
    }
  };

  // Start Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const newRecording = {
          id: Date.now(),
          url,
          blob,
          timestamp: new Date().toISOString(),
          duration: recordingTime
        };
        setRecordings([...recordings, newRecording]);
        setRecordingTime(0);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  // Download Recording
  const downloadRecording = (recording, type = 'user') => {
    const a = document.createElement('a');
    a.href = recording.url || recording;
    a.download = `${book.title}-${type}-audio-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <p className="text-gray-600 dark:text-gray-400">Book not found</p>
          <button
            onClick={() => navigate('/audiobook-library')}
            className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => navigate('/audiobook-library')}
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all mb-6"
        >
          <FaArrowLeft />
          <span>Back to Library</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sticky top-6">
              <div className="h-80 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                {book.cover_image ? (
                  <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <FaBook className="text-white text-8xl opacity-50" />
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {book.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                by {book.author}
              </p>
              
              {book.description && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {book.description}
                </p>
              )}
            </div>
          </div>

          {/* Audio Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Audio Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <FaRobot className="mr-3 text-purple-500" />
                AI Generated Audio
              </h3>

              {!aiAudioUrl ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Generate AI audio from the PDF text
                  </p>
                  <button
                    onClick={generateAIAudio}
                    disabled={generatingAI || !book.pdf_file}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                  >
                    {generatingAI ? (
                      <>
                        <FaSpinner className="animate-spin mr-3" />
                        Generating AI Audio...
                      </>
                    ) : (
                      <>
                        <FaRobot className="mr-3" />
                        Generate AI Audio
                      </>
                    )}
                  </button>
                  {!book.pdf_file && (
                    <p className="text-red-500 text-sm mt-4">
                      PDF file required to generate audio
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <audio
                    ref={aiAudioRef}
                    src={aiAudioUrl}
                    onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                    onLoadedMetadata={(e) => setDuration(e.target.duration)}
                    onEnded={() => setAiAudioPlaying(false)}
                  />

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={(e) => {
                        const newTime = parseFloat(e.target.value);
                        setCurrentTime(newTime);
                        if (aiAudioRef.current) {
                          aiAudioRef.current.currentTime = newTime;
                        }
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <button
                      onClick={() => {
                        if (aiAudioRef.current) {
                          aiAudioRef.current.currentTime -= 10;
                        }
                      }}
                      className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <FaBackward />
                    </button>
                    
                    <button
                      onClick={toggleAIAudio}
                      className="p-6 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full hover:from-purple-600 hover:to-blue-700 shadow-lg"
                    >
                      {aiAudioPlaying ? (
                        <FaPause className="text-2xl text-white" />
                      ) : (
                        <FaPlay className="text-2xl text-white ml-1" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        if (aiAudioRef.current) {
                          aiAudioRef.current.currentTime += 10;
                        }
                      }}
                      className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <FaForward />
                    </button>
                  </div>

                  {/* Download AI Audio */}
                  <button
                    onClick={() => downloadRecording(aiAudioUrl, 'ai')}
                    className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <FaDownload className="mr-2" />
                    Download AI Audio
                  </button>
                </div>
              )}
            </div>

            {/* User Recording Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <FaUser className="mr-3 text-blue-500" />
                Your Voice Recording
              </h3>

              {/* Recording Controls */}
              <div className="text-center mb-6">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center mx-auto"
                  >
                    <FaMicrophone className="mr-3" />
                    Start Recording
                  </button>
                ) : (
                  <div>
                    <div className="text-4xl font-bold text-red-500 mb-4 animate-pulse">
                      {formatTime(recordingTime)}
                    </div>
                    <button
                      onClick={stopRecording}
                      className="px-8 py-4 bg-gray-700 hover:bg-gray-800 text-white rounded-xl font-semibold transition-all flex items-center justify-center mx-auto"
                    >
                      <FaStop className="mr-3" />
                      Stop Recording
                    </button>
                  </div>
                )}
              </div>

              {/* Recordings List */}
              {recordings.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Your Recordings ({recordings.length})
                  </h4>
                  {recordings.map((recording) => (
                    <div
                      key={recording.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <audio src={recording.url} controls className="flex-1" />
                      </div>
                      <button
                        onClick={() => downloadRecording(recording, 'user')}
                        className="ml-3 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        <FaDownload />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioBookDetail;
