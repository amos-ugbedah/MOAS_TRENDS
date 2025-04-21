import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Social media URLs (replace with your actual social media links)
  const socialLinks = {
    facebook: "https://www.facebook.com/yourpage",
    twitter: "https://twitter.com/yourhandle",
    instagram: "https://www.instagram.com/yourprofile",
    youtube: "https://www.youtube.com/yourchannel",
    whatsapp: "https://wa.me/yourphonenumber" // WhatsApp link format
  };

  return (
    <footer className="relative z-50 px-4 py-6 text-white bg-gradient-to-r from-blue-900 to-blue-700 sm:py-8 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Logo + Back to Top (Centered) */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <Link 
            to="/" 
            onClick={scrollToTop}
            className="flex items-center transition-opacity hover:opacity-80 active:scale-95"
          >
            <span 
              className="text-2xl font-bold sm:text-3xl lg:text-4xl lg:font-extrabold" 
              style={{ 
                fontFamily: "'Pacifico', cursive",
                display: "flex",
                alignItems: "flex-end",
                textTransform: "uppercase"
              }}
            >
              MOAS
              <span className="inline-block text-xl transform -translate-y-1 sm:text-2xl -rotate-12">
                🕊️
              </span>
              TRENDS
            </span>
          </Link>
        </div>

        {/* Navigation Links (Stacked on mobile, inline on desktop) */}
        <div className="flex flex-col flex-wrap items-center justify-center gap-2 mb-4 sm:flex-row sm:gap-4 sm:mb-6">
          {[
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about" },
            { name: "Contact Us", path: "/contact" },
            { name: "Terms of Use", path: "/terms" },
            { name: "Privacy Policy", path: "/privacy" },
            { name: "Comment Policy", path: "/comment-policy" },
            { name: "Correction Policy", path: "/correction-policy" }
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="px-2 py-1 text-xs transition-colors sm:text-sm hover:text-blue-200 active:text-blue-300"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Social Media Icons with proper links */}
        <div className="flex justify-center gap-3 mb-4 sm:gap-4 sm:mb-6">
          {[
            { 
              icon: <FaFacebook size={18} className="sm:w-5 sm:h-5" />, 
              name: "Facebook",
              url: socialLinks.facebook
            },
            { 
              icon: <FaTwitter size={18} className="sm:w-5 sm:h-5" />, 
              name: "X (Twitter)",
              url: socialLinks.twitter
            },
            { 
              icon: <FaInstagram size={18} className="sm:w-5 sm:h-5" />, 
              name: "Instagram",
              url: socialLinks.instagram
            },
            { 
              icon: <FaYoutube size={18} className="sm:w-5 sm:h-5" />, 
              name: "YouTube",
              url: socialLinks.youtube
            },
            { 
              icon: <FaWhatsapp size={18} className="sm:w-5 sm:h-5" />, 
              name: "WhatsApp",
              url: socialLinks.whatsapp
            }
          ].map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="p-2 transition-colors rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 active:scale-95"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Copyright (Smaller text on mobile) */}
        <div className="text-xs text-center opacity-80 sm:text-sm">
          © 2025 MOAS_TRENDS. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;