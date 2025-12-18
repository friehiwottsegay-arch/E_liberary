import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  FaShare,
  FaRedo,
  FaExpand,
  FaCompress,
  FaStar,
  FaHeart,
  FaPlus,
  FaList,
  FaSearch,
  FaFilter,
  FaCircle,
  FaSquare,
  FaRegCircle,
  FaRegSquare,
  FaHistory,
  FaSave,
  FaTrash,
  FaShareAlt,
  FaEye,
  FaEyeSlash,
  FaSync,
  FaMusic,
  FaWaveSquare,
  FaMicrophoneSlash
} from 'react-icons/fa';

const AudioBookPlayerEnhanced = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);
  const [quality, setQuality] = useState('high');
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevels, setAudioLevels] = useState(0);
  const [recordingSettings, setRecordingSettings] = useState({
    format: 'webm',
    quality: 'high',
    sampleRate: 44100,
    channels: 1
  });
  
  // Book data state
  const [book, setBook] = useState(null);
  const [allAudioBooks, setAllAudioBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAllBooks, setLoadingAllBooks] = useState(false);
  const [error, setError] = useState(null);
  
  // Chapter and playlist state
  const [currentChapter, setCurrentChapter] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [queue, setQueue] = useState([]);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [repeatMode, setRepeatMode] = useState('none'); // none, one, all
  const [shuffleMode, setShuffleMode] = useState(false);
  
  // UI state
  const [currentView, setCurrentView] = useState('player'); // player, library, recordings
  const [showBookLibrary, setShowBookLibrary] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [currentBookmark, setCurrentBookmark] = useState(null);
  
  // Audio context and visualizer
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [audioData, setAudioData] = useState([]);
  
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const visualizerRef = useRef(null);
  const animationRef = useRef(null);

  // API Configuration
  const API_BASE_URL = 'http://127.0.0.1:8000/api';
  const headers = {
    'Content-Type': 'application/json',
  };

  // Enhanced API calls with better error handling
  const fetchAudioBooks = useCallback(async () => {
    try {
      setLoadingAllBooks(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/audiobooks/list/`, {
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch audiobooks: ${response.status}`);
      }
      
      const data = await response.json();
      setAllAudioBooks(data.audiobooks || []);
      
    } catch (error) {
      console.error('Error fetching audiobooks:', error);
      setError('Failed to load audiobook library. Using offline data.');
      // Fallback to sample data
      setAllAudioBooks([
        {
          id: 1,
          title: "The Great Adventure",
          author: "John Smith",
          narrator: "Sarah Johnson",
          duration: "5h 32m",
          rating: 4.5,
          genre: "Adventure",
          language: "English",
          description: "An amazing audio book experience",
          cover_image: "/assets/book6.png",
          chapters: [
            { id: 1, title: "Chapter 1: The Beginning", duration: "45:30", audio_url: "" },
            { id: 2, title: "Chapter 2: The Journey", duration: "52:15", audio_url: "" },
            { id: 3, title: "Chapter 3: The Discovery", duration: "48:20", audio_url: "" }
          ]
        },
        {
          id: 2,
          title: "Mystery in the Mountains",
          author: "Emma Wilson",
          narrator: "Michael Brown",
          duration: "4h 15m",
          rating: 4.7,
          genre: "Mystery",
          language: "English",
          description: "A thrilling mystery adventure",
          cover_image: "/assets/book6.png",
          chapters: [
            { id: 1, title: "Chapter 1: The Discovery", duration: "42:10", audio_url: "" },
            { id: 2, title: "Chapter 2: The Investigation", duration: "38:25", audio_url: "" }
          ]
        }
      ]);
    } finally {
      setLoadingAllBooks(false);
    }
  }, []);

  const fetchAudioBook = useCallback(async (bookId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/audiobooks/${bookId}/detail/`, {
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch audiobook: ${response.status}`);
      }
      
      const data = await response.json();
      setBook(data);
      setPlaylist(data.chapters || []);
      setQueue(data.chapters?.map((_, index) => index) || []);
      
      // Load notes and bookmarks from localStorage
      const savedNotes = localStorage.getItem(`audiobook-notes-${bookId}`);
      if (savedNotes) setNotes(savedNotes);
      
      const savedBookmarks = localStorage.getItem(`audiobook-bookmarks-${bookId}`);
      if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
      
    } catch (error) {
      console.error('Error fetching audiobook:', error);
      setError('Failed to load audiobook. Using sample data.');
      // Fallback to sample data
      const fallbackBook = {
        id: bookId,
        title: "The Great Adventure",
        author: "John Smith",
        narrator: "Sarah Johnson",
        duration: "5h 32m",
        rating: 4.5,
        genre: "Adventure",
        language: "English",
        description: "An amazing audio book experience",
        cover_image: "/assets/book6.png",
        chapters: [
          { id: 1, title: "Chapter 1: The Beginning", duration: "45:30", audio_url: "" },
          { id: 2, title: "Chapter 2: The Journey", duration: "52:15", audio_url: "" },
          { id: 3, title: "Chapter 3: The Discovery", duration: "48:20", audio_url: "" }
        ]
      };
      setBook(fallbackBook);
      setPlaylist(fallbackBook.chapters || []);
      setQueue(fallbackBook.chapters?.map((_, index) => index) || []);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize audio context for visualization
  useEffect(() => {
    if (audioRef.current && !audioContext) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const analyserNode = ctx.createAnalyser();
        analyserNode.fftSize = 256;
        setAudioContext(ctx);
        setAnalyser(analyserNode);
        
        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(analyserNode);
        analyserNode.connect(ctx.destination);
      } catch (error) {
        console.warn('Audio context not supported:', error);
      }
    }
  }, [audioContext]);

  // Initialize audio book and library
  useEffect(() => {
    if (id) {
      fetchAudioBook(id);
    }
    fetchAudioBooks();
  }, [id, fetchAudioBook, fetchAudioBooks]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      setRecordingTime(0);
    }
    
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  // Audio visualization
  useEffect(() => {
    if (analyser && showVisualizer) {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVisualizer = () => {
        analyser.getByteFrequencyData(dataArray);
        setAudioData([...dataArray]);
        animationRef.current = requestAnimationFrame(updateVisualizer);
      };
      updateVisualizer();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, showVisualizer]);

  // Save data to localStorage
  useEffect(() => {
    if (book && notes) {
      localStorage.setItem(`audiobook-notes-${book.id}`, notes);
    }
  }, [notes, book]);

  useEffect(() => {
    if (book && bookmarks.length > 0) {
      localStorage.setItem(`audiobook-bookmarks-${book.id}`, JSON.stringify(bookmarks));
    }
  }, [bookmarks, book]);

  // Enhanced audio controls
  const initializeAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, isMuted, playbackRate]);

  useEffect(() => {
    initializeAudio();
  }, [initializeAudio]);

  // Enhanced playback controls
  const togglePlay = useCallback(async () => {
    if (!audioRef.current || !book || !playlist[currentChapter]) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Resume audio context if suspended
        if (audioContext && audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        
        setIsBuffering(true);
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Playback error:', error);
      setError('Failed to play audio. Please check the audio file.');
    } finally {
      setIsBuffering(false);
    }
  }, [isPlaying, book, playlist, currentChapter, audioContext]);

  const handleStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, []);

  const skipForward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime += 15;
    }
  }, []);

  const skipBackward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 15;
    }
  }, []);

  // Chapter navigation with playlist support
  const playChapter = useCallback((index) => {
    if (!book || !playlist[index]) return;
    
    setCurrentChapter(index);
    setCurrentTime(0);
    
    // Update queue if shuffle is enabled
    let newQueue = [...queue];
    if (shuffleMode) {
      newQueue = shuffleArray(queue);
    }
    
    if (audioRef.current && playlist[index].audio_url) {
      audioRef.current.src = playlist[index].audio_url;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [book, playlist, queue, shuffleMode]);

  const nextChapter = useCallback(() => {
    if (playlist.length === 0) return;
    
    let nextIndex;
    if (repeatMode === 'one' && isPlaying) {
      nextIndex = currentChapter;
    } else if (currentChapter < playlist.length - 1) {
      nextIndex = currentChapter + 1;
    } else if (repeatMode === 'all') {
      nextIndex = 0;
    } else {
      return; // End of playlist
    }
    
    playChapter(nextIndex);
  }, [currentChapter, playlist, repeatMode, isPlaying, playChapter]);

  const previousChapter = useCallback(() => {
    if (playlist.length === 0) return;
    
    if (currentChapter > 0) {
      playChapter(currentChapter - 1);
    } else if (repeatMode === 'all') {
      playChapter(playlist.length - 1);
    }
  }, [currentChapter, playlist, repeatMode, playChapter]);

  // Enhanced volume and speed controls
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  const changePlaybackRate = useCallback((rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, []);

  // Time and seeking controls
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const handleSeek = useCallback((e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  }, []);

  // Enhanced recording functionality
  const startRecording = useCallback(async () => {
    try {
      const constraints = {
        audio: {
          sampleRate: recordingSettings.sampleRate,
          channelCount: recordingSettings.channels,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: `audio/${recordingSettings.format};codecs=opus`
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: `audio/${recordingSettings.format}` });
        const url = URL.createObjectURL(blob);
        const newRecording = {
          id: Date.now(),
          url,
          blob,
          timestamp: new Date().toISOString(),
          duration: recordingTime,
          format: recordingSettings.format,
          quality: recordingSettings.quality,
          sampleRate: recordingSettings.sampleRate,
          channels: recordingSettings.channels,
          bookId: book?.id,
          chapterIndex: currentChapter
        };
        
        setRecordings(prev => [...prev, newRecording]);
        setRecordedChunks([]);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Could not access microphone. Please check permissions.');
    }
  }, [recordingSettings, recordingTime, book, currentChapter]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  // Recording management
  const downloadRecording = useCallback((recording) => {
    const a = document.createElement('a');
    a.href = recording.url;
    a.download = `recording-${recording.id}.${recording.format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  const deleteRecording = useCallback((recordingId) => {
    setRecordings(prev => prev.filter(r => r.id !== recordingId));
  }, []);

  const saveRecording = useCallback(async (recording) => {
    try {
      const formData = new FormData();
      formData.append('audio_file', recording.blob, `recording-${recording.id}.${recording.format}`);
      formData.append('title', `Recording from ${book?.title || 'Unknown'}`);
      formData.append('description', `Chapter ${currentChapter + 1} recording`);
      formData.append('book_id', book?.id || '');
      
      const response = await fetch(`${API_BASE_URL}/audiobooks/save-recording/`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        alert('Recording saved successfully!');
      } else {
        throw new Error('Failed to save recording');
      }
    } catch (error) {
      console.error('Error saving recording:', error);
      alert('Failed to save recording. Please try again.');
    }
  }, [book, currentChapter]);

  // Bookmark functionality
  const addBookmark = useCallback(() => {
    if (!book || currentTime === 0) return;
    
    const bookmark = {
      id: Date.now(),
      time: currentTime,
      chapter: currentChapter,
      timestamp: new Date().toISOString(),
      title: `${book.title} - ${playlist[currentChapter]?.title || 'Unknown'}`
    };
    
    setBookmarks(prev => [...prev, bookmark]);
  }, [book, currentTime, currentChapter, playlist]);

  const goToBookmark = useCallback((bookmark) => {
    setCurrentChapter(bookmark.chapter);
    setCurrentTime(bookmark.time);
    if (audioRef.current) {
      audioRef.current.currentTime = bookmark.time;
    }
    setCurrentBookmark(bookmark.id);
  }, []);

  // Utility functions
  const formatTime = useCallback((seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const formatRecordingTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const shuffleArray = useCallback((array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  // Audio event handlers
  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
    if (autoPlayNext) {
      nextChapter();
    }
  }, [autoPlayNext, nextChapter]);

  const handleAudioError = useCallback(() => {
    setError('Audio playback error. Please check the audio file.');
    setIsPlaying(false);
  }, []);

  // Library filtering and searching
  const filteredAudioBooks = allAudioBooks
    .filter(book => {
      const matchesSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = filterGenre === 'all' || book.genre === filterGenre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title?.localeCompare(b.title) || 0;
        case 'author':
          return a.author?.localeCompare(b.author) || 0;
        case 'duration':
          return (parseInt(a.duration) || 0) - (parseInt(b.duration) || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  // Render loading state
  if (loading && !book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading audiobook...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (!book && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Audiobook not found</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Back to Library
            </button>
            <button
              onClick={() => setShowBookLibrary(true)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Browse Audiobooks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/products')}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all"
            >
              <FaBook />
              <span>Back to Library</span>
            </button>
            
            <button
              onClick={() => setShowBookLibrary(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            >
              <FaList />
              <span>Audiobook Library</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
              <FaHeadphones className="mr-3 text-purple-500" />
              Enhanced Audio Book Player
            </h1>
            
            {/* View Toggle */}
            <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow">
              {['player', 'library', 'recordings'].map((view) => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${
                    currentView === view
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Main Content Based on Current View */}
        {currentView === 'player' && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Book Info & Cover */}
            <div className="xl:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sticky top-8">
                <img
                  src={book?.cover_image || "/api/placeholder/300/400"}
                  alt={book?.title}
                  className="w-full rounded-xl shadow-lg mb-4"
                />
                
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {book?.title}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  by {book?.author}
                </p>
                
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  Narrated by {book?.narrator}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <FaClock className="mr-2" />
                    {book?.duration}
                  </div>
                  <div className="flex items-center">
                    <FaBookmark className="mr-2" />
                    {book?.chapters?.length || 0} Chapters
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(book?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {book?.rating}/5
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button className="flex items-center justify-center space-x-1 px-3 py-2 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-all">
                    <FaHeart />
                    <span className="text-xs">Like</span>
                  </button>
                  <button className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-all">
                    <FaShare />
                    <span className="text-xs">Share</span>
                  </button>
                  <button
                    onClick={() => setShowNotes(!showNotes)}
                    className="flex items-center justify-center space-x-1 px-3 py-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-all"
                  >
                    <FaBookmark />
                    <span className="text-xs">Notes</span>
                  </button>
                  <button
                    onClick={addBookmark}
                    className="flex items-center justify-center space-x-1 px-3 py-2 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800 transition-all"
                  >
                    <FaPlus />
                    <span className="text-xs">Bookmark</span>
                  </button>
                </div>

                {/* Notes Section */}
                {showNotes && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add your notes here..."
                      className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm resize-none"
                    />
                  </div>
                )}
              </div>

              {/* Enhanced Chapters List */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    Chapters ({playlist.length})
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShuffleMode(!shuffleMode)}
                      className={`p-2 rounded-lg transition-all ${shuffleMode ? 'bg-purple-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                    >
                      <FaMusic />
                    </button>
                    <button
                      onClick={() => setRepeatMode(repeatMode === 'all' ? 'none' : 'all')}
                      className={`p-2 rounded-lg transition-all ${repeatMode !== 'none' ? 'bg-purple-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                    >
                      <FaRedo />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {playlist.map((chapter, index) => (
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
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            currentChapter === index
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <span className="font-medium text-gray-800 dark:text-white text-sm">
                              {chapter.title}
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {chapter.duration}
                            </div>
                          </div>
                        </div>
                        {currentChapter === index && isPlaying && (
                          <div className="flex space-x-1">
                            <FaCircle className="w-1 h-1 text-purple-500 animate-pulse" />
                            <FaCircle className="w-1 h-1 text-purple-500 animate-pulse" style={{animationDelay: '0.1s'}} />
                            <FaCircle className="w-1 h-1 text-purple-500 animate-pulse" style={{animationDelay: '0.2s'}} />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Bookmarks */}
                {bookmarks.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Bookmarks ({bookmarks.length})
                    </h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {bookmarks.map((bookmark) => (
                        <button
                          key={bookmark.id}
                          onClick={() => goToBookmark(bookmark)}
                          className={`w-full text-left p-2 rounded text-xs transition-all ${
                            currentBookmark === bookmark.id
                              ? 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400'
                              : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{formatTime(bookmark.time)}</span>
                            <span className="text-gray-500">Ch. {bookmark.chapter + 1}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Player & Controls */}
            <div className="xl:col-span-3 space-y-6">
              {/* Audio Visualizer */}
              {showVisualizer && audioData.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                    <FaWaveSquare className="mr-2" />
                    Audio Visualizer
                  </h3>
                  <div className="flex items-end justify-center space-x-1 h-32">
                    {audioData.slice(0, 64).map((value, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-t from-purple-500 to-blue-500 rounded-t"
                        style={{
                          width: '4px',
                          height: `${(value / 255) * 100}%`,
                          transition: 'height 0.1s ease-out'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Main Player */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Now Playing: {playlist[currentChapter]?.title || 'No chapter selected'}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowVisualizer(!showVisualizer)}
                      className={`p-2 rounded-lg transition-all ${showVisualizer ? 'bg-purple-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                    >
                      <FaWaveSquare />
                    </button>
                    <button
                      onClick={() => setShowEqualizer(!showEqualizer)}
                      className={`p-2 rounded-lg transition-all ${showEqualizer ? 'bg-purple-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                    >
                      <FaEqualizer />
                    </button>
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                    >
                      {isFullscreen ? <FaCompress /> : <FaExpand />}
                    </button>
                  </div>
                </div>

                {/* Audio Element */}
                <audio
                  ref={audioRef}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={handleAudioEnded}
                  onError={handleAudioError}
                  onLoadStart={() => setIsBuffering(true)}
                  onCanPlay={() => setIsBuffering(false)}
                />

                {/* Enhanced Progress Bar */}
                <div className="mb-6">
                  <div className="relative">
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
                    {/* Chapter markers */}
                    {playlist.map((_, index) => (
                      <div
                        key={index}
                        className="absolute top-0 w-1 h-2 bg-purple-300 dark:bg-purple-700 rounded-full transform -translate-x-1/2"
                        style={{
                          left: `${(index / (playlist.length - 1)) * 100}%`
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  
                  {/* Buffering indicator */}
                  {isBuffering && (
                    <div className="text-center mt-2">
                      <div className="inline-flex items-center text-purple-500">
                        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span className="text-sm">Loading...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Main Controls */}
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <button
                    onClick={previousChapter}
                    className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                  >
                    <FaBackward className="text-lg text-gray-700 dark:text-gray-300" />
                  </button>
                  
                  <button
                    onClick={skipBackward}
                    className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                  >
                    <FaBackward className="text-lg text-gray-700 dark:text-gray-300" />
                  </button>
                  
                  <button
                    onClick={togglePlay}
                    disabled={!playlist[currentChapter]?.audio_url}
                    className="p-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBuffering ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : isPlaying ? (
                      <FaPause className="text-2xl text-white" />
                    ) : (
                      <FaPlay className="text-2xl text-white ml-1" />
                    )}
                  </button>
                  
                  <button
                    onClick={skipForward}
                    className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                  >
                    <FaForward className="text-lg text-gray-700 dark:text-gray-300" />
                  </button>
                  
                  <button
                    onClick={nextChapter}
                    className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                  >
                    <FaForward className="text-lg text-gray-700 dark:text-gray-300" />
                  </button>
                </div>

                {/* Enhanced Volume & Speed Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Volume Control */}
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
                    <div className="flex flex-wrap gap-1">
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

                  {/* Auto-play & Repeat */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Playback Settings
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={autoPlayNext}
                          onChange={(e) => setAutoPlayNext(e.target.checked)}
                          className="mr-2 rounded"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Auto-play next chapter</span>
                      </label>
                      <div className="flex space-x-2">
                        <select
                          value={repeatMode}
                          onChange={(e) => setRepeatMode(e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="none">No repeat</option>
                          <option value="one">Repeat chapter</option>
                          <option value="all">Repeat all</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Recording Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                    <FaMicrophone className="mr-3 text-red-500" />
                    Enhanced Voice Recording
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`p-2 rounded-lg transition-all ${isRecording ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                    >
                      {isRecording ? <FaMicrophoneSlash /> : <FaMicrophone />}
                    </button>
                  </div>
                </div>

                {/* Recording Settings */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Format
                    </label>
                    <select
                      value={recordingSettings.format}
                      onChange={(e) => setRecordingSettings(prev => ({ ...prev, format: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="webm">WebM</option>
                      <option value="mp4">MP4</option>
                      <option value="wav">WAV</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Quality
                    </label>
                    <select
                      value={recordingSettings.quality}
                      onChange={(e) => setRecordingSettings(prev => ({ ...prev, quality: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sample Rate
                    </label>
                    <select
                      value={recordingSettings.sampleRate}
                      onChange={(e) => setRecordingSettings(prev => ({ ...prev, sampleRate: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="22050">22.05 kHz</option>
                      <option value="44100">44.1 kHz</option>
                      <option value="48000">48 kHz</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Channels
                    </label>
                    <select
                      value={recordingSettings.channels}
                      onChange={(e) => setRecordingSettings(prev => ({ ...prev, channels: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="1">Mono</option>
                      <option value="2">Stereo</option>
                    </select>
                  </div>
                </div>

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
                      <span>Stop Recording ({formatRecordingTime(recordingTime)})</span>
                    </button>
                  )}
                </div>

                {/* Audio Level Indicator */}
                {isRecording && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Audio Level
                    </label>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-100"
                        style={{ width: `${audioLevels}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Enhanced Recordings List */}
                {recordings.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                        Your Recordings ({recordings.length})
                      </h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setRecordings([])}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                    {recordings.map((recording) => (
                      <div
                        key={recording.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <audio src={recording.url} controls className="h-12" />
                          <div>
                            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              Recording {formatRecordingTime(recording.duration)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(recording.timestamp).toLocaleString()}
                              {recording.bookId && ` • ${allAudioBooks.find(b => b.id === recording.bookId)?.title || 'Unknown'}`}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {recording.format.toUpperCase()} • {recording.quality} quality • {recording.sampleRate/1000}kHz
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => saveRecording(recording)}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                            title="Save to Cloud"
                          >
                            <FaSave />
                          </button>
                          <button
                            onClick={() => downloadRecording(recording)}
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                            title="Download"
                          >
                            <FaDownload />
                          </button>
                          <button
                            onClick={() => deleteRecording(recording.id)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Audiobook Library View */}
        {currentView === 'library' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Audiobook Library
              </h2>
              <button
                onClick={fetchAudioBooks}
                disabled={loadingAllBooks}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all disabled:opacity-50"
              >
                <FaSync className={`${loadingAllBooks ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Search and Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search audiobooks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Genres</option>
                <option value="Adventure">Adventure</option>
                <option value="Mystery">Mystery</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="title">Sort by Title</option>
                <option value="author">Sort by Author</option>
                <option value="duration">Sort by Duration</option>
                <option value="rating">Sort by Rating</option>
              </select>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                {filteredAudioBooks.length} of {allAudioBooks.length} audiobooks
              </div>
            </div>

            {/* Audiobooks Grid */}
            {loadingAllBooks ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAudioBooks.map((audiobook) => (
                  <div
                    key={audiobook.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => navigate(`/audiobook/${audiobook.id}`)}
                  >
                    <img
                      src={audiobook.cover_image || "/assets/book6.png"}
                      alt={audiobook.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 truncate">
                      {audiobook.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      by {audiobook.author}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{audiobook.duration}</span>
                      <div className="flex items-center">
                        <FaStar className="w-3 h-3 text-yellow-400 mr-1" />
                        <span>{audiobook.rating}/5</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredAudioBooks.length === 0 && !loadingAllBooks && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No audiobooks found matching your criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Recordings View */}
        {currentView === 'recordings' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Voice Recordings
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setRecordings([])}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Clear All
                </button>
              </div>
            </div>

            {recordings.length === 0 ? (
              <div className="text-center py-12">
                <FaMicrophone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No recordings yet. Start recording to see your voice notes here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recordings.map((recording) => (
                  <div
                    key={recording.id}
                    className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-xl"
                  >
                    <div className="flex items-center space-x-4">
                      <audio src={recording.url} controls className="h-12" />
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">
                          Recording {formatRecordingTime(recording.duration)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(recording.timestamp).toLocaleString()}
                        </div>
                        {recording.bookId && (
                          <div className="text-sm text-purple-600 dark:text-purple-400">
                            {allAudioBooks.find(b => b.id === recording.bookId)?.title || 'Unknown Book'}
                            {recording.chapterIndex !== undefined && ` - Chapter ${recording.chapterIndex + 1}`}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {recording.format.toUpperCase()} • {recording.quality} quality • {recording.sampleRate/1000}kHz • {recording.channels} channel{recording.channels > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => saveRecording(recording)}
                        className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                        title="Save to Cloud"
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={() => downloadRecording(recording)}
                        className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                        title="Download"
                      >
                        <FaDownload />
                      </button>
                      <button
                        onClick={() => deleteRecording(recording.id)}
                        className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioBookPlayerEnhanced;