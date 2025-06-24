// components/Charts.tsx
"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  ChartData,
  ChartOptions,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import React from "react";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement
);

type DoughnutChartProps = {
  title: string;
  labels: string[];
  data: number[];
  colors?: string[];
  showTotal?: boolean;
};

export function DoughnutChart({
  title,
  labels,
  data,
  colors = ["#3b82f6", "#ec4899", "#8b5cf6", "#10b981", "#f59e0b"],
  showTotal = true,
}: DoughnutChartProps) {
  const chartData: ChartData<"doughnut"> = {
    labels,
    datasets: [
      {
        label: title,
        data,
        backgroundColor: colors,
        borderWidth: 1,
        borderColor: "#fff",
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 10,
          boxWidth: 8,
          boxHeight: 8,
          font: {
            size: 10,
            family: "'Inter', sans-serif",
          },
          color: "#6b7280",
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#111827",
        bodyColor: "#4b5563",
        bodyFont: {
          size: 11,
          family: "'Inter', sans-serif",
        },
        titleFont: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "bold",
        },
        padding: 8,
        boxPadding: 4,
        usePointStyle: true,
        borderColor: "rgba(229, 231, 235, 1)",
        borderWidth: 1,
        displayColors: true,
        caretSize: 5,
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 800,
    },
  };

  const total = data.reduce((sum, value) => sum + value, 0);
  const chartContainerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="w-full h-full">
      <h3 className="text-xs font-semibold text-gray-700 mb-2">{title}</h3>
      <div
        className="relative"
        style={{ height: "180px" }}
        ref={chartContainerRef}
      >
        <div className="h-full">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
        {showTotal && data.length > 0 && (
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -65%)",
              pointerEvents: "none",
              textAlign: "center",
            }}
          >
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-base font-bold text-gray-800">{total}</p>
          </div>
        )}
      </div>
    </div>
  );
}

type BarChartProps = {
  title: string;
  labels: string[];
  data: number[];
  colors?: string[];
  yAxisLabel?: string;
};

export function BarChart({
  title,
  labels,
  data,
  colors = ["#3b82f6"],
  yAxisLabel = "",
}: BarChartProps) {
  const chartData: ChartData<"bar"> = {
    labels,
    datasets: [
      {
        label: title,
        data,
        backgroundColor: colors,
        borderWidth: 0,
        borderRadius: 4,
        maxBarThickness: 40,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
          font: {
            size: 10,
          },
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 10,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#111827",
        bodyColor: "#4b5563",
        bodyFont: {
          size: 11,
          family: "'Inter', sans-serif",
        },
        titleFont: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "bold",
        },
        padding: 8,
        boxPadding: 4,
        usePointStyle: true,
        borderColor: "rgba(229, 231, 235, 1)",
        borderWidth: 1,
        displayColors: true,
      },
    },
  };

  return (
    <div className="w-full h-full">
      <h3 className="text-xs font-semibold text-gray-700 mb-2">{title}</h3>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: string | number;
  subValue?: string | number;
  subLabel?: string;
  color?: string;
  icon?: React.ReactNode;
};

export function StatCard({
  title,
  value,
  subValue,
  subLabel,
  color = "bg-blue-50 text-blue-600",
  icon,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-medium text-gray-500">{title}</h3>
        {icon && (
          <div className={`p-1.5 rounded-full ${color.split(" ")[0]}`}>
            {icon}
          </div>
        )}
      </div>
      <p className="text-xl font-bold text-gray-800">{value}</p>
      {subValue && (
        <div className="mt-1.5 flex items-center">
          <span
            className={`text-xs font-medium ${color} px-1.5 py-0.5 rounded-full`}
          >
            {subValue}{" "}
            {subLabel && <span className="opacity-75">{subLabel}</span>}
          </span>
        </div>
      )}
    </div>
  );
}

// For backward compatibility
export default DoughnutChart;
