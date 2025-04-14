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
      className={`p-4 rounded-lg shadow-md transform-3d md:transform-flat text-white flex items-start justify-around ${
        color || "bg-blue-500"
      }`}
    >
      <div className="">
        {icon}
      </div>
      <div className="flex flex-col justify-end relative top-1">
        <h3 className="text-lg font-bold uppercase">{title}</h3>
        <p className="text-2xl font-semibold">Entires: {count}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
