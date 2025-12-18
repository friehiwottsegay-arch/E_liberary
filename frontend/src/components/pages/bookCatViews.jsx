import React, { useEffect, useState } from "react";
import Sidebar2 from "./Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import placeholderImg from "../../assets/women/FeaturedBook1.png";

const BookCatViews = () => {
  const { categoryName, subcategoryName } = useParams(); // from URL params
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const [booksRes, categoriesRes, subcategoriesRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/books/"),
          axios.get("http://127.0.0.1:8000/api/categories/"),
          axios.get("http://127.0.0.1:8000/api/Subcategory/"),
        ]);

        setCategories(categoriesRes.data);
        setSubcategories(subcategoriesRes.data);

        let filteredBooks = booksRes.data;

        if (subcategoryName) {
          // Find subcategory object by name
          const subcat = subcategoriesRes.data.find(
            (s) => s.name.toLowerCase().trim() === subcategoryName.toLowerCase().trim()
          );
          if (!subcat) {
            setBooks([]);
            setError(`Subcategory "${subcategoryName}" not found.`);
            setLoading(false);
            return;
          }
          filteredBooks = filteredBooks.filter(
            (book) =>
              book.sub_category &&
              book.sub_category.toString().toLowerCase() === subcat.id.toString().toLowerCase()
          );
        } else if (categoryName) {
          // Find category object by name
          const cat = categoriesRes.data.find(
            (c) => c.name.toLowerCase().trim() === categoryName.toLowerCase().trim()
          );
          if (!cat) {
            setBooks([]);
            setError(`Category "${categoryName}" not found.`);
            setLoading(false);
            return;
          }
          filteredBooks = filteredBooks.filter(
            (book) =>
              book.category &&
              book.category.toString().toLowerCase() === cat.id.toString().toLowerCase()
          );
        }

        setBooks(filteredBooks);
        setError("");
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load books or categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryName, subcategoryName]);

  const handleReadBook = (id) => {
    navigate(`/book/read/${id}`);
  };

  const getPdfUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `http://127.0.0.1:8000${path}`;
  };

  const getImageUrl = (path) => {
    if (!path) return placeholderImg;
    return path.startsWith("http") ? path : `http://127.0.0.1:8000${path}`;
  };

  const BookCard = ({ book }) => (
    <div
      onClick={() => handleReadBook(book.id)}
      className="cursor-pointer rounded overflow-hidden shadow hover:shadow-md transition border border-gray-200 dark:border-gray-700"
    >
      <div className="w-full h-48 sm:h-56 md:h-60 bg-gray-100">
        <img
          src={getImageUrl(book.cover_image)}
          alt={book.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImg;
          }}
        />
      </div>

      <div className="p-2 bg-white dark:bg-gray-800">
        <h3 className="text-xs sm:text-sm font-medium text-center truncate text-gray-800 dark:text-white">
          {book.title || "Untitled"}
        </h3>
        {book.pdf_file && (
          <a
            href={getPdfUrl(book.pdf_file)}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center mt-1 text-blue-600 text-xs underline hover:text-blue-800"
            onClick={(e) => e.stopPropagation()}
          >
            View PDF
          </a>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 dark:text-gray-400">
        Loading books...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <div className="w-1/6 bg-gray-100 dark:bg-gray-800">
        <Sidebar2 />
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <h2 className="text-lg font-bold mb-6 text-center">
          {subcategoryName
            ? `Books in subcategory: ${subcategoryName}`
            : categoryName
            ? `Books in category: ${categoryName}`
            : "All Books"}
        </h2>

        {books.length === 0 ? (
          <div className="text-center text-gray-500">No books available.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BookCatViews;
