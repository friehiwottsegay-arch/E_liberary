import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UploadExam = () => {
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [file, setFile] = useState(null);
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [manualQuestion, setManualQuestion] = useState('');
  const [manualOptions, setManualOptions] = useState(['', '', '', '']);
  const [manualAnswer, setManualAnswer] = useState('');
  const [manualExplanation, setManualExplanation] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/qcategories/'),
          axios.get('http://127.0.0.1:8000/api/subjects/'),
        ]);
        setCategories(catRes.data || []);
        setSubjects(subRes.data || []);
      } catch (err) {
        console.error('Error fetching categories or subjects:', err);
      }
    };
    fetchData();
  }, []);

  const filteredSubjects = subjects.filter(
    (s) => String(s.QCategory) === selectedCategory
  );

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const scanPDF = async () => {
    if (!file || !selectedSubject) {
      alert('Please select a subject and upload a file.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject_id', selectedSubject);

    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/upload-parse/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setParsedQuestions(res.data.questions || []);
    } catch (err) {
      console.error('PDF parsing failed:', err);
      alert('Failed to scan PDF.');
    } finally {
      setUploading(false);
    }
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...parsedQuestions];
    updated[index][field] = value;
    setParsedQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...parsedQuestions];
    updated[qIndex].options[oIndex] = value;
    setParsedQuestions(updated);
  };

  const validateQuestions = (questions) => {
    for (const q of questions) {
      if (!q.question_text.trim()) return false;
      const filledOptions = q.options.filter((opt) => opt.trim());
      if (filledOptions.length < 2) return false;
    }
    return true;
  };

  const saveQuestions = async () => {
    const reviewedQuestions = parsedQuestions.map((q) => ({
      question_text: q.question_text,
      options: q.options,
      correct_option: q.correct_option || '',
      explain: q.explain || '',
      subject: parseInt(selectedSubject, 10),
    }));

    if (manualQuestion.trim() && manualOptions.some((opt) => opt.trim())) {
      reviewedQuestions.push({
        question_text: manualQuestion,
        options: manualOptions,
        correct_option: manualAnswer || '',
        explain: manualExplanation || '',
        subject: parseInt(selectedSubject, 10),
      });
    }

    if (!validateQuestions(reviewedQuestions)) {
      alert('Each question must have text and at least two options.');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/questions/bulk/', {
        questions: reviewedQuestions,
      });

      alert('Questions saved successfully!');
      setParsedQuestions([]);
      setManualQuestion('');
      setManualOptions(['', '', '', '']);
      setManualAnswer('');
      setManualExplanation('');
      setFile(null);
    } catch (error) {
      console.error('Failed to save questions:', error);
      const msg = error.response?.data
        ? JSON.stringify(error.response.data, null, 2)
        : 'Server or network error';
      alert(`Failed to save questions:\n${msg}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Upload & Parse Exam PDF
      </h1>

      {/* Category & Subject Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 text-gray-700 dark:text-white">Select Category</label>
          <select
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubject('');
              setParsedQuestions([]);
            }}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-gray-700 dark:text-white">Select Subject</label>
          <select
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedCategory}
          >
            <option value="">-- Select Subject --</option>
            {filteredSubjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* File Upload */}
      <input type="file" accept=".pdf,image/*" onChange={handleFileChange} />
      <button
        onClick={scanPDF}
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
      >
        {uploading ? 'Scanning PDF...' : 'Scan & Parse File'}
      </button>

      {/* Manual Entry */}
      <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
          Add Manual Question (optional)
        </h2>
        <textarea
          placeholder="Question text"
          className="w-full mb-2 p-2 border rounded"
          value={manualQuestion}
          onChange={(e) => setManualQuestion(e.target.value)}
        />
        {manualOptions.map((opt, i) => (
          <div key={i} className="mb-2 flex items-center">
            <span className="mr-2">{String.fromCharCode(65 + i)}.</span>
            <input
              className="flex-grow p-2 border rounded"
              value={opt}
              onChange={(e) => {
                const updated = [...manualOptions];
                updated[i] = e.target.value;
                setManualOptions(updated);
              }}
            />
          </div>
        ))}
        <select
          className="w-full mb-2 p-2 border rounded"
          value={manualAnswer}
          onChange={(e) => setManualAnswer(e.target.value)}
        >
          <option value="">-- Correct Option (optional) --</option>
          {manualOptions.map((opt, i) => (
            <option key={i} value={opt}>
              {String.fromCharCode(65 + i)}. {opt}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Explanation (optional)"
          className="w-full p-2 border rounded"
          value={manualExplanation}
          onChange={(e) => setManualExplanation(e.target.value)}
        />
      </div>

      {/* Parsed Questions */}
      {parsedQuestions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl mb-4 text-white">Parsed Questions</h2>
          {parsedQuestions.map((q, i) => (
            <div key={i} className="mb-6 bg-white dark:bg-gray-800 p-4 rounded">
              {q.image_url && (
                <img src={q.image_url} alt="Question Visual" className="mb-2 rounded w-full" />
              )}
              <textarea
                className="w-full p-2 border mb-2 rounded"
                value={q.question_text}
                onChange={(e) => updateQuestion(i, 'question_text', e.target.value)}
              />
              {q.options.map((opt, j) => (
                <div key={j} className="flex items-center mb-2">
                  <span className="mr-2">{String.fromCharCode(65 + j)}.</span>
                  <input
                    className="flex-grow p-2 border rounded"
                    value={opt}
                    onChange={(e) => updateOption(i, j, e.target.value)}
                  />
                </div>
              ))}
              <select
                className="w-full mb-2 p-2 border rounded"
                value={q.correct_option || ''}
                onChange={(e) => updateQuestion(i, 'correct_option', e.target.value)}
              >
                <option value="">-- Correct Option (optional) --</option>
                {q.options.map((opt, j) => (
                  <option key={j} value={opt}>
                    {String.fromCharCode(65 + j)}. {opt}
                  </option>
                ))}
              </select>
              <textarea
                rows={2}
                className="w-full p-2 border rounded"
                placeholder="Explanation (optional)"
                value={q.explain || ''}
                onChange={(e) => updateQuestion(i, 'explain', e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={saveQuestions}
        className="bg-green-600 text-white px-5 py-2 rounded mt-4"
        disabled={
          !selectedSubject ||
          (parsedQuestions.length === 0 && !manualQuestion.trim())
        }
        title={!selectedSubject ? 'Select subject first' : 'Save all questions'}
      >
        Save All Questions
      </button>
    </div>
  );
};

export default UploadExam;
