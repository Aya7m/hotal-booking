import React, { useState } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/ApiContext";
import toast from "react-hot-toast";

const AddRoom = () => {
  const { axios, getToken } = useAppContext();

  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [input, setInput] = useState({
    roomType: "",
    pricePerNight: 0,
    amenities: {
      "Free Wifi": "False",
      "Free Breakfast": "False",
      "Room Services": "False",
      "Mountain View": "False",
      "Pool Access": "False",
    },
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // check input fields
    if (
      !input.roomType ||
      !input.pricePerNight ||
      !input.amenities ||
      Object.values(images).some((img) => img === null)
    ) {
      toast.error("Please fill all fields and upload all images");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("roomType", input.roomType);
      formData.append("pricePerNight", input.pricePerNight);
      // conformt amenities to array of strings
      const amenitiesArray = Object.keys(input.amenities).filter(
        (amenity) => input.amenities[amenity]
      );
      formData.append("amenities", JSON.stringify(amenitiesArray));
      // add images to formData
      Object.keys(images).forEach((key) => {
        images[key] && formData.append("images", images[key]);
      });
      const { data } = await axios.post("/api/rooms/", formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (data.success) {
        toast.success(data.message);
        setInput({
          roomType: "",
          pricePerNight: 0,
          amenities: {
            "Free Wifi": "False",
            "Free Breakfast": "False",
            "Room Services": "False",
            "Mountain View": "False",
            "Pool Access": "False",
          },
        });
        setImages({
          1: null,
          2: null,
          3: null,
          4: null,
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Title align="left" title="Add room" />
      {/* upload area for images */}
      <p className="text-gray-800 mt-10">Images</p>
      <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImage${key}`} key={key}>
            <img
              className="max-h-15 cursor-pointer opacity-80"
              src={
                images[key]
                  ? URL.createObjectURL(images[key])
                  : assets.uploadArea
              }
              alt="image"
            />
            <input
              type="file"
              accept="image/*"
              id={`roomImage${key}`}
              hidden
              onChange={(e) =>
                setImages({ ...images, [key]: e.target.files[0] })
              }
            />
          </label>
        ))}
      </div>

      <div className="flex w-full max-sm:flex-col mt-4 sm:gap-4 items-center">
        <div className="flex-1 max-w-48">
          <p className="text-gray-800 mt-4">Room Type</p>
          <select
            value={input.roomType}
            onChange={(e) => setInput({ ...input, roomType: e.target.value })}
            className="border opacity-70 border-gray-300 mt-1 rounded p-2 w-full"
          >
            <option value="">select room type</option>
            <option value="Single Bed">Single Bes</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>

        <div>
          <p className="text-gray-800 mt-4">
            Price <span className="text-xs">/night</span>
          </p>
          <input
            type="number"
            placeholder="0"
            className="border border-gray-300 mt-2 p-2 w-24"
            onChange={(e) =>
              setInput({ ...input, pricePerNight: e.target.value })
            }
          />
        </div>
      </div>

      <p className="text-gray-800 mt-4">Amenities</p>
      <div className="flex flex-col flex-wrap mt-1 ml-2 text-gray-400 max-w-sm">
        {Object.keys(input.amenities).map((amenity, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`amenities ${index + 1}`}
              checked={input.amenities[amenity]}
              onChange={() =>
                setInput({
                  ...input,
                  amenities: {
                    ...input.amenities,
                    [amenity]: !input.amenities[amenity],
                  },
                })
              }
            />
            <label htmlFor={`amenities ${index + 1}`} className="mr-1.5">
              {" "}
              {amenity}
            </label>
          </div>
        ))}
      </div>

      <button className="bg-primary text-white px-8 py-2 rounded mt-8 cursor-pointer" disabled={loading}>
        {loading ? "Add ..." : "Add Room"}
      </button>
    </form>
  );
};

export default AddRoom;
