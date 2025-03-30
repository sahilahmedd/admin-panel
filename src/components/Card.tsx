import React from "react";

interface DashboardCardProps {
  title: string;
  count: number;
  color?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, count, color }) => {
  return (
    <div
      className={`p-4 rounded-lg shadow-md text-white flex flex-col items-center justify-center ${
        color || "bg-blue-500"
      }`}
    >
      <h3 className="text-lg font-semibold capitalize">{title}</h3>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  );
};

export default DashboardCard;
