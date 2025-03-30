"use client";

import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { fetchData } from "@/utils/api";

const ProfessionsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfessions = async () => {
      const result = await fetchData("profession");
      if (result && result.professions) {
        setData(result.professions);
      }
      setLoading(false);
    };

    getProfessions();
  }, []);

  // Define columns for DataTable
//   const columns = data.length
//     ? Object.keys(data[0]).map((key) => ({
//         name: key.replace(/_/g, " ").toUpperCase(),
//         selector: (row) => row[key] ?? "N/A",
//         sortable: true,
//       }))
//     : [];

const columns = [
    { name: "Profession", selector: (row) => `${row.PROF_ID} - ${row.PROF_NAME}`, sortable: true },
    // { name: "City Code", selector: (row) => row.CITY_CODE, sortable: true },
    { name: "Discription", selector: (row) => `${row.PROF_DESC}`, sortable: true },
    { name: "Active", selector: (row) => `${row.PROF_ACTIVE_YN}`, sortable: true },
  ];


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Professions</h1>
      <DataTable columns={columns} data={data} progressPending={loading} pagination />
    </div>
  );
};

export default ProfessionsTable;
