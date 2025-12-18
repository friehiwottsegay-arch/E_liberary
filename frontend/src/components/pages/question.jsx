import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductsWithExams from "./Relatedexam";
import { 
  FaCheckCircle, 
  FaClock, 
  FaList, 
  FaBook, 
  FaRedo, 
  FaArrowLeft, 
  FaArrowRight,
  FaPlay,
  FaPause,
  FaFlag,
  FaChevronRight,
  FaChevronLeft,
  FaStar,
  FaChartBar,
  FaUserClock,
  FaHome,
  FaSave,
  FaPrint,
  FaShare,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle
} from "react-icons/fa";

// Mock data for fallback
const mockQuestions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correct_option: "Paris",
    explain: "Paris is the capital and most populous city of France."
  },
  {
    id: 2,
    question: "Which programming language is primarily used for web development?",
    options: ["Python", "JavaScript", "Java", "C++"],
    correct_option: "JavaScript",
    explain: "JavaScript is the primary language for client-side web development."
  },
  {
    id: 3,
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Markup Language",
      "Home Tool Markup Language"
    ],
    correct_option: "Hyper Text Markup Language",
    explain: "HTML is the standard markup language for creating web pages."
  }
];

const QUESTIONS_PER_PAGE = 1;

const ExamPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState("exam");
  const [subjectName, setSubjectName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  const [markedQuestions, setMarkedQuestions] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showExplanation, setShowExplanation] = useState(true);
  const [savedProgress, setSavedProgress] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);

  // Enhanced API fetch with error handling
  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid content type. Expected JSON.');
      }
      
      return await response.json();
    } catch (err) {
      throw new Error(`Failed to fetch: ${err.message}`);
    }
  };

  // Load saved progress and preferences
  useEffect(() => {
    const saved = localStorage.getItem(`exam-${subjectId}`);
    const preferences = localStorage.getItem('exam-preferences');
    
    if (preferences) {
      try {
        const prefs = JSON.parse(preferences);
        setSoundEnabled(prefs.soundEnabled ?? true);
        setDarkMode(prefs.darkMode ?? false);
        setShowExplanation(prefs.showExplanation ?? true);
      } catch (e) {
        console.warn('Failed to parse preferences:', e);
      }
    }

    if (saved) {
      try {
        const data = JSON.parse(saved);
        setAnswers(data.answers || {});
        setCurrentPage(data.currentPage || 0);
        setTimeLeft(data.timeLeft || questions.length * 60);
        setMarkedQuestions(new Set(data.markedQuestions || []));
        setSavedProgress(true);
      } catch (e) {
        console.warn('Failed to parse saved progress:', e);
      }
    }
  }, [subjectId]);

  // Save progress automatically
  useEffect(() => {
    if (questions.length > 0) {
      const progress = {
        answers,
        currentPage,
        timeLeft,
        markedQuestions: Array.from(markedQuestions),
        timestamp: new Date().toISOString()
      };
      try {
        localStorage.setItem(`exam-${subjectId}`, JSON.stringify(progress));
      } catch (e) {
        console.warn('Failed to save progress:', e);
      }
    }
  }, [answers, currentPage, timeLeft, markedQuestions, subjectId, questions.length]);

  // Save preferences
  useEffect(() => {
    const preferences = {
      soundEnabled,
      darkMode,
      showExplanation
    };
    try {
      localStorage.setItem('exam-preferences', JSON.stringify(preferences));
    } catch (e) {
      console.warn('Failed to save preferences:', e);
    }
  }, [soundEnabled, darkMode, showExplanation]);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Lock body scroll for full screen
  useEffect(() => {
    if (fullScreen) {
      document.body.style.overflow = "hidden";
      document.documentElement.requestFullscreen?.().catch(console.error);
    } else {
      document.body.style.overflow = "auto";
      document.exitFullscreen?.().catch(console.error);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [fullScreen]);

  // Enhanced quiz data fetching with multiple fallbacks
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Try multiple endpoints
        const endpoints = [
          `http://127.0.0.1:8000/api/subjects/`,
          `http://127.0.0.1:8000/api/qcategories/`
        ];

        let subjectsData = null;
        
        for (const endpoint of endpoints) {
          try {
            console.log(`Trying endpoint: ${endpoint}`);
            subjectsData = await fetchData(endpoint);
            break; // Exit loop if successful
          } catch (err) {
            console.warn(`Endpoint ${endpoint} failed:`, err.message);
            continue;
          }
        }

        if (!subjectsData) {
          throw new Error("Could not connect to server. Using demo data.");
        }

        // Find subject
        const sub = Array.isArray(subjectsData) 
          ? subjectsData.find(s => String(s.id) === String(subjectId))
          : subjectsData.results?.find(s => String(s.id) === String(subjectId));

        if (!sub) {
          throw new Error("Subject not found. Using demo questions.");
        }

        setSubjectName(sub.name || sub.title || `Subject ${subjectId}`);

        // Try to fetch questions - backend provides /api/exams/<id>/ returning { name, duration, questions }
        const questionEndpoints = [
          `http://127.0.0.1:8000/api/exams/${sub.id}/`,
          `http://127.0.0.1:8000/api/question/${sub.name}/`,
          `http://127.0.0.1:8000/api/questions/?subject=${sub.id}`
        ];

        let questionsData = null;
        
        for (const endpoint of questionEndpoints) {
          try {
            console.log(`Trying questions endpoint: ${endpoint}`);
            questionsData = await fetchData(endpoint);
            break;
          } catch (err) {
            console.warn(`Questions endpoint ${endpoint} failed:`, err.message);
            continue;
          }
        }

        if (questionsData) {
          // Handle different response formats
          if (Array.isArray(questionsData)) {
            setQuestions(questionsData);
          } else if (questionsData.questions && Array.isArray(questionsData.questions)) {
            setQuestions(questionsData.questions);
          } else if (questionsData.results && Array.isArray(questionsData.results)) {
            setQuestions(questionsData.results);
          } else {
            throw new Error("Invalid questions format. Using demo data.");
          }
        } else {
          throw new Error("No questions found. Using demo data.");
        }

      } catch (e) {
        console.error('Fetch error:', e);
        const errorMessage = e.message || "Failed to load exam data";
        setError(`${errorMessage}. Using demo questions for practice.`);
        // Fallback to mock data
        setQuestions(mockQuestions);
        setSubjectName("General Knowledge (Demo)");
        setUsingMockData(true);
        
        // Show user-friendly notification
        console.warn('⚠️ API Connection Issue - Demo mode activated');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuiz();
  }, [subjectId]);

  // Initialize exam
  useEffect(() => {
    if (questions.length > 0) {
      if (!savedProgress) {
        // do not auto-start timer until user presses Start
        setTimeLeft(questions.length * 60);
        setCurrentPage(0);
        setAnswers({});
        setIsSubmitted(false);
        setReviewMode(false);
        setMarkedQuestions(new Set());
        // auto-start when using mock/demo data to reduce friction
        if (usingMockData) setExamStarted(true);
      }
    }
  }, [questions, savedProgress]);

  const startExam = () => {
    setExamStarted(true);
    setTimerRunning(true);
    // ensure timeLeft has been initialized
    if (!timeLeft || timeLeft <= 0) setTimeLeft(questions.length * 60);
  };

  // Timer logic
  useEffect(() => {
    if (mode !== "exam" || isSubmitted || !timerRunning) return;
    if (timeLeft <= 0) return handleSubmit();
    
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mode, timeLeft, isSubmitted, timerRunning]);

  // Sound effects with error handling
  const playSound = (type) => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      const frequencies = {
        correct: 800,
        incorrect: 400,
        complete: 1000,
        navigate: 600
      };
      
      oscillator.frequency.value = frequencies[type] || 600;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.warn('Audio not supported:', e);
    }
  };

  const handleAnswerChange = (qid, val) => {
    const newAnswers = { ...answers, [qid]: val };
    setAnswers(newAnswers);
    
    // Play sound for answer selection
    if (soundEnabled) {
      const question = questions.find(q => q.id === qid);
      if (question && question.correct_option === val) {
        playSound('correct');
      } else {
        playSound('incorrect');
      }
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimerRunning(false);
    if (soundEnabled) playSound('complete');
    
    // Calculate and save results
    const correctCount = questions.filter(q => answers[q.id] === q.correct_option).length;
    const scorePercentage = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
    
    const results = {
      subjectId,
      subjectName,
      score: scorePercentage,
      correctCount,
      totalQuestions: questions.length,
      timestamp: new Date().toISOString(),
      timeSpent: (questions.length * 60) - timeLeft,
      usingMockData
    };
    
    // Save to exam history
    try {
      const history = JSON.parse(localStorage.getItem('exam-history') || '[]');
      history.unshift(results);
      localStorage.setItem('exam-history', JSON.stringify(history.slice(0, 50)));
    } catch (e) {
      console.warn('Failed to save history:', e);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setIsSubmitted(false);
    setReviewMode(false);
    setCurrentPage(0);
    setTimeLeft(questions.length * 60);
    setTimerRunning(true);
    setMarkedQuestions(new Set());
    try {
      localStorage.removeItem(`exam-${subjectId}`);
    } catch (e) {
      console.warn('Failed to clear progress:', e);
    }
    setSavedProgress(false);
  };

  const toggleMarkQuestion = (qid) => {
    setMarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(qid)) {
        newSet.delete(qid);
      } else {
        newSet.add(qid);
      }
      return newSet;
    });
  };

  const clearProgress = () => {
    if (window.confirm('Are you sure you want to clear all progress?')) {
      try {
        localStorage.removeItem(`exam-${subjectId}`);
      } catch (e) {
        console.warn('Failed to clear progress:', e);
      }
      handleRestart();
    }
  };

  const formatTime = sec => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const isAnswerSelected = qid => answers[qid] !== undefined;
  
  const pageQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  const correctCount = isSubmitted
    ? questions.filter(q => answers[q.id] === q.correct_option).length
    : 0;

  const allAnswered = pageQuestions.every(q => isAnswerSelected(q.id));
  const scorePercentage = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;

  const getOptionClass = (q, opt) => {
    const ans = answers[q.id];
    if (mode === "exam" && !isSubmitted && !reviewMode) {
      return "hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:bg-gray-700 cursor-pointer border-gray-200 dark:border-gray-600";
    }
    if (mode === "static" && ans === undefined) return "border-gray-200 dark:border-gray-600";

    if (ans === opt) {
      return ans === q.correct_option
        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 text-green-900 shadow-sm"
        : "bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-500 text-red-900 shadow-sm";
    }
    if (opt === q.correct_option && (isSubmitted || reviewMode)) {
      return "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 text-green-800 shadow-sm";
    }
    return "border-gray-200 dark:border-gray-600";
  };

  const getScoreColor = () => {
    if (scorePercentage >= 80) return "text-green-600";
    if (scorePercentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const printResults = () => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to print results.');
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>${subjectName} - Exam Results</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #333; }
              .score { font-size: 2em; font-weight: bold; text-align: center; margin: 20px 0; padding: 20px; }
              .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
              .stat-item { padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
              .question { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
              .correct { background-color: #d4edda; border-color: #c3e6cb; }
              .incorrect { background-color: #f8d7da; border-color: #f5c6cb; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${subjectName} - Exam Results</h1>
              <p>Completed on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>
            <div class="score" style="color: ${
              scorePercentage >= 80 ? 'green' : scorePercentage >= 60 ? 'orange' : 'red'
            }">
              Score: ${scorePercentage}%
            </div>
            <div class="stats">
              <div class="stat-item">
                <strong>Correct Answers:</strong> ${correctCount}
              </div>
              <div class="stat-item">
                <strong>Incorrect Answers:</strong> ${questions.length - correctCount}
              </div>
              <div class="stat-item">
                <strong>Total Questions:</strong> ${questions.length}
              </div>
              <div class="stat-item">
                <strong>Time Spent:</strong> ${formatTime((questions.length * 60) - timeLeft)}
              </div>
            </div>
            <h2>Question Review:</h2>
            ${questions.map((q, idx) => `
              <div class="question ${answers[q.id] === q.correct_option ? 'correct' : 'incorrect'}">
                <strong>Q${idx + 1}:</strong> ${q.question}<br><br>
                <strong>Your Answer:</strong> ${answers[q.id] || 'Not answered'}<br>
                <strong>Correct Answer:</strong> ${q.correct_option}<br>
                ${q.explain ? `<br><strong>Explanation:</strong> ${q.explain}` : ''}
              </div>
            `).join('')}
          </body>
        </html>
      `);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
      }, 250);
    } catch (e) {
      console.error('Print failed:', e);
      alert('Printing failed. Please try again.');
    }
  };

  const shareResults = async () => {
    const text = `I scored ${scorePercentage}% on ${subjectName} exam! Correct answers: ${correctCount}/${questions.length}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Exam Results',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
        fallbackShare(text);
      }
    } else {
      fallbackShare(text);
    }
  };

  const fallbackShare = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Results copied to clipboard!');
    }).catch(() => {
      // Final fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Results copied to clipboard!');
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-purple-600 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
        </div>
        <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium">Preparing your exam...</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Loading questions and resources</p>
      </div>
    </div>
  );

  if (error && questions.length === 0) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaExclamationTriangle className="text-red-500 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Connection Issue</h2>
        <p className="text-red-600 dark:text-red-400 mb-4 leading-relaxed">{error}</p>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
          {usingMockData ? "Demo questions loaded. You can still practice." : "Trying to load demo questions..."}
        </p>
        <div className="space-y-3">
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            Go Back
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  // Show start screen if questions are loaded but exam not started yet
  if (!loading && questions.length > 0 && !examStarted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{subjectName || 'Exam Ready'}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{questions.length} questions · {formatTime(questions.length * 60)} total</p>
          <div className="space-y-3">
            <button
              onClick={startExam}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              ▶️ Start Exam
            </button>

            <button
              onClick={() => setMode('static')}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-medium"
            >
              Study Mode (Browse Questions)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 ${
      fullScreen ? 'fixed inset-0 z-50' : ''
    }`}>
      {/* Enhanced Control Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 z-30 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <FaHome />
              Home
            </button>
            
            {savedProgress && (
              <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-sm font-medium flex items-center gap-2">
                <FaSave size={12} />
                Progress Saved
              </span>
            )}

            {usingMockData && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-sm font-medium flex items-center gap-2">
                <FaExclamationTriangle size={12} />
                Demo Mode
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title={soundEnabled ? "Mute sounds" : "Enable sounds"}
            >
              {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
            </button>

            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title={showExplanation ? "Hide explanations" : "Show explanations"}
            >
              {showExplanation ? <FaEye /> : <FaEyeSlash />}
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            <button
              onClick={() => setFullScreen(!fullScreen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title={fullScreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {fullScreen ? <FaCompress /> : <FaExpand />}
            </button>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same as your original code */}
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-16 right-4 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <FaList className="text-lg" />
      </button>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Enhanced Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:relative w-80 lg:w-96 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 
        transition-transform duration-300 z-40 flex flex-col shadow-xl mt-16 lg:mt-0
      `}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaBook className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{subjectName}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {questions.length} Questions
                {usingMockData && " • Demo"}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => {
                setMode(prev => (prev === "exam" ? "static" : "exam"));
                handleRestart();
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-md ${
                mode === "exam" 
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg" 
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:shadow-lg"
              }`}
            >
              {mode === "exam" ? "📝 Exam Mode" : "📖 Study Mode"}
            </button>
          </div>

          {mode === "exam" && !isSubmitted && (
            <button
              onClick={clearProgress}
              className="w-full py-2 px-4 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-300 rounded-lg font-medium transition-colors text-sm"
            >
              Clear Progress & Restart
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Exam Mode Sidebar Content */}
          {mode === "exam" && !isSubmitted && (
            <>
              {/* Enhanced Timer Section */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 font-medium">
                    <FaUserClock className="text-blue-200" />
                    Time Remaining
                  </div>
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="text-blue-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                  >
                    {timerRunning ? <FaPause size={14} /> : <FaPlay size={14} />}
                  </button>
                </div>
                <div className={`text-3xl font-bold text-center mb-2 font-mono ${
                  timeLeft <= 300 ? "animate-pulse" : ""
                }`}>
                  {formatTime(timeLeft)}
                </div>
                {timeLeft <= 300 && (
                  <p className="text-blue-200 text-sm text-center">
                    ⚡ Time is running out!
                  </p>
                )}
              </div>

              {/* Enhanced Progress */}
              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-600">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span className="font-medium">Your Progress</span>
                  <span className="font-semibold">{Object.keys(answers).length}/{questions.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-600 mb-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{Math.round((Object.keys(answers).length / questions.length) * 100)}% Complete</span>
                  <span>{questions.length - Object.keys(answers).length} Left</span>
                </div>
              </div>

              {/* Enhanced Question Grid */}
              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-600">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <FaList className="text-indigo-500" />
                  Question Navigation
                </h3>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {questions.map((q, idx) => {
                    const isCurrent = currentPage === Math.floor(idx / QUESTIONS_PER_PAGE);
                    const isAnswered = isAnswerSelected(q.id);
                    const isMarked = markedQuestions.has(q.id);
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentPage(Math.floor(idx / QUESTIONS_PER_PAGE));
                          setSidebarOpen(false);
                        }}
                        className={`
                          w-10 h-10 text-sm rounded-xl flex items-center justify-center transition-all duration-300 relative
                          shadow-sm hover:shadow-md hover:scale-105
                          ${isCurrent 
                            ? 'ring-2 ring-indigo-500 ring-offset-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-110' 
                            : isAnswered 
                              ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-md' 
                              : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }
                          ${isMarked ? 'ring-1 ring-yellow-400 shadow-md' : ''}
                        `}
                      >
                        {idx + 1}
                        {isMarked && (
                          <FaFlag className="absolute -top-1 -right-1 text-yellow-500 text-xs bg-white rounded-full p-0.5 shadow-sm" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span>Unanswered</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaFlag className="text-yellow-500 text-xs" />
                    <span>Marked</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Enhanced Results Section */}
          {mode === "exam" && isSubmitted && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 text-white text-center shadow-xl">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaStar className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Exam Completed!</h3>
                <div className={`text-4xl font-bold mb-3 ${getScoreColor()}`}>
                  {scorePercentage}%
                </div>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Correct Answers</span>
                    <span className="font-semibold">{correctCount}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Incorrect Answers</span>
                    <span className="font-semibold">{questions.length - correctCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Skipped Questions</span>
                    <span className="font-semibold">
                      {questions.length - Object.keys(answers).length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleRestart}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <FaRedo />
                  Restart Exam
                </button>

                <button
                  onClick={() => setReviewMode(!reviewMode)}
                  className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <FaChartBar />
                  {reviewMode ? "Hide Review" : "Review Answers"}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={printResults}
                    className="bg-white dark:bg-gray-700 text-gray-700 dark:text-white py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm"
                  >
                    <FaPrint />
                    Print
                  </button>
                  <button
                    onClick={shareResults}
                    className="bg-white dark:bg-gray-700 text-gray-700 dark:text-white py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm"
                  >
                    <FaShare />
                    Share
                  </button>
                </div>
              </div>

              {/* Enhanced Related Exams */}
              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <FaBook className="text-indigo-500" />
                  Related Exams
                </h3>
                <ProductsWithExams currentSubject={subjectName} />
              </div>
            </div>
          )}

          {/* Enhanced Static Mode Sidebar */}
          {mode === "static" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <FaBook className="text-indigo-500" />
                  Related Exams
                </h3>
                <ProductsWithExams currentSubject={subjectName} />
              </div>
              
              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-600">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Study Progress
                </h3>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Answered Questions</span>
                  <span className="font-semibold">{Object.keys(answers).length}/{questions.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                  {Math.round((Object.keys(answers).length / questions.length) * 100)}% Complete
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Main Content */}
<div className="flex-1 overflow-y-auto pt-0 px-4 lg:pt-0 lg:px-6 mt-16">
        {/* Enhanced Header */}
        

        {/* Enhanced Questions Area */}
        <div className="space-y-6">
          {mode === "exam" && pageQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              {/* Enhanced Question Header */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600 p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold px-3 py-2 rounded-xl shadow-md">
                      Q{currentPage * QUESTIONS_PER_PAGE + idx + 1} of {questions.length}
                    </span>
                    {markedQuestions.has(q.id) && (
                      <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-sm font-semibold px-3 py-2 rounded-xl shadow-md flex items-center gap-2">
                        <FaFlag className="text-xs" />
                        Marked for Review
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleMarkQuestion(q.id)}
                    className={`p-3 rounded-xl transition-all duration-300 shadow-sm ${
                      markedQuestions.has(q.id) 
                        ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md" 
                        : "bg-gray-100 dark:bg-gray-600 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    }`}
                  >
                    <FaFlag size={16} />
                  </button>
                </div>
              </div>

              {/* Enhanced Question Body */}
              <div className="p-4 lg:p-6">
                <div
                  className="text-lg text-gray-800 dark:text-gray-200 mb-6 leading-relaxed font-medium"
                  dangerouslySetInnerHTML={{ __html: q.question }}
                />
                
                <div className="space-y-3">
                  {q.options.map(opt => (
                    <label
                      key={opt}
                      className={`block p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 group ${
                        getOptionClass(q, opt)
                      } ${
                        !isSubmitted && !reviewMode 
                          ? "hover:border-indigo-400 hover:shadow-md hover:scale-[1.02]" 
                          : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={opt}
                          checked={answers[q.id] === opt}
                          disabled={isSubmitted || reviewMode}
                          onChange={() => handleAnswerChange(q.id, opt)}
                          className="mr-4 transform scale-125"
                        />
                        <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                          {opt}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Enhanced Explanation */}
                {(isSubmitted || reviewMode) && showExplanation && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold mb-2 text-base">
                      <FaCheckCircle size={16} />
                      Correct Answer: <span className="font-bold">{q.correct_option}</span>
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {q.explain ? (
                        <div dangerouslySetInnerHTML={{ __html: q.explain }} />
                      ) : (
                        <div className="italic text-gray-500 dark:text-gray-400">
                          No explanation available for this question.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Enhanced Static Mode Questions */}
          {mode === "static" && (
            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 lg:p-6 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold px-3 py-2 rounded-xl shadow-md">
                      Q{idx + 1}
                    </span>
                    {isAnswerSelected(q.id) && (
                      <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-3 py-2 rounded-xl shadow-md flex items-center gap-2">
                        <FaCheckCircle className="text-xs" />
                        Answered
                      </span>
                    )}
                  </div>

                  <div
                    className="text-lg text-gray-800 dark:text-gray-200 mb-6 leading-relaxed font-medium"
                    dangerouslySetInnerHTML={{ __html: q.question }}
                  />

                  <div className="space-y-3 mb-6">
                    {q.options.map(opt => (
                      <label
                        key={opt}
                        className={`block p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 group ${
                          isAnswerSelected(q.id) 
                            ? "pointer-events-none opacity-90" 
                            : "hover:border-indigo-400 hover:shadow-md hover:scale-[1.02] border-gray-200 dark:border-gray-600"
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={opt}
                            checked={answers[q.id] === opt}
                            onChange={() => handleAnswerChange(q.id, opt)}
                            disabled={isAnswerSelected(q.id)}
                            className="mr-4 transform scale-125"
                          />
                          <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                            {opt}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {isAnswerSelected(q.id) && showExplanation && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold mb-2 text-base">
                        <FaCheckCircle size={16} />
                        Correct Answer: <span className="font-bold">{q.correct_option}</span>
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {q.explain ? (
                          <div dangerouslySetInnerHTML={{ __html: q.explain }} />
                        ) : (
                          <div className="italic text-gray-500 dark:text-gray-400">
                            No explanation available for this question.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Exam Navigation */}
        {mode === "exam" && (
          <div className="flex items-center justify-between mt-8 p-4 lg:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 0}
              className="flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md"
            >
              <FaChevronLeft size={14} />
              Previous
            </button>

            <div className="flex items-center gap-4">
              {currentPage < totalPages - 1 ? (
                <button
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="flex items-center gap-3 px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Next
                  <FaChevronRight size={14} />
                </button>
              ) : !isSubmitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className="flex items-center gap-3 px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Exam
                  <FaCheckCircle size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setReviewMode(!reviewMode)}
                  className="flex items-center gap-3 px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {reviewMode ? "Hide Review" : "Review Answers"}
                  <FaChartBar size={16} />
                </button>
              )}
            </div>
          </div> 
        )}
      </div>
    </div>
  );
};

export default ExamPage;