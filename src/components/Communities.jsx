import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const Communities = () => {
  // States for cities, builders, communities and selected values
  const [cities, setCities] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [communities, setCommunities] = useState([]);
  
  // Separate states for community selection in each form:
  const [selectedCommunityForCommunity, setSelectedCommunityForCommunity] = useState("");
  const [selectedCommunityForAmenity, setSelectedCommunityForAmenity] = useState("");
  const [selectedCommunityForLandmark, setSelectedCommunityForLandmark] = useState("");

  // States for amenities
  const [amenitiesCategories, setAmenitiesCategories] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [selectedAmenityCategory, setSelectedAmenityCategory] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // States for landmarks
  const [landmarkCategories, setLandmarkCategories] = useState([]);
  const [landmarks, setLandmarks] = useState([{ category: "", name: "", distance: "" }]);

  // Other states
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBuilder, setSelectedBuilder] = useState("");
  const [status, setStatus] = useState("");

  // UI toggle states for forms
  const [showCommunityForm, setShowCommunityForm] = useState(false);
  const [showAmenitiesForm, setShowAmenitiesForm] = useState(false);
  const [showLandmarksForm, setShowLandmarksForm] = useState(false);

  // Refs for scrolling
  const communityFormRef = useRef(null);
  const amenitiesFormRef = useRef(null);
  const landmarksFormRef = useRef(null);

