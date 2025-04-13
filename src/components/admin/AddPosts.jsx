import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../libs/supabaseClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPosts = () => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      body: "",
      category: "",
    },
  });

  const [subheadings, setSubheadings] = useState([
    { subheading_title: "", subheading_content: "" },
  ]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState([]);

  const navigate = useNavigate();

  const categories = [
    "Sport",
    "Local News",
    "Foreign News",
    "Politics",
    "Comedy",
    "Trending",
    "Local",
    "International",
  ];

  // Upload to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  // Handle main image selection
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setMainImagePreview(reader.result);
      reader.readAsDataURL(file);
      setMainImageFile(file);
    } else {
      setMainImageFile(null);
      setMainImagePreview(null);
    }
  };

  // Handle additional images selection
  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPreviews = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          newPreviews.push(reader.result);
          if (newPreviews.length === files.length) {
            setAdditionalImagesPreviews((prev) => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
      setAdditionalImageFiles((prev) => [...prev, ...files]);
    } else {
      setAdditionalImageFiles([]);
      setAdditionalImagesPreviews([]);
    }
  };

  // Clear all form fields
  const clearAllFormFields = () => {
    reset({
      title: "",
      body: "",
      category: "",
    });
    setMainImageFile(null);
    setMainImagePreview(null);
    setAdditionalImageFiles([]);
    setAdditionalImagesPreviews([]);
    setVideoUrl("");
    setSubheadings([{ subheading_title: "", subheading_content: "" }]);
    setFormError(null);
  };

  // Form submission
  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    setFormError(null);

    try {
      // Get current user with full profile data
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error(authError?.message || "No user logged in");
      }

      // Verify we have the user ID
      if (!user.id) {
        throw new Error("User ID not available");
      }

      // Get user's full name from their user record
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("fullName")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      // Show uploading toast
      const uploadToastId = toast.info("Uploading images...", {
        autoClose: false,
      });

      // Upload images to Cloudinary
      const mainImageUrl = mainImageFile
        ? await uploadToCloudinary(mainImageFile)
        : null;
      const additionalImageUrls =
        additionalImageFiles.length > 0
          ? await Promise.all(
              additionalImageFiles.map((file) => uploadToCloudinary(file))
            )
          : [];

      // Update toast message
      toast.update(uploadToastId, {
        render: "Creating post...",
        autoClose: false,
      });

      // Create post data with all required fields
      const postData = {
        title: data.title,
        body: data.body,
        category: data.category,
        main_image_url: mainImageUrl,
        additional_images:
          additionalImageUrls.length > 0 ? additionalImageUrls : null,
        video_url: videoUrl || null,
        author_id: user.id,
        admin_name: userProfile?.fullName || user.email, // Use fullName from users table
        created_by: user.id,
        created_at: new Date().toISOString(),
      };

      // Insert into news table
      const { data: post, error: postError } = await supabase
        .from("news")
        .insert(postData)
        .select();

      if (postError) throw postError;

      // Insert subheadings if they exist
      if (subheadings.some((s) => s.subheading_title || s.subheading_content)) {
        const { error: subError } = await supabase.from("subheadings").insert(
          subheadings.map((sub) => ({
            post_id: post[0].id,
            subheading_title: sub.subheading_title,
            subheading_content: sub.subheading_content,
          }))
        );
        if (subError) throw subError;
      }

      // Show success toast
      toast.dismiss(uploadToastId);
      toast.success("News post created successfully!", {
        autoClose: 3000,
      });

      // Clear form only after successful submission
      clearAllFormFields();
    } catch (err) {
      console.error("Submission error:", err);
      setFormError(err.message || "Failed to create post");
      toast.error(err.message || "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  // Subheading management
  const addSubheading = () => {
    setSubheadings([
      ...subheadings,
      { subheading_title: "", subheading_content: "" },
    ]);
  };

  const removeSubheading = (index) => {
    setSubheadings(subheadings.filter((_, i) => i !== index));
  };

  const updateSubheading = (index, field, value) => {
    const newSubheadings = [...subheadings];
    newSubheadings[index][field] = value;
    setSubheadings(newSubheadings);
  };

  return (
    <div className="container max-w-4xl px-4 py-8 mx-auto mt-28">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add New Post</h1>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back to Dashboard
        </button>
      </div>

      {formError && (
        <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
          {formError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="p-6 space-y-6 bg-white rounded-lg shadow"
      >
        {/* Title Field */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Title*
          </label>
          <Controller
            name="title"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            )}
          />
        </div>

        {/* Body Field */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Content*
          </label>
          <Controller
            name="body"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <textarea
                {...field}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            )}
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Category*
          </label>
          <Controller
            name="category"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select a Category</option>
                {categories.map((category, idx) => (
                  <option key={idx} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        {/* Main Image */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Main Image*
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
            className="w-full"
          />
          {mainImagePreview && (
            <img
              src={mainImagePreview}
              alt="Preview"
              className="object-cover w-full h-48 mt-2"
            />
          )}
        </div>

        {/* Additional Images */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Additional Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleAdditionalImagesChange}
            className="w-full"
          />
          {additionalImagesPreviews.length > 0 && (
            <div className="flex mt-2 space-x-4">
              {additionalImagesPreviews.map((preview, idx) => (
                <img
                  key={idx}
                  src={preview}
                  alt={`Preview ${idx}`}
                  className="object-cover w-20 h-20"
                />
              ))}
            </div>
          )}
        </div>

        {/* Video URL */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Video URL (Optional)
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Subheadings */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Subheadings
          </label>
          {subheadings.map((subheading, idx) => (
            <div key={idx} className="mb-4 space-y-2">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Subheading Title"
                  value={subheading.subheading_title}
                  onChange={(e) =>
                    updateSubheading(idx, "subheading_title", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-center">
                <textarea
                  placeholder="Subheading Content"
                  value={subheading.subheading_content}
                  onChange={(e) =>
                    updateSubheading(idx, "subheading_content", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="button"
                onClick={() => removeSubheading(idx)}
                className="text-sm text-red-500"
              >
                Remove Subheading
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSubheading}
            className="text-sm text-blue-500"
          >
            Add Subheading
          </button>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 mt-4 text-white bg-blue-600 rounded-md"
          >
            {isLoading ? "Submitting..." : "Submit Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPosts;