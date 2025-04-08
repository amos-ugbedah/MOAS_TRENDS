import { useForm } from 'react-hook-form';
import { useState } from 'react'; // Import useState from React
import HandleImageUpload from './handleImageUpload'; // Import your file upload component

export default function FormComponent() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [mediaUrls, setMediaUrls] = useState([]);  // To store uploaded media URLs

  const onSubmit = (data) => {
    // Include the media URLs in the form data
    const formData = { ...data, media: mediaUrls };
    console.log('Form submitted with data:', formData);

    // Send the formData to your backend or server
    // You can use a function like fetch or axios here to send data to your server
  };

  const handleMediaUpload = (newMediaUrls) => {
    setMediaUrls(newMediaUrls);  // Update the media URLs state
    // Optionally, you can set the media URLs in the form if needed
    setValue("media", newMediaUrls); // This will set the media URLs in the form value
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Name Field */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'Name is required' })}
          className="mt-1 p-2 border border-gray-300 rounded"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      {/* Category Field */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          {...register('category', { required: 'Category is required' })}
          className="mt-1 p-2 border border-gray-300 rounded"
        >
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="furniture">Furniture</option>
        </select>
        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
      </div>

      {/* Media Upload Field */}
      <div className="mb-4">
        <label htmlFor="media" className="block text-sm font-medium text-gray-700">Upload Media</label>
        <HandleImageUpload onUpload={handleMediaUpload} /> {/* Pass the callback to HandleImageUpload */}
        {mediaUrls.length > 0 && (
          <div className="mt-4">
            <p className="text-gray-600">Uploaded Media:</p>
            {mediaUrls.map((url, index) => (
              <div key={index} className="mb-2">
                {url.endsWith('.mp4') || url.endsWith('.avi') || url.endsWith('.mov') ? (
                  <video width="200" controls>
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={url} alt="Uploaded preview" width="200" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="mb-4">
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