const[nameCommunity, setNameCommunity]=useState("");
const [mapUrl, setMapUrl] = useState("");
const [totalArea, setTotalArea] = useState("");
const [openArea, setOpenArea] = useState("");
const [nblocks, setNBlocks] = useState("");
const [nfloorsPerBlock, setNFloorsPerBlock] = useState("");
const [nhousesPerFloor, setNHousesPerFloor] = useState("");
const [address, setAddress] = useState("");
const [majorArea, setMajorArea] = useState("");
const [totflats, setTotFlats] = useState("");
// const [status, setStatus] = useState("");  // This should be a number (1 for completed, 0 for ongoing)
const [rstatus, setRStatus] = useState("");
const [image, setImage] = useState(null);
  // --- Data Fetching Effects ---

  // Fetch cities
  useEffect(() => {
    fetch("http://localhost:5000/api/getRecords?tableName=st_city&fieldNames=id,name&whereCondition=rstatus=1")
      .then((response) => response.json())
      .then((data) => setCities(data.result || []))
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  // Fetch builders based on selected city
  useEffect(() => {
    if (selectedCity) {
      fetch(
        `http://localhost:5000/api/getRecords?tableName=st_builder&fieldNames=id,name&whereCondition=rstatus=1&city_id=${selectedCity}`
      )
        .then((response) => response.json())
        .then((data) => setBuilders(data.result || []))
        .catch((error) => console.error("Error fetching builders:", error));
    } else {
      setBuilders([]);
      setSelectedBuilder("");
    }
  }, [selectedCity]);

  // Fetch communities based on selected builder
  useEffect(() => {
    if (selectedBuilder) {
      fetch(
        `http://localhost:5000/api/getRecords?tableName=st_community&fieldNames=id,name&whereCondition=rstatus=1`
      )
        .then((response) => response.json())
        .then((data) => {
          setCommunities(data.result || []);
          // Reset all community selections when builder changes:
          setSelectedCommunityForCommunity("");
          setSelectedCommunityForAmenity("");
          setSelectedCommunityForLandmark("");
        })
        .catch((error) => console.error("Error fetching communities:", error));
    } else {
      setCommunities([]);
      setSelectedCommunityForCommunity("");
      setSelectedCommunityForAmenity("");
      setSelectedCommunityForLandmark("");
    }
  }, [selectedBuilder]);

  // Fetch amenity categories based on selected community for amenities
  useEffect(() => {
    if (selectedCommunityForAmenity) {
      const communityId = Number(selectedCommunityForAmenity);
      console.log("Fetching amenities for community:", communityId);
      fetch(`http://localhost:5000/api/amenities?community_id=${communityId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Amenity categories data:", data);
          if (data && data.result && Array.isArray(data.result)) {
            // Create a unique list of amenity categories
            const uniqueCategories = [
              ...new Set(data.result.map((item) => item.amenity_category)),
            ];
            setAmenitiesCategories(uniqueCategories);
          } else {
            console.warn("No amenities found for the selected community");
            setAmenitiesCategories([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching amenity categories:", error);
        });
    } else {
      setAmenitiesCategories([]);
    }
  }, [selectedCommunityForAmenity]);

  // Fetch amenities based on selected amenity category and community for amenities
  useEffect(() => {
    if (selectedCommunityForAmenity && selectedAmenityCategory) {
      console.log(
        "Fetching amenities for community:",
        selectedCommunityForAmenity,
        "and category:",
        selectedAmenityCategory
      );
      fetch(`http://localhost:5000/api/amenities?community_id=${selectedCommunityForAmenity}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched amenities data:", data);
          const amenitiesForCategory = data.result.filter(
            (item) =>
              item.amenity_category === selectedAmenityCategory &&
              item.amenity_name // ensure amenity_name exists
          );
          setAmenities(amenitiesForCategory);
        })
        .catch((error) => {
          console.error("Error fetching amenities:", error);
          setAmenities([]);
        });
    } else {
      setAmenities([]);
    }
  }, [selectedCommunityForAmenity, selectedAmenityCategory]);

  // Fetch landmark categories
  useEffect(() => {
    fetch("http://localhost:5000/api/getRecords?tableName=st_landmarks_category&fieldNames=id,landmark_category&whereCondition=rstatus=1")
      .then((response) => response.json())
      .then((data) => setLandmarkCategories(data.result || []))
      .catch((error) => console.error("Error fetching landmark categories:", error));
  }, []);

  // --- Handlers ---

  const handleAmenityChange = (amenityName) => {
    setSelectedAmenities((prevSelected) =>
      prevSelected.includes(amenityName)
        ? prevSelected.filter((name) => name !== amenityName)
        : [...prevSelected, amenityName]
    );
  };

  const handleSaveAmenities = () => {
    if (selectedAmenities.length === 0) {
      alert("Please select at least one amenity.");
      return;
    }
    const payload = {
      community_id: parseInt(selectedCommunityForAmenity, 10),
      amenity_ids: selectedAmenities.map(Number),
    };
    fetch("http://localhost:5000/api/addamenities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message && data.message.includes("successfully")) {
          alert(data.message);
        } else {
          alert("Failed to save amenities.");
        }
      })
      .catch((error) => {
        console.error("Error saving amenities:", error);
        alert("An error occurred while saving the amenities.");
      });
  };

  const handleAddLandmark = () => {
    setLandmarks([...landmarks, { category: "", name: "", distance: "" }]);
  };

  const handleLandmarkInputChange = (index, field, value) => {
    const newLandmarks = [...landmarks];
    newLandmarks[index][field] = value;
    setLandmarks(newLandmarks);
  };

  const handleSaveLandmarks = () => {
    const payload = {
      community_id: parseInt(selectedCommunityForLandmark, 10),
      landmarks: landmarks.map((landmark) => ({
        landmark_name: landmark.name,
        distance: parseFloat(landmark.distance) || 0,
        landmark_category_id: parseInt(landmark.category, 10),
      })),
    };
    fetch("http://localhost:5000/api/landmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message && data.message.includes("successfully")) {
          //alert(data.message);
          alert("landmark saved successfully");
        } else {
          alert("Failed to save landmarks.");
        }
      })
      .catch((error) => {
        console.error("Error saving landmarks:", error);
        alert("An error occurred while saving landmarks.");
      });
  };

 /* const handleSaveCommunity = () => {
    if (!selectedCommunityForCommunity) {
      alert("Please select a community from the dropdown.");
      return;
    }
    const payload = {
      tableName: "st_community",
      fieldNames: "name",
      fieldValues: selectedCommunityForCommunity,
    };
    fetch("http://localhost:5000/api/addNewRecord", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message && data.message.includes("successfully")) {
          alert("Community added successfully!");
        } else {
          alert("Failed to add community.");
        }
      })
      .catch((error) => {
        console.error("Error adding community:", error);
        alert("An error occurred while adding the community.");
      });
  };*/
  // In your handleSaveCommunity function:
  const handleSaveCommunity = () => {
    // Validate required fields
    if (!nameCommunity) {
      alert("Please enter a community name.");
      return;
    }
    if (!selectedBuilder) {
      alert("Please select a builder.");
      return;
    }
  
    // Build the communityData object in the format expected by your backend.
    // Note: status and rstatus are kept as strings.
    const communityData = {
      name: nameCommunity,       // e.g. "Green Valley"
      map_url: mapUrl,                           // e.g. "https://maps.google.com/sample"
      total_area: Number(totalArea),             // e.g. 5000
      open_area: Number(openArea),               // e.g. 2000
      nblocks: Number(nblocks),                  // e.g. 5
      nfloors_per_block: Number(nfloorsPerBlock),  // e.g. 10
      nhouses_per_floor: Number(nhousesPerFloor),  // e.g. 4
      address: address,                          // e.g. "123, Main Street, City"
      major_area: majorArea,                     // e.g. "Downtown"
      builder_id: Number(selectedBuilder),       // e.g. 101 (from the builder dropdown)
      totflats: Number(totflats),                // e.g. 200
      status: status,                            // e.g. "active"
      rstatus: rstatus                           // e.g. "1"
    };
  
    // Log the JSON string to check its structure
    console.log("Sending communityData:", JSON.stringify(communityData));
  
    // Create a FormData object and append communityData as a JSON string
    const formData = new FormData();
    formData.append("communityData", JSON.stringify(communityData));
  
    // Append image if one is selected
    if (image) {
      formData.append("image", image);
    }
  
    // Make the API request
    fetch("http://localhost:5000/api/createCommunity", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          // If the response is not OK, read the response as text and throw an error
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.message && data.message.includes("successfully")) {
          alert("Community added successfully!");
        } else {
          alert("Failed to add community.");
        }
      })
      .catch((error) => {
        console.error("Error adding community:", error);
        alert("An error occurred while adding the community.");
      });
  };
  


  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Communities Management</h2>
      
      {/* Top Section: City and Builder Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div>
          <label htmlFor="city" className="block font-medium mb-1">
            Select City:
          </label>
          <select
            id="city"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="mt-2 block w-full border px-3 py-2 rounded-md"
          >
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="builder" className="block font-medium mb-1">
            Select Builder:
          </label>
          <select
            id="builder"
            value={selectedBuilder}
            onChange={(e) => setSelectedBuilder(e.target.value)}
            className="mt-2 block w-full border px-3 py-2 rounded-md"
          >
            <option value="">Select a builder</option>
            {builders.map((builder) => (
              <option key={builder.id} value={builder.id}>
                {builder.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
        <Button
          onClick={() => {
            setShowCommunityForm(true);
            setShowAmenitiesForm(false);
            setShowLandmarksForm(false);
            setTimeout(() => {
              communityFormRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
          className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-6 py-2 rounded-full shadow transition transform hover:scale-105"
        >
          Add Community
        </Button>
        <Button
          onClick={() => {
            setShowCommunityForm(false);
            setShowAmenitiesForm(true);
            setShowLandmarksForm(false);
            setTimeout(() => {
              amenitiesFormRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
          className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-6 py-2 rounded-full shadow transition transform hover:scale-105"
        >
          Add Amenities
        </Button>
        <Button
          onClick={() => {
            setShowCommunityForm(false);
            setShowAmenitiesForm(false);
            setShowLandmarksForm(true);
            setTimeout(() => {
              landmarksFormRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
          className="bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white px-6 py-2 rounded-full shadow transition transform hover:scale-105"
        >
          Add Landmark
        </Button>
      </div>
      
      {/* Community Form Section */}
      
