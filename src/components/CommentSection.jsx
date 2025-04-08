import React, { useState, useEffect } from "react";
import { supabase } from "../libs/supabaseClient";

const CommentSection = ({ newsId, session }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fetch comments on newsId change
  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("id, user_id, comment, commented_at")
        .eq("news_id", newsId)
        .order("commented_at", { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error.message);
      } else {
        console.log("Fetched comments:", data);
        setComments(data); // Set the fetched comments directly
      }
    };

    fetchComments();
  }, [newsId]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    if (!session?.user?.email) {
      alert("You must be logged in to post a comment.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          news_id: newsId,
          user_id: session.user.email,
          comment: newComment.trim(),
          commented_at: new Date().toISOString(),
        })
        .select(); // Return the inserted data

      if (error) {
        console.error("Error posting comment:", error.message);
        alert("Failed to post comment.");
      } else if (Array.isArray(data) && data.length > 0) {
        setComments((prev) => [data[0], ...prev]); // Prepend the new comment to the list
        setSuccessMessage("Commented successfully!");
        setNewComment(""); // Clear the input box

        // Optional: hide success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editedComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const { error } = await supabase
        .from("comments")
        .update({ comment: editedComment })
        .eq("id", commentId)
        .eq("user_id", session?.user?.email); // Ensure user owns the comment

      if (error) {
        console.error("Error editing comment:", error.message);
        alert("Failed to edit comment.");
      } else {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId ? { ...comment, comment: editedComment } : comment
          )
        );
        setEditingCommentId(null); // Exit edit mode
      }
    } catch (err) {
      console.error("Unexpected error editing comment:", err.message);
    }
  };

  const handleDeleteComment = async () => {
    const isAdmin = session?.user?.email === "admin@example.com"; // Adjust admin logic as needed
    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentToDelete)
        .or(isAdmin ? "" : `user_id.eq.${session?.user?.email}`); // Admin check logic

      if (error) {
        console.error("Error deleting comment:", error.message);
        alert("Failed to delete comment.");
      } else {
        setComments((prev) => prev.filter((comment) => comment.id !== commentToDelete));
        setShowConfirmModal(false); // Close the confirmation modal
      }
    } catch (err) {
      console.error("Unexpected error deleting comment:", err.message);
    }
  };

  const showDeleteConfirmation = (commentId) => {
    setCommentToDelete(commentId); // Store the comment to delete
    setShowConfirmModal(true); // Open the confirmation modal
  };

  const cancelDelete = () => {
    setCommentToDelete(null); // Clear the comment being deleted
    setShowConfirmModal(false); // Close the confirmation modal
  };

  return (
    <div>
      <textarea
        placeholder="Write your comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        rows={3}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={handleCommentSubmit}
        disabled={isSubmitting}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {isSubmitting ? "Submitting..." : "Post Comment"}
      </button>

      {successMessage && (
        <p className="mt-2 text-green-600 font-medium">{successMessage}</p>
      )}

      <div className="mt-4">
        {comments.map((comment) => (
          <div key={comment.id} className="mb-2 p-2 border rounded">
            {editingCommentId === comment.id ? (
              <div>
                <textarea
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  rows={2}
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={() => handleEditComment(comment.id)}
                  className="mt-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingCommentId(null)}
                  className="mt-1 ml-2 px-2 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-800">{comment.comment}</p>
                <p className="text-xs text-gray-500">
                  {new Date(comment.commented_at).toLocaleString()}
                </p>
                {(session?.user?.email === comment.user_id ||
                  session?.user?.email === "admin@example.com") && (
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditedComment(comment.comment);
                      }}
                      className="text-blue-500 underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => showDeleteConfirmation(comment.id)}
                      className="text-red-500 underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-lg font-medium mb-4">Are you sure you want to delete this comment?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDeleteComment}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
