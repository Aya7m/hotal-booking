import React, { useState } from "react";
import Title from "../components/Title";
import { assets, userBookingsDummyData } from "../assets/assets";

const MyBooking = () => {
  const [booking, setBooking] = useState(userBookingsDummyData);
  return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-42 xl:px-32">
      <Title
        title="My Bookings"
        subTitle="Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks"
        align="left"
      />

      <div className="max-w-6xl mt-8 w-full text-gray-800">
        <div className="hidden md:grid  md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
          <div className="w-1/3">Hotels</div>
          <div className="w-1/3">Date & Timing</div>
          <div className="w-1/3">Payment</div>
        </div>

        {booking.map((booking) => (
          <div
            key={booking._id}
            className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t"
          >
            {/* hotel Details */}
            <div className="flex flex-col md:flex-row">
              <img
                src={booking.room.images[0]}
                alt="hotel-img"
                className="min-md:w-44 rounded shadow object-cover"
              />
              <div className="flex flex-col gap-1.5 max-md:mt-4 min-md:ml-4">
                <p className="font-playfair text-2xl">
                  {booking.hotel.name}
                  <span className="font-inter text-sm">
                    ({booking.room.roomType})
                  </span>
                </p>
                <div className="flex items-center gap-2">
                  <img src={assets.locationIcon} alt="hotel-image" />
                  <span>{booking.hotel.address}</span>
                </div>

                <div className="flex items-center gap-2">
                  <img src={assets.guestsIcon} alt="guestsIcon" />
                  <span>Guests :{booking.guests}</span>
                </div>
                <p className="text-base">total:${booking.totalPrice}</p>
              </div>
            </div>
            {/* hotel timeings */}
            <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-7">
              <div>
                <p>Check-In</p>
                <p>{new Date(booking.checkInDate).toDateString()}</p>
              </div>

              <div>
                <p>Check-Out</p>
                <p>{new Date(booking.checkOutDate).toDateString()}</p>
              </div>
            </div>
            {/* paymeng state */}
            <div className="flex flex-col items-start justify-center pt-3">
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${
                    booking.isPaid ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <p
                  className={`text-sm ${
                    booking.isPaid ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {booking.isPaid ? "Paid" : "UnPaid"}
                </p>
              </div>

              {!booking.isPaid && (
                <button className="px-4 py-1.5 mt-3 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer">
                  Pay Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBooking;
