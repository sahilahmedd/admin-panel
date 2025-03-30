"use client";

import React, { useEffect, useState } from "react";
import DashboardCard from "@/components/Card";
import { fetchData } from "@/utils/api";

const Dashboard = () => {
  const [tableCounts, setTableCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  const tables = ["city", "Hobbies", "events", "profession"]; // Add other API tables here

  // console.log("1st count: ", tableCounts);
  
  const tableMappings: Record<string, string> = {
    city: "cities",
    Hobbies: "Hobbies", // Different casing
    events: "events",
    profession: "professions",
  };
  

  useEffect(() => {
    const fetchTableCounts = async () => {
      const counts: { [key: string]: number } = {}; // Store table counts
    
      for (const table of Object.keys(tableMappings)) {
        const result = await fetchData(table); // Fetch data from API
    
        if (result) {
          const objectName = tableMappings[table]; // Get the correct object name
          counts[table] = result[objectName]?.length || 0; // Use correct object name
        }
      }
    
      setTableCounts(counts);
      setLoading(false);
    };

    fetchTableCounts();
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