{showCommunityForm && (
  <div ref={communityFormRef} className="mb-8 p-6 border rounded-lg shadow-sm bg-gray-50">
    <h3 className="text-xl font-semibold mb-4">Community Details</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input
  type="text"
  placeholder="Enter Community Name"
  className="border p-2 rounded"
  value={nameCommunity}
  onChange={(e) => setNameCommunity(e.target.value)}
/>

      
      <input
        type="text"
        placeholder="Enter Map URL"
        className="border p-2 rounded"
        value={mapUrl}
        onChange={(e) => setMapUrl(e.target.value)}
      />
      <input
        type="number"
        placeholder="Enter Total Area"
        className="border p-2 rounded"
        value={totalArea}
        onChange={(e) => setTotalArea(e.target.value)}
      />
      <input
        type="number"
        placeholder="Enter Open Area"
        className="border p-2 rounded"
        value={openArea}
        onChange={(e) => setOpenArea(e.target.value)}
      />
      <input
        type="number"
        placeholder="Enter Number of Blocks"
        className="border p-2 rounded"
        value={nblocks}
        onChange={(e) => setNBlocks(e.target.value)}
      />
      <input
        type="number"
        placeholder="Enter Floors per Block"
        className="border p-2 rounded"
        value={nfloorsPerBlock}
        onChange={(e) => setNFloorsPerBlock(e.target.value)}
      />
      <input
        type="number"
        placeholder="Enter Houses per Floor"
        className="border p-2 rounded"
        value={nhousesPerFloor}
        onChange={(e) => setNHousesPerFloor(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Address"
        className="border p-2 rounded"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Major Area"
        className="border p-2 rounded"
        value={majorArea}
        onChange={(e) => setMajorArea(e.target.value)}
      />
      <input
        type="number"
        placeholder="Enter Total Flats"
        className="border p-2 rounded"
        value={totflats}
        onChange={(e) => setTotFlats(e.target.value)}
      />
      
      <select className="border p-2 rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">Select Status</option>
        <option value="active">completed</option>
        <option value="inactive">Ongoing</option>
      </select>

      <input
        type="number"
        placeholder="Enter RStatus"
        className="border p-2 rounded"
        value={rstatus}
        onChange={(e) => setRStatus(e.target.value)}
      />
    </div>

    <div className="mt-6">
      <label className="block mb-2 text-sm font-medium">Default Image</label>
      <input
        type="file"
        className="border p-2 rounded w-full"
        onChange={(e) => setImage(e.target.files[0])}
      />
    </div>

    <div className="mt-6 flex justify-center">
      <button
        onClick={handleSaveCommunity}
        className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-xs px-4 py-2 rounded-full shadow transition transform hover:scale-105"
      >
        Save Community
      </button>
    </div>
  </div>
)}

      
      {/* Amenities Form Section */}
      {showAmenitiesForm && (
        <div ref={amenitiesFormRef} className="mb-8 p-6 border rounded-lg shadow-sm bg-gray-50">
          <h3 className="text-xl font-semibold mb-4">Add Amenities</h3>
          {/* Select Community Dropdown for Amenities */}
          <div className="mb-4">
            <label htmlFor="amenity-community" className="block font-medium mb-1">
              Select Community:
            </label>
            <select
              id="amenity-community"
              value={selectedCommunityForAmenity}
              onChange={(e) => setSelectedCommunityForAmenity(e.target.value)}
              className="mt-2 block w-full border px-3 py-2 rounded-md"
            >
              <option value="">Select Community</option>
              {communities.map((community) => (
                <option key={community.id} value={community.id}>
                  {community.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="amenity-category" className="block font-medium mb-1">
              Select Amenities Category:
            </label>
            <select
              id="amenity-category"
              value={selectedAmenityCategory}
              onChange={(e) => setSelectedAmenityCategory(e.target.value)}
              className="mt-2 block w-full border px-3 py-2 rounded-md"
            >
              <option value="">Select Amenity Category</option>
              {amenitiesCategories.length > 0 ? (
                amenitiesCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))
              ) : (
                <option disabled>No amenity categories available</option>
              )}
            </select>
          </div>
          {selectedAmenityCategory && amenities.length > 0 && (
            <div className="mt-2">
              {amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={amenity.amenity_name}
                    onChange={() => handleAmenityChange(amenity.amenity_name)}
                    checked={selectedAmenities.includes(amenity.amenity_name)}
                    className="h-4 w-4"
                  />
                  <label className="text-gray-700">{amenity.amenity_name}</label>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex justify-center">
            <Button
              onClick={handleSaveAmenities}
              className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-xs px-4 py-2 rounded-full shadow transition transform hover:scale-105"
            >
              Save Amenities
            </Button>
          </div>
        </div>
      )}
      
      {/* Landmarks Form Section */}
      {showLandmarksForm && (
        <div ref={landmarksFormRef} className="mb-8 p-6 border rounded-lg shadow-sm bg-gray-50">
          <h3 className="text-xl font-semibold mb-4">Add Landmark</h3>
          {/* Select Community Dropdown for Landmarks */}
          <div className="mb-4">
            <label htmlFor="landmark-community" className="block font-medium mb-1">
              Select Community:
            </label>
            <select
              id="landmark-community"
              value={selectedCommunityForLandmark}
              onChange={(e) => setSelectedCommunityForLandmark(e.target.value)}
              className="mt-2 block w-full border px-3 py-2 rounded-md"
            >
              <option value="">Select Community</option>
              {communities.map((community) => (
                <option key={community.id} value={community.id}>
                  {community.name}
                </option>
              ))}
            </select>
          </div>
          {landmarks.map((landmark, index) => (
            <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-4">
              <select
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-1/3"
                value={landmark.category}
                onChange={(e) => handleLandmarkInputChange(index, "category", e.target.value)}
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
                value={landmark.name}
                onChange={(e) => handleLandmarkInputChange(index, "name", e.target.value)}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-1/3"
              />
              <input
                type="text"
                placeholder="Distance (km)"
                value={landmark.distance}
                onChange={(e) => handleLandmarkInputChange(index, "distance", e.target.value)}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-1/3"
              />
            </div>
          ))}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-6">
            <Button
              onClick={handleAddLandmark}
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-xs px-4 py-2 rounded-full shadow transition transform hover:scale-105"
            >
              Add More Landmark
            </Button>
            <Button
              onClick={handleSaveLandmarks}
              className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-xs px-4 py-2 rounded-full shadow transition transform hover:scale-105"
            >
              Save Landmarks
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communities;
