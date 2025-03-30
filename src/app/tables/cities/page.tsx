"use client";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { fetchData } from "@/utils/api";

const CitiesTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const response = await fetchData("city");
      if (response && response.cities) {
        setData(response.cities);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  // Define table columns
  const columns = [
    { name: "City Name", selector: (row) => `${row.CITY_ID} - ${row.CITY_NAME}`, sortable: true },
    // { name: "City Code", selector: (row) => row.CITY_CODE, sortable: true },
    { name: "District", selector: (row) => `${row.CITY_DS_CODE} - ${row.CITY_DS_NAME}`, sortable: true },
    { name: "State", selector: (row) => `${row.CITY_ST_CODE} - ${row.CITY_ST_NAME}`, sortable: true },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cities</h1>
      <DataTable columns={columns} data={data} progressPending={loading} pagination />
    </div>
  );
};

export default CitiesTable;
