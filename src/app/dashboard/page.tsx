"use client";

import React, { useEffect, useState } from "react";
import DashboardCard from "@/components/Card";
import { fetchData } from "@/utils/api";

const Dashboard = () => {
  const [tableCounts, setTableCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  const tables = ["cities", "hobbies", "events", "professions"]; // List of tables

  const fetchTableCounts = async () => {
    try {
      // setLoading(true);

      // Fetch all tables in parallel
      const results = await Promise.all(tables.map((table) => fetchData(table)));

      // Process results
      const counts = tables.reduce((acc, table, index) => {
        acc[table] = results[index]?.[table]?.length || 0; // Direct access since names are consistent
        return acc;
      }, {} as { [key: string]: number });

      setTableCounts(counts);
    } catch (error) {
      console.error("Error fetching table counts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableCounts();

    const fetchInterval = setInterval(()=>{
      fetchTableCounts();
    }, 1000) 

    return () => clearInterval(fetchInterval);
  }, []);


  const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500"];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      {loading ? (
        <p className="text-gray-500">Loading data...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tables.map((table, index) => (
            <DashboardCard
              key={table}
              title={table}
              count={tableCounts[table] || 0}
              color={colors[index % colors.length]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
