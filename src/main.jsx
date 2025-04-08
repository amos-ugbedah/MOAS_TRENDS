import './styles/global.css'; // Import the global CSS file
import React from "react";
import ReactDOM from "react-dom/client";  // Use ReactDOM.createRoot from 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import { AuthProvider } from "./hooks/AuthContext"; // Import your AuthProvider
import App from "./App";
import './index.css';  // Import your index.css file

// Create a root and render the app
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthProvider> {/* Wrap your entire app with the AuthProvider */}
    <Router> {/* Wrap the app in Router to manage routing */}
      <App />
    </Router>
  </AuthProvider>
);