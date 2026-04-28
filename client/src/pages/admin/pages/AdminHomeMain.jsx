import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../constants/api";

const AdminHomeMain = () => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalVendors: 0,
    totalEarnings: 0
  });

  const { username } = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let refreshToken = localStorage.getItem("refreshToken");
        let accessToken = localStorage.getItem("accessToken");

        const res = await fetch(`${API_BASE_URL}/api/admin/dashboardStats`, {
          headers: {
            "Authorization": `Bearer ${refreshToken},${accessToken}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Vehicles", key: "totalVehicles", color: "rgb(254, 201, 15)", bg: "rgba(254, 201, 15, 0.2)" },
    { title: "Total Bookings", key: "totalBookings", color: "rgb(38, 198, 249)", bg: "rgba(38, 198, 249, 0.2)" },
    { title: "Active Users", key: "totalUsers", color: "rgb(0, 227, 150)", bg: "rgba(0, 227, 150, 0.2)" },
    { title: "Vendors", key: "totalVendors", color: "rgb(251, 146, 60)", bg: "rgba(251, 146, 60, 0.2)" },
  ];

  return (
    <div className="mt-12 ">
      <div className="flex flex-wrap lg:flex-nowrap justify-center items-center lg:items-start">
        <div className=" dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 xl:w-full 2xl:w-80 p-8 pt-9 m-3  bg-hero-pattern bg-no-repeat bg-cover   bg-slate-50 xl:h-[250px] 2xl:h-44">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-400">Total Earnings</p>
              <p className="text-2xl text-black">${stats.totalEarnings.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex m-3 flex-wrap  justify-center xl:justify-start  gap-1 items-center ">
          {statCards.map((item) => (
            <div
              key={item.title}
              className="bg-slate-50 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 rounded-2xl"
            >
              <p className="mt-3">
                <span className="text-lg font-semibold text-black">
                  {stats[item.key] || 0}
                </span>
              </p>
              <p className="text-sm text-gray-400 mt-1">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-10 m-4 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
          <p className="text-xl font-semibold">Recent Bookings</p>
        </div>
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
          <p className="text-xl font-semibold">Bookings Overview</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHomeMain;