import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router";

const Error = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-6">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse">
          404
        </h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-800">
          Oops! Page Not Found
        </h2>
        <p className="mt-2 text-gray-600 text-base max-w-md mx-auto">
          The page you're looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 transition duration-300"
          >
            <FaArrowLeft className="mr-2" /> Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error;
