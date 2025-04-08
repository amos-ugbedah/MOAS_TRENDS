// src/pages/Dashboard.jsx
import React, { useContext } from "react";
import { AuthContext } from "../hooks/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl">Welcome, {user?.email}</h1>
      <p>This is your dashboard.</p>
      <div className="mt-4">
        <Link to="/news" className="text-blue-500 mx-2">View News</Link>
        {user?.role === "admin" && (
          <Link to="/admin" className="text-red-500 mx-2">Go to Admin Panel</Link>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
