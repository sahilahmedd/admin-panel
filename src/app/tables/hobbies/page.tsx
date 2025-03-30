"use client";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { fetchData } from "@/utils/api";
import Image from "next/image";

const HobbiesTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const response = await fetchData("hobbies");
      if (response && response.Hobbies) {
        setData(response.Hobbies);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const columns = [
    { name: "Hobby Name", selector: (row) => `${row.HOBBY_ID} - ${row.HOBBY_NAME}`, sortable: true },
    { name: "Image", selector: (row) => row.HOBBY_IMAGE_URL, cell: (row) => <Image height={10} src={row.HOBBY_IMAGE_URL} alt={row.HOBBY_NAME} width="50" /> },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hobbies</h1>
      <DataTable columns={columns} data={data} progressPending={loading} pagination />
    </div>
  );
};

export default HobbiesTable;
