import React from "react";
import { Link } from "react-router-dom";

const UserActions = ({ user, handleLogout }) => {
  return user ? (
    <div className="flex items-center space-x-4">
      <span className="text-white font-medium">{user.fullName}</span>
      <button
        onClick={handleLogout}
        className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  ) : (
    <div className="flex items-center space-x-4">
      <Link to="/login" className="hover:underline hover:text-yellow-300">
        Sign In
      </Link>
      <Link to="/signup" className="hover:underline hover:text-yellow-300">
        Sign Up
      </Link>
      <Link
        to="/admin-login"
        className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded"
      >
        Admin Login
      </Link>
    </div>
  );
};

export default UserActions;
