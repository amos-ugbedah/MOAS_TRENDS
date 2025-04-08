import React from "react";
import { useLocation, Link } from "react-router-dom"; // Import Link for navigation

const SearchResults = () => {
  const { state } = useLocation(); // Fetch state passed via navigation
  const { results = [], query, error } = state || {};

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Search Results for "{query}"</h1>
      
      {/* Handle error or no results */}
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : results.length === 0 ? (
        <p className="text-center text-gray-500">
          No results found for "{query}". Try searching for other keywords.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item) => (
            <div key={item.id} className="border p-4 rounded-lg shadow-md bg-white">
              <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
              <p className="text-gray-600 mt-2">
                {item.body ? item.body.substring(0, 150) : "No content available"}...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Category: {item.category || "No category"}
              </p>
              <p className="text-sm text-gray-500">
                Posted on: {new Date(item.created_at).toLocaleDateString()}
              </p>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="mt-4 w-full h-48 object-cover rounded-md"
                />
              )}
              <div className="mt-4">
                <Link
                  to={`/post/${item.id}`}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Read Full News
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
