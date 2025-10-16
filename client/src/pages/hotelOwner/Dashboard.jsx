import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/ApiContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { axios, getToken, user, currency } = useAppContext();
  const [dashboard, setDashboard] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    bookings: [],
  });

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get("/api/booking/hotel", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if (data.success) {
        setDashboard(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (user) {
      fetchDashboard();
    }
  }, [user]);
  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Dashboard"
        subTitle="monitor your room lists,booking ...."
      />
      <div className="flex gap-4 my-8 border border-primary/10 rounded">
        {/* total booking */}
        <div className="flex p-4 pr-4">
          <img
            src={assets.totalBookingIcon}
            alt="totalBooking"
            className="max-sm:hidden h-10"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Booking</p>
            <p className="text-neutral-400 text-base">
              {dashboard.totalBookings}
            </p>
          </div>
        </div>

        {/* total revinu */}
        <div className="flex p-4 pr-4">
          <img
            src={assets.totalRevenueIcon}
            alt="totalBooking"
            className="max-sm:hidden h-10"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Revenue</p>
            <p className="text-neutral-400 text-base">
             {currency} {dashboard.totalRevenue}
            </p>
          </div>
        </div>
      </div>

      {/* recently booking */}
      <h1 className="text-xl text-blue-950/70 font-medium mb-5">
        Recently Booking
      </h1>
      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-2 text-gray-800 font-medium">User Name</th>
              <th className="py-3 px-2 text-gray-800 font-medium max-sm:hidden">
                Room Name
              </th>
              <th className="py-3 px-2 text-gray-800 font-medium text-center">
                Total Amount
              </th>
              <th className="py-3 px-2 text-gray-800 font-medium text-center">
                Payment Status
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {dashboard.bookings.map((item, index) => (
              <tr key={index}>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-700">
                  {item.user.username}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-700 max-sm:hidden">
                  {item.room.roomType}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-700 items-center">
                  {currency} {item.totalPrice}
                </td>

                <td className="py-3 px-2 border-t border-gray-300 flex">
                  <button
                    className={`py-1 px-3 text-xs rounded-full mx-auto ${
                      item.isPaid
                        ? "bg-green-200 text-green-600"
                        : "bg-amber-200 text-yellow-600"
                    }`}
                  >
                    {item.isPaid ? "Complete" : "Pending"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
