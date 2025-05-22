/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { fetchData, postData, updateData, deleteData } from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";
import { Pencil, CircleX } from "lucide-react";
import { ColorRing } from "react-loader-spinner";
import Modal from "@/components/AddEdit";
import Input from "@/components/FormInput";
import TableHeader from "@/components/TableHeader";

const CitiesTable = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<"add" | "edit" | null>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [searchText, setSearchText] = useState("");

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

  // handle search
  // const filteredData = data.filter(
  //   (item) =>
  //     item.CITY_NAME.toLowerCase().includes(searchText.toLowerCase()) ||
  //     item.CITY_ST_NAME.toLowerCase().includes(searchText.toLowerCase()) ||
  //     item.CITY_DS_NAME.toLowerCase().includes(searchText.toLowerCase())
  // );
  const filteredData = data.filter((item) =>
    (item.CITY_NAME ?? "").toLowerCase().includes(searchText.toLowerCase()) ||
    (item.CITY_ST_NAME ?? "").toLowerCase().includes(searchText.toLowerCase()) ||
    (item.CITY_DS_NAME ?? "").toLowerCase().includes(searchText.toLowerCase())
  );
  

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
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-1 rounded-full hover:bg-green-100 transition"
          >
            <Pencil size={16} className="text-green-600" />
          </button>
          <button
            onClick={() => handleDelete(row.CITY_ID)}
            className="p-1 rounded-full hover:bg-red-100 transition"
          >
            <CircleX size={16} className="text-red-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="p-6">
        <TableHeader
          title="Cities"
          text="City"
          placeholder="Search for cities, district, state..."
          searchText={searchText}
          setSearchText={setSearchText}
          handleAdd={handleAdd}
        />

        <DataTable
          columns={columns}
          data={filteredData}
          progressPending={loading}
          pagination
          progressComponent={
            <div className="flex justify-center items-center h-32 w-full">
              <ColorRing
                visible={true}
                height="80"
                width="80"
                ariaLabel="color-ring-loading"
                colors={["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"]}
              />
            </div>
          }
        />

        {showModal && (
          <Modal
            title={showModal === "add" ? "Add City" : "Edit City"}
            onClose={() => setShowModal(null)}
            onSubmit={showModal === "add" ? handleSubmit : handleUpdate}
            >
            <Input
              type="text"
              label="City Name"
              name="CITY_NAME"
              value={newCity.CITY_NAME}
              onChange={handleChange}
            />
            <Input
              type="number"
              label="City Code"
              name="CITY_CODE"
              value={newCity.CITY_CODE}
              onChange={handleChange}
            />
            <Input
              type="number"
              label="Pincode"
              name="CITY_PIN_CODE"
              value={newCity.CITY_PIN_CODE}
              onChange={handleChange}
            />
            <Input
              type="text"
              label="District Name"
              name="CITY_DS_NAME"
              value={newCity.CITY_DS_NAME}
              onChange={handleChange}
            />
            <Input
              type="number"
              label="District Code"
              name="CITY_DS_CODE"
              value={newCity.CITY_DS_CODE}
              onChange={handleChange}
            />
            <Input
              type="text"
              label="State Name"
              name="CITY_ST_NAME"
              value={newCity.CITY_ST_NAME}
              onChange={handleChange}
            />
            <Input
              type="number"
              label="State Code"
              name="CITY_ST_CODE"
              value={newCity.CITY_ST_CODE}
              onChange={handleChange}
            />
          </Modal>
        )}
      </div>
    </>
  );
};


export default CitiesTable;
