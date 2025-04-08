import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate for navigation

const SubscribeForm = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // Use useNavigate for navigation

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed with email: ${email}`);
      setEmail(""); // Clear email input after submission
      navigate("/"); // Redirect to the homepage
    } else {
      alert("Please enter a valid email");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl mb-6">Subscribe to Our Newsletter</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full mb-4"
          placeholder="Enter your email"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default SubscribeForm;
