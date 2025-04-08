import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Title from "../Title";
import axiosInstance from "../../services/axiosInstance"; // Import the updated Axios instance

const EditPosts = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]); // State for all posts
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering posts
  const [isPending, setIsPending] = useState(false); // Loading state for fetching posts
  const [isDeleting, setIsDeleting] = useState(false); // Loading state for deleting a post
  const [confirmationVisible, setConfirmationVisible] = useState(false); // State for showing confirmation
  const [postToDelete, setPostToDelete] = useState(null); // Post ID to delete
  const [error, setError] = useState(null); // Error state for handling failures

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      setIsPending(true);
      try {
        const { data } = await axiosInstance.get("/news"); // Fetch all posts from Supabase
        setPosts(data); // Populate posts state
      } catch (error) {
        console.error("Error fetching posts:", error.response?.data || error.message);
        setError("Failed to fetch posts.");
      } finally {
        setIsPending(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/news?id=eq.${postToDelete}`); // Delete post in Supabase
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postToDelete)); // Update UI state
      setPostToDelete(null); // Clear selected post
      setConfirmationVisible(false); // Close confirmation modal
    } catch (error) {
      console.error("Error deleting post:", error.response?.data || error.message);
      setError("Failed to delete the post.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isPending) return <p className="text-2xl font-medium text-gray-800">Loading...</p>;

  return (
    <div className="p-6 mt-20"> {/* Added mt-20 to prevent overlap with the navbar */}
      <Title showClose={true} className="text-xl font-bold text-gray-800">
        Manage Posts
      </Title>

      {/* Navigation Buttons */}
      <div className="flex justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-800 text-white p-2 rounded-md hover:bg-gray-700"
        >
          Back
        </button>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="bg-green-700 text-white p-2 rounded-md hover:bg-green-600"
        >
          Admin Dashboard
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search for posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-800 rounded-md outline-none text-gray-800"
        />
      </div>

      {/* List of Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="p-4 border rounded-md bg-gray-100">
            <h3 className="text-lg font-bold text-gray-800">{post.title}</h3>
            <p className="text-gray-800">{post.body.substring(0, 100)}...</p>
            <div className="mt-2 flex space-x-4">
              <button
                onClick={() => navigate(`/edit-single-post/${post.id}`)} // Navigate to EditSinglePost.jsx
                className="text-green-700 underline hover:text-green-600"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setPostToDelete(post.id);
                  setConfirmationVisible(true); // Show confirmation modal
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

      {/* Confirmation Dialog */}
      {confirmationVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <p className="mb-4 text-lg text-gray-800">Are you sure you want to delete this post?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmationVisible(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default EditPosts;
