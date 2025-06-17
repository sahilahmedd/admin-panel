/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import DashboardCard from "@/components/Card";
import { fetchData } from "@/utils/api";
import { ColorRing } from "react-loader-spinner";
import {
  Building2,
  Heart,
  Calendar,
  Briefcase,
  Book,
  LayoutGrid,
  RefreshCw,
  Users,
} from "lucide-react";
import DoughnutChart from "@/components/chart";
import axios from "axios";

const Dashboard = () => {
  const [tableCounts, setTableCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [userCount, setUserCount] = useState();

  const tables = [
    "cities",
    "hobbies",
    "events",
    "professions",
    "education",
    "streams",
  ];

  const fetchTableCounts = async () => {
    try {
      setLoading(true);

      const results = await Promise.all(
        tables.map((table) => fetchData(table))
      );

      const counts = tables.reduce((acc, table, index) => {
        acc[table] = results[index]?.[table]?.length || 0;
        return acc;
      }, {} as { [key: string]: number });

      setTableCounts(counts);
    } catch (error) {
      console.error("Error fetching table counts:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Fetch only once on mount
  useEffect(() => {
    fetchTableCounts();
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      const res = await fetch("https://node2-plum.vercel.app/api/admin/users");

      const data = await res.json();
      // console.log("Users: ", data.data.length);
      setUserCount(data.data.length)
    };

    getUsers();
  }, []);

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-sky-500",
  ];

  const iconMap: { [key: string]: React.ReactNode } = {
    cities: <Building2 strokeWidth={1} className="w-20 h-20 text-white" />,
    hobbies: <Heart strokeWidth={1} className="w-20 h-20 text-white" />,
    events: <Calendar strokeWidth={1} className="w-20 h-20 text-white" />,
    professions: <Briefcase strokeWidth={1} className="w-20 h-20 text-white" />,
    education: <Book strokeWidth={1} className="w-20 h-20 text-white" />,
    streams: <LayoutGrid strokeWidth={1} className="w-20 h-20 text-white" />,
  };

  useEffect(() => {
    axios
      .get("https://node2-plum.vercel.app/api/user/getStats")
      .then((res) => setStats(res.data));
  }, []);

  if (!stats)
    return (
      <div className="flex justify-center items-center h-screen">
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="color-ring-loading"
          colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
        />
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <button
          onClick={fetchTableCounts}
          className="px-2 py-2 bg-emerald-400 text-white rounded-full mb-4"
        >
          <RefreshCw />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="color-ring-loading"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tables.map((table, index) => (
            <DashboardCard
              key={table}
              title={table}
              count={tableCounts[table] || 0}
              color={colors[index % colors.length]}
              icon={iconMap[table]}
            />
          ))}

          <div
            className={`p-4 rounded-lg shadow-md transform-3d md:transform-flat text-white flex items-start justify-around bg-amber-500`}
          >
            <div className=""><Users strokeWidth={1} className="w-20 h-20 text-white" /></div>
            <div className="flex flex-col justify-end relative top-1">
              <h3 className="text-lg font-bold uppercase">Users</h3>
              <p className="text-2xl font-semibold">Entires: {userCount}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 border border-gray-300 shadow-md">
        <h2 className="text-xl font-bold text-center my-4">Statics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
          {/* Total Population */}
          {/* <DoughnutChart
            title="Total Population"
            labels={["Population"]}
            data={[stats.totalPopulation]}
            colors={["#3B82F6"]}
          /> */}

          {/* Percentage Distribution */}
          <DoughnutChart
            title="Gender Distribution"
            labels={["Male", "Female", "Child"]}
            data={[
              stats.totalPopulation,
              stats.count.male,
              stats.count.female,
              stats.count.child,
            ]}
          />

          {/* Children Distribution */}
          <DoughnutChart
            title="Children Distribution"
            labels={["2 Children", "> 2 Children"]}
            data={[
              parseFloat(
                stats.childrenDistribution.fromChildTable.familiesWith2Children
              ),
              parseFloat(
                stats.childrenDistribution.fromChildTable
                  .familiesWithMoreThan2Children
              ),
            ]}
          />

          {/* Donation Stats */}
          <DoughnutChart
            title="Donation Stats"
            labels={["Total Donations", "Remaining"]}
            data={[
              stats.donationStats.totalDonations,
              stats.totalPopulation - stats.donationStats.totalDonations,
            ]}
          />

          {/* Business Interest Stats */}
          <DoughnutChart
            title="Business Interest"
            labels={["Interested", "Not Interested"]}
            data={[
              stats.businessInterestStats.interestedCount,
              stats.totalPopulation -
                stats.businessInterestStats.interestedCount,
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
