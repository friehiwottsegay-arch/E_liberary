import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { searchPlugin } from "@react-pdf-viewer/search";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { fullScreenPlugin } from "@react-pdf-viewer/full-screen";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "@react-pdf-viewer/full-screen/lib/styles/index.css";
import "./BookRead.css";

const ReadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const viewerRef = useRef(null);

  const [books, setBooks] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentBook, setCurrentBook] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Accessibility states
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    screenReaderEnabled: localStorage.getItem('accessibility_screenReader') === 'true',
    highContrast: localStorage.getItem('accessibility_highContrast') === 'true',
    largeText: localStorage.getItem('accessibility_largeText') === 'true',
    focusMode: localStorage.getItem('accessibility_focusMode') === 'true',
    reducedMotion: localStorage.getItem('accessibility_reducedMotion') === 'true',
    voiceCommands: localStorage.getItem('accessibility_voiceCommands') === 'true',
    autoRead: localStorage.getItem('accessibility_autoRead') === 'true',
    readingSpeed: parseInt(localStorage.getItem('accessibility_readingSpeed')) || 1.0,
    offlineMode: localStorage.getItem('accessibility_offlineMode') === 'true',
    voicePitch: parseFloat(localStorage.getItem('accessibility_voicePitch')) || 1.0,
    voiceVolume: parseFloat(localStorage.getItem('accessibility_voiceVolume')) || 0.8,
    loopReading: localStorage.getItem('accessibility_loopReading') === 'true'
  });

  // Enhanced audio control states
  const [audioControls, setAudioControls] = useState({
    isPlaying: false,
    isPaused: false,
    isLooping: localStorage.getItem('accessibility_loopReading') === 'true',
    currentPosition: 0,
    duration: 0,
    playbackRate: parseInt(localStorage.getItem('accessibility_readingSpeed')) || 1.0
  });

  // Function to update accessibility settings
  const updateAccessibilitySetting = (setting, value) => {
    const newSettings = { ...accessibilitySettings, [setting]: value };
    setAccessibilitySettings(newSettings);
    localStorage.setItem(`accessibility_${setting}`, value.toString());
    
    // Apply settings to document
    if (setting === 'highContrast') {
      document.body.classList.toggle('high-contrast', value);
    }
    if (setting === 'largeText') {
      document.body.classList.toggle('large-text', value);
    }
    if (setting === 'focusMode') {
      document.body.classList.toggle('focus-mode', value);
    }
  };

  // Text-to-Speech states
  const [isReading, setIsReading] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const [voice, setVoice] = useState(null);

  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordedNotes, setRecordedNotes] = useState(
    JSON.parse(localStorage.getItem('recordedNotes') || '[]')
  );

  // Voice recognition states
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceCommandText, setVoiceCommandText] = useState('');

  // Focus management
  const [focusedElement, setFocusedElement] = useState(null);

  // Offline support
  const [offlineMode, setOfflineMode] = useState(false);
  const [cachedContent, setCachedContent] = useState({});

  // Screen reader announcements
  const [announcements, setAnnouncements] = useState('');
  const announcerRef = useRef(null);

  // Initialize plugins
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const searchPluginInstance = searchPlugin();
  const zoomPluginInstance = zoomPlugin();
  const fullScreenPluginInstance = fullScreenPlugin();

  const { 
    jumpToNextPage, 
    jumpToPreviousPage, 
    jumpToPage
  } = pageNavigationPluginInstance;

  const { Search } = searchPluginInstance;
  const { ZoomIn, ZoomOut, CurrentScale, ZoomTo } = zoomPluginInstance;
  const { EnterFullScreen } = fullScreenPluginInstance;

  // Initialize accessibility features
  useEffect(() => {
    // Screen reader announcer
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }

    // Auto-start reading when page changes (if enabled) - Moved to separate useEffect
    // to avoid initialization issues

    // Voice recognition setup
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(command);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    return () => {
      document.removeEventListener('keydown', handleKeyboardNavigation);
    };
  }, []);

  // Theme effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Screen reader announcements
  const announceToScreenReader = useCallback((message) => {
    setAnnouncements(message);
    if (announcerRef.current) {
      announcerRef.current.textContent = message;
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  // Save accessibility settings
  useEffect(() => {
    Object.entries(accessibilitySettings).forEach(([key, value]) => {
      localStorage.setItem(`accessibility_${key}`, value.toString());
    });
  }, [accessibilitySettings]);

  // Helper function to get page text
  const getPageText = useCallback((pageNumber) => {
    // This would typically extract text from the PDF page
    // For now, return a placeholder text
    return `This is the content of page ${pageNumber}. This is where the actual text from the PDF would be read aloud.`;
  }, []);

  // Text-to-Speech functions
  const speak = useCallback((text) => {
    if (!speechSynthesis || !accessibilitySettings.screenReaderEnabled) return;

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = accessibilitySettings.readingSpeed;
    utterance.pitch = accessibilitySettings.voicePitch;
    utterance.volume = accessibilitySettings.voiceVolume;

    // Set voice if available
    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      setVoice(selectedVoice);
    }

    utterance.onstart = () => {
      setIsReading(true);
      setAudioControls(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    };
    utterance.onend = () => {
      setIsReading(false);
      setAudioControls(prev => ({ ...prev, isPlaying: false, isPaused: false }));
      
      // Auto-advance to next page if enabled and looping
      if (audioControls.isLooping && accessibilitySettings.autoRead) {
        if (currentPage < totalPages) {
          setTimeout(() => {
            jumpToNextPage();
            if (accessibilitySettings.autoRead) {
              const nextPageText = getPageText(currentPage + 1);
              speak(nextPageText);
            }
          }, 1000); // 1 second pause between pages
        } else if (audioControls.isLooping) {
          // Loop back to beginning
          setTimeout(() => {
            jumpToPage(1);
            if (accessibilitySettings.autoRead) {
              const firstPageText = getPageText(1);
              speak(firstPageText);
            }
          }, 1000);
        }
      }
    };
    utterance.onerror = () => {
      setIsReading(false);
      setAudioControls(prev => ({ ...prev, isPlaying: false, isPaused: false }));
    };

    speechSynthesis.speak(utterance);
    setCurrentUtterance(utterance);
  }, [speechSynthesis, accessibilitySettings, audioControls.isLooping, currentPage, totalPages, jumpToNextPage, jumpToPage, getPageText, accessibilitySettings.autoRead]);

  // Auto-start reading when page changes (if enabled)
  useEffect(() => {
    if (accessibilitySettings.autoRead && accessibilitySettings.screenReaderEnabled && currentPage > 0 && currentBook) {
      const autoReadTimeout = setTimeout(() => {
        const pageText = getPageText(currentPage);
        const textToRead = `Page ${currentPage}. ${pageText}`;
        speak(textToRead);
        setAudioControls(prev => ({ ...prev, isPlaying: true, isPaused: false }));
        announceToScreenReader(`Auto-reading started for page ${currentPage}`);
      }, 1500); // 1.5 second delay to let the page settle

      return () => clearTimeout(autoReadTimeout);
    }
  }, [currentPage, currentBook, accessibilitySettings.autoRead, accessibilitySettings.screenReaderEnabled, getPageText, speak, announceToScreenReader]);

  // Enhanced audio control functions
  const pauseReading = useCallback(() => {
    if (speechSynthesis && isReading) {
      speechSynthesis.pause();
      setAudioControls(prev => ({ ...prev, isPlaying: false, isPaused: true }));
    }
  }, [speechSynthesis, isReading]);

  const resumeReading = useCallback(() => {
    if (speechSynthesis && isReading) {
      speechSynthesis.resume();
      setAudioControls(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    }
  }, [speechSynthesis, isReading]);

  const stopSpeaking = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsReading(false);
      setAudioControls(prev => ({ ...prev, isPlaying: false, isPaused: false }));
    }
  }, [speechSynthesis]);

  const repeatPage = useCallback(() => {
    if (!currentBook) return;
    
    const textToRead = `Page ${currentPage}. ${getPageText(currentPage)}`;
    speak(textToRead);
    announceToScreenReader(`Repeating page ${currentPage}`);
  }, [currentBook, currentPage, speak, announceToScreenReader, getPageText]);

  const skipToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      jumpToNextPage();
      setAudioControls(prev => ({ ...prev, isPlaying: true }));
      announceToScreenReader(`Skipped to page ${currentPage + 1}`);
    } else if (audioControls.isLooping) {
      jumpToPage(1);
      announceToScreenReader('Looped back to first page');
    }
  }, [currentPage, totalPages, jumpToNextPage, jumpToPage, audioControls.isLooping, announceToScreenReader]);

  const skipToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      jumpToPreviousPage();
      setAudioControls(prev => ({ ...prev, isPlaying: true }));
      announceToScreenReader(`Skipped to page ${currentPage - 1}`);
    }
  }, [currentPage, jumpToPreviousPage, announceToScreenReader]);

  const toggleLoopReading = useCallback(() => {
    const newLoopState = !accessibilitySettings.loopReading;
    updateAccessibilitySetting('loopReading', newLoopState);
    setAudioControls(prev => ({ ...prev, isLooping: newLoopState }));
    announceToScreenReader(`Loop reading ${newLoopState ? 'enabled' : 'disabled'}`);
  }, [accessibilitySettings.loopReading, updateAccessibilitySetting, announceToScreenReader]);

  const startAutoReading = useCallback(() => {
    if (!currentBook) return;
    
    // Check if auto-read is enabled in accessibility settings
    if (accessibilitySettings.autoRead) {
      const textToRead = `Reading ${currentBook.title} by ${currentBook.author || 'Unknown author'}. Page ${currentPage} of ${totalPages}. ${getPageText(currentPage)}`;
      speak(textToRead);
      setAudioControls(prev => ({ ...prev, isPlaying: true, isPaused: false }));
      announceToScreenReader(`Started auto-reading ${currentBook.title}`);
    } else {
      announceToScreenReader('Auto-read is disabled. Enable it in accessibility settings.');
    }
  }, [currentBook, currentPage, totalPages, accessibilitySettings.autoRead, getPageText, speak, announceToScreenReader]);

  // Voice recording functions
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const newNote = {
          id: Date.now(),
          bookId: currentBook?.id,
          page: currentPage,
          audioUrl,
          timestamp: new Date().toISOString(),
          duration: chunks.length * 100 // Approximate duration
        };

        const updatedNotes = [...recordedNotes, newNote];
        setRecordedNotes(updatedNotes);
        localStorage.setItem('recordedNotes', JSON.stringify(updatedNotes));
        
        announceToScreenReader('Audio note recorded successfully');
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks([]);
      setIsRecording(true);
      announceToScreenReader('Started recording audio note');
    } catch (error) {
      console.error('Error starting recording:', error);
      announceToScreenReader('Unable to start recording. Please check microphone permissions.');
    }
  }, [currentBook, currentPage, recordedNotes, announceToScreenReader]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setMediaRecorder(null);
    }
  }, [mediaRecorder, isRecording]);

  // Voice command functions
  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      recognition.start();
      setIsListening(true);
      announceToScreenReader('Listening for voice commands');
    }
  }, [recognition, isListening, announceToScreenReader]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  // Bookmark functionality
  const toggleBookmark = useCallback(() => {
    if (!currentBook || currentPage === 0) return;

    const bookmarkKey = `${currentBook.id}-${currentPage}`;
    const existingBookmarkIndex = bookmarks.findIndex(bm => bm.key === bookmarkKey);

    let newBookmarks;
    if (existingBookmarkIndex > -1) {
      newBookmarks = bookmarks.filter((_, index) => index !== existingBookmarkIndex);
    } else {
      newBookmarks = [
        ...bookmarks,
        {
          key: bookmarkKey,
          bookId: currentBook.id,
          bookTitle: currentBook.title,
          page: currentPage,
          timestamp: new Date().toISOString()
        }
      ];
    }

    setBookmarks(newBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
  }, [currentBook, currentPage, bookmarks]);

  // Check if current page is bookmarked
  const isCurrentPageBookmarked = useCallback(() => {
    return bookmarks.some(bm =>
      bm.bookId === currentBook?.id && bm.page === currentPage
    );
  }, [bookmarks, currentBook, currentPage]);

  const handleVoiceCommand = useCallback((command) => {
    setVoiceCommandText(command);
    
    // Parse voice commands
    if (command.includes('next page') || command.includes('next')) {
      if (currentPage < totalPages) {
        jumpToNextPage();
        announceToScreenReader(`Moved to page ${currentPage + 1}`);
      }
    } else if (command.includes('previous page') || command.includes('back')) {
      if (currentPage > 1) {
        jumpToPreviousPage();
        announceToScreenReader(`Moved to page ${currentPage - 1}`);
      }
    } else if (command.includes('zoom in')) {
      ZoomIn();
      announceToScreenReader('Zoomed in');
    } else if (command.includes('zoom out')) {
      ZoomOut();
      announceToScreenReader('Zoomed out');
    } else if (command.includes('search for')) {
      const searchTerm = command.replace('search for', '').trim();
      if (searchTerm) {
        setSearchOpen(true);
        announceToScreenReader(`Searching for ${searchTerm}`);
      }
    } else if (command.includes('bookmark')) {
      toggleBookmark();
      announceToScreenReader(isCurrentPageBookmarked() ? 'Bookmark removed' : 'Page bookmarked');
    } else if (command.includes('read aloud') || command.includes('start reading')) {
      startAutoReading();
    } else if (command.includes('stop reading')) {
      stopSpeaking();
    } else if (command.includes('toggle sidebar')) {
      setSidebarOpen(!sidebarOpen);
      announceToScreenReader(sidebarOpen ? 'Sidebar closed' : 'Sidebar opened');
    } else if (command.includes('toggle theme')) {
      setTheme(theme === 'light' ? 'dark' : 'light');
      announceToScreenReader(`Switched to ${theme === 'light' ? 'dark' : 'light'} theme`);
    } else if (command.includes('toggle accessibility') || command.includes('accessibility settings')) {
      setAccessibilityOpen(!accessibilityOpen);
      announceToScreenReader(accessibilityOpen ? 'Accessibility settings closed' : 'Accessibility settings opened');
    } else if (command.includes('high contrast')) {
      updateAccessibilitySetting('highContrast', !accessibilitySettings.highContrast);
      announceToScreenReader(`High contrast ${accessibilitySettings.highContrast ? 'disabled' : 'enabled'}`);
    } else if (command.includes('large text')) {
      updateAccessibilitySetting('largeText', !accessibilitySettings.largeText);
      announceToScreenReader(`Large text ${accessibilitySettings.largeText ? 'disabled' : 'enabled'}`);
    } else if (command.includes('focus mode')) {
      updateAccessibilitySetting('focusMode', !accessibilitySettings.focusMode);
      announceToScreenReader(`Focus mode ${accessibilitySettings.focusMode ? 'disabled' : 'enabled'}`);
    } else if (command.includes('offline mode')) {
      updateAccessibilitySetting('offlineMode', !accessibilitySettings.offlineMode);
      announceToScreenReader(`Offline mode ${accessibilitySettings.offlineMode ? 'disabled' : 'enabled'}`);
    } else if (command.includes('pause reading') || command.includes('pause')) {
      pauseReading();
      announceToScreenReader('Reading paused');
    } else if (command.includes('resume reading') || command.includes('resume')) {
      resumeReading();
      announceToScreenReader('Reading resumed');
    } else if (command.includes('repeat page') || command.includes('repeat current page')) {
      repeatPage();
      announceToScreenReader('Repeating current page');
    } else if (command.includes('skip next page') || command.includes('next page with audio')) {
      skipToNextPage();
    } else if (command.includes('skip previous page') || command.includes('previous page with audio')) {
      skipToPreviousPage();
    } else if (command.includes('loop reading') || command.includes('continuous reading')) {
      toggleLoopReading();
    } else if (command.includes('faster reading')) {
      const newSpeed = Math.min(3, accessibilitySettings.readingSpeed + 0.2);
      updateAccessibilitySetting('readingSpeed', newSpeed);
      announceToScreenReader(`Reading speed increased to ${newSpeed.toFixed(1)} times`);
    } else if (command.includes('slower reading')) {
      const newSpeed = Math.max(0.5, accessibilitySettings.readingSpeed - 0.2);
      updateAccessibilitySetting('readingSpeed', newSpeed);
      announceToScreenReader(`Reading speed decreased to ${newSpeed.toFixed(1)} times`);
    } else {
      announceToScreenReader(`Command "${command}" not recognized`);
    }
  }, [
    currentPage, totalPages, jumpToNextPage, jumpToPreviousPage,
    ZoomIn, ZoomOut, toggleBookmark, isCurrentPageBookmarked,
    startAutoReading, stopSpeaking, sidebarOpen, setSidebarOpen, theme, setTheme,
    announceToScreenReader
  ]);

  // Keyboard navigation
  const handleKeyboardNavigation = useCallback((event) => {
    // Don't interfere with form inputs
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        if (currentPage > 1) {
          jumpToPreviousPage();
          event.preventDefault();
        }
        break;
      case 'ArrowRight':
        if (currentPage < totalPages) {
          jumpToNextPage();
          event.preventDefault();
        }
        break;
      case 'f':
      case 'F':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          setSearchOpen(!searchOpen);
        }
        break;
      case 'b':
      case 'B':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          toggleBookmark();
        }
        break;
      case 'z':
      case 'Z':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          if (event.shiftKey) {
            ZoomOut();
          } else {
            ZoomIn();
          }
        }
        break;
      case 'Escape':
        if (searchOpen) {
          setSearchOpen(false);
          event.preventDefault();
        }
        break;
      case ' ':
        if (event.target === document.body) {
          event.preventDefault();
          if (currentPage < totalPages) {
            jumpToNextPage();
          }
        }
        break;
      default:
        break;
    }
  }, [currentPage, totalPages, searchOpen, jumpToNextPage, jumpToPreviousPage, toggleBookmark]);

  // Focus management
  const focusElement = useCallback((elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
      setFocusedElement(elementId);
    }
  }, []);

  // Offline support
  const cacheContent = useCallback(async (content) => {
    try {
      const cacheKey = `book_${currentBook?.id}_page_${currentPage}`;
      setCachedContent(prev => ({
        ...prev,
        [cacheKey]: content
      }));
      
      // Store in localStorage for persistence
      localStorage.setItem(cacheKey, JSON.stringify(content));
      announceToScreenReader('Content cached for offline reading');
    } catch (error) {
      console.error('Error caching content:', error);
    }
  }, [currentBook, currentPage, announceToScreenReader]);

  // Toggle accessibility settings
  const toggleAccessibilitySetting = useCallback((setting) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  }, []);

  // Fetch books
  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/books/")
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch books');
        return res.json();
      })
      .then((data) => {
        setBooks(data);
        const selectedBook = data.find((book) => book.id.toString() === id);

        if (selectedBook) {
          setCurrentBook(selectedBook);
          if (selectedBook.pdf_file) {
            setPdfUrl(selectedBook.pdf_file);
          } else {
            setPdfUrl(null);
          }
        } else {
          const firstPdfBook = data.find((book) => book.pdf_file);
          setCurrentBook(firstPdfBook || null);
          setPdfUrl(firstPdfBook ? firstPdfBook.pdf_file : null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch books", err);
        setLoading(false);
      });
  }, [id]);

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarks(savedBookmarks);
  }, []);

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarks(savedBookmarks);
  }, []);

  // Filter books to same subcategory
  const filteredBooks = currentBook
    ? books.filter(
        (book) =>
          book.subcategory === currentBook.subcategory &&
          book.pdf_file
      )
    : [];

  // Handle book selection
  const handleBookSelect = (book) => {
    if (book.pdf_file) {
      setPdfUrl(book.pdf_file);
      setCurrentBook(book);
      setPdfLoading(true);
      setReadingProgress(0);
      navigate(`/read/${book.id}`, { replace: true });
    }
  };

  // Handle page change
  const handlePageChange = (e) => {
    const page = parseInt(e.target.value);
    if (page >= 1 && page <= totalPages) {
      jumpToPage(page - 1);
      setCurrentPage(page);
    }
  };

  // Quick page navigation
  const quickJumpToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      jumpToPage(pageNumber - 1);
      setCurrentPage(pageNumber);
    }
  };

  // Enhanced zoom functions
  const zoomToFit = () => {
    ZoomTo(SpecialZoomLevel.PageFit);
  };

  const zoomToWidth = () => {
    ZoomTo(SpecialZoomLevel.PageWidth);
  };

  const zoomToActual = () => {
    ZoomTo(SpecialZoomLevel.ActualSize);
  };

  // Quick zoom levels
  const quickZoom = (scale) => {
    ZoomTo(scale);
  };

  // Reading progress calculation
  const updateReadingProgress = (page) => {
    if (totalPages > 0) {
      const progress = (page / totalPages) * 100;
      setReadingProgress(progress);
    }
  };

  // Handle document load
  const handleDocumentLoad = (doc) => {
    setPdfLoading(false);
    setTotalPages(doc.numPages);
    setCurrentPage(1); // Start at page 1
    updateReadingProgress(1);
  };

  // Handle page change from viewer
  const handleViewerPageChange = (e) => {
    const newPage = e.currentPage + 1;
    setCurrentPage(newPage);
    updateReadingProgress(newPage);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your library...</p>
        </div>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl">
          <div className="text-8xl mb-6">📚</div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">No PDF Available</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">We couldn't find a PDF file for this book.</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            ← Back to Library
          </button>
        </div>
      </div>
    );
  }

  // Accessibility Settings Panel Component
  const AccessibilityPanel = () => {
    const [panelOpen, setPanelOpen] = useState(false);

    return (
      <>
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="fixed top-4 left-20 z-50 bg-purple-600/80 hover:bg-purple-700/80 backdrop-blur-sm text-white p-2 rounded-xl shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Accessibility settings"
          title="Accessibility Settings"
        >
          ♿
        </button>

        {panelOpen && (
          <div className="fixed top-16 left-20 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 w-80 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Accessibility Settings</h3>
            
            <div className="space-y-4">
              {/* Screen Reader */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Screen Reader Support
                </label>
                <button
                  onClick={() => toggleAccessibilitySetting('screenReaderEnabled')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    accessibilitySettings.screenReaderEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  aria-label="Toggle screen reader support"
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    accessibilitySettings.screenReaderEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  High Contrast Mode
                </label>
                <button
                  onClick={() => toggleAccessibilitySetting('highContrast')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    accessibilitySettings.highContrast ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  aria-label="Toggle high contrast mode"
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    accessibilitySettings.highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Large Text */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Large Text
                </label>
                <button
                  onClick={() => toggleAccessibilitySetting('largeText')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    accessibilitySettings.largeText ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  aria-label="Toggle large text"
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    accessibilitySettings.largeText ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Focus Mode */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Focus Mode
                </label>
                <button
                  onClick={() => toggleAccessibilitySetting('focusMode')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    accessibilitySettings.focusMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  aria-label="Toggle focus mode"
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    accessibilitySettings.focusMode ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Voice Commands */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Voice Commands
                </label>
                <button
                  onClick={() => toggleAccessibilitySetting('voiceCommands')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    accessibilitySettings.voiceCommands ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  aria-label="Toggle voice commands"
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    accessibilitySettings.voiceCommands ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Auto Read */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Auto Reading
                </label>
                <button
                  onClick={() => toggleAccessibilitySetting('autoRead')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    accessibilitySettings.autoRead ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  aria-label="Toggle auto reading"
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    accessibilitySettings.autoRead ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Reading Speed */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Reading Speed: {accessibilitySettings.readingSpeed}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={accessibilitySettings.readingSpeed}
                  onChange={(e) => setAccessibilitySettings(prev => ({
                    ...prev,
                    readingSpeed: parseFloat(e.target.value)
                  }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  aria-label="Reading speed"
                />
              </div>

              {/* Voice Commands Help */}
              {accessibilitySettings.voiceCommands && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Voice Commands:</h4>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• "Next page" / "Previous page"</li>
                    <li>• "Zoom in" / "Zoom out"</li>
                    <li>• "Search for [term]"</li>
                    <li>• "Bookmark" / "Read aloud"</li>
                    <li>• "Toggle sidebar" / "Toggle theme"</li>
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={() => setPanelOpen(false)}
              className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
            >
              Close Settings
            </button>
          </div>
        )}
      </>
    );
  };

  // Apply accessibility classes
  const getAccessibilityClasses = () => {
    const classes = [];
    
    if (accessibilitySettings.highContrast) {
      classes.push('contrast-more');
    }
    
    if (accessibilitySettings.largeText) {
      classes.push('text-lg');
    }
    
    if (accessibilitySettings.focusMode) {
      classes.push('focus-mode');
    }
    
    if (accessibilitySettings.reducedMotion) {
      classes.push('reduce-motion');
    }
    
    return classes.join(' ');
  };

  return (
    <div
      className={`flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 transition-colors duration-500 ${getAccessibilityClasses()}`}
      role="application"
      aria-label="Digital Book Reader"
      aria-describedby="reader-instructions"
    >
      {/* Screen Reader Announcements */}
      <div
        id="screen-reader-announcements"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        ref={announcerRef}
      >
        {announcements}
      </div>

      {/* Accessibility Instructions */}
      <div id="reader-instructions" className="sr-only">
        Use arrow keys to navigate pages. Press F to search, B to bookmark, Ctrl+Z to zoom.
      </div>

      {/* Accessibility Panel */}
      <AccessibilityPanel />
      {/* Enhanced Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-6 left-6 z-50">
        <button
          onClick={() => {
            setSidebarOpen(!sidebarOpen);
            announceToScreenReader(sidebarOpen ? 'Sidebar closed' : 'Sidebar opened');
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20"
          aria-label={sidebarOpen ? "Close book navigation sidebar" : "Open book navigation sidebar"}
          aria-expanded={sidebarOpen}
          aria-controls="book-navigation-sidebar"
        >
          <span className="text-lg">{sidebarOpen ? '←' : '📚'}</span>
        </button>
      </div>

      {/* Enhanced Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 p-3 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110 border border-gray-200/50 dark:border-gray-700/50"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          <span className="text-lg">{theme === 'light' ? '🌙' : '☀️'}</span>
        </button>
      </div>

      {/* Enhanced Modern Sidebar */}
      <div
        id="book-navigation-sidebar"
        className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 transition-all duration-500 ease-out
        fixed md:relative w-72 md:w-80 h-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl md:shadow-xl z-40
        flex flex-col border-r border-gray-200/30 dark:border-gray-700/30
      `}
        role="navigation"
        aria-label="Book navigation sidebar"
        aria-describedby="sidebar-instructions"
      >
        <div id="sidebar-instructions" className="sr-only">
          Navigate through books in the current category. Use Tab to move between books.
        </div>
        {/* Enhanced Sidebar Header */}
        <div className="p-6 border-b border-gray-200/30 dark:border-gray-700/30 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <span className="text-white text-lg">📚</span>
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {currentBook?.subcategory || "Collection"}
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} available
              </p>
            </div>
          </div>
          
          {/* Enhanced Reading Progress */}
          {currentBook && (
            <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reading Progress</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{Math.round(readingProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${readingProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>Page {currentPage}</span>
                <span>of {totalPages}</span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Books List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredBooks.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl opacity-60">📖</span>
              </div>
              <p className="text-sm font-medium">No other books in this category</p>
              <p className="text-xs text-gray-400 mt-1">Explore other categories to find more books</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleBookSelect(book)}
                  className={`
                    group p-4 rounded-2xl border cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1
                    ${
                      currentBook?.id === book.id
                        ? "border-blue-400 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-purple-900/30 shadow-xl shadow-blue-200/50 dark:shadow-blue-900/30"
                        : "border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/80 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg hover:bg-white dark:hover:bg-gray-800"
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-lg ${
                      currentBook?.id === book.id
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
                        : "bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 text-gray-600 dark:text-gray-300"
                    }`}>
                      📖
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-sm leading-tight ${
                        currentBook?.id === book.id 
                          ? "text-blue-700 dark:text-blue-300" 
                          : "text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      }`}>
                        {book.title}
                      </h3>
                      {book.author && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                          by {book.author}
                        </p>
                      )}
                      {currentBook?.id === book.id && (
                        <div className="flex items-center mt-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse mr-2"></div>
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Currently Reading</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookmarks Section */}
        {bookmarks.length > 0 && (
          <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-3">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-sm">Bookmarks</h3>
            <div className="space-y-1 max-h-24 overflow-y-auto" role="list" aria-label="Bookmarked pages">
              {bookmarks
                .filter(bm => bm.bookId === currentBook?.id)
                .map((bookmark, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      quickJumpToPage(bookmark.page);
                      announceToScreenReader(`Jumped to bookmark on page ${bookmark.page}`);
                    }}
                    className="flex items-center p-1.5 rounded-md bg-yellow-50 dark:bg-yellow-900/20 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
                    role="listitem"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        quickJumpToPage(bookmark.page);
                        announceToScreenReader(`Jumped to bookmark on page ${bookmark.page}`);
                      }
                    }}
                    aria-label={`Bookmark on page ${bookmark.page}`}
                  >
                    <span className="text-yellow-500 mr-1 text-xs" aria-hidden="true">🔖</span>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Page {bookmark.page}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Recorded Notes Section */}
        {recordedNotes.length > 0 && (
          <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-3">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-sm">Audio Notes</h3>
            <div className="space-y-1 max-h-24 overflow-y-auto" role="list" aria-label="Recorded audio notes">
              {recordedNotes
                .filter(note => note.bookId === currentBook?.id)
                .map((note) => (
                  <div
                    key={note.id}
                    className="flex items-center p-1.5 rounded-md bg-purple-50 dark:bg-purple-900/20 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                    role="listitem"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        // Play audio note
                        const audio = new Audio(note.audioUrl);
                        audio.play();
                        announceToScreenReader(`Playing audio note from page ${note.page}`);
                      }
                    }}
                    onClick={() => {
                      const audio = new Audio(note.audioUrl);
                      audio.play();
                      announceToScreenReader(`Playing audio note from page ${note.page}`);
                    }}
                    aria-label={`Audio note from page ${note.page}`}
                  >
                    <span className="text-purple-500 mr-1 text-xs" aria-hidden="true">🎵</span>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Page {note.page}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Remove note
                        const updatedNotes = recordedNotes.filter(n => n.id !== note.id);
                        setRecordedNotes(updatedNotes);
                        localStorage.setItem('recordedNotes', JSON.stringify(updatedNotes));
                        announceToScreenReader('Audio note deleted');
                      }}
                      className="ml-auto text-red-500 hover:text-red-700"
                      aria-label="Delete audio note"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Enhanced Modern Top Bar */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-700/30 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Enhanced Book Info */}
            <div className="flex-1 min-w-0 mr-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm shadow-lg">
                  📖
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate leading-tight">
                    {currentBook?.title || "PDF Viewer"}
                  </h1>
                  {currentBook?.author && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      by {currentBook.author}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Compact Controls */}
            <div className="flex items-center gap-2">
              {/* Enhanced Quick Zoom Controls */}
              <div className="hidden md:flex items-center gap-1 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-1.5 shadow-inner">
                <button
                  onClick={() => quickZoom(0.5)}
                  className="text-xs px-3 py-2 rounded-lg hover:bg-white dark:hover:bg-gray-500 transition-all duration-200 hover:shadow-sm font-medium"
                  title="50%"
                >
                  50%
                </button>
                <button
                  onClick={zoomToWidth}
                  className="text-xs px-3 py-2 rounded-lg hover:bg-white dark:hover:bg-gray-500 transition-all duration-200 hover:shadow-sm font-medium"
                  title="Fit Width"
                >
                  Width
                </button>
                <button
                  onClick={zoomToFit}
                  className="text-xs px-3 py-2 rounded-lg hover:bg-white dark:hover:bg-gray-500 transition-all duration-200 hover:shadow-sm font-medium"
                  title="Fit Page"
                >
                  Fit
                </button>
                <button
                  onClick={zoomToActual}
                  className="text-xs px-3 py-2 rounded-lg hover:bg-white dark:hover:bg-gray-500 transition-all duration-200 hover:shadow-sm font-medium"
                  title="Actual Size"
                >
                  100%
                </button>
                <button
                  onClick={() => quickZoom(1.5)}
                  className="text-xs px-3 py-2 rounded-lg hover:bg-white dark:hover:bg-gray-500 transition-all duration-200 hover:shadow-sm font-medium"
                  title="150%"
                >
                  150%
                </button>
              </div>

              {/* Enhanced Standard Zoom Controls */}
              <div className="flex items-center gap-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-1.5 shadow-inner border border-blue-200/50 dark:border-blue-700/50">
                <button
                  onClick={ZoomOut}
                  className="p-2 rounded-lg hover:bg-white dark:hover:bg-blue-800/50 transition-all duration-200 hover:shadow-sm text-blue-600 dark:text-blue-400"
                  title="Zoom Out"
                >
                  ➖
                </button>
                <span className="text-sm font-bold text-blue-700 dark:text-blue-300 px-3 min-w-12 text-center">
                  <CurrentScale>
                    {(scale) => scale && !isNaN(scale) ? `${Math.round(scale * 100)}%` : '100%'}
                  </CurrentScale>
                </span>
                <button
                  onClick={ZoomIn}
                  className="p-2 rounded-lg hover:bg-white dark:hover:bg-blue-800/50 transition-all duration-200 hover:shadow-sm text-blue-600 dark:text-blue-400"
                  title="Zoom In"
                >
                  ➕
                </button>
              </div>

              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex items-center gap-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 hover:shadow transition text-sm"
                title="Search"
              >
                <span>🔍</span>
              </button>

              {/* Accessibility Controls */}
              <button
                onClick={() => setAccessibilityOpen(!accessibilityOpen)}
                className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg px-2 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-sm"
                title="Accessibility Settings"
              >
                <span>♿</span>
              </button>

              {/* Text-to-Speech Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={isReading ? pauseReading : startAutoReading}
                  className={`p-1 rounded-lg transition ${
                    isReading
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                      : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                  }`}
                  title={isReading ? "Pause reading" : "Start reading aloud"}
                  aria-label={isReading ? "Pause reading aloud" : "Start reading aloud"}
                >
                  {isReading && !audioControls.isPaused ? '⏸️' : '▶️'}
                </button>

                <button
                  onClick={stopSpeaking}
                  disabled={!isReading}
                  className="p-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Stop reading"
                  aria-label="Stop reading aloud"
                >
                  ⏹️
                </button>

                <button
                  onClick={repeatPage}
                  disabled={!isReading}
                  className="p-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Repeat current page"
                  aria-label="Repeat current page"
                >
                  🔁
                </button>

                <button
                  onClick={skipToPreviousPage}
                  disabled={currentPage <= 1}
                  className="p-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous page with audio"
                  aria-label="Go to previous page and continue reading"
                >
                  ⏮
                </button>

                <button
                  onClick={skipToNextPage}
                  disabled={currentPage >= totalPages && !audioControls.isLooping}
                  className="p-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next page with audio"
                  aria-label="Go to next page and continue reading"
                >
                  ⏭
                </button>

                <button
                  onClick={toggleLoopReading}
                  className={`p-1 rounded-lg transition ${
                    audioControls.isLooping
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                  }`}
                  title="Toggle loop reading"
                  aria-label={audioControls.isLooping ? "Disable loop reading" : "Enable loop reading"}
                >
                  🔁
                </button>
              </div>

              {/* Voice Recording */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-1 rounded-lg transition ${
                  isRecording
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse'
                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
                title={isRecording ? "Stop recording" : "Record audio note"}
                aria-label={isRecording ? "Stop recording audio note" : "Record audio note"}
              >
                {isRecording ? '⏺️' : '🎙️'}
              </button>

              {/* Voice Commands */}
              {accessibilitySettings.voiceCommands && (
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`p-1 rounded-lg transition ${
                    isListening
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 animate-pulse'
                      : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                  }`}
                  title={isListening ? "Stop listening" : "Start voice commands"}
                  aria-label={isListening ? "Stop voice recognition" : "Start voice recognition"}
                >
                  🎤
                </button>
              )}

              {/* Bookmark Button */}
              <button
                onClick={toggleBookmark}
                className={`p-1 rounded-lg transition ${
                  isCurrentPageBookmarked()
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                }`}
                title="Bookmark this page"
                aria-label={isCurrentPageBookmarked() ? "Remove bookmark from this page" : "Bookmark this page"}
              >
                {isCurrentPageBookmarked() ? '🔖' : '📑'}
              </button>

              {/* Fullscreen */}
              <button
                onClick={EnterFullScreen}
                className="p-1 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                title="Fullscreen"
                aria-label="Enter fullscreen mode"
              >
                ⛶
              </button>
            </div>
          </div>

          {/* Search Panel */}
          {searchOpen && (
            <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700">
              <Search>
                {(searchProps) => (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={searchProps.keyword}
                      onChange={(e) => {
                        searchProps.setKeyword(e.target.value);
                        if (e.target.value) {
                          searchProps.search();
                        }
                      }}
                      placeholder="Search in this PDF..."
                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          searchProps.search();
                        }
                      }}
                      aria-label="Search in PDF document"
                      aria-describedby="search-help"
                    />
                    <div id="search-help" className="sr-only">
                      Type your search term and press Enter to search through the PDF document
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => searchProps.jumpToNextMatch()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition text-sm"
                        disabled={!searchProps.keyword}
                      >
                        Next
                      </button>
                      <button
                        onClick={() => searchProps.jumpToPreviousMatch()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition text-sm"
                        disabled={!searchProps.keyword}
                      >
                        Prev
                      </button>
                      <button
                        onClick={() => {
                          searchProps.setKeyword('');
                          setSearchOpen(false);
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded transition text-sm"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </Search>
            </div>
          )}

          {/* Accessibility Panel */}
          {accessibilityOpen && (
            <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  ♿ Accessibility Settings
                </h3>
                <button
                  onClick={() => setAccessibilityOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Screen Reader Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Screen Reader Support</span>
                  <button
                    onClick={() => updateAccessibilitySetting('screenReaderEnabled', !accessibilitySettings.screenReaderEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      accessibilitySettings.screenReaderEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      accessibilitySettings.screenReaderEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* High Contrast Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">High Contrast</span>
                  <button
                    onClick={() => updateAccessibilitySetting('highContrast', !accessibilitySettings.highContrast)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      accessibilitySettings.highContrast ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      accessibilitySettings.highContrast ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Large Text Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Large Text</span>
                  <button
                    onClick={() => updateAccessibilitySetting('largeText', !accessibilitySettings.largeText)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      accessibilitySettings.largeText ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      accessibilitySettings.largeText ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Focus Mode Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Focus Mode</span>
                  <button
                    onClick={() => updateAccessibilitySetting('focusMode', !accessibilitySettings.focusMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      accessibilitySettings.focusMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      accessibilitySettings.focusMode ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Voice Commands Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Voice Commands</span>
                  <button
                    onClick={() => updateAccessibilitySetting('voiceCommands', !accessibilitySettings.voiceCommands)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      accessibilitySettings.voiceCommands ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      accessibilitySettings.voiceCommands ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Auto Read Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto Read Aloud</span>
                  <button
                    onClick={() => updateAccessibilitySetting('autoRead', !accessibilitySettings.autoRead)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      accessibilitySettings.autoRead ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      accessibilitySettings.autoRead ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Loop Reading Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Loop Reading</span>
                  <button
                    onClick={() => updateAccessibilitySetting('loopReading', !accessibilitySettings.loopReading)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      accessibilitySettings.loopReading ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      accessibilitySettings.loopReading ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Reading Speed Control */}
                <div className="flex items-center justify-between sm:col-span-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reading Speed: {accessibilitySettings.readingSpeed.toFixed(1)}x</span>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={accessibilitySettings.readingSpeed}
                    onChange={(e) => updateAccessibilitySetting('readingSpeed', parseFloat(e.target.value))}
                    className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>

                {/* Voice Pitch Control */}
                <div className="flex items-center justify-between sm:col-span-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Voice Pitch: {accessibilitySettings.voicePitch.toFixed(1)}</span>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={accessibilitySettings.voicePitch}
                    onChange={(e) => updateAccessibilitySetting('voicePitch', parseFloat(e.target.value))}
                    className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>

                {/* Voice Volume Control */}
                <div className="flex items-center justify-between sm:col-span-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Voice Volume: {Math.round(accessibilitySettings.voiceVolume * 100)}%</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={accessibilitySettings.voiceVolume}
                    onChange={(e) => updateAccessibilitySetting('voiceVolume', parseFloat(e.target.value))}
                    className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>

                {/* Offline Mode Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Offline Mode</span>
                  <button
                    onClick={() => updateAccessibilitySetting('offlineMode', !accessibilitySettings.offlineMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      accessibilitySettings.offlineMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      accessibilitySettings.offlineMode ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Compact Page Navigation */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={jumpToPreviousPage}
                disabled={currentPage <= 1}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1 rounded transition text-sm"
              >
                ← Prev
              </button>
              
              <div className="flex items-center gap-1 bg-white dark:bg-gray-700 rounded px-2 py-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">Page</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage || 1}
                  onChange={handlePageChange}
                  className="w-12 text-center border-none bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-0 text-sm"
                  aria-label={`Current page. ${totalPages} total pages`}
                  aria-describedby="page-input-help"
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">/ {totalPages}</span>
              </div>
              <div id="page-input-help" className="sr-only">
                Enter a page number between 1 and {totalPages} to jump to that page
              </div>

              <button
                onClick={jumpToNextPage}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1 rounded transition text-sm"
                aria-label={`Go to next page. Current page ${currentPage} of ${totalPages}`}
              >
                Next →
              </button>

              {/* Quick Page Jumps */}
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => quickJumpToPage(1)}
                  disabled={currentPage === 1}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition"
                  title="First Page"
                >
                  ⏮
                </button>
                <button
                  onClick={() => quickJumpToPage(Math.max(1, currentPage - 10))}
                  disabled={currentPage <= 1}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition"
                  title="Back 10 Pages"
                >
                  -10
                </button>
                <button
                  onClick={() => quickJumpToPage(Math.min(totalPages, currentPage + 10))}
                  disabled={currentPage >= totalPages}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition"
                  title="Forward 10 Pages"
                >
                  +10
                </button>
                <button
                  onClick={() => quickJumpToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition"
                  title="Last Page"
                >
                  ⏭
                </button>
              </div>
            </div>

            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>

        {/* Enhanced PDF Viewer Container */}
        <div className="flex-1 bg-gradient-to-br from-gray-100 via-slate-100 to-blue-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 p-4 overflow-hidden">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl h-full overflow-hidden relative border border-gray-200/50 dark:border-gray-700/50">
            {/* Enhanced PDF Loading Overlay */}
            {pdfLoading && (
              <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 flex items-center justify-center z-10 backdrop-blur-sm" role="status" aria-live="polite">
                <div className="text-center p-8 bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                  <div className="relative mb-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-800 mx-auto"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 dark:border-blue-400 mx-auto absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-800 dark:text-gray-200 text-lg font-semibold">Loading PDF...</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Preparing your reading experience</p>
                  </div>
                  <div className="mt-4 w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
  
            {/* PDF Viewer */}
            <div
              className="h-full"
              ref={viewerRef}
              role="document"
              aria-label={`PDF document: ${currentBook?.title || 'Document'}`}
              aria-describedby="pdf-viewer-help"
            >
              <div id="pdf-viewer-help" className="sr-only">
                This is a PDF document viewer. Use arrow keys to navigate pages,
                zoom controls to adjust view size, and search to find text within the document.
              </div>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={pdfUrl}
                  plugins={[
                    pageNavigationPluginInstance,
                    searchPluginInstance,
                    zoomPluginInstance,
                    fullScreenPluginInstance
                  ]}
                  defaultScale={SpecialZoomLevel.PageWidth}
                  onDocumentLoad={handleDocumentLoad}
                  onPageChange={handleViewerPageChange}
                  theme={theme === 'dark' ? 'dark' : 'light'}
                />
              </Worker>
            </div>
  
            {/* Enhanced Voice Command Status */}
            {isListening && (
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 voice-listening shadow-2xl backdrop-blur-sm border border-blue-400/30" role="status">
                  <div className="relative">
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-4 h-4 bg-white rounded-full animate-ping opacity-75"></div>
                  </div>
                  <span className="text-sm font-medium">🎤 Listening for commands...</span>
                </div>
              </div>
            )}
  
            {/* Enhanced Reading Status */}
            {isReading && (
              <div className="absolute top-6 right-6 z-20">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 auto-reading shadow-2xl backdrop-blur-sm border border-emerald-400/30" role="status">
                  <div className="relative">
                    <span className="text-lg animate-bounce">🔊</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Reading Aloud</span>
                    <span className="text-xs opacity-90">Page {currentPage} of {totalPages}</span>
                  </div>
                </div>
              </div>
            )}
  
            {/* Enhanced Recording Status */}
            {isRecording && (
              <div className="absolute top-6 left-6 z-20">
                <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 recording-indicator shadow-2xl backdrop-blur-sm border border-red-400/30" role="status">
                  <div className="relative">
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-4 h-4 bg-white rounded-full animate-ping opacity-75"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">🎙️ Recording Note</span>
                    <span className="text-xs opacity-90">Page {currentPage}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
  
        {/* Offline Mode Indicator */}
        {offlineMode && (
          <div className="offline-indicator" role="status" aria-live="polite">
            📱 Offline Mode
          </div>
        )}
  
        {/* Voice Command Feedback */}
        {voiceCommandText && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-md" role="status">
            <div className="text-sm">
              <span className="font-semibold">Heard:</span> "{voiceCommandText}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadPage;