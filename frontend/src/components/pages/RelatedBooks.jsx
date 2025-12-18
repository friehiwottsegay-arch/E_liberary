import React from "react";
import { useNavigate } from "react-router-dom";
import Img1 from "../../assets/shirt/FeaturedBook7.png";
import Img2 from "../../assets/shirt/FeaturedBook8.png";
import Img3 from "../../assets/shirt/FeaturedBook9.png";

// Dummy data for products (Books) similar to your main product list
const ProductsData = [
  { id: 1, img: Img1, title: "Book 6", description: "Lorem ipsum dolor sit amet..." },
  { id: 2, img: Img2, title: "Book 9", description: "Lorem ipsum dolor sit amet..." },
  { id: 3, img: Img3, title: "Book 12", description: "Lorem ipsum dolor sit amet..." },
  { id: 4, img: Img1, title: "Book 16", description: "Lorem ipsum dolor sit amet..." },
  { id: 5, img: Img2, title: "Book 21", description: "Lorem ipsum dolor sit amet..." },
  { id: 6, img: Img3, title: "Book 24", description: "Lorem ipsum dolor sit amet..." },
  { id: 7, img: Img1, title: "Book 30", description: "Lorem ipsum dolor sit amet..." },
  { id: 8, img: Img2, title: "Book 35", description: "Lorem ipsum dolor sit amet..." },
  { id: 9, img: Img3, title: "Book 40", description: "Lorem ipsum dolor sit amet..." },
];



const ProductsWithbooks = () => {
  const navigate = useNavigate();

  const handleViewExamDetails = (examId) => {
    navigate(`/Exam/details/${examId}`);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      {/* Related Products Section */}
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Related Products</h2>
      <div className="space-y-4">
        {ProductsData.slice(0, 3).map((product) => (
          <div key={product.id} className="flex items-center gap-4">
            <img
              src={product.img}
              alt={product.title}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {product.title}
              </h3>
              <button
                onClick={() =>     navigate(`/book/read/${BookId}`)}
                className="text-blue-500 hover:text-blue-700"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ProductsWithbooks;
