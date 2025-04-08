import axios from "axios";

// Cloudinary upload service
export const upload = async (image) => {
  const formData = new FormData();
  formData.append("file", image); // Add the image file
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); // Use the upload preset
  formData.append("folder", "moas-trends"); // Optional folder for organizing uploads

  try {
    const response = await axios.post(import.meta.env.VITE_CLOUDINARY_URL, formData);
    return response.data.secure_url; // Return the secure URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Image upload failed");
  }
};
