import React from 'react';
import { useNavigate } from 'react-router-dom';
import useGetUserDetails from '../../hooks/useGetUserDetails';
import { ClipboardList, Share, BarChart3 } from 'lucide-react'; // lucide-react icons

const Home = () => {
  const { user_data } = useGetUserDetails();
  const navigate = useNavigate();

  const handleClick = () => {
    user_data ? navigate("/generate") : navigate("/signin");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-indigo-100 to-indigo-50 px-6">
      {/* Main Heading */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-600 mb-4">
        TrimURL
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-6">
        Simplify Your Links with Ease
      </p>

      {/* Subheading */}
      <h2 className="text-2xl md:text-4xl font-semibold text-center text-gray-800 mb-12 max-w-2xl">
        Shorten, share, and track your URLs with a single click
      </h2>

      {/* Call to Action Button */}
      <button
        onClick={handleClick}
        className="bg-indigo-500 text-white py-4 px-10 rounded-full text-lg font-medium hover:bg-indigo-600 transition duration-300 shadow-lg transform hover:scale-105"
      >
        Get Started
      </button>

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-4xl w-full">
        {[
          { icon: ClipboardList, text: "Shorten URLs", color: "text-indigo-500" },
          { icon: Share, text: "Easy Sharing", color: "text-green-500" },
          { icon: BarChart3, text: "Track Analytics", color: "text-purple-500" }
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-2xl transform hover:scale-105 transition duration-300"
          >
            <item.icon className={`mx-auto h-12 w-12 mb-4 ${item.color}`} />
            <p className="text-lg font-medium text-gray-700">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;