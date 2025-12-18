
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';

const API_URL = 'http://127.0.0.1:8000/api/adminbooks/';
const CATS_URL = 'http://127.0.0.1:8000/api/category/';
const SUB_URL = 'http://127.0.0.1:8000/api/Subcategory/';

const AdminBookUpload = () => {
  const [cats, setCats] = useState([]);
  const [subs, setSubs] = useState([]);
  const [pdfPreview, setPdfPreview] = useState(null);

  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    published_date: '',
    category: '',
    category_new: '',
    subcategory: '',
    subcategory_new: '',
    book_type: 'both', // 'hard', 'soft', or 'both'
    cover_image: null,
    pdf_file: null,
  });

  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch categories and subcategories on mount
  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchCategories = async () => {
    setLoadingCats(true);
    try {
      const res = await axios.get(CATS_URL);
      setCats(res.data);
    } catch {
      setError('Failed to load categories.');
    } finally {
      setLoadingCats(false);
    }
  };

  const fetchSubcategories = async () => {
    setLoadingSubs(true);
    try {
      const res = await axios.get(SUB_URL);
      setSubs(res.data);
    } catch {
      setError('Failed to load subcategories.');
    } finally {
      setLoadingSubs(false);
    }
  };

  // Handle form input changes, including file uploads
  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === 'pdf_file' && files[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, pdf_file: file }));
      await renderPdfCoverAndExtract(file);
    } else if (name === 'cover_image') {
      const file = files[0];
      if (file) {
        setForm((prev) => ({ ...prev, cover_image: file }));
        setPdfPreview(URL.createObjectURL(file));
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
        ...(name === 'category' ? { subcategory: '', subcategory_new: '' } : {}),
      }));
    }
  };

  const extractMetadataFromText = (text) => {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

    let title = '';
    let author = '';
    let published_date = '';

    if (lines.length > 0) {
      title = lines[0]; // First line as title fallback
    }

    // Try to find a line with "author" or "by"
    const authorLine = lines.find((line) => /author[:\-]?|by /i.test(line));
    if (authorLine) {
      const authorMatch = authorLine.match(/author[:\-]?\s*(.*)/i) || authorLine.match(/by\s+(.*)/i);
      if (authorMatch) {
        author = authorMatch[1].trim();
      } else {
        author = authorLine;
      }
    } else if (lines.length > 1) {
      author = lines[1];
    }

    // Search for a year (1900-2099) as published date guess
    const yearMatch = text.match(/(19|20)\d{2}/);
    if (yearMatch) {
      published_date = `${yearMatch[0]}-01-01`; // default to Jan 1st
    }

    return { title, author, published_date };
  };

  // Render first PDF page to canvas, extract image + text metadata
  const renderPdfCoverAndExtract = async (pdfFile) => {
    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedarray = new Uint8Array(this.result);

      try {
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        const page = await pdf.getPage(1);

        const scale = 0.7;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        // Convert canvas to PNG blob and set preview + cover_image
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'cover.png', { type: 'image/png' });
            setForm((prev) => ({ ...prev, cover_image: file }));
            setPdfPreview(URL.createObjectURL(file));
          }
        }, 'image/png');

        // Extract text from first page for metadata
        const textContent = await page.getTextContent();
        const strings = textContent.items.map((item) => item.str).join('\n');

        const metadata = extractMetadataFromText(strings);

        // Autofill form fields only if empty
        setForm((prev) => ({
          ...prev,
          title: prev.title || metadata.title,
          author: prev.author || metadata.author,
          published_date: prev.published_date || metadata.published_date,
        }));
      } catch (err) {
        console.error('PDF render or text extraction failed:', err);
        setError('Failed to preview and extract info from PDF first page.');
      }
    };
    fileReader.readAsArrayBuffer(pdfFile);
  };

  // Create new category or subcategory on backend
  const createNew = async (type, name) => {
    const url = type === 'category' ? CATS_URL : SUB_URL;
    try {
      const res = await axios.post(url, { name });
      if (type === 'category') await fetchCategories();
      else await fetchSubcategories();
      return res.data.id;
    } catch {
      setError(`Failed to create ${type}`);
      return null;
    }
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitLoading(true);

    let categoryId = form.category;
    let subcategoryId = form.subcategory;

    if (categoryId === '__new_cat') {
      categoryId = await createNew('category', form.category_new.trim());
      if (!categoryId) {
        setSubmitLoading(false);
        return;
      }
    }

    if (subcategoryId === '__new_sub') {
      subcategoryId = await createNew('subcategory', form.subcategory_new.trim());
      if (!subcategoryId) {
        setSubmitLoading(false);
        return;
      }
    }

    const data = new FormData();
    data.append('title', form.title.trim());
    data.append('author', form.author.trim());
    data.append('description', form.description.trim());
    data.append('published_date', form.published_date);
    data.append('category', categoryId);
    data.append('sub_category', subcategoryId);
    data.append('book_type', form.book_type);
    if (form.cover_image) data.append('cover_image', form.cover_image);
    if (form.pdf_file) data.append('pdf_file', form.pdf_file);

    try {
      const res = await axios.post(API_URL, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Book uploaded:', res.data);
      navigate('/admin/books');
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError('Upload failed: ' + JSON.stringify(err.response?.data || err.message));
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📘 Upload Book</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" noValidate>
        <div className="space-y-4">
          <input
            name="title"
            placeholder="Title*"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="author"
            placeholder="Author*"
            value={form.author}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="date"
            name="published_date"
            value={form.published_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            disabled={loadingCats}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select category</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {`#${c.id} - ${c.name}`}
              </option>
            ))}
            <option value="__new_cat">➕ Create new category</option>
          </select>
          {form.category === '__new_cat' && (
            <input
              name="category_new"
              placeholder="New category name"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          )}

          <select
            name="subcategory"
            value={form.subcategory}
            onChange={handleChange}
            required
            disabled={loadingSubs}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select subcategory</option>
            {subs.map((s) => (
              <option key={s.id} value={s.id}>
                {`#${s.id} - ${s.name}`}
              </option>
            ))}
            <option value="__new_sub">➕ Create new subcategory</option>
          </select>
          {form.subcategory === '__new_sub' && (
            <input
              name="subcategory_new"
              placeholder="New subcategory name"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          )}

          <select
            name="book_type"
            value={form.book_type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="both">📚 Both (Hard & Soft)</option>
            <option value="hard">📦 Hard Cover Only</option>
            <option value="soft">📄 Soft Cover Only</option>
          </select>
        </div>

        <div className="space-y-4">
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows="5"
            className="w-full px-3 py-2 border rounded"
          />

          <div>
            <label className="block text-sm mb-1">📄 PDF File</label>
            <input
              type="file"
              name="pdf_file"
              accept="application/pdf"
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {pdfPreview && (
            <div>
              <label className="block text-sm mb-1">🖼️ First Page Preview (PNG)</label>
              <img
                src={pdfPreview}
                alt="PDF First Page"
                className="w-full max-w-xs rounded shadow border"
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-1">📸 Custom Cover (optional)</label>
            <input
              type="file"
              name="cover_image"
              accept="image/*"
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={submitLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded flex items-center justify-center"
          >
            <FiPlus className="mr-2" />
            {submitLoading ? 'Uploading...' : 'Submit Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBookUpload;
  // Extract metadata heuristics from PDF
