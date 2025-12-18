import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar2 from "./SidebarExam2";
import ProductsWithExams from "./Relatedexam";

const QUESTIONS_PER_PAGE = 2;

const ExamPage = () => {
  const { subjectId } = useParams();
  const [subjectName, setSubjectName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  // Timer: 1 minute per question * total questions
  const EXAM_DURATION_SECONDS = questions.length * 60;
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);

  // Fetch subject and questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const subjectRes = await fetch("http://127.0.0.1:8000/api/subjects/");
        const subjects = await subjectRes.json();
        const subject = subjects.find((s) => String(s.id) === String(subjectId));
        if (!subject) throw new Error("Subject not found");
        setSubjectName(subject.name);

        const questionRes = await fetch(
          `http://127.0.0.1:8000/api/question/${subject.name}/`
        );
        const questionData = await questionRes.json();
        setQuestions(questionData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [subjectId]);

  // Reset timer & states when questions load or on restart
  useEffect(() => {
    setTimeLeft(questions.length * 60);
    setAnswers({});
    setIsSubmitted(false);
    setReviewMode(false);
    setCurrentPage(0);
  }, [questions]);

  // Timer countdown effect
  useEffect(() => {
    if (isSubmitted) return; // stop timer after submit

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isSubmitted]);

  const handleAnswerChange = (questionId, selected) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selected }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  // Restart the exam: reload questions and reset states & timer
  const handleRestart = () => {
    // To refetch questions, just setQuestions([]) and trigger useEffect? 
    // But we already refetch on subjectId, so simpler is just reload page or reset states:

    setAnswers({});
    setIsSubmitted(false);
    setReviewMode(false);
    setCurrentPage(0);
    setTimeLeft(questions.length * 60);
  };

  // Class for options depending on user answer and correct answer during review/submit
  const getOptionClass = (question, option) => {
    if (!isSubmitted && !reviewMode) return "";
    const userAnswer = answers[question.id];
    if (userAnswer === option) {
      return userAnswer === question.correct_option
        ? "bg-green-200 border-green-500 text-green-900"
        : "bg-red-200 border-red-500 text-red-900";
    } else if (option === question.correct_option) {
      return "bg-green-100 border-green-400 text-green-800";
    }
    return "";
  };

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const pageQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  const correctCount = isSubmitted
    ? questions.filter((q) => answers[q.id] === q.correct_option).length
    : 0;

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-600 text-lg">{error}</p>
    );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="lg:w-1/5 bg-gray-200 dark:bg-gray-800 min-h-screen lg:block hidden overflow-auto">
        <Sidebar2 />
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Exam - {subjectName}</h1>
          {!isSubmitted && (
            <div className="text-xl font-semibold text-red-600">
              ⏱ Time Left: {formatTime(timeLeft)}
            </div>
          )}
        </div>

        {isSubmitted && !reviewMode && (
          <div className="text-center text-green-700 text-xl font-bold mb-6">
            ✅ You got {correctCount} out of {questions.length} correct.
            <br />
            <button
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded mr-3"
              onClick={() => setReviewMode(true)}
            >
              Enter Review Mode
            </button>
            <button
              className="mt-4 bg-gray-600 text-white px-6 py-2 rounded"
              onClick={handleRestart}
            >
              Restart Exam
            </button>
          </div>
        )}

        {/* Show Restart button even before submit if user wants to start over */}
        {!isSubmitted && (
          <div className="mb-6 text-right">
            <button
              onClick={handleRestart}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              Restart Exam
            </button>
          </div>
        )}

        {pageQuestions.map((question, index) => (
          <div
            key={question.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6"
          >
            <p className="text-gray-500 text-lg mb-2">
              Question {currentPage * QUESTIONS_PER_PAGE + index + 1} of{" "}
              {questions.length}
            </p>

            <div
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
              dangerouslySetInnerHTML={{ __html: question.question }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {question.options.map((option) => (
                <label
                  key={option}
                  htmlFor={`q${question.id}-opt-${option}`}
                  className={`flex items-center cursor-pointer p-4 rounded-lg border
                    dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700
                    ${getOptionClass(question, option)}`}
                >
                  <input
                    type="radio"
                    id={`q${question.id}-opt-${option}`}
                    name={`question-${question.id}`}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={() => handleAnswerChange(question.id, option)}
                    className="mr-4 h-6 w-6 cursor-pointer accent-blue-600 dark:accent-blue-400"
                    disabled={isSubmitted || reviewMode}
                  />
                  <span className="select-none">{option}</span>
                </label>
              ))}
            </div>

            {reviewMode && (
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <p className="font-semibold text-green-700 text-lg">
                  ✅ Correct Answer: {question.correct_option}
                </p>
                <div
                  className="text-gray-700 dark:text-gray-300 mt-2"
                  dangerouslySetInnerHTML={{
                    __html: question.explain || "No explanation available.",
                  }}
                />
              </div>
            )}
          </div>
        ))}

        {/* Pagination & Submit */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
          <div className="space-x-2 mb-4 sm:mb-0">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`px-4 py-2 rounded ${
                  currentPage === idx
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300"
                }`}
                disabled={isSubmitted || reviewMode}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="space-x-4">
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 0))
              }
              disabled={currentPage === 0 || isSubmitted || reviewMode}
              className="bg-gray-300 text-black px-6 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>

            {currentPage < totalPages - 1 && (
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, totalPages - 1)
                  )
                }
                disabled={isSubmitted || reviewMode}
                className="bg-gray-300 text-black px-6 py-2 rounded"
              >
                Next
              </button>
            )}

            {currentPage === totalPages - 1 && !isSubmitted && (
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-6 py-2 rounded font-bold"
              >
                Submit Exam
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="lg:w-1/4 ml-8 lg:block hidden min-h-screen overflow-auto">
        <h3 className="text-3xl font-semibold text-center mb-6">
          Related Products
        </h3>
        <ProductsWithExams currentSubject={subjectName} />
      </div>
    </div>
  );
};

export default ExamPage;
