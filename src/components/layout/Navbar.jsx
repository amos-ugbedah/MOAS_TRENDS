import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DropdownMenu from "./DropdownMenu";
import DynamicNewsTitle from "./DynamicNewsTitle";
import SearchBar from "./SearchBar";
import { supabase } from "../../libs/supabaseClient";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("down");

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data: userDetails, error } = await supabase
          .from("users")
          .select("id, fullName, email, role")
          .eq("id", session.user.id)
          .single();

        if (!error) {
          setUser(userDetails);
        }
      }
    };

    getSession();
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollDirection(currentScrollY > lastScrollY ? "down" : "up");
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <nav className="fixed top-0 z-50 w-full px-4 py-3 text-white bg-green-700 shadow-md sm:px-6">
      {/* Main container - switches between mobile and desktop layouts */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        {/* Logo and mobile search */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <DropdownMenu
              isOpen={isDropdownOpen}
              toggleDropdown={() => setIsDropdownOpen((prev) => !prev)}
              user={user}
              handleLogout={handleLogout}
            />
            
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-white cursor-pointer sm:text-3xl lg:text-4xl lg:font-extrabold" 
                style={{ 
                  fontFamily: "'Pacifico', 'Great Vibes', 'Yellowtail', 'Allura', cursive",
                  display: "flex",
                  alignItems: "flex-end",
                  textTransform: "uppercase"
                }}>
                MOAS
                <span style={{ 
                  fontSize: "1.5rem",
                  transform: "translateY(-6px) rotate(-20deg)",
                  display: "inline-block"
                }}>
                  🕊️
                </span>
                TRENDS
              </span>
            </Link>
          </div>

          {/* Mobile search - hidden on desktop */}
          <div className="lg:hidden">
            <SearchBar compact={true} />
          </div>
        </div>

        {/* Desktop layout - center content */}
        <div className="justify-center flex-1 hidden px-4 mx-4 lg:flex">
          {scrollDirection === 'up' ? (
            <div className="flex space-x-6 text-xl font-extrabold">
              <Link to="/" className="hover:underline hover:text-yellow-300">Home</Link>
              <Link to="/news" className="hover:underline hover:text-yellow-300">News</Link>
              <Link to="/category/politics" className="hover:underline hover:text-yellow-300">Politics</Link>
              <Link to="/category/trending" className="hover:underline hover:text-yellow-300">Entertainment</Link>
              <Link to="/category/local" className="hover:underline hover:text-yellow-300">Metro</Link>
              <Link to="/category/sport" className="hover:underline hover:text-yellow-300">Sports</Link>
            </div>
          ) : (
            <DynamicNewsTitle className="text-xl font-extrabold" />
          )}
        </div>

        {/* Desktop search - hidden on mobile */}
        <div className="hidden lg:block">
          <SearchBar />
        </div>
      </div>

      {/* Mobile layout - dynamic title appears below logo when scrolling down */}
      {scrollDirection === 'down' && (
        <div className="mt-2 text-center lg:hidden">
          <DynamicNewsTitle />
        </div>
      )}
    </nav>
  );
};

export default Navbar;