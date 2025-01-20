import React from "react";

const StatsCard = ({ IconComponent, title, value }) => {
  return (
    <div className="stats-card p-3 bg-white shadow-lg rounded-lg flex items-center space-x-3 w-48">
      {/* Icon */}
      <div className="icon text-2xl text-gray-600">
        <IconComponent />
      </div>

      {/* Texts */}
      <div>
        <h4 className="text-gray-600 text-xs">{title}</h4>
        <h2 className="text-lg font-bold">{value}</h2>
      </div>
    </div>
  );
};

export default StatsCard;
