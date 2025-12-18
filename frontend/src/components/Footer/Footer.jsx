import React from "react";
import { FiShoppingBag } from "react-icons/fi";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { IoCall } from "react-icons/io5";

const FooterLinks = [
  { title: "Home", link: "/#" },
  { title: "About", link: "/#about" },
  { title: "Contact", link: "/#contact" },
  { title: "Blog", link: "/#blog" },
];

const Footer = () => {
  return (
    <div className="bg-white text-black border-t border-gray-200 dark:bg-[#121212] dark:text-gray-200 dark:border-gray-700 py-10 px-4 sm:px-10 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Company Info */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 mb-4">
              <FiShoppingBag size="30" />
              <span className="text-gray-900 dark:text-gray-200">ReadMe</span>
            </h1>
            <p className="text-gray-900 dark:text-gray-300 text-justify">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum in
              beatae ea recusandae blanditiis veritatis.
            </p>
          </div>

          {/* Important & More Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-200">
                Important Links
              </h2>
              <ul className="flex flex-col gap-2">
                {FooterLinks.map((link) => (
                  <li
                    key={link.title}
                    className="cursor-pointer hover:text-primary hover:translate-x-1 transition duration-300 text-gray-900 dark:text-gray-400"
                  >
                    {link.title}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-200">
                More Links
              </h2>
              <ul className="flex flex-col gap-2">
                {FooterLinks.map((link) => (
                  <li
                    key={link.title + "-more"}
                    className="cursor-pointer hover:text-primary hover:translate-x-1 transition duration-300 text-gray-900 dark:text-gray-400"
                  >
                    {link.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social & Contact Info */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <a href="#"><FaInstagram className="text-2xl text-gray-900 dark:text-gray-200" /></a>
              <a href="#"><FaFacebook className="text-2xl text-gray-900 dark:text-gray-200" /></a>
              <a href="#"><FaLinkedin className="text-2xl text-gray-900 dark:text-gray-200" /></a>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaMapLocationDot className="text-gray-900 dark:text-gray-200" />
                <p className="text-gray-900 dark:text-gray-300">Addis Ababa, Ethiopia</p>
              </div>
              <div className="flex items-center gap-3">
                <IoCall className="text-gray-900 dark:text-gray-200" />
                <p className="text-gray-900 dark:text-gray-300">+251 911 123 456</p>
              </div>
              <div className="flex items-center gap-3">
                <IoCall className="text-gray-900 dark:text-gray-200" />
                <p className="text-gray-900 dark:text-gray-300">+251 922 987 654</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
