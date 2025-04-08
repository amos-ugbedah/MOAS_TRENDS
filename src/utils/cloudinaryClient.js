// cloudinaryClient.js

export const VITE_CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dycvjrjys/image/upload";
export const VITE_CLOUDINARY_UPLOAD_PRESET = "smcciebt";
export const VITE_CLOUDINARY_CLOUD_NAME = "dycvjrjys";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", VITE_CLOUDINARY_UPLOAD_PRESET); 
  formData.append("cloud_name", VITE_CLOUDINARY_CLOUD_NAME); 

  try {
    const response = await fetch(VITE_CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await response.json();
    return data.secure_url; // Return the secure URL
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; 
  }
};

export const uploadVideo = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", VITE_CLOUDINARY_UPLOAD_PRESET);
  formData.append("cloud_name", VITE_CLOUDINARY_CLOUD_NAME);

  const videoUploadUrl = "https://api.cloudinary.com/v1_1/dycvjrjys/video/upload";

  try {
    const response = await fetch(videoUploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload video to Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
};
export const deleteMedia = async (publicId) => {
  const url = `https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_CLOUD_NAME}/delete_by_token/${publicId}`; // Adjust the URL as needed

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete media from Cloudinary");
    }

    const data = await response.json();
    return data; // Return the response data if needed
  } catch (error) {
    console.error("Error deleting media:", error);
    throw error;
  }
};
