/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
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
  Bell,
} from "lucide-react";
import axios from "axios";
import KpiDashboard from "@/components/KpiDashboard";

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
      setUserCount(data.data.length);
    };

    getUsers();
  }, []);

  const iconMap: { [key: string]: React.ReactNode } = {
    cities: <Building2 strokeWidth={1.5} className="w-6 h-6 text-blue-600" />,
    hobbies: <Heart strokeWidth={1.5} className="w-6 h-6 text-pink-600" />,
    events: <Calendar strokeWidth={1.5} className="w-6 h-6 text-purple-600" />,
    professions: (
      <Briefcase strokeWidth={1.5} className="w-6 h-6 text-emerald-600" />
    ),
    education: <Book strokeWidth={1.5} className="w-6 h-6 text-amber-600" />,
    streams: (
      <LayoutGrid strokeWidth={1.5} className="w-6 h-6 text-indigo-600" />
    ),
  };

  useEffect(() => {
    axios
      .get("https://node2-plum.vercel.app/api/user/getStats")
      .then((res) => setStats(res.data));
  }, []);

  if (!stats)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="color-ring-loading"
          colors={["#4f46e5", "#3b82f6", "#0ea5e9", "#06b6d4", "#14b8a6"]}
        />
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1">Welcome to your admin dashboard</p>
        </div>
        <button
          onClick={fetchTableCounts}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw size={16} />
          <span>Refresh Data</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="color-ring-loading"
            colors={["#4f46e5", "#3b82f6", "#0ea5e9", "#06b6d4", "#14b8a6"]}
          />
        </div>
      ) : (
        <>
          {/* Data Tables */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Data Tables Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {tables.map((table) => (
                <div
                  key={table}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                >
                  <div className="flex items-center mb-2">
                    <div className="p-2 rounded-lg bg-white mr-3">
                      {iconMap[table]}
                    </div>
                    <h3 className="text-sm font-medium text-gray-700 capitalize">
                      {table}
                    </h3>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-2xl font-bold text-gray-800">
                      {tableCounts[table] || 0}
                    </p>
                    <span className="text-xs font-medium text-gray-500">
                      entries
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KPI Dashboard */}
          <KpiDashboard data={stats} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
