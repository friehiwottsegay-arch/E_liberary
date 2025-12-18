import React from "react";
import Img1 from "../../assets/shirt/FeaturedBook7.png";
import Img2 from "../../assets/shirt/FeaturedBook8.png";
import Img3 from "../../assets/shirt/FeaturedBook9.png";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Original data
const ProductsData = [
  { id: 1, img: Img1, title: "Book 6", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt." },
  { id: 2, img: Img2, title: "Book 9", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt." },
  { id: 3, img: Img3, title: "Book 12", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt." },
  { id: 4, img: Img1, title: "Book 16", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt." },
  { id: 5, img: Img2, title: "Book 21", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt." },
  { id: 6, img: Img3, title: "Book 24", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt." },
  { id: 7, img: Img1, title: "Book 30", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt." },
  { id: 8, img: Img2, title: "Book 35", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt." },
  { id: 9, img: Img3, title: "Book 40", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt." },
];

// Helper function to split into chunks of 4
const chunkArray = (array, size) => {
  return array.reduce((acc, _, i) => {
    if (i % size === 0) acc.push(array.slice(i, i + size));
    return acc;
  }, []);
};

const TopProducts = () => {
  const navigate = useNavigate();

  const handleOrderPopup = () => {
    navigate("/Exam/list");
  };

  // Using 4 items per row for larger screens and 2 items per row for mobile
  const itemsPerRow = 4;
  const productRows = chunkArray(ProductsData, itemsPerRow);

  return (
    <div>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-24">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-700 dark:text-gray-300">
            Featured Books
          </h1>
        </div>

        {/* Dynamic Rows */}
        {productRows.map((row, rowIndex) => (
          <div key={rowIndex}>
            {/* Separator (not before the first row) */}
            {rowIndex > 0 && (
              <div className="my-12 text-center">
                <br />
              </div>
            )}

            {/* Row Grid with mobile-specific padding and spacing */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 gap-y-8 place-items-center">
              {row.map((data, idx) => (
                <div
                  key={`${data.id}-${idx}`}
                  data-aos="zoom-in"
                  className="rounded-2xl bg-white dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-primary hover:text-white relative shadow-xl duration-300 group max-w-[300px] p-2"
                >
                  {/* Image */}
                  <div className="h-[100px]">
                    <img
                      src={data.img}
                      alt={data.title}
                      className="max-w-[140px] block mx-auto transform -translate-y-20 group-hover:scale-105 duration-300 drop-shadow-md"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 text-center">
                    
                    <p className="text-gray-500 group-hover:text-white duration-300 text-sm line-clamp-2">
                      {data.description}
                    </p>
                    <button
                      onClick={handleOrderPopup}
                      className="bg-primary hover:scale-105 duration-300 text-white py-1 px-4 rounded-full mt-4 group-hover:bg-white group-hover:text-primary"
                    >
                      Read Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;
