// frontend/src/pages/NotFound.jsx
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-[150px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-none">
            404
          </h1>
        </div>

        {/* Emoji */}
        <div className="text-6xl mb-6">😕</div>

        {/* Error Message */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            ← Go Back
          </button>
          <Link
            to="/"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium shadow-lg"
          >
            🏠 Go to Dashboard
          </Link>
        </div>

        {/* Additional Links */}
        <div className="mt-8 pt-8 border-t border-gray-300">
          <p className="text-gray-600 mb-4">You might want to check:</p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <Link to="/members" className="text-blue-600 hover:underline">
              Members
            </Link>
            <span className="text-gray-400">•</span>
            <Link to="/members/add" className="text-blue-600 hover:underline">
              Add Member
            </Link>
            <span className="text-gray-400">•</span>
            <Link to="/profile" className="text-blue-600 hover:underline">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;