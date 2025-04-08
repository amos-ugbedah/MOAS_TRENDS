import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../libs/supabaseClient";
import { Search, X } from "lucide-react";

const SearchBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  // Handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  // Handle search submission
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    try {
      const { data, error } = await supabase
        .from("news")
        .select("id, title, body, category, created_at")
        .or(
          `title.ilike.%${searchQuery}%,body.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`
        );

      if (error) throw error;

      navigate("/search-results", {
        state: {
          results: data || [],
          query: searchQuery,
        },
      });
    } catch (err) {
      console.error("Search error:", err);
      navigate("/search-results", {
        state: {
          error: "Failed to search. Please try again.",
          query: searchQuery,
        },
      });
    } finally {
      setSearchQuery("");
      setIsSearchOpen(false);
      setIsSearching(false);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative">
      {/* Search toggle button */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="text-white hover:text-yellow-300 transition-colors"
        aria-label="Search"
      >
        <Search size={24} />
      </button>

      {/* Search modal */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={(e) =>
            e.target === e.currentTarget && setIsSearchOpen(false)
          }
        >
          <div
            ref={modalRef}
            className="bg-white p-4 rounded-lg w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center border-b pb-2">
              <Search className="text-gray-500 mr-2" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search news, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 outline-none bg-white text-gray-800 placeholder-gray-400 p-2"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-gray-500 hover:text-gray-700 ml-2"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className={`px-4 py-2 rounded text-white ${
                  isSearching || !searchQuery.trim()
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
