import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ResearchProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/projects/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data);
        setFilteredProjects(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Enhanced search and filter functionality
  useEffect(() => {
    let results = projects.filter((project) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch = 
        project.title.toLowerCase().includes(query) ||
        project.profile_username.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        (typeof project.tags === "string"
          ? project.tags.toLowerCase().includes(query)
          : Array.isArray(project.tags) &&
            project.tags.join(" ").toLowerCase().includes(query));

      // Apply additional filters
      if (activeFilter === "featured") return matchesSearch && project.featured;
      if (activeFilter === "recent") {
        const projectDate = new Date(project.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return matchesSearch && projectDate > thirtyDaysAgo;
      }
      if (activeFilter === "high-rated") return matchesSearch && project.rating >= 4;

      return matchesSearch;
    });

    setFilteredProjects(results);
  }, [searchTerm, projects, activeFilter]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "in progress": return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "planning": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100";
      case "intermediate": return "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100";
      case "advanced": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-700 dark:text-gray-300 mt-4">Loading research projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 dark:text-red-400 text-xl mb-2">Error Loading Projects</p>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 md:px-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Research Projects
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Discover innovative research projects from talented researchers worldwide
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-6xl mx-auto mb-12 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Search projects by title, researcher, tags, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-300"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {["all", "featured", "recent", "high-rated"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-all duration-300 ${
                    activeFilter === filter
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {filter.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{projects.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {projects.filter(p => p.status?.toLowerCase() === "completed").length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {projects.filter(p => p.status?.toLowerCase() === "in progress").length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {projects.filter(p => p.featured).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Featured</div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:transform hover:-translate-y-2"
            >
              {/* Project Image with Overlay */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={project.image || "/api/placeholder/400/250"}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Badge and Featured Icon */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(project.status)}`}>
                    {project.status || "Ongoing"}
                  </span>
                  {project.featured && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 rounded-full text-sm font-semibold">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                {/* Difficulty Level */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty || "Not Specified"}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 line-clamp-2">
                    {project.title}
                  </h2>
                  <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
                    <span className="text-lg">⭐</span>
                    <span className="font-semibold">{project.rating || "N/A"}</span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                  {project.description || project.summary}
                </p>

                {/* Project Metadata */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <span>📅</span>
                      <span>{new Date(project.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <span>👁️</span>
                      <span>{project.views || 0} views</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <span>💼</span>
                      <span>{project.field || "Research"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <span>⏱️</span>
                      <span>{project.duration || "Ongoing"}</span>
                    </div>
                  </div>
                </div>

                {/* Researcher Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      project.profile_username
                    )}&background=random&color=fff&size=128`}
                    alt={project.profile_username}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                      {project.profile_username}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {project.institution || "Research Institution"}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {Array.isArray(project.tags)
                    ? project.tags.slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800"
                        >
                          {tag}
                        </span>
                      ))
                    : typeof project.tags === "string"
                    ? project.tags.split(",").slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800"
                        >
                          {tag.trim()}
                        </span>
                      ))
                    : null}
                  {(Array.isArray(project.tags) ? project.tags.length > 4 : 
                    typeof project.tags === "string" ? project.tags.split(",").length > 4 : false) && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1.5">
                      +{Array.isArray(project.tags) ? project.tags.length - 4 : project.tags.split(",").length - 4} more
                    </span>
                  )}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => navigate(`/project/research/${project.id}`)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  View Project Details
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              No projects found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              No projects matching "<strong>{searchTerm}</strong>" were found. Try adjusting your search terms or filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("all");
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Clear Search & Filters
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-16 text-gray-500 dark:text-gray-400">
        <p>Showing {filteredProjects.length} of {projects.length} research projects</p>
      </div>
    </div>
  );
};

export default ResearchProjectsList;