import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const Communities = () => {
  const [cities, setCities] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [amenitiesCategories, setAmenitiesCategories] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [landmarkCategories, setLandmarkCategories] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBuilder, setSelectedBuilder] = useState(""); 
  const [selectedAmenityCategory, setSelectedAmenityCategory] = useState("");
  const [landmarks, setLandmarks] = useState([{ category: "", name: "", distance: "" }]);
  const [status, setStatus] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/getRecords?tableName=st_city&fieldNames=id,name&whereCondition=rstatus=1")
      .then((response) => response.json())
      .then((data) => setCities(data.result || []))
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetch(`http://localhost:5000/api/getRecords?tableName=st_builder&fieldNames=id,name&whereCondition=rstatus=1&city_id=${selectedCity}`)
        .then((response) => response.json())
        .then((data) => setBuilders(data.result || []))
        .catch((error) => console.error("Error fetching builders:", error));
    } else {
      setBuilders([]);
      setSelectedBuilder("");
    }
  }, [selectedCity]);

  useEffect(() => {
    fetch("http://localhost:5000/api/getRecords?tableName=st_amenity_category&fieldNames=id,amenity_category&whereCondition=rstatus=1")
      .then((response) => response.json())
      .then((data) => setAmenitiesCategories(data.result || []))
      .catch((error) => console.error("Error fetching amenity categories:", error));
  }, []);

  useEffect(() => {
    if (selectedAmenityCategory) {
      fetch(`http://localhost:5000/api/getRecords?tableName=st_amenities&fieldNames=id,amenity_name,amenity_category_id&whereCondition=amenity_category_id=${selectedAmenityCategory}`)
        .then((response) => response.json())
        .then((data) => setAmenities(data.result || []))
        .catch((error) => console.error("Error fetching amenities:", error));
    }
  }, [selectedAmenityCategory]);

  useEffect(() => {
    fetch("http://localhost:5000/api/getRecords?tableName=st_landmarks_category&fieldNames=id,landmark_category&whereCondition=rstatus=1")
      .then((response) => response.json())
      .then((data) => setLandmarkCategories(data.result || []))
      .catch((error) => console.error("Error fetching landmark categories:", error));
  }, []);

  const handleAddLandmark = () => {
    setLandmarks([...landmarks, { category: "", name: "", distance: "" }]);
  };

  const handleInputChange = (index, field, value) => {
    const newLandmarks = [...landmarks];
    newLandmarks[index][field] = value;
    setLandmarks(newLandmarks);
  };

  const handleAmenityChange = (amenityId) => {
    setSelectedAmenities((prevSelected) =>
      prevSelected.includes(amenityId)
        ? prevSelected.filter((id) => id !== amenityId)
        : [...prevSelected, amenityId]
    );
  };

  const handleSaveCommunity = () => {
    // Prepare the community data object
    const communityData = {
      name: document.querySelector('input[placeholder="Enter Community Name"]').value,
      map_url: document.querySelector('input[placeholder="Enter Map URL"]').value,
      total_area: parseFloat(document.querySelector('input[placeholder="Enter Total Area"]').value) || 0,
      open_area: parseFloat(document.querySelector('input[placeholder="Enter Open Area"]').value) || 0,
      nblocks: parseInt(document.querySelector('input[placeholder="Enter Number of Blocks"]').value, 10) || 0,
      nfloors_per_block: parseInt(document.querySelector('input[placeholder="Enter Floors per Block"]').value, 10) || 0,
      nhouses_per_floor: parseInt(document.querySelector('input[placeholder="Enter Houses per Floor"]').value, 10) || 0,
      address: document.querySelector('input[placeholder="Enter Address"]').value,
      major_area: document.querySelector('input[placeholder="Enter Major Area"]').value,
      total_flats: parseInt(document.querySelector('input[placeholder="Enter Total Flats"]').value, 10) || 0,
      city_id: selectedCity,
      builder_id: selectedBuilder,
      amenities: selectedAmenities,
      landmarks: landmarks.map(({ category, name, distance }) => ({
        category_id: category,
        name,
        distance: parseFloat(distance) || 0,
      })),
      status,
      rstatus: parseInt(document.querySelector('input[placeholder="Enter RStatus"]').value, 10) || 0,
    };
  
    console.log("Saving community data:", communityData);
  
    // POST the community data to the specified API endpoint
    fetch("http://localhost:5000/api/addcommunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(communityData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Community saved successfully:", data);
          alert("Community saved successfully!");
        } else {
          console.error("Error saving community:", data);
          alert("Failed to save community.");
        }
      })
      .catch((error) => {
        console.error("Error saving community:", error);
        alert("An error occurred while saving the community.");
      });
  };
  

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Community</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <select
          className="border p-2 rounded"
          onChange={(e) => setSelectedCity(e.target.value)}
          value={selectedCity}
        >
          <option value="">Select City</option>
          {cities.length === 0 ? (
            <option disabled>No cities available</option>
          ) : (
            cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))
          )}
        </select>

        <select
          className="border p-2 rounded"
          onChange={(e) => setSelectedBuilder(e.target.value)}
          value={selectedBuilder}
          disabled={!selectedCity}
        >
          <option value="">Select Builder</option>
          {builders.length === 0 ? (
            <option disabled>No builders available</option>
          ) : (
            builders.map((builder) => (
              <option key={builder.id} value={builder.id}>
                {builder.name}
              </option>
            ))
          )}
        </select>

        <input type="text" placeholder="Enter Community Name" className="border p-2 rounded" />
        <input type="text" placeholder="Enter Map URL" className="border p-2 rounded" />
        <input type="text" placeholder="Enter Total Area" className="border p-2 rounded" />
        <input type="text" placeholder="Enter Open Area" className="border p-2 rounded" />
        <input type="text" placeholder="Enter Number of Blocks" className="border p-2 rounded" />
        <input type="text" placeholder="Enter Floors per Block" className="border p-2 rounded" />
        <input type="text" placeholder="Enter Houses per Floor" className="border p-2 rounded" />
        <input type="text" placeholder="Enter Address" className="border p-2 rounded" />
        <input type="text" placeholder="Enter Major Area" className="border p-2 rounded" />
        <input type="text" placeholder="Enter Total Flats" className="border p-2 rounded" />
        
        <select
          className="border p-2 rounded"
          onChange={(e) => setStatus(e.target.value)}
          value={status}
        >
          <option value="">Select Status</option>
          <option value="completed">Completed</option>
          <option value="ongoing">Ongoing</option>
        </select>

        <input type="text" placeholder="Enter RStatus" className="border p-2 rounded" />

        {/* Amenities Category Dropdown */}
        <select
  className="border p-2 rounded w-50 h-10" // Add w-40 for a smaller width
  onChange={(e) => setSelectedAmenityCategory(e.target.value)}
  value={selectedAmenityCategory}
