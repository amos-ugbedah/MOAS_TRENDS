import { useState } from "react";
import { supabase } from "../libs/supabaseClient";

const SignUp = () => {
  // State variables for form inputs, error messages, success message, and loading state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (event) => {
    event.preventDefault();

    // Client-side validation: Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true); // Set loading state to true while processing

    try {
      // Create a new user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        console.error("Auth error:", error.message); // Log any authentication error
        setErrorMessage(error.message);
        setIsLoading(false); // Set loading to false on error
        return;
      }

      const user = data?.user; // Extract the user object from the response

      if (!user) {
        console.error("No user returned after signup."); // Log if no user is returned
        setErrorMessage("Signup failed. Please try again.");
        setIsLoading(false);
        return;
      }

      console.log("User signed up successfully:", user);

      // Insert user data into the 'users' table
      const { error: dbError } = await supabase.from("users").insert([
        {
          id: user.id, // Use the user ID from Supabase Auth
          email: user.email, // Use the user's email
          full_name: fullName, // Full name from the form
          role: "user", // Default role as 'user'
          created_at: new Date().toISOString(), // Timestamp for user creation
        },
      ]);

      if (dbError) {
        console.error("Database error:", dbError.message); // Log any database error
        setErrorMessage("Database error saving new user: " + dbError.message);
        setIsLoading(false);
        return;
      }

      // If everything succeeds, clear errors and show success message
      setErrorMessage("");
      setSuccessMessage(`Signup successful! Welcome, ${fullName}!`);
      console.log("User saved to database.");
    } catch (err) {
      console.error("Unexpected error:", err); // Log unexpected errors
      setErrorMessage("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false); // Always set loading state back to false
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handleSignUp}
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

        {/* Input for Full Name */}
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Input for Email */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Input for Password */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Input for Confirm Password */}
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Display error message */}
        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
        )}

        {/* Display success message */}
        {successMessage && (
          <p className="text-green-500 text-sm text-center mb-4">
            {successMessage}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg ${
            isLoading ? "bg-indigo-300" : "hover:bg-indigo-700"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
