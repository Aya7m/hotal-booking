import React, { useMemo, useState } from "react";
import { assets, facilityIcons, roomsDummyData } from "../assets/assets";
import { useNavigate, useSearchParams } from "react-router-dom";
import StartRating from "../components/StartRating";
import { useAppContext } from "../context/ApiContext";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center mt-2 cursor-pointer text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center mt-2 cursor-pointer text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};
const AllRooms = () => {
  const [ searchParams, setSearchParams]  = useSearchParams();
  const {navigate, currency, rooms} = useAppContext();

  const [openFilter, setOpenFilter] = useState(false);
  const [selectFilter, setSelectFilter] = useState({
    roomTypes: [],
    priceRange: [],
  });

  const [selectedSort, setSelectedSort] = useState("");

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];

  const priceRanges = [
    "0 to 500",
    "500 to 1000",
    "1000 to 2000",
    "2000 to 3000",
  ];

  const sortOptions = [
    "Price Low To Hight",
    "Price Hight To Low",
    "Newest First",
  ];

  // handle changes for filters and sorting

  const handleFilterChange = (checked, value, type) => {
    setSelectFilter((prevFilters) => {
      const updateFilters = { ...prevFilters };
      if (checked) {
        updateFilters[type].push(value);
      } else {
        updateFilters[type] = updateFilters[type].filter(
          (item) => item !== value
        );
      }
      return updateFilters;
    });
  };

  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
  };

  // function to check if a room matches the select room type

  const matchRoomType = (room) => {
    return (
      selectFilter.roomTypes.length === 0 ||
      selectFilter.roomTypes.includes(room.roomTypes)
    );
  };

  // function to check if a room matches the selected price range

const matchPriceRange = (room) => {
  return (
    selectFilter.priceRange.length === 0 ||
    selectFilter.priceRange.some((range) => {
      const [min, max] = range.split(" to ").map(Number);
      return (
        +room.pricePerNight >= min &&
        +room.pricePerNight <= max
      );
    })
  );
};


  // function to sort rooms based on the selected sorting option
  const sortRooms = (a, b) => {
    if (selectedSort === "Price Low To Hight") {
      return a.pricePerNight - b.pricePerNight;
    } else if (selectedSort === "Price Hight To Low") {
      return b.pricePerNight - a.pricePerNight;
    } else if (selectedSort === "Newest First") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  };
  // filter distination

  const filterDistination = (room) => {
    const destination = searchParams.get("destination");
    if (!destination) return true;
    return room.hotel.city.toLowerCase().includes(destination.toLowerCase());
  };

  // filter and sort rooms based on the selected filters and sorting option
  const filterRoom = useMemo(() => {
    return rooms
      .filter(
        (room) =>
          matchRoomType(room) &&
          matchPriceRange(room) &&
          filterDistination(room)
      )
      .sort(sortRooms);
  }, [rooms, selectFilter, selectedSort, searchParams]);

  // clear all filters and sorting options
  const clearFilters = () => {
    setSelectFilter({
      roomTypes: [],
      priceRange: [],
    });
    setSelectedSort("");
    setSearchParams({});
  };
  return (
    <div className="flex flex-col-reverse md:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl-px-32">
      <div>
        <div className="flex flex-col items-start text-left">
          <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
            Take advantage of our limited-time offers and special packages to
            enhance your stay and create unforgettable memories.
          </p>
        </div>

        {filterRoom.map((room) => (
          <div
            key={room._id}
            className="flex flex-col md:flex-row items-start py-20 gap-6 border-b border-gray-300 last:pb-30 last:border-0"
          >
            <img
              onClick={() => {
                navigate(`/rooms/${room._id}`);
                scrollTo(0, 0);
              }}
              src={room.images[0]}
              alt="hotel-rooms"
              title="view room details"
              className="max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer"
            />

            <div className="flex flex-col gap-2 max-w-1/2">
              <p className="text-gray-500">{room.hotel.city}</p>
              <p
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  scrollTo(0, 0);
                }}
                className="font-playfair text-gray-800 text-3xl cursor-pointer"
              >
                {room.hotel.name}
              </p>
              <div className="flex items-center">
                <StartRating />
                <p className="ml-2">200 + reviews</p>
              </div>

              <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                <img src={assets.locationIcon} alt="location-icons" />
                <span>{room.hotel.address}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-3 mb-4">
                {room.amenities?.map((item, index) => (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70">
                    <img
                      src={facilityIcons[item]}
                      alt="item"
                      className="w-5 h-5"
                    />
                    <p className="text-sm">{item}</p>
                  </div>
                ))}
              </div>

              <p className="text-xl font-medium text-gray-800">
                ${room.pricePerNight}/night
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* filter */}
      <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16">
        <div
          className={`flex items-center justify-between px-5 py-2 min-lg:border-b border-gray-300 ${
            openFilter && "border-b"
          }`}
        >
          <p className="text-base font-medium text-gray-800">Filter</p>
          <div className="text-xs cursor-pointer">
            <span
              onClick={() => setOpenFilter(!openFilter)}
              className="lg:hidden"
            >
              {openFilter ? "HIDE" : "Show"}
            </span>
            <span className="hidden lg:block">Clear</span>
          </div>
        </div>

        <div
          className={`${
            openFilter
              ? "h-auto"
              : "h-0 lg:h-auto overflow-hidden transition-all duration-700"
          }`}
        >
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Popular Filter</p>

            {roomTypes.map((room, index) => (
              <CheckBox
                key={index}
                label={room}
                selected={selectFilter.roomTypes.includes(room)}
                onChange={(checked) =>
                  handleFilterChange(checked, room, "roomTypes")
                }
              />
            ))}
          </div>

         

          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Price Range</p>

            {priceRanges.map((range, index) => (
              <CheckBox
                key={index}
                label={`$ ${range}`}
                selected={selectFilter.priceRange.includes(range)}
                onChange={(checked) =>
                  handleFilterChange(checked, range, "priceRange")
                }
              />
            ))}
          </div>

          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 pb-2">Sort By</p>

            {sortOptions.map((option, index) => (
              <RadioButton
                key={index}
                label={option}
                selected={selectedSort === option}
                onChange={() => handleSortChange(option)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
