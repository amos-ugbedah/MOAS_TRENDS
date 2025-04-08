import React, { useState } from "react";
import { uploadImage } from "../utils/cloudinaryClient"; // Your Cloudinary function

export default function HandleImageUpload({ onUpload }) {
  const [mediaUrls, setMediaUrls] = useState([]); // To hold the uploaded file URLs
  const [error, setError] = useState(""); // To display error messages
  const [isUploading, setIsUploading] = useState(false); // Show upload progress
  const allowedImageTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

  const handleFileChange = async (event) => {
    const file = event.target.files[0]; // Single file upload
    if (!file) return;

    if (!allowedImageTypes.includes(file.type)) {
      setError("Unsupported file type. Please upload a valid image.");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      // Upload the image to Cloudinary
      const uploadedUrl = await uploadImage(file);
      setMediaUrls((prev) => [...prev, uploadedUrl]); // Add the new URL to the list

      if (onUpload) {
        onUpload(uploadedUrl); // Pass the uploaded URL to the parent component
      }

      setIsUploading(false);
    } catch (err) {
      setError("Failed to upload the image. Please try again.");
      console.error("Error uploading image:", err.message);
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {isUploading && <p className="text-blue-500 text-sm mt-1">Uploading...</p>}

      {mediaUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mediaUrls.map((url, index) => (
            <img key={index} src={url} alt="Uploaded preview" className="h-32 object-cover rounded" />
          ))}
        </div>
      )}
    </div>
  );
}
