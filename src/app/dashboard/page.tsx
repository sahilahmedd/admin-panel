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
} from "lucide-react";

const Dashboard = () => {
  const [tableCounts, setTableCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

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
        </div>
      )}
    </div>
  );
};

export default Dashboard;
