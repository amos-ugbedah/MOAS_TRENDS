import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../libs/supabaseClient";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Title from "../Title";

const EditSinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("news")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (!data) {
          toast.error("Post not found");
          navigate("/edit-posts");
          return;
        }

        setPost(data);
        setImagePreview(data.main_image_url);
        reset({
          title: data.title,
          body: data.body,
          category: data.category,
        });
      } catch (error) {
        console.error("Error fetching post:", error.message);
        toast.error("Failed to load post data");
        navigate("/edit-posts");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id, reset, navigate]);

  // Upload image to Cloudinary
  const handleImageUpload = async (file) => {
    if (!file) return null;

    setIsImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
      throw error;
    } finally {
      setIsImageUploading(false);
    }
  };

  // Handle image change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await handleImageUpload(file);
      if (imageUrl) {
        setImagePreview(imageUrl);
        toast.success("Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Error handling image change:", error);
    }
  };

  // Submit form
  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const updateData = {
        title: formData.title,
        body: formData.body,
        category: formData.category,
        updated_at: new Date().toISOString(),
      };

      // Only update image if a new one was uploaded
      if (imagePreview !== post?.main_image_url) {
        updateData.main_image_url = imagePreview;
      }

      const { error } = await supabase
        .from("news")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      toast.success("Post updated successfully!");
      // Redirect to previous page after successful save
      navigate(-1);
    } catch (error) {
      console.error("Error updating post:", error.message);
      toast.error("Failed to update post");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 mt-24">Loading post data...</div>;
  }

  if (!post) {
    return <div className="p-6 mt-24">Post not found</div>;
  }

  return (
    <div className="p-6 mt-24">
      <Title showClose={true} className="text-xl font-bold text-gray-800">
        Edit Post
      </Title>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Title
          </label>
          <Controller
            name="title"
            control={control}
            defaultValue={post?.title || ""}
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            )}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Content
          </label>
          <Controller
            name="body"
            control={control}
            defaultValue={post?.body || ""}
            rules={{ required: "Content is required" }}
            render={({ field }) => (
              <textarea
                {...field}
                rows={6}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            )}
          />
          {errors.body && (
            <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Category
          </label>
          <Controller
            name="category"
            control={control}
            defaultValue={post?.category || ""}
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a category</option>
                <option value="Sport">Sport</option>
                <option value="Local News">Local News</option>
                <option value="Foreign News">Foreign News</option>
                <option value="Politics">Politics</option>
                <option value="Comedy">Comedy</option>
                <option value="Trending">Trending</option>
              </select>
            )}
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Featured Image
          </label>
          {imagePreview && (
            <div className="mb-4">
              <p className="mb-2 text-sm text-gray-500">Current Image:</p>
              <img
                src={imagePreview}
                alt="Current"
                className="w-full h-48 mb-2 rounded-md"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isImageUploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {isImageUploading && (
            <p className="mt-2 text-sm text-blue-600">Uploading image...</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || isImageUploading}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSinglePost;