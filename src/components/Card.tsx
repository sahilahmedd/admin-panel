/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface DashboardCardProps {
  title: string;
  count: number;
  color?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  count,
  color = "bg-blue-50",
  icon,
  trend,
}) => {
  const iconColorMap: { [key: string]: string } = {
    "bg-blue-50": "text-blue-600",
    "bg-green-50": "text-green-600",
    "bg-purple-50": "text-purple-600",
    "bg-amber-50": "text-amber-600",
    "bg-indigo-50": "text-indigo-600",
    "bg-pink-50": "text-pink-600",
    "bg-emerald-50": "text-emerald-600",
  };

  const iconColor = iconColorMap[color] || "text-blue-600";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{count}</h3>
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-xs font-medium ${
                  trend.isPositive
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-red-600 bg-red-50"
                } px-2 py-1 rounded-full flex items-center`}
              >
                {trend.isPositive ? "↑" : "↓"} {trend.value}%{" "}
                {trend.label || ""}
              </span>
            </div>
          )}
        </div>
        <div
          className={`h-12 w-12 ${color} rounded-lg flex items-center justify-center`}
        >
          <div className={`h-6 w-6 ${iconColor}`}>{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
