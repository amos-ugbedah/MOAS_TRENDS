import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Title from "../Title";
import { supabase } from "../../libs/supabaseClient";

const EditPosts = () => {
  const navigate = useNavigate();
  const [newsItems, setNewsItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);
  const [error, setError] = useState(null);

  // Fetch all news items
  useEffect(() => {
    const fetchNews = async () => {
      setIsPending(true);
      try {
        const { data, error } = await supabase
          .from("news")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setNewsItems(data || []);
      } catch (error) {
        console.error("Error fetching news:", error.message);
        setError(error.message || "Failed to fetch news items");
      } finally {
        setIsPending(false);
      }
    };

    fetchNews();
  }, []);

  const handleDelete = async () => {
    if (!newsToDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("news")
        .delete()
        .eq("id", newsToDelete);

      if (error) throw error;

      setNewsItems((prevItems) =>
        prevItems.filter((item) => item.id !== newsToDelete)
      );
      setNewsToDelete(null);
      setConfirmationVisible(false);
    } catch (error) {
      console.error("Error deleting news item:", error.message);
      setError(error.message || "Failed to delete news item");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredNews = newsItems.filter((item) =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isPending)
    return <p className="text-2xl font-medium text-gray-800">Loading...</p>;

  return (
    <div className="p-6 mt-20">
      <Title showClose={true} className="text-xl font-bold text-gray-800">
        Manage News
      </Title>

      <div className="flex justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-white bg-gray-800 rounded-md hover:bg-gray-700"
        >
          Back
        </button>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="p-2 text-white bg-green-700 rounded-md hover:bg-green-600"
        >
          Admin Dashboard
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search news..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 text-gray-800 border border-gray-800 rounded-md outline-none"
        />
      </div>

      <div className="space-y-4">
        {filteredNews.map((item) => (
          <div key={item.id} className="p-4 bg-gray-100 border rounded-md">
            <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
            <p className="text-gray-800">{item.body?.substring(0, 100)}...</p>
            <div className="flex mt-2 space-x-4">
              <button
                onClick={() => navigate(`/edit-single-post/${item.id}`)} // Navigate to EditSinglePost.jsx
                className="text-green-700 underline hover:text-green-600"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setNewsToDelete(item.id);
                  setConfirmationVisible(true);
                }}
                className="text-red-500 underline hover:text-red-400"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirmationVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="p-6 text-center bg-white rounded-md shadow-md">
            <p className="mb-4 text-lg text-gray-800">
              Are you sure you want to delete this news item?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmationVisible(false)}
                className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default EditPosts;
