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
      subheadings: [],
    },
  });

  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleMainImageChange = (file) => {
    setMainImage(file);
  };

  const handleAdditionalImagesChange = (files) => {
    setAdditionalImages([...files]);
  };

  const handleVideoChange = (file) => {
    setVideoFile(file);
  };

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setSuccess("");
      setError("");

      // Get current user session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) throw new Error("Failed to retrieve user session");

      const user = sessionData.session.user;
      const userId = user.id;
      const adminName = user.user_metadata?.full_name || "Unknown Admin";

      // Upload main image
      let mainImageUrl = null;
      if (mainImage) {
        mainImageUrl = await upload(mainImage);
      }

      // Upload additional images
      let additionalImageUrls = [];
      for (const file of additionalImages) {
        const url = await upload(file);
        if (url) additionalImageUrls.push(url);
      }

      // Upload video if provided
      let videoUrl = null;
      if (videoFile) {
        videoUrl = await upload(videoFile);
      }

      const payload = {
        title: formData.title,
        body: formData.body,
        category: formData.category,
        subheadings: formData.subheadings || [],
        main_image_url: mainImageUrl,
        additional_images: additionalImageUrls,
        video_url: videoUrl,
        created_by: userId,
        admin_name: adminName,
        created_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase.from("news").insert([payload]);
      if (insertError) throw insertError;

      setSuccess("News post created successfully!");
      reset(); // Reset form fields
      setMainImage(null);
      setAdditionalImages([]);
      setVideoFile(null);
    } catch (err) {
      console.error("Error submitting post:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    isLoading,
    success,
    error,
    handleMainImageChange,
    handleAdditionalImagesChange,
    handleVideoChange,
    mainImage,
    additionalImages,
    videoFile,
    reset,
  };
};

export default useAddPost;
