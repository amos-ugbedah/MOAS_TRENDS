import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const DropdownMenu = ({ isOpen, toggleDropdown, user, handleLogout }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        toggleDropdown(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleDropdown]);

  return (
    <div className="relative">
      <button
        className="text-white focus:outline-none"
        onClick={() => toggleDropdown(!isOpen)}
      >
        <span className="text-3xl">&#9776;</span>
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-12 left-0 bg-white text-black w-64 shadow-lg rounded p-4"
        >
          {/* Category Links */}
          <Link
            to="/news" // All News
            className="block px-4 py-2 hover:bg-gray-200"
            onClick={() => toggleDropdown(false)}
          >
            All News
          </Link>
          <Link
            to="/category/Sport"
            className="block px-4 py-2 hover:bg-gray-200"
            onClick={() => toggleDropdown(false)}
          >
            Sport
          </Link>
          <Link
            to="/category/Politics"
            className="block px-4 py-2 hover:bg-gray-200"
            onClick={() => toggleDropdown(false)}
          >
            Politics
          </Link>
          <Link
            to="/category/Comedy"
            className="block px-4 py-2 hover:bg-gray-200"
            onClick={() => toggleDropdown(false)}
          >
            Comedy
          </Link>
          <Link
            to="/category/Trending"
            className="block px-4 py-2 hover:bg-gray-200"
            onClick={() => toggleDropdown(false)}
          >
            Trending
          </Link>
          <Link
            to="/category/Local"
            className="block px-4 py-2 hover:bg-gray-200"
            onClick={() => toggleDropdown(false)}
          >
            Local
          </Link>
          <Link
            to="/category/International"
            className="block px-4 py-2 hover:bg-gray-200"
            onClick={() => toggleDropdown(false)}
          >
            International
          </Link>

          {/* User Auth Links */}
          <div className="border-t my-3"></div>
          {user ? (
            <>
              <span className="block px-4 py-2 font-medium text-gray-700">{user.fullName}</span>
              {user.role === 'admin' && (
                <Link
                  to="/admin-dashboard"
                  className="block px-4 py-2 hover:bg-gray-200 bg-green-600 rounded text-white"
                  onClick={() => toggleDropdown(false)}
                >
                 Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block w-full bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 hover:bg-gray-200"
                onClick={() => toggleDropdown(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-2 hover:bg-gray-200"
                onClick={() => toggleDropdown(false)}
              >
                Sign Up
              </Link>
              <Link
                to="/admin-login"
                className="block px-4 py-2 bg-yellow-500 rounded text-black hover:bg-yellow-600"
                onClick={() => toggleDropdown(false)}
              >
                Admin Login
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;