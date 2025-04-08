import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form"; // Import useForm from react-hook-form
import useAddPost from "./hooks/useAddPost";
import HandleImageUpload from "../handleImageUpload";
import { useNavigate } from "react-router-dom";

const AddPosts = () => {
  // Get setValue and other necessary functions from react-hook-form useForm hook
  const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm();

  const {
    preview,
    handleFileChange,
    clearPreview,
    onSubmit,
    isLoading,
    success,
    error,
  } = useAddPost();

  const categories = [
    "Sport", "Local News", "Foreign News", "Politics",
    "Comedy", "Trending", "Local", "International",
  ];

  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/admin-dashboard");
  };

  // Function to persist form data in localStorage
  const saveFormData = () => {
    const formData = {
      title: localStorage.getItem("title") || "",
      body: localStorage.getItem("body") || "",
      category: localStorage.getItem("category") || "",
    };

    // Set form data into react-hook-form if exists
    Object.keys(formData).forEach((key) => {
      setValue(key, formData[key]);
    });
  };

  // Function to handle form changes and save them to localStorage
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    localStorage.setItem(name, value);
  };

  useEffect(() => {
    saveFormData();
  }, [saveFormData, setValue]);
  console.log(setValue);

  // Reset the form and clear localStorage after successful submission
  useEffect(() => {
    if (success) {
      reset(); // Reset form fields after success
      localStorage.removeItem("title");
      localStorage.removeItem("body");
      localStorage.removeItem("category");
    }
  }, [success, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 mt-24"
      onChange={handleInputChange}
    >
      <h1 className="text-xl font-bold mb-4">Add New Post</h1>

      {/* Success Message */}
      {success && (
        <div className="p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Title */}
      <Controller
        name="title"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <input
            {...field}
            type="text"
            placeholder="Enter title"
            className="w-full p-2 border border-gray-300 rounded-md"
            name="title"
          />
        )}
      />

      {/* Body */}
      <Controller
        name="body"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <textarea
            {...field}
            placeholder="Enter body content"
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={5}
            name="body"
          ></textarea>
        )}
      />

      {/* Category */}
      <Controller
        name="category"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <select {...field} className="w-full p-2 border border-gray-300 rounded-md" name="category">
            <option value="">-- Select a Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        )}
      />

      <HandleImageUpload
        onUpload={handleFileChange}
        preview={preview}
        clearPreview={clearPreview}
      />

      <button
        type="submit"
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50`}
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Add Post"}
      </button>

      <button
        type="button"
        onClick={handleBackToDashboard}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md mt-4"
      >
        Back to Admin Dashboard
      </button>
    </form>
  );
};

export default AddPosts;
