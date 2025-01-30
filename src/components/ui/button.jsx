import React from "react";

export const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
