import React, { useState } from "react";

const AdminPanel = () => {
  const [communities, setCommunities] = useState([
    {
      city: "Los Angeles",
      builder: "ABC Builders",
      communityName: "Sunset Villas",
      address: "123 Sunset Blvd",
      neighborhood: "Sunset District",
      mapUrl: "https://maps.google.com",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      city: "Miami",
      builder: "XYZ Developers",
      communityName: "Ocean View Apartments",
      address: "456 Ocean Drive",
      neighborhood: "Oceanfront",
      mapUrl: "https://maps.google.com",
      imageUrl: "https://via.placeholder.com/150",
    },
  ]);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    city: "",
    builder: "",
    communityName: "",
    address: "",
    neighborhood: "",
    mapUrl: "",
    imageUrl: "",
  });

  const [selectedCommunities, setSelectedCommunities] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCommunity({ ...newCommunity, [name]: value });
  };

  const handleAddCommunity = () => {
    setCommunities([...communities, newCommunity]);
    setNewCommunity({
      city: "",
      builder: "",
      communityName: "",
      address: "",
      neighborhood: "",
      mapUrl: "",
      imageUrl: "",
    });
    setIsFormVisible(false);
  };

  const handleDeleteCommunity = () => {
    const filteredCommunities = communities.filter(
      (community, index) => !selectedCommunities.includes(index)
    );
    setCommunities(filteredCommunities);
    setSelectedCommunities([]);
  };

  const handleSelectCommunity = (index) => {
    setSelectedCommunities((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((id) => id !== index)
        : [...prevSelected, index]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5 flex justify-center items-start">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-5xl">
        {/* Heading, Search Box, and Buttons */}
        <div className="flex items-center justify-between mb-5">
          {/* Left: Heading */}
          <h1 className="text-lg font-medium text-gray-700">Existing Communities</h1>

          {/* Center: Search Box */}
          <input
            type="text"
            placeholder="Search Communities..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-1/2 text-sm text-gray-700"
          />

          {/* Right: Buttons */}
          <div className="space-x-3">
            <button
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
            >
              Add
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm">
              Save
            </button>
            <button
              onClick={handleDeleteCommunity}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-gray-600">Select</th>
                <th className="px-4 py-2 text-gray-600">City</th>
                <th className="px-4 py-2 text-gray-600">Builder</th>
                <th className="px-4 py-2 text-gray-600">Community Name</th>
                <th className="px-4 py-2 text-gray-600">Address</th>
                <th className="px-4 py-2 text-gray-600">Neighborhood</th>
                <th className="px-4 py-2 text-gray-600">Map URL</th>
                <th className="px-4 py-2 text-gray-600">Default Image</th>
              </tr>
            </thead>
            <tbody>
              {communities.map((community, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedCommunities.includes(index)}
                      onChange={() => handleSelectCommunity(index)}
                    />
                  </td>
                  <td className="px-4 py-2">{community.city}</td>
                  <td className="px-4 py-2">{community.builder}</td>
                  <td className="px-4 py-2">{community.communityName}</td>
                  <td className="px-4 py-2">{community.address}</td>
                  <td className="px-4 py-2">{community.neighborhood}</td>
                  <td className="px-4 py-2">
                    <a
                      href={community.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 underline text-sm"
                    >
                      Map Link
                    </a>
                  </td>
                  <td className="px-4 py-2">
                    <img
                      src={community.imageUrl}
                      alt="Default"
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Community Form */}
      {isFormVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-90 flex justify-center items-center z-50">
          <div className="bg-gray-100 p-5 rounded shadow-md w-3/4 sm:w-1/2">
            <h2 className="text-lg font-semibold mb-3 text-center">Add New Community</h2>
            <form className="space-y-3">
              {[
                "city",
                "builder",
                "communityName",
                "address",
                "neighborhood",
                "mapUrl",
                "imageUrl",
              ].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type="text"
                    name={field}
                    value={newCommunity[field]}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddCommunity}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full text-sm"
              >
                Add Community
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
