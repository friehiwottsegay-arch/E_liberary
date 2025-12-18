import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UploadQuiz = () => {
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Fetch categories and subjects from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/qcategories/'),
          axios.get('http://127.0.0.1:8000/api/subjects/'),
        ]);

        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setSubjects(Array.isArray(subRes.data) ? subRes.data : []);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  // Filter subjects by category
  const filteredSubjects = subjects.filter(
    (subject) => String(subject.QCategory) === selectedCategory
  );

  // Handle PDF file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Call backend to generate quiz from uploaded PDF
  const generateQuiz = async () => {
    if (!title.trim() || !file || !selectedSubject) {
      alert('Please enter a title, select a subject, and upload a PDF.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('title', title);
    formData.append('subject_id', selectedSubject);

    try {
      const { data } = await axios.post('http://127.0.0.1:8000/api/generate/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setParsedQuestions(data.questions || []);
    } catch (err) {
      console.error('Quiz generation failed:', err);
      alert('Failed to generate quiz. Please check your file or server.');
    } finally {
      setUploading(false);
    }
  };

  // Update question text, correct answer, or explanation
  const updateQuestion = (index, key, value) => {
    const updated = [...parsedQuestions];
    updated[index][key] = value;
    setParsedQuestions(updated);
  };

  // Update individual option values (a, b, c, d)
  const updateOption = (index, optionKey, value) => {
    const updated = [...parsedQuestions];
    updated[index].options[optionKey] = value;
    setParsedQuestions(updated);
  };

  // Validate each question before saving
  const validate = () =>
    parsedQuestions.every((q) => {
      const optionCount = Object.values(q.options || {}).filter((opt) => opt?.trim()).length;
      return q.text?.trim() && optionCount >= 2 && q.correct;
    });

  // Save all questions via bulk API
  const saveQuiz = async () => {
    if (!validate()) {
      alert('Each question must have text, at least two options, and a correct answer.');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/questions/bulk/', {
        questions: parsedQuestions,
      });

      alert('Quiz saved successfully!');
      setParsedQuestions([]);
      setFile(null);
      setTitle('');
      setSelectedCategory('');
      setSelectedSubject('');
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save quiz.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Upload PDF & Generate Quiz</h1>

      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <div className="flex gap-4 mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedSubject('');
          }}
          className="p-2 border rounded flex-1"
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          disabled={!selectedCategory}
          className="p-2 border rounded flex-1"
        >
          <option value="">-- Select Subject --</option>
          {filteredSubjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="mb-3"
      />

      <button
        onClick={generateQuiz}
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        {uploading ? 'Generating Quiz...' : 'Generate Quiz'}
      </button>

      {parsedQuestions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Edit Generated Questions</h2>

          {parsedQuestions.map((q, i) => (
            <div key={i} className="border p-4 mb-4 rounded shadow-sm">
              <textarea
                value={q.text}
                onChange={(e) => updateQuestion(i, 'text', e.target.value)}
                className="w-full p-2 mb-2 border rounded"
                placeholder="Question text"
              />

              {['a', 'b', 'c', 'd'].map((opt) => (
                <div key={opt} className="flex items-center mb-2">
                  <span className="mr-2 font-semibold">{opt.toUpperCase()}.</span>
                  <input
                    value={q.options?.[opt] || ''}
                    onChange={(e) => updateOption(i, opt, e.target.value)}
                    className="flex-grow p-2 border rounded"
                    placeholder={`Option ${opt.toUpperCase()}`}
                  />
                </div>
              ))}

              <select
                value={q.correct}
                onChange={(e) => updateQuestion(i, 'correct', e.target.value)}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">-- Correct Option --</option>
                {['a', 'b', 'c', 'd'].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.toUpperCase()}: {q.options?.[opt] || ''}
                  </option>
                ))}
              </select>

              <textarea
                value={q.explanation || ''}
                onChange={(e) => updateQuestion(i, 'explanation', e.target.value)}
                placeholder="Explanation (optional)"
                className="w-full p-2 border rounded"
                rows={2}
              />
            </div>
          ))}

          <button
            onClick={saveQuiz}
            className="bg-green-600 text-white px-6 py-2 rounded mt-4"
          >
            Save Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadQuiz;
