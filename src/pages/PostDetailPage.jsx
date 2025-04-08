import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../libs/supabaseClient";

const PostDetailPage = () => {
  const { id } = useParams(); // Get the news post ID from the URL
  const [post, setPost] = useState(null); // Store the news post details
  const [comments, setComments] = useState([]); // Store related comments
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  // Fetch post and comments based on ID
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setLoading(true);

        // Fetch the post details
        const { data: postData, error: postError } = await supabase
          .from("news")
          .select("*")
          .eq("id", id)
          .single();

        if (postError) throw postError;

        // Fetch comments related to this post using `news_id`
        const { data: commentsData, error: commentsError } = await supabase
          .from("comments")
          .select("*")
          .eq("news_id", id);

        if (commentsError) throw commentsError;

        setPost(postData); // Set the post data
        setComments(commentsData); // Set the comments
      } catch (err) {
        console.error("Error fetching post or comments:", err.message);
        setError(err.message);
      } finally {
        setLoading(false); // Turn off loading state
      }
    };

    fetchPostDetails();
  }, [id]);

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (error) return <p className="p-6 text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-6 mt-[80px]"> {/* Added `mt-[80px]` to offset navbar */}
      {post && (
        <>
          {/* Post Title */}
          <h1 className="text-4xl font-bold">{post.title}</h1>

          {/* Post Image */}
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="my-4 w-full" // Full width, natural height
            />
          )}

          {/* Post Body */}
          <div className="whitespace-pre-line text-base leading-relaxed">
            {post.body}
          </div>

          {/* Comments Section */}
          <h2 className="text-2xl mt-8 mb-4">Comments</h2>
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="p-4 border border-gray-200 rounded-md">
                  <p className="font-semibold">{comment.user_id}</p>
                  <p>{comment.comment}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.commented_at).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-6 flex space-x-4">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
              onClick={() => navigate(-1)} // Go back to the previous page
            >
              Back
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
              onClick={() => navigate("/")} // Navigate to the home page
            >
              Home
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PostDetailPage;
