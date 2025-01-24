import React, { useState } from "react";
import { FaHome, FaUsers, FaTable, FaChartPie, FaBars } from "react-icons/fa";
import Communities from "./Communities"; // Import Communities page
import Dashboard from "./TableDropdown";
import TableDropdown from "./DbTables";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard"); // Track the active page

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Function to handle menu item click
  const handleMenuClick = (page) => {
    setActivePage(page); // Update active page
  };

  return (
    <div className="flex">
      {/* Sidebar Toggle Button */}
      <button
        className="md:hidden text-white bg-[#1a202c] p-3 focus:outline-none"
        onClick={toggleSidebar}
      >
        <FaBars className="text-xl" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-[#1a202c] text-white font-poppins transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 md:translate-x-0 md:static md:w-64 p-6`}
      >
        {/* Logo */}
        <div className="text-2xl font-bold mb-4">LOGO</div>

        {/* White line under the logo */}
        <hr className="border-t-2 border-white mb-6" />

        {/* Sidebar Menu */}
        <ul className="space-y-4">
          <li
            className="flex items-center space-x-2 hover:cursor-pointer"
            onClick={() => handleMenuClick("Dashboard")}
          >
            <FaHome className="text-xl" />
            <span>Dashboard</span>
          </li>
          <li
            className="flex items-center space-x-2 hover:cursor-pointer"
            onClick={() => handleMenuClick("Property Listings")}
          >
            <FaUsers className="text-xl" />
            <span>Property Listings</span>
          </li>
          <li
            className="flex items-center space-x-2 hover:cursor-pointer"
            onClick={() => handleMenuClick("Requests")}
          >
            <FaChartPie className="text-xl" />
            <span>Requests</span>
          </li>
          <li
            className="flex items-center space-x-2 hover:cursor-pointer"
            onClick={() => handleMenuClick("Staff Assignment")}
          >
            <FaUsers className="text-xl" />
            <span>Staff Assignment</span>
          </li>
          <li
            className="flex items-center space-x-2 hover:cursor-pointer"
            onClick={() => handleMenuClick("Communities")}
          >
            <FaTable className="text-xl" />
            <span>Communities</span>
          </li>
          <li
            className="flex items-center space-x-2 hover:cursor-pointer"
            onClick={() => handleMenuClick("User Management")}
          >
            <FaUsers className="text-xl" />
            <span>User Management</span>
          </li>
          <li
            className="flex items-center space-x-2 hover:cursor-pointer"
            onClick={() => handleMenuClick("DB Tables")}
          >
            <FaTable className="text-xl" />
            <span>DB Tables</span>
          </li>
          <li
            className="flex items-center space-x-2 hover:cursor-pointer"
            onClick={() => handleMenuClick("Reports")}
          >
            <FaTable className="text-xl" />
            <span>Reports</span>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {activePage === "Dashboard" && <Dashboard/>}
        {activePage === "Property Listings" && <h1>Property Listings</h1>}
        {activePage === "Requests" && <h1>Requests</h1>}
        {activePage === "Staff Assignment" && <h1>Staff Assignment</h1>}
        {activePage === "Communities" && <Communities />} {/* Communities Page */}
        {activePage === "User Management" && <h1>User Management</h1>}
        {activePage === "DB Tables" && <TableDropdown/>}
        {activePage === "Reports" && <h1>Reports</h1>}
      </div>
    </div>
  );
};

export default Sidebar;
