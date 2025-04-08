import React from "react";

const CustomButton = ({ className, type, children,disable }) => {
console.log(disable)
  return (
    <button
      type={type || "submit"}
      className={`w-full py-2 px-4 bg-purple-500 text-white outline-none border-none cursor-pointer rounded-md ${className}`}
      disable={disable}
     
    >
      {children}
    </button>
  );
};

export default CustomButton;
