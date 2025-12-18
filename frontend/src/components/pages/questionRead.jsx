import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar2 from "./SidebarExam2";
import ProductsWithExams from "./Relatedexam";


const ExamPage = () => {
  const { subjectId } = useParams();
  const [subjectName, setSubjectName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showAnswers, setShowAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [editedQuestions, setEditedQuestions] = useState({}); // store edited question content

  useEffect(() => {
    const fetchQuestionsBySubjectId = async () => {
      try {
        const subjectRes = await fetch(`http://127.0.0.1:8000/api/subjects/`);
        if (!subjectRes.ok) throw new Error("Failed to fetch subjects");
        const subjects = await subjectRes.json();

        const subject = subjects.find((s) => String(s.id) === String(subjectId));
        if (!subject) throw new Error("Subject not found");

        setSubjectName(subject.name);

        const questionRes = await fetch(
          `http://127.0.0.1:8000/api/question/${subject.name}/`
        );
        if (!questionRes.ok) throw new Error("Failed to fetch questions");

        const data = await questionRes.json();
        setQuestions(data);
        setVisibleCount(10);

        // Initialize editedQuestions with original questions content
        const initialEdited = {};
        data.forEach((q) => {
          initialEdited[q.id] = q.question;
        });
        setEditedQuestions(initialEdited);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsBySubjectId();
  }, [subjectId]);

  // Handle CKEditor content change per question
  const handleQuestionEdit = (questionId, data) => {
    // Remove outer <p> tags if present
    let cleanedData = data;
    if (
      data.startsWith("<p>") &&
      data.endsWith("</p>") &&
      (data.match(/<p>/g) || []).length === 1
    ) {
      cleanedData = data.slice(3, -4);
    }

    setEditedQuestions((prev) => ({
      ...prev,
      [questionId]: cleanedData,
    }));
  };

  const handleAnswerChange = (questionId, selected) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selected }));
  };

  const toggleShowAnswer = (questionId) => {
    setShowAnswers((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const loadMoreQuestions = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const isAnswerSelected = (questionId) => answers[questionId] !== undefined;

  const getOptionClass = (question, option) => {
    const userAnswer = answers[question.id];
    if (!userAnswer) return "";

    if (userAnswer === option) {
      if (userAnswer === question.correct_option) {
        return "bg-green-200 border-green-500 text-green-900";
      } else {
        return "bg-red-200 border-red-500 text-red-900";
      }
    } else {
      if (option === question.correct_option && isAnswerSelected(question.id)) {
        return "bg-green-100 border-green-400 text-green-800";
      }
    }
    return "";
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

      {/* Main Content Section */}
      <div
        className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 sm:pl-6 lg:pl-8 flex flex-col lg:flex-row"
        style={{ paddingBottom: 0 }} // no bottom padding
      >
        {/* Questions Section */}
        <div
          className="w-full lg:w-3/4 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 3rem)" }}
        >
          <h1 className="text-4xl font-semibold text-center mb-6">{`Exam Page - ${subjectName}`}</h1>

          {questions.slice(0, visibleCount).map((question, idx) => (
            <div
              key={question.id}
              className="question bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-8"
            >
              {/* Auto question counter */}
              <div className="mb-4">
                  <p className="text-gray-500 text-lg mb-2">
                    Question {idx + 1} of {questions.length}
                  </p>
                  <div
                    className="text-2xl font-semibold text-gray-900 dark:text-gray-100"
                    dangerouslySetInnerHTML={{ __html: question.question }}
                  />
                </div>


            

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {question.options.map((option) => (
                  <label
                    key={option}
                    htmlFor={`q${question.id}-opt-${option}`}
                    className={`flex items-center cursor-pointer p-4 rounded-lg border
                      dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700
                      transition-colors duration-200 text-lg sm:text-xl
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
                      disabled={isAnswerSelected(question.id)}
                    />
                    <span className="select-none">{option}</span>
                  </label>
                ))}
              </div>

              <button
                type="button"
                onClick={() => toggleShowAnswer(question.id)}
                className="mt-4 bg-blue-600 text-white p-4 rounded hover:bg-blue-700 text-lg flex items-center space-x-3"
              >
                {showAnswers[question.id] ? (
                  <>
                    <svg
                      className="w-5 h-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6l4 2M12 18v-6l-4-2M4 12l2-4 2 4-2 4-2-4z"
                      />
                    </svg>
                    <span>Hide Answer</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 3v18h14V3H5zm2 16V5h10v14H7z"
                      />
                    </svg>
                    <span>Show Answer</span>
                  </>
                )}
              </button>

              {showAnswers[question.id] && (
                <div className="mt-6 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="font-semibold text-green-700 text-2xl mb-2">
                    Correct Answer: {question.correct_option}
                  </p>
                  <div
                    className="text-lg text-gray-700 dark:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: question.explain }}
                  ></div>
                </div>
              )}
            </div>
          ))}

          {visibleCount < questions.length && (
            <button
              type="button"
              onClick={loadMoreQuestions}
              className="mt-6 bg-yellow-500 text-white p-5 rounded w-full hover:bg-yellow-600 text-xl font-semibold"
            >
              Load More Exams
            </button>
          )}
        </div>

        {/* Right Side - Related Products */}
        <div className="lg:w-1/4 ml-8 lg:block hidden min-h-screen overflow-auto">
          <h3 className="text-3xl font-semibold text-center mb-6">
            Related Products
          </h3>
     <ProductsWithExams currentSubject={subjectName} />
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
