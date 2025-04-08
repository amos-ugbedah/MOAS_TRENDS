import React from "react";

const NewsHeader = ({ category, successMessage, handleSubscribe }) => {
  return (
    <div className="mx-4 mb-6">
      <h1 className="text-4xl mb-6">
        {category ? `${category} News` : "All News"}
      </h1>

      {successMessage && (
        <div className="bg-green-500 text-white p-4 mb-4 rounded">
          {successMessage}
        </div>
      )}

      <div className="flex justify-center mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={handleSubscribe}
        >
          Subscribe to Newsletter
        </button>
      </div>
    </div>
  );
};

export default NewsHeader;