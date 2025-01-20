import React from "react";
import { FaBell, FaUserCircle, FaMoon } from "react-icons/fa";

const Topbar = () => {
  return (
    <div className="bg-white text-gray-600 w-full flex justify-between items-center p-4 shadow-md">
      {/* Admin Panel Title */}
      <h1 className="text-xl font-bold flex-grow" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Admin Panel
      </h1>

      {/* Icons Container */}
      <div className="flex space-x-4">
        <FaBell className="text-base cursor-pointer" />
        <FaMoon className="text-base cursor-pointer" />
        <FaUserCircle className="text-base cursor-pointer" />
      </div>
    </div>
  );
};

export default Topbar;
