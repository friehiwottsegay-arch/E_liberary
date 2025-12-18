import React, { useState } from "react";
import { 
  FaBook, 
  FaDownload, 
  FaShippingFast, 
  FaMobile,
  FaTruck,
  FaStore,
  FaDollarSign,
  FaClock,
  FaCheck,
  FaExclamationTriangle
} from "react-icons/fa";

const BookTypeSelector = ({ book, onSelectType, selectedType }) => {
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");

  if (!book) return null;

  const handleTypeSelect = (type) => {
    onSelectType({
      bookType: type,
      deliveryMethod: type === 'soft' ? 'digital' : deliveryMethod,
      price: type === 'hard' ? book.hard_price : book.soft_price
    });
  };

  const getBookTypeIcon = (type) => {
    switch (type) {
      case 'hard': return FaBook;
      case 'soft': return FaDownload;
      case 'rent': return FaClock;
      default: return FaBook;
    }
  };

  const getDeliveryIcon = (method) => {
    switch (method) {
      case 'pickup': return FaStore;
      case 'delivery': return FaTruck;
      case 'digital': return FaMobile;
      default: return FaShippingFast;
    }
  };

  const DeliveryIcon = getDeliveryIcon(deliveryMethod);

  return (
    <div className="space-y-6">
      {/* Book Type Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Select Book Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Hard Copy Option */}
          {book.available_for_hard && (
            <div
              onClick={() => handleTypeSelect('hard')}
              className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                selectedType?.bookType === 'hard'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-xl ${
                  selectedType?.bookType === 'hard'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600'
                }`}>
                  <FaBook className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white">Hard Copy</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Physical Book</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Price:</span>
                  <span className="font-bold text-lg text-green-600 dark:text-green-400">
                    ${book.hard_price}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <FaShippingFast className="text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {book.delivery_method === 'both' ? 'Pickup or Delivery' :
                     book.delivery_method === 'pickup' ? 'Pickup' :
                     book.delivery_method === 'delivery' ? 'Delivery' :
                     'Multiple Options'}
                  </span>
                </div>
                
                {selectedType?.bookType === 'hard' && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Delivery Method
                    </label>
                    <select
                      value={deliveryMethod}
                      onChange={(e) => {
                        setDeliveryMethod(e.target.value);
                        handleTypeSelect({
                          bookType: 'hard',
                          deliveryMethod: e.target.value,
                          price: book.hard_price
                        });
                      }}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {book.delivery_method === 'both' && (
                        <>
                          <option value="pickup">Pickup (Free)</option>
                          <option value="delivery">Delivery ($2.99)</option>
                        </>
                      )}
                      {book.delivery_method === 'pickup' && (
                        <option value="pickup">Pickup (Free)</option>
                      )}
                      {book.delivery_method === 'delivery' && (
                        <option value="delivery">Delivery ($2.99)</option>
                      )}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Soft Copy Option */}
          {book.available_for_soft && (
            <div
              onClick={() => handleTypeSelect('soft')}
              className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                selectedType?.bookType === 'soft'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-xl ${
                  selectedType?.bookType === 'soft'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600'
                }`}>
                  <FaDownload className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white">Soft Copy</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Digital Download</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Price:</span>
                  <span className="font-bold text-lg text-green-600 dark:text-green-400">
                    ${book.soft_price}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <FaMobile className="text-purple-500" />
                  <span className="text-gray-600 dark:text-gray-400">Instant Download</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <FaCheck className="text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">Available in PDF format</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rental Option */}
      {book.available_for_rent && (
        <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <FaClock className="mr-2 text-orange-500" />
            Rental Options
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 4, 8, 12, 24].map(weeks => (
              <div
                key={weeks}
                onClick={() => handleTypeSelect({
                  bookType: 'rent',
                  deliveryMethod: deliveryMethod,
                  price: book.rental_price_per_week * weeks,
                  duration: weeks
                })}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedType?.bookType === 'rent' && selectedType?.duration === weeks
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                      {weeks} {weeks === 1 ? 'week' : 'weeks'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ${(book.rental_price_per_week * weeks).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-orange-500">
                    <FaClock />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selection Summary */}
      {selectedType && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 border border-blue-200 dark:border-gray-500">
          <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center">
            <FaCheck className="mr-2 text-green-500" />
            Selection Summary
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Book Type:</span>
              <span className="font-semibold text-gray-800 dark:text-white capitalize">
                {selectedType.bookType === 'rent' ? 'Rental' : `${selectedType.bookType} Copy`}
              </span>
            </div>
            
            {selectedType.duration && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {selectedType.duration} {selectedType.duration === 1 ? 'week' : 'weeks'}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Delivery:</span>
              <span className="font-semibold text-gray-800 dark:text-white flex items-center">
                <DeliveryIcon className="mr-1 text-sm" />
                {selectedType.deliveryMethod === 'digital' ? 'Digital' : 
                 selectedType.deliveryMethod === 'pickup' ? 'Pickup' : 'Delivery'}
              </span>
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-300 pt-2">
              <span className="text-gray-600 dark:text-gray-400">Total Price:</span>
              <span className="font-bold text-xl text-green-600 dark:text-green-400">
                ${selectedType.price}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookTypeSelector;