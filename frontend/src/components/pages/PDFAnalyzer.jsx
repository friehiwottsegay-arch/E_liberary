import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, FileText, UploadCloud, BookOpen, Download } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api"; // Adjust if your backend is different

const PDFAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Fetch PDFs from API
  const fetchPDFs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/pdfs/`);
      setPdfs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPDFs();
  }, []);

  // Upload PDF
  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF file!");
    const formData = new FormData();
    formData.append("pdf_file", file);

    try {
      await axios.post(`${API_BASE}/pdfs/upload/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        },
      });
      setFile(null);
      setProgress(0);
      fetchPDFs();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
      setProgress(0);
    }
  };

  // Analyze PDF
  const handleAnalyze = async (pdf) => {
    setSelectedPdf(pdf);
    setAnalysis(null);
    setLoading(true);
    setProgress(0);

    try {
      const res = await axios.get(`${API_BASE}/pdfs/${pdf.id}/analyze/`, {
        onDownloadProgress: (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
      });
      setAnalysis(res.data);
    } catch (err) {
      console.error(err);
      alert("Analysis failed");
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  // Download worksheet files
  const downloadFile = async (pdfId, type) => {
    try {
      const res = await axios.get(`${API_BASE}/pdfs/${pdfId}/download/${type}/`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${selectedPdf.filename}_${type}.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 font-inter p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-4 text-indigo-700">
          <BookOpen size={30} /> AI Student PDF Analyzer
        </h1>

        {/* Upload Section */}
        <div className="border border-indigo-200 rounded-xl p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3 text-slate-700">
            Upload a PDF for analysis
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            />
            <button
              onClick={handleUpload}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <UploadCloud size={18} /> Upload
            </button>
          </div>

          {progress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* List of PDFs */}
        <div>
          <h2 className="text-lg font-semibold text-slate-700 mb-3">
            Uploaded PDFs
          </h2>
          {pdfs.length === 0 ? (
            <p className="text-gray-500 italic">No PDFs uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pdfs.map((pdf) => (
                <div
                  key={pdf.id}
                  className={`p-4 border rounded-xl shadow-sm hover:shadow-md transition ${
                    selectedPdf?.id === pdf.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-indigo-600" />
                    <div>
                      <p className="font-medium">{pdf.filename}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleAnalyze(pdf)}
                      className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-indigo-700 transition"
                    >
                      Analyze
                    </button>
                    {selectedPdf?.id === pdf.id && analysis && (
                      <>
                        <button
                          onClick={() => downloadFile(pdf.id, "pdf")}
                          className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-700 transition flex items-center gap-1"
                        >
                          <Download size={16} /> PDF
                        </button>
                        <button
                          onClick={() => downloadFile(pdf.id, "json")}
                          className="bg-yellow-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-yellow-700 transition flex items-center gap-1"
                        >
                          <Download size={16} /> JSON
                        </button>
                        <button
                          onClick={() => downloadFile(pdf.id, "txt")}
                          className="bg-orange-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-orange-700 transition flex items-center gap-1"
                        >
                          <Download size={16} /> TXT
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analysis Section */}
        {loading && (
          <div className="flex justify-center mt-8">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
          </div>
        )}

        {analysis && (
          <div className="mt-8 p-5 bg-slate-50 border rounded-xl">
            <h3 className="text-2xl font-bold text-indigo-700 mb-3">
              Analysis Results
            </h3>

            {analysis.summary && (
              <>
                <h4 className="font-semibold text-slate-700 mb-1">Summary:</h4>
                <p className="text-gray-700 mb-4">{analysis.summary}</p>
              </>
            )}

            {analysis.concepts && (
              <>
                <h4 className="font-semibold text-slate-700 mb-1">Key Concepts:</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {analysis.concepts.map((c, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </>
            )}

            {analysis.quiz && (
              <>
                <h4 className="font-semibold text-slate-700 mb-1">Quiz Questions:</h4>
                <ul className="list-disc ml-5 text-gray-700 space-y-2">
                  {analysis.quiz.map((q, i) => (
                    <li key={i}>{q.Q}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFAnalyzer;
