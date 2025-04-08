import { X } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router";

const Title = ({ children, text, textLink, showClose=false,className }) => {
  const { pathname } = useLocation();
  return (
    <div className="flex justify-between items-center w-full">
      <h1 className={`text-4xl font-bold text-gray-800 ${className}`}>{children}</h1>
      {pathname === "/"  && (
        <Link
          to={textLink}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg"
        >
          {text}
        </Link>
      )}

      {
       showClose &&  <Link to={"/"}>
       <X className="size-4 text-red-500"/>
     
     </Link>
      }
    </div>
  );
};

export default Title;
