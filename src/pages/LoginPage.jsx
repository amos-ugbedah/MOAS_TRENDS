import React, { useState } from "react";
import { supabase } from "../libs/supabaseClient"; // Ensure the path is correct
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorMessage(""); // Clear previous error
    setIsLoading(true); // Set loading state

    try {
      // Attempt to log in using Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Login error:", error.message); // Log the error
        setErrorMessage(error.message); // Display error to the user
      } else if (!data?.user) {
        console.error("No user returned from login request."); // Log if no user is returned
        setErrorMessage("Login failed. Please check your credentials.");
      } else {
        console.log("User logged in successfully:", data.user); // Log the user data
        navigate("/dashboard"); // Redirect to the dashboard
      }
    } catch (err) {
      console.error("Unexpected error during login:", err); // Log unexpected errors
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-center text-2xl font-semibold text-gray-700 mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-3 bg-blue-500 text-white rounded-md font-semibold ${
              isLoading ? "bg-blue-300" : "hover:bg-blue-600"
            } transition`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
