import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axiosInstance from "../../services/axiosInstance";

const EditSinglePost = () => {
  const { postId } = useParams(); // Get post ID from route params
  const navigate = useNavigate();

  const [values, setValues] = useState({
    title: "",
    body: "",
    imageUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // To track image upload progress
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // To show success notification

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axiosInstance.get(`/news?id=eq.${postId}`);
        if (data.length > 0) {
          setValues({
            title: data[0].title,
            body: data[0].body,
            imageUrl: data[0].imageUrl,
          });
        }
      } catch (err) {
        console.error("Error fetching post:", err.response?.data || err.message);
        setError("Failed to fetch the post.");
      }
    };

    fetchPost();
  }, [postId]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Mock an image upload API endpoint (replace with actual logic)
      const { data } = await axiosInstance.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setValues((prevValues) => ({
        ...prevValues,
        imageUrl: data.url, // Assume API returns the image URL
      }));
    } catch (err) {
      console.error("Error uploading image:", err.response?.data || err.message);
      setError("Failed to upload the image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.patch(`/news?id=eq.${postId}`, values);
      setSuccessMessage("Post successfully updated!"); // Display success message

      // Automatically redirect after 2 seconds
      setTimeout(() => {
        navigate(`/post/${postId}`); // Redirect to PostDetailPage to review the post
      }, 2000);
    } catch (err) {
      console.error("Error updating post:", err.response?.data || err.message);
      setError("Failed to update the post.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 mt-20"> {/* Added mt-20 to create space below the navbar */}
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>

      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>} {/* Success Message */}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-gray-800 font-medium">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={values.title}
            onChange={handleOnChange}
            className="w-full p-2 border border-gray-300 rounded-md outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="body" className="text-gray-800 font-medium">
            Body
          </label>
          <textarea
            name="body"
            id="body"
            value={values.body}
            onChange={handleOnChange}
            className="w-full p-2 border border-gray-300 rounded-md outline-none"
            rows={5}
          ></textarea>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-gray-800 font-medium">Current Image</label>
          {values.imageUrl ? (
            <img
              src={values.imageUrl}
              alt="Current"
              className="w-48 h-48 object-cover rounded-md border"
            />
          ) : (
            <p className="text-gray-500">No image available.</p>
          )}
          <label
            htmlFor="imageUpload"
            className="bg-blue-600 text-white px-4 py-2 rounded-md w-fit hover:bg-blue-700 cursor-pointer"
          >
            {isUploading ? "Uploading..." : "Reupload Image"}
          </label>
          <input
            type="file"
            id="imageUpload"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-700 text-white p-2 rounded-md w-full hover:bg-green-600"
        >
          {isLoading ? "Updating..." : "Update Post"}
        </button>
      </form>

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => navigate("/edit-post")}
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Back to Manage Posts
        </button>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
        >
          Go to Admin Dashboard
        </button>
      </div>
    </div>
  );
};

export default EditSinglePost;
