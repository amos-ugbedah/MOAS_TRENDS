import React from "react";
import { useNavigate } from "react-router-dom";

const ArticleCard = ({
  article,
  likedNews = {},       // Default to empty object
  savedNews = {},        // Default to empty object
  handleLike = () => {}, // Default to no-op function
  handleSave = () => {}, // Prevent crashes if not passed
  toggleCommentBox = () => {},
}) => {
  const navigate = useNavigate();

  const isLiked = likedNews?.[article.id] || false;
  const isSaved = savedNews?.[article.id] || false;

  return (
    <div key={article.id} className="bg-white p-4 rounded shadow-md">
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover mb-3 rounded"
        />
      )}
      <h2 className="text-2xl font-bold">{article.title}</h2>
      <p>{article.body.substring(0, 100)}...</p>
      <button
        className="text-blue-500 mt-2"
        onClick={() => navigate(`/post/${article.id}`)}
      >
        Read More
      </button>

      <div className="mt-3 flex space-x-4">
        <button
          className={`px-3 py-1 rounded-md ${
            isLiked ? "bg-red-500 text-white" : "bg-gray-200 text-black"
          }`}
          onClick={() => handleLike(article.id)}
        >
          {isLiked ? "Liked ❤️" : "Like"}
        </button>
        <button
          className="bg-gray-200 px-3 py-1 rounded-md"
          onClick={() => toggleCommentBox(article.id)}
        >
          Comment 💬
        </button>
        <button
          className={`px-3 py-1 rounded-md ${
            isSaved ? "bg-green-500 text-white" : "bg-gray-200 text-black"
          }`}
          onClick={() => handleSave(article.id)}
        >
          {isSaved ? "Saved ✅" : "Save"}
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;
