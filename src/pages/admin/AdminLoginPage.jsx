import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../libs/supabaseClient";

const AdminLogin = () => {
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [error, setError] = useState(null); // State for error messages
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate(); // Navigation instance

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous error messages
    setIsLoading(true); // Enable loading state

    try {
      // Perform login using Supabase Auth
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError("Login failed: " + loginError.message);
        setIsLoading(false); // Reset loading state
        return;
      }

      const userId = data.user?.id; // Retrieve logged-in user's ID
      if (!userId) {
        setError("Invalid login. User ID not found.");
        setIsLoading(false);
        return;
      }

      // Fetch the user role and full name from the `users` table
      const { data: userDetails, error: userError } = await supabase
        .from("users")
        .select("role, fullName") // Updated column name to fullName
        .eq("id", userId)
        .single();

      if (userError) {
        setError("Error fetching user details: " + userError.message);
        setIsLoading(false); // Reset loading state
        return;
      }

      if (userDetails.role !== "admin") {
        setError("Access Denied: You are not an admin.");
        setIsLoading(false); // Reset loading state
        return;
      }

      // Store session and admin data in local storage
      localStorage.setItem("adminToken", data.session.access_token);
      localStorage.setItem("adminRole", userDetails.role);
      localStorage.setItem("adminName", userDetails.fullName); // Use updated column name

      // Navigate to admin dashboard
      navigate("/admin-dashboard");
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Login Error:", err.message || err);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-blue-500 text-white p-3 rounded-md w-full mt-4 ${
                isLoading ? "bg-blue-300" : "hover:bg-blue-600"
              } focus:outline-none`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        {/* Error Message Display */}
        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
