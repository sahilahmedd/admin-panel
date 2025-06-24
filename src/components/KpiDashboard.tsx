"use client";

import React from "react";
import { DoughnutChart, BarChart, StatCard } from "./chart";
import {
  Users,
  Home,
  DollarSign,
  UserCheck,
  Briefcase,
  User,
  UserRound,
  Baby,
} from "lucide-react";

interface KpiData {
  totalPopulation: number;
  familyCount: number;
  count: {
    male: number;
    female: number;
    child: number;
  };
  percentageDistribution: {
    male: string;
    female: string;
    child: string;
  };
  childrenDistribution: {
    fromChildTable: {
      familiesWith2Children: string;
      familiesWithMoreThan2Children: string;
    };
    fromPeopleRegistry: {
      familiesWith2Children: string;
      familiesWithMoreThan2Children: string;
    };
  };
  donationStats: {
    totalDonations: number;
    totalDonationAmount: number;
    uniqueDonors: number;
    donationPercentageOfPopulation: string;
  };
  businessInterestStats: {
    interestedCount: number;
    percentageOfPopulation: string;
  };
}

interface KpiDashboardProps {
  data: KpiData;
}

export default function KpiDashboard({ data }: KpiDashboardProps) {
  // Parse percentage strings to numbers for chart data
  const parsePercentage = (percentStr: string) => {
    return parseFloat(percentStr.replace("%", "")) || 0;
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Total Population"
          value={data.totalPopulation}
          subValue={data.familyCount}
          subLabel="families"
          color="bg-blue-50 text-blue-600"
          icon={<Users size={16} />}
        />

        <StatCard
          title="Total Donations"
          value={data.donationStats.totalDonations}
          subValue={`₹${data.donationStats.totalDonationAmount.toLocaleString()}`}
          color="bg-green-50 text-green-600"
          icon={<DollarSign size={16} />}
        />

        <StatCard
          title="Unique Donors"
          value={data.donationStats.uniqueDonors}
          subValue={data.donationStats.donationPercentageOfPopulation}
          subLabel="of population"
          color="bg-purple-50 text-purple-600"
          icon={<UserCheck size={16} />}
        />

        <StatCard
          title="Business Interest"
          value={data.businessInterestStats.interestedCount}
          subValue={data.businessInterestStats.percentageOfPopulation}
          subLabel="of population"
          color="bg-amber-50 text-amber-600"
          icon={<Briefcase size={16} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Population Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Population Distribution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gender Distribution Chart */}
            <div className="bg-gray-50 rounded-lg p-3">
              <DoughnutChart
                title="Gender & Age Distribution"
                labels={["Male", "Female", "Children"]}
                data={[data.count.male, data.count.female, data.count.child]}
                colors={["#3b82f6", "#ec4899", "#8b5cf6"]}
              />
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="text-center p-1 bg-white rounded-lg">
                  <div className="flex items-center justify-center">
                    <User size={14} className="text-blue-600 mr-1" />
                    <p className="text-xs text-gray-500">Male</p>
                  </div>
                  <p className="text-sm font-semibold text-blue-600">
                    {data.percentageDistribution.male}
                  </p>
                </div>
                <div className="text-center p-1 bg-white rounded-lg">
                  <div className="flex items-center justify-center">
                    <UserRound size={14} className="text-pink-600 mr-1" />
                    <p className="text-xs text-gray-500">Female</p>
                  </div>
                  <p className="text-sm font-semibold text-pink-600">
                    {data.percentageDistribution.female}
                  </p>
                </div>
                <div className="text-center p-1 bg-white rounded-lg">
                  <div className="flex items-center justify-center">
                    <Baby size={14} className="text-purple-600 mr-1" />
                    <p className="text-xs text-gray-500">Children</p>
                  </div>
                  <p className="text-sm font-semibold text-purple-600">
                    {data.percentageDistribution.child}
                  </p>
                </div>
              </div>
            </div>

            {/* Children Distribution Chart */}
            <div className="bg-gray-50 rounded-lg p-3">
              <DoughnutChart
                title="Children Distribution"
                labels={["2 Children", ">2 Children"]}
                data={[
                  parsePercentage(
                    data.childrenDistribution.fromChildTable
                      .familiesWith2Children
                  ),
                  parsePercentage(
                    data.childrenDistribution.fromChildTable
                      .familiesWithMoreThan2Children
                  ),
                ]}
                colors={["#10b981", "#f59e0b"]}
              />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="text-center p-1 bg-white rounded-lg">
                  <p className="text-xs text-gray-500">2 Children</p>
                  <p className="text-sm font-semibold text-emerald-600">
                    {
                      data.childrenDistribution.fromChildTable
                        .familiesWith2Children
                    }
                  </p>
                </div>
                <div className="text-center p-1 bg-white rounded-lg">
                  <p className="text-xs text-gray-500">&gt;2 Children</p>
                  <p className="text-sm font-semibold text-amber-600">
                    {
                      data.childrenDistribution.fromChildTable
                        .familiesWithMoreThan2Children
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donation & Business Interest */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Donation & Business Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Donation Stats */}
            <div className="bg-gray-50 rounded-lg p-3">
              <DoughnutChart
                title="Donation Statistics"
                labels={["Donors", "Non-Donors"]}
                data={[
                  data.donationStats.uniqueDonors,
                  data.totalPopulation - data.donationStats.uniqueDonors,
                ]}
                colors={["#22c55e", "#e5e7eb"]}
              />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-white rounded-lg">
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="text-sm font-semibold text-green-600">
                    ₹{data.donationStats.totalDonationAmount.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-2 bg-white rounded-lg">
                  <p className="text-xs text-gray-500">Donor %</p>
                  <p className="text-sm font-semibold text-green-600">
                    {data.donationStats.donationPercentageOfPopulation}
                  </p>
                </div>
              </div>
            </div>

            {/* Business Interest Stats */}
            <div className="bg-gray-50 rounded-lg p-3">
              <DoughnutChart
                title="Business Interest"
                labels={["Interested", "Not Interested"]}
                data={[
                  data.businessInterestStats.interestedCount,
                  data.totalPopulation -
                    data.businessInterestStats.interestedCount,
                ]}
                colors={["#eab308", "#e5e7eb"]}
              />
              <div className="mt-3 p-2 bg-white rounded-lg text-center">
                <p className="text-xs text-gray-500">Business Interest</p>
                <p className="text-sm font-semibold text-amber-600">
                  {data.businessInterestStats.percentageOfPopulation} of
                  population
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h2 className="text-base font-semibold text-gray-800 mb-4">
          Comparative Analysis
        </h2>
        <div className="h-64">
          <BarChart
            title="Population Metrics"
            labels={[
              "Total Population",
              "Families",
              "Donors",
              "Business Interest",
            ]}
            data={[
              data.totalPopulation,
              data.familyCount,
              data.donationStats.uniqueDonors,
              data.businessInterestStats.interestedCount,
            ]}
            colors={["#3b82f6", "#ec4899", "#22c55e", "#eab308"]}
            yAxisLabel="Count"
          />
        </div>
      </div>
    </div>
  );
}
