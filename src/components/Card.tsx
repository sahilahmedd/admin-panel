/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface DashboardCardProps {
  title: string;
  count: number;
  color?: string;
  icon: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, count, color, icon }) => {
  return (
    <div
      className={`p-4 rounded-lg shadow-md text-white flex flex-col items-center justify-center ${
        color || "bg-blue-500"
      }`}
    >
      <div className="flex gap-2">
        <div className="opacity-80">{icon}</div>
        <h3 className="text-lg font-semibold capitalize">{title}</h3>
      </div>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  );
};

export default DashboardCard;
