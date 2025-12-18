import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus, FiXCircle } from 'react-icons/fi';

const AdminExam = () => {
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [filterSubjectId, setFilterSubjectId] = useState('');

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, subRes, quesRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/qcategories/'),
        axios.get('http://127.0.0.1:8000/api/subjects/'),
        axios.get('http://127.0.0.1:8000/api/questions/'),
      ]);
      setCategories(catRes.data);
      setSubjects(subRes.data);
      setQuestions(quesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getQuestionCount = (subjectId) => {
    return questions.filter((q) => q.subject === subjectId).length;
  };

  // Filter logic for subjects
  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const matchesCategory =
        filterCategoryId === '' || subject.QCategory.toString() === filterCategoryId;
      const matchesSubject =
        filterSubjectId === '' || subject.id.toString() === filterSubjectId;
      return matchesCategory && matchesSubject;
    });
  }, [subjects, filterCategoryId, filterSubjectId]);

  // Group subjects by category
  const groupedSubjects = useMemo(() => {
    const grouped = {};
    filteredSubjects.forEach((subject) => {
      if (!grouped[subject.QCategory]) {
        grouped[subject.QCategory] = [];
      }
      grouped[subject.QCategory].push(subject);
    });
    return grouped;
  }, [filteredSubjects]);

  const clearFilters = () => {
    setFilterCategoryId('');
    setFilterSubjectId('');
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Manage Exams
        </h1>
        <button
          onClick={() => (window.location = '/admin/exams/upload')}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          <FiPlus className="mr-2" /> Add Exam
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded shadow">
        <select
          value={filterCategoryId}
          onChange={(e) => {
            setFilterCategoryId(e.target.value);
            setFilterSubjectId('');
          }}
          className="px-4 py-2 border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={filterSubjectId}
          onChange={(e) => setFilterSubjectId(e.target.value)}
          className="px-4 py-2 border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded"
          disabled={!filterCategoryId}
        >
          <option value="">All Subjects</option>
          {subjects
            .filter((s) =>
              filterCategoryId ? s.QCategory.toString() === filterCategoryId : true
            )
            .map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
        </select>

        {(filterCategoryId || filterSubjectId) && (
          <button
            onClick={clearFilters}
            className="flex items-center text-red-600 hover:text-red-800"
          >
            <FiXCircle className="mr-1" /> Clear Filters
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center text-gray-600 dark:text-white">Loading...</p>
      ) : (
        categories
          .filter(
            (cat) =>
              !filterCategoryId || cat.id.toString() === filterCategoryId
          )
          .map((category) => {
            const subjectsInCategory = groupedSubjects[category.id] || [];
            return (
              <div
                key={category.id}
                className="mb-10 bg-white dark:bg-gray-800 p-6 rounded shadow"
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 border-b pb-2">
                  Category: {category.name}
                </h2>

                {subjectsInCategory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-200 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-white">
                            Subject
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-white">
                            Description
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-white">
                            No. of Questions
                          </th>
                          <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700 dark:text-white">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {subjectsInCategory.map((subject) => (
                          <tr key={subject.id}>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                              {subject.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                              {subject.desc?.slice(0, 120) || 'No description'}
                            </td>
                            <td className="px-4 py-3 text-sm text-blue-600 dark:text-blue-300">
                              {getQuestionCount(subject.id)}
                            </td>
                            <td className="px-4 py-3 text-right space-x-3">
                              <button
                                className="text-green-600 hover:text-green-800"
                                title="Edit"
                              >
                                <FiEdit />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800"
                                title="Delete"
                              >
                                <FiTrash2 />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No subjects found under this category.
                  </p>
                )}
              </div>
            );
          })
      )}
    </div>
  );
};

export default AdminExam;
