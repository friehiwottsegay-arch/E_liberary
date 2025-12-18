import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted!");
    // Replace this with actual submission logic (e.g. API call)
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-white to-teal-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 sm:p-12 border-t-8 border-teal-500">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-4">
          Contact Us
        </h1>
        <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-10">
          We’d love to hear from you. Please fill out the form below and we’ll respond as soon as possible.
        </p>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="md:col-span-1">
            <label htmlFor="name" className="block text-lg font-medium text-gray-800 dark:text-gray-200">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your name"
              className="mt-2 p-3 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Email */}
          <div className="md:col-span-1">
            <label htmlFor="email" className="block text-lg font-medium text-gray-800 dark:text-gray-200">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="mt-2 p-3 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Message (spans both columns) */}
          <div className="md:col-span-2">
            <label htmlFor="message" className="block text-lg font-medium text-gray-800 dark:text-gray-200">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Write your message..."
              className="mt-2 p-3 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition"
            >
              Send Message
            </button>
          </div>
        </form>

        {/* Contact Info Section */}
        <div className="mt-12 text-center text-lg text-gray-700 dark:text-gray-300">
          <p className="mb-2">Or reach us directly:</p>
          <p className="font-semibold">
            <a href="mailto:contact@example.com" className="text-teal-600 dark:text-teal-400 hover:underline">
              contact@example.com
            </a>
          </p>
          <p className="font-semibold mt-2">+1 (555) 123-4567</p>
          <p className="mt-4">1234 Main Street, Suite 100, City, State, 12345</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
