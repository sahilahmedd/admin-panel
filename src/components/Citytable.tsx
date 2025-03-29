"use client";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

const CityTable = () => {
  const [cities, setCities] = useState([]);

  const fetchCities = async () => {
    try {
      const res = await fetch("https://node2-plum.vercel.app/api/user/city");
      const result = await res.json();

      console.log("Data:", result.cities);
      setCities(result.cities);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  interface City {
    CITY_ID: string;
    CITY_NAME: string;
    CITY_DS_NAME: string;
    CITY_DS_CODE: string;
    CITY_ST_NAME: string;
    CITY_ST_CODE: string;
    CITY_PIN_CODE: string;
  }
  
  const columns = [
    {
      name: "City Name",
      selector: (row: City) => `${row.CITY_ID} - ${row.CITY_NAME}`,
      sortable: true,
    },
    {
      name: "District",
      selector: (row: City) => `${row.CITY_DS_CODE} - ${row.CITY_DS_NAME}`,
      sortable: true,
    },
    {
      name: "State",
      selector: (row: City) => `${row.CITY_ST_CODE} - ${row.CITY_ST_NAME}`,
      sortable: true,
    },
    {
      name: "PIN Code",
      selector: (row: City) => row.CITY_PIN_CODE,
      sortable: true,
    },
  ];
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">City</h2>
      <DataTable
        columns={columns}
        data={cities}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
};

export default CityTable;
