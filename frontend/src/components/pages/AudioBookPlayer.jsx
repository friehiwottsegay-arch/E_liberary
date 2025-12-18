import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaPlay,
  FaPause,
  FaStop,
  FaVolumeUp,
  FaVolumeMute,
  FaForward,
  FaBackward,
  FaMicrophone,
  FaDownload,
  FaBook,
  FaHeadphones,
  FaClock,
  FaBookmark,
  FaShare
} from 'react-icons/fa';

const AudioBookPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordings, setRecordings] = useState([]);
  
  // Book data
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [currentChapter, setCurrentChapter] = useState(0);
  
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  // Fetch audio book data from backend
  useEffect(() => {
    const fetchAudioBook = async () => {
      try {
        setLoading(true);
        const bookId = id || 1;
        
        // Try to fetch from backend
        const response = await fetch(`http://127.0.0.1:8000/api/audiobooks/${bookId}/detail/`);
        
        if (response.ok) {
          const data = await response.json();
          setBook(data);
        } else {
          throw new Error('Backend not available');
        }
      } catch (error) {
        console.log('Using sample data (backend not available)');
        // Set default sample data
        setBook({
          id: 1,
          title: "The Great Adventure",
          author: "John Smith",
          narrator: "Sarah Johnson",
          duration: "5h 32m",
          description: "An amazing audio book experience",
          rating: 4.5,
          language: "English",
          chapters: [
            { id: 1, title: "Chapter 1: The Beginning", duration: "45:30", audio_url: "" },
            { id: 2, title: "Chapter 2: The Journey", duration: "52:15", audio_url: "" },
            { id: 3, title: "Chapter 3: The Discovery", duration: "48:20", audio_url: "" }
          ],
          cover_image: null
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAudioBook();
  }, [id]);

  // Initialize audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Play/Pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Stop
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  // Skip forward/backward
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 15;
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 15;
    }
  };

  // Volume control
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Playback speed
  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // Time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Seek
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Format time
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Chapter navigation
  const playChapter = (index) => {
    setCurrentChapter(index);
    setCurrentTime(0);
    if (audioRef.current && book) {
      audioRef.current.src = book.chapters[index].audio_url;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const newRecording = {
          id: Date.now(),
          url,
          blob,
          timestamp: new Date().toISOString(),
          duration: currentTime
        };
        setRecordings([...recordings, newRecording]);
        setRecordedChunks([]);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const downloadRecording = (recording) => {
    const a = document.createElement('a');
    a.href = recording.url;
    a.download = `recording-${recording.id}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading audio book...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Audio book not found</p>
          <button
            onClick={() => navigate('/products')}
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
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all"
          >
            <FaBook />
            <span>Back to Library</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <FaHeadphones className="mr-3 text-purple-500" />
            Audio Book Player
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Info & Cover */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
              <img
                src={book.cover_image || "/api/placeholder/300/400"}
                alt={book.title}
                className="w-full rounded-xl shadow-lg mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {book.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-1">
                by {book.author}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                Narrated by {book.narrator}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <FaClock className="mr-2" />
                  {book.duration}
                </div>
                <div className="flex items-center">
                  <FaBookmark className="mr-2" />
                  {book.chapters?.length || 0} Chapters
                </div>
              </div>
            </div>

            {/* Chapters List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                Chapters
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {book.chapters && book.chapters.length > 0 ? (
                  book.chapters.map((chapter, index) => (
                    <button
                      key={chapter.id}
                      onClick={() => playChapter(index)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        currentChapter === index
                          ? 'bg-purple-100 dark:bg-purple-900 border-2 border-purple-500'
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800 dark:text-white">
                          {chapter.title}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {chapter.duration}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No chapters available
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Player & Controls */}
          <div className="lg:col-span-2">
            {/* Main Player */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                Now Playing: {book.chapters?.[currentChapter]?.title || 'No chapter selected'}
              </h3>

              {/* Audio Element */}
              <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
              />

              {/* Progress Bar */}
              <div className="mb-6">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(currentTime / duration) * 100}%, #e5e7eb ${(currentTime / duration) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Main Controls */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                <button
                  onClick={skipBackward}
                  className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  <FaBackward className="text-xl text-gray-700 dark:text-gray-300" />
                </button>
                
                <button
                  onClick={togglePlay}
                  className="p-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg"
                >
                  {isPlaying ? (
                    <FaPause className="text-2xl text-white" />
                  ) : (
                    <FaPlay className="text-2xl text-white ml-1" />
                  )}
                </button>
                
                <button
                  onClick={handleStop}
                  className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  <FaStop className="text-xl text-gray-700 dark:text-gray-300" />
                </button>
                
                <button
                  onClick={skipForward}
                  className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  <FaForward className="text-xl text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              {/* Volume & Speed Controls */}
              <div className="grid grid-cols-2 gap-6">
                {/* Volume */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Volume
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={toggleMute}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                </div>

                {/* Playback Speed */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Speed
                  </label>
                  <div className="flex space-x-2">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => changePlaybackRate(rate)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                          playbackRate === rate
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recording Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <FaMicrophone className="mr-3 text-red-500" />
                Voice Notes & Recording
              </h3>

              {/* Recording Controls */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all"
                  >
                    <FaMicrophone />
                    <span>Start Recording</span>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold transition-all animate-pulse"
                  >
                    <FaStop />
                    <span>Stop Recording</span>
                  </button>
                )}
              </div>

              {/* Recordings List */}
              {recordings.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                    Your Recordings ({recordings.length})
                  </h4>
                  {recordings.map((recording) => (
                    <div
                      key={recording.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <audio src={recording.url} controls className="h-10" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(recording.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => downloadRecording(recording)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
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

export default AudioBookPlayer;
