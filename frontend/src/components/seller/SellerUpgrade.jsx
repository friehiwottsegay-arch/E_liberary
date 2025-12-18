import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaStore, 
  FaUser, 
  FaCreditCard, 
  FaCheckCircle, 
  FaArrowRight,
  FaArrowLeft,
  FaStar,
  FaDollarSign,
  FaChartBar,
  FaShieldAlt
} from "react-icons/fa";

const SellerUpgrade = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    storeName: "",
    businessType: "",
    businessDescription: "",
    phoneNumber: "",
    address: "",
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Set user as seller (in real app, this would be done via API)
      localStorage.setItem('isSeller', 'true');
      localStorage.setItem('sellerType', 'basic');
      localStorage.setItem('sellerStoreName', formData.storeName);
      
      // Redirect to seller dashboard
      navigate('/seller/admin');
    } catch (error) {
      console.error("Error upgrading to seller:", error);
    } finally {
      setLoading(false);
    }
  };

  const sellerBenefits = [
    {
      icon: FaDollarSign,
      title: "Earn Revenue",
      description: "Sell your books and earn money from every transaction"
    },
    {
      icon: FaChartBar,
      title: "Analytics Dashboard",
      description: "Track your sales, popular books, and customer insights"
    },
    {
      icon: FaShieldAlt,
      title: "Secure Payments",
      description: "Safe and secure payment processing for all transactions"
    },
    {
      icon: FaStore,
      title: "Professional Storefront",
      description: "Customize your store with your brand and book catalog"
    }
  ];

  const pricingPlans = [
    {
      name: "Basic Seller",
      price: "Free",
      features: [
        "Sell up to 50 books",
        "Basic analytics",
        "Standard support",
        "5% transaction fee"
      ],
      popular: false
    },
    {
      name: "Professional Seller",
      price: "$29/month",
      features: [
        "Unlimited books",
        "Advanced analytics",
        "Priority support",
        "3% transaction fee",
        "Custom storefront",
        "Bulk upload tools"
      ],
      popular: true
    },
    {
      name: "Enterprise Seller",
      price: "$99/month",
      features: [
        "Everything in Professional",
        "API access",
        "White-label options",
        "Dedicated account manager",
        "1% transaction fee",
        "Advanced integrations"
      ],
      popular: false
    }
  ];

  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4 mx-auto"
            >
              <FaArrowLeft className="mr-2" />
              Back to Home
            </button>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Become a Seller
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of sellers on our platform and start monetizing your book collection today
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {sellerBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="text-white text-2xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Pricing Plans */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Choose Your Plan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-xl p-8 relative ${
                    plan.popular ? 'border-2 border-blue-500' : 'border border-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                        <FaStar className="mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-blue-600">{plan.price}</div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <FaCheckCircle className="text-green-500 mr-3" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setCurrentStep(2)}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    Choose {plan.name}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-6">
              Join our marketplace and start selling your books to thousands of customers
            </p>
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center mx-auto"
            >
              Start Selling
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Registration Form (Step 2)
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <FaArrowLeft className="mr-2" />
              Back to Plans
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Registration
            </h1>
            <p className="text-gray-600">
              Set up your seller account and start selling books
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  1
                </div>
                <span className="ml-2 text-sm text-gray-600">Choose Plan</span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  2
                </div>
                <span className="ml-2 text-sm text-gray-600">Register</span>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Store Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name *
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your store name"
                />
              </div>

              {/* Business Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type *
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select business type</option>
                  <option value="individual">Individual Seller</option>
                  <option value="small-business">Small Business</option>
                  <option value="publisher">Publisher</option>
                  <option value="bookstore">Bookstore</option>
                </select>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your business address"
                />
              </div>

              {/* Business Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description
                </label>
                <textarea
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about your business and what types of books you sell"
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleCheckboxChange}
                  required
                  className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">
                  I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Seller Agreement</a>. I understand that a verification process will be conducted before my store goes live.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.agreeTerms}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Your Store...
                </div>
              ) : (
                "Create Seller Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerUpgrade;