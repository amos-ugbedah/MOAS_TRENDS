import React, { useState } from 'react'

const useImageUpload = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log(e.target.files)
        setImage(file);
        setPreview(URL.createObjectURL(file));
      };

      const handleClearImage = (event) => {
        console.log(event, "hello")
        event.stopPropagation()
        setImage(null)
        setPreview(null)
      }
  return {
    image,
    preview,
    handleFileChange,
    handleClearImage
  }
}

export default useImageUpload
