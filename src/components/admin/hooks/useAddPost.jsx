import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../../libs/supabaseClient";
import { upload } from "../../../services/cloudinary";

const useAddPost = () => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      body: "",
      category: "",
    },
  });

  const [preview, setPreview] = useState(null); // For image preview
  const [file, setFile] = useState(null); // For the uploaded image file
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (selectedFile, previewUrl) => {
    setFile(selectedFile); // Set the selected file
    setPreview(previewUrl); // Set the preview URL
  };

  const clearPreview = () => {
    setFile(null);
    setPreview(null); // Clear the preview image
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setSuccess("");
      setError("");

      // Fetch admin/user session data
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) throw new Error("Failed to retrieve user session");

      const adminName = sessionData.session.user.user_metadata?.full_name || "Unknown Admin";

      let imageUrl = null;

      // Upload image to Cloudinary if a file is selected
      if (file) {
        imageUrl = await upload(file); // Upload and get the image URL
      }

      // Store post details in Supabase
      const payload = {
        title: data.title,
        body: data.body,
        category: data.category,
        imageUrl, // Correct column name
        created_at: new Date().toISOString(),
        admin_name: adminName, // Include admin name in the payload
      };

      const { error: insertError } = await supabase.from("news").insert([payload]);
      if (insertError) throw insertError;

      reset(); // Clear the form
      clearPreview(); // Clear the image preview
      setSuccess("Post successfully added!");
      setTimeout(() => setSuccess(""), 3000); // Success message disappears after 3 seconds
    } catch (err) {
      console.error("Post Error:", err.message);
      setError(err.message || "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    control,
    handleSubmit,
    preview,
    handleFileChange,
    clearPreview,
    onSubmit,
    isLoading,
    success,
    error,
  };
};

export default useAddPost;
