import React, { useEffect, useState } from "react";

const About = () => {
  const [abouts, setAbouts] = useState([]); // Now an array
  const [testimonials, setTestimonials] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [aboutsRes, testimonialsRes, teamRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/aboutus/"),
          fetch("http://127.0.0.1:8000/api/testimonials/"),
          fetch("http://127.0.0.1:8000/api/team-members/"),
        ]);

        if (!aboutsRes.ok || !testimonialsRes.ok || !teamRes.ok) {
          throw new Error("Failed to fetch some data");
        }

        const aboutsData = await aboutsRes.json();
        const testimonialsData = await testimonialsRes.json();
        const teamData = await teamRes.json();

        setAbouts(aboutsData);
        setTestimonials(testimonialsData);
        setTeamMembers(teamData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load content. Please try again later.");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  // For now, show only the first About entry (you can map multiple if needed)
  const about = abouts[0];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-10 lg:px-24 transition-colors duration-300">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 sm:p-12 border-t-8 border-teal-600 transition-colors duration-300">

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          {about?.logo && (
            <img
              src={about.logo}
              alt="Company Logo"
              className="w-24 h-24 object-contain mb-4"
            />
          )}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-800 dark:text-white">
            {about?.title || "About Us"}
          </h1>
          <p className="text-center text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto mt-2">
            {about?.subtitle}
          </p>
          {/* Established Year */}
          {about?.established_year && (
            <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-1">
              Established {about.established_year} {about.established_year === 1 ? "year" : "years"} ago
            </p>
          )}
        </div>

        {/* Contact Info */}
        <div className="mb-10 text-center">
          {about?.email && <p>Email: <a href={`mailto:${about.email}`} className="text-teal-600 dark:text-teal-400">{about.email}</a></p>}
          {about?.phone && <p>Phone: <a href={`tel:${about.phone}`} className="text-teal-600 dark:text-teal-400">{about.phone}</a></p>}
          {about?.website && <p>Website: <a href={about.website} target="_blank" rel="noreferrer" className="text-teal-600 dark:text-teal-400">{about.website}</a></p>}
          {(about?.address || about?.region || about?.city) && (
            <p>
              Address:{" "}
              {[about.address, about.region, about.city].filter(Boolean).join(", ")}
            </p>
          )}
        </div>

        {/* Mission & Team */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">🚀 Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {about?.mission}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">👨‍💻 Our Team</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {about?.why_choose_us}
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
            ✅ Why Choose Us?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed whitespace-pre-line">
            {about?.description}
          </p>
        </div>

        {/* Team Image */}
        {about?.image && (
          <div className="mt-12 flex justify-center">
            <img
              src={about.image}
              alt="Team Working"
              className="rounded-xl shadow-lg w-full max-w-3xl object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}

        {/* Testimonials */}
        <div className="mt-16">
          <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white text-center mb-10">
            💬 What Our Customers Say
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {testimonials.map(({ quote, name }, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <p className="text-gray-700 dark:text-gray-200 italic mb-4">"{quote}"</p>
                <p className="text-right font-semibold text-teal-700 dark:text-teal-400">— {name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {teamMembers.map(({ name, role, photo, bio }, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <img
                src={photo}
                alt={name}
                className="w-28 h-28 rounded-full shadow-md object-cover border-2 border-teal-400 mb-3"
              />
              <p className="font-semibold text-gray-800 dark:text-white">{name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{role}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">{bio}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default About;
