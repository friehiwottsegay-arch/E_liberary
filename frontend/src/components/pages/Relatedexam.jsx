import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBookOpen, FaArrowRight } from "react-icons/fa";

const ProductsWithExams = ({ currentSubject }) => {
  const [subjects, setSubjects] = useState([]);
  const [relatedSubjects, setRelatedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/subjects/");
        if (!res.ok) throw new Error("Failed to fetch subjects");
        const data = await res.json();
        setSubjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    if (!currentSubject || subjects.length === 0) return;

    const current = subjects.find(
      (s) => s.name.toLowerCase() === currentSubject.toLowerCase()
    );

    if (!current) return;

    const sameCategorySubjects = subjects.filter(
      (s) => s.QCategory === current.QCategory && s.id !== current.id
    );

    setRelatedSubjects(sameCategorySubjects);
  }, [currentSubject, subjects]);

  const handleClick = (id) => navigate(`/exam/question/${id}`);

  if (loading) return <p>Loading related exams...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (relatedSubjects.length === 0)
    return <p className="text-sm text-gray-500">No related exams found.</p>;

  return (
    <div className="mt-6">
      <ul className="space-y-3">
        {relatedSubjects.map((subj) => (
          <li
            key={subj.id}
            onClick={() => handleClick(subj.id)}
            className="flex items-center justify-between bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 cursor-pointer p-3 rounded shadow transition"
          >
            <div className="flex items-center space-x-3">
              <FaBookOpen className="text-blue-600" />
              <span className="text-gray-800 dark:text-white font-medium">
                {subj.name}
              </span>
            </div>
            <FaArrowRight className="text-gray-400" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsWithExams;
