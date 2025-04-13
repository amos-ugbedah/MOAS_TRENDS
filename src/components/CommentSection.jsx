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
        .select("id, user_id, content, created_at")  // Changed from 'comment' to 'content'
        .eq("news_id", newsId)
        .order("created_at", { ascending: false });  // Changed from 'commented_at' to 'created_at'

      if (error) {
        console.error("Error fetching comments:", error.message);
      } else {
        console.log("Fetched comments:", data);
        setComments(data);
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
          content: newComment.trim(),  // Changed from 'comment' to 'content'
          created_at: new Date().toISOString(),  // Changed from 'commented_at' to 'created_at'
        })
        .select();

      if (error) {
        console.error("Error posting comment:", error.message);
        alert("Failed to post comment.");
      } else if (Array.isArray(data) && data.length > 0) {
        setComments((prev) => [data[0], ...prev]);
        setSuccessMessage("Commented successfully!");
        setNewComment("");

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
        .update({ 
          content: editedComment,  // Changed from 'comment' to 'content'
          updated_at: new Date().toISOString()  // Added updated_at field
        })
        .eq("id", commentId)
        .eq("user_id", session?.user?.email);

      if (error) {
        console.error("Error editing comment:", error.message);
        alert("Failed to edit comment.");
      } else {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId ? { 
              ...comment, 
              content: editedComment,
              updated_at: new Date().toISOString()
            } : comment
          )
        );
        setEditingCommentId(null);
      }
    } catch (err) {
      console.error("Unexpected error editing comment:", err.message);
    }
  };

  const handleDeleteComment = async () => {
    const isAdmin = session?.user?.email === "admin@example.com";
    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentToDelete)
        .or(isAdmin ? "" : `user_id.eq.${session?.user?.email}`);

      if (error) {
        console.error("Error deleting comment:", error.message);
        alert("Failed to delete comment.");
      } else {
        setComments((prev) => prev.filter((comment) => comment.id !== commentToDelete));
        setShowConfirmModal(false);
      }
    } catch (err) {
      console.error("Unexpected error deleting comment:", err.message);
    }
  };

  const showDeleteConfirmation = (commentId) => {
    setCommentToDelete(commentId);
    setShowConfirmModal(true);
  };

  const cancelDelete = () => {
    setCommentToDelete(null);
    setShowConfirmModal(false);
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
        className="px-4 py-2 mt-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        {isSubmitting ? "Submitting..." : "Post Comment"}
      </button>

      {successMessage && (
        <p className="mt-2 font-medium text-green-600">{successMessage}</p>
      )}

      <div className="mt-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-2 mb-2 border rounded">
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
                  className="px-2 py-1 mt-1 text-white bg-green-500 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingCommentId(null)}
                  className="px-2 py-1 mt-1 ml-2 text-black bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-800">{comment.content}</p>  {/* Changed from 'comment' to 'content' */}
                <p className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleString()}  {/* Changed from 'commented_at' to 'created_at' */}
                </p>
                {(session?.user?.email === comment.user_id ||
                  session?.user?.email === "admin@example.com") && (
                  <div className="flex mt-2 space-x-2">
                    <button
                      onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditedComment(comment.content);  // Changed from 'comment' to 'content'
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
          <div className="p-6 bg-white rounded shadow-lg">
            <p className="mb-4 text-lg font-medium">Are you sure you want to delete this comment?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDeleteComment}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-400"
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