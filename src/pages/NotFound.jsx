// pages/NotFound.jsx
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="mb-4 text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="mb-8 text-xl text-gray-600">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        Return to Home
      </button>
    </div>
  );
};

export default NotFound;