>
  <option value="">Select Amenities Category</option>
  {amenitiesCategories.length === 0 ? (
    <option disabled>No amenity categories available</option>
  ) : (
    amenitiesCategories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.amenity_category}
      </option>
    ))
  )}
</select>


        {/* Amenities Checkboxes */}
        {selectedAmenityCategory && amenities.length > 0 && (
          <div>
            {amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={amenity.id}
                  onChange={() => handleAmenityChange(amenity.id)}
                  checked={selectedAmenities.includes(amenity.id)}
                />
                <label>{amenity.amenity_name}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Landmarks</h3>
        {landmarks.map((landmark, index) => (
          <div key={index} className="flex items-center gap-2 mt-2">
            <select
              className="border p-2 rounded"
              value={landmark.category}
              onChange={(e) => handleInputChange(index, "category", e.target.value)}
            >
              <option value="">Select Landmark Category</option>
              {landmarkCategories.length === 0 ? (
                <option disabled>No landmark categories available</option>
              ) : (
                landmarkCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.landmark_category}
                  </option>
                ))
              )}
            </select>
            <input
              type="text"
              placeholder="Landmark Name"
              className="border p-2 rounded"
              value={landmark.name}
              onChange={(e) => handleInputChange(index, "name", e.target.value)}
            />
            <input
              type="text"
              placeholder="Distance (km)"
              className="border p-2 rounded"
              value={landmark.distance}
              onChange={(e) => handleInputChange(index, "distance", e.target.value)}
            />
          </div>
        ))}
        <Button onClick={handleAddLandmark} className="mt-2 text-sm bg-blue-500 text-white">
          Add Landmark
        </Button>
      </div>

      <div className="mt-4">
        <label className="block mb-2 text-sm">Default Image</label>
        <input type="file" className="border p-2 rounded" />
      </div>

      <Button onClick={handleSaveCommunity} className="mt-6 bg-green-500 text-white text-sm px-4 py-2">
        Save
      </Button>
    </div>
  );
};

export default Communities;
