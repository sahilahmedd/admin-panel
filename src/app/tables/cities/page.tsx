/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { fetchData, postData, updateData, deleteData } from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";
import {Pencil,CircleX} from 'lucide-react'
import { ColorRing } from "react-loader-spinner";

const CitiesTable = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<"add" | "edit" | null>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);

  const defaultCity = {
    CITY_PIN_CODE: "",
    CITY_CODE: 0,
    CITY_NAME: "",
    CITY_DS_CODE: "",
    CITY_DS_NAME: "",
    CITY_ST_CODE: "",
    CITY_ST_NAME: "",
  };

  const [newCity, setNewCity] = useState(defaultCity);

  // Fetch cities data
  const loadData = async () => {
    setLoading(true);
    const response = await fetchData("cities");
    if (response?.cities) {
      setData(response.cities);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCity((prev) => ({
      ...prev,
      [name]: name === "CITY_CODE" ? Number(value) || 0 : value, // Ensure CITY_CODE is a number
    }));
  };

  // Open Add Modal
  const handleAdd = () => {
    setNewCity(defaultCity);
    setShowModal("add");
  };

  // Submit New City
  const handleSubmit = async () => {
    const response = await postData("cities", newCity);
    if (response) {
      loadData();
      toast.success("City Added successfully!");
      setShowModal(null);
    } else {
      toast.error("Failed to add City!!!");
    }
  };

  // Open Edit Modal
  const handleEdit = (city: any) => {
    setSelectedCity(city);
    setNewCity({
      CITY_PIN_CODE: city.CITY_PIN_CODE,
      CITY_CODE: city.CITY_CODE,
      CITY_NAME: city.CITY_NAME,
      CITY_DS_CODE: city.CITY_DS_CODE,
      CITY_DS_NAME: city.CITY_DS_NAME,
      CITY_ST_CODE: city.CITY_ST_CODE,
      CITY_ST_NAME: city.CITY_ST_NAME,
    });
    setShowModal("edit");
  };

  // Submit Edit City
  const handleUpdate = async () => {
    if (!selectedCity) return;
    const response = await updateData("cities", selectedCity.CITY_ID, newCity);
    if (response) {
      loadData();
      toast.success("Successfully updated!");
      setShowModal(null);
    } else {
      toast.error("Error Updating city!!!");
    }
  };

  // Delete a city
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this city?")) {
      const response = await deleteData("cities", id);
      if (response) {
        loadData();
        toast.success("Successfully deleted!");
      } else {
        toast.error("Error deleting city!!!");
      }
    }
  };

  // Table columns
  const columns = [
    {
      name: "City Name",
      selector: (row) => `${row.CITY_ID} - ${row.CITY_NAME}`,
      sortable: true,
    },
    {
      name: "District",
      selector: (row) => `${row.CITY_DS_CODE} - ${row.CITY_DS_NAME}`,
      sortable: true,
    },
    {
      name: "State",
      selector: (row) => `${row.CITY_ST_CODE} - ${row.CITY_ST_NAME}`,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleEdit(row)}
            className="bg-transparent text-white cursor-pointer px-2 py-1 rounded-full hover:bg-green-200"
          >
           <Pencil size={15} className="text-green-500"/>
          </button>
          <button
            onClick={() => handleDelete(row.HOBBY_ID)}
            className="bg-transparent text-white cursor-pointer px-2 py-1 rounded-full hover:bg-red-200"
          >
            <CircleX size={15} className="text-red-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Cities</h1>
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add New City
          </button>
        </div>

        <DataTable
          columns={columns}
          data={data}
          progressPending={loading}
          progressComponent={
              <div className="flex justify-center items-center h-32">
                  <ColorRing
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="color-ring-loading"
                    colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
                    />
              </div>
              }
          pagination
        />

        {/* Add/Edit City Modal */}
        {showModal && (
          <Modal
            title={showModal === "add" ? "Add New City" : "Edit City"}
            onClose={() => setShowModal(null)}
            onSubmit={showModal === "add" ? handleSubmit : handleUpdate}
            city={newCity}
            onChange={handleChange}
          />
        )}
      </div>
    </>
  );
};

// 🟢 Improved Responsive Modal Component
const Modal = ({ title, onClose, onSubmit, city, onChange }: any) => (
  <div className="fixed inset-0 bg-gray-300/25 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4 md:mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">City Name</label>
          <input
            type="text"
            name="CITY_NAME"
            value={city.CITY_NAME}
            onChange={onChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">City Code</label>
          <input
            type="number"
            name="CITY_CODE"
            value={city.CITY_CODE}
            onChange={onChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Pincode</label>
          <input
            type="text"
            name="CITY_PIN_CODE"
            value={city.CITY_PIN_CODE}
            onChange={onChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">District Code</label>
          <input
            type="text"
            name="CITY_DS_CODE"
            value={city.CITY_DS_CODE}
            onChange={onChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">District Name</label>
          <input
            type="text"
            name="CITY_DS_NAME"
            value={city.CITY_DS_NAME}
            onChange={onChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">State Name</label>
          <input
            type="text"
            name="CITY_ST_NAME"
            value={city.CITY_ST_NAME}
            onChange={onChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">State Code</label>
          <input
            type="text"
            name="CITY_ST_CODE"
            value={city.CITY_ST_CODE}
            onChange={onChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4 gap-2">
        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  </div>
);

export default CitiesTable;
