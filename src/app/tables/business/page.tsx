/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { fetchData } from "@/utils/api";
import { Pencil, CircleX } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { ColorRing } from "react-loader-spinner";
import TableHeader from "@/components/TableHeader";

const BusinessTable = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<"add" | "edit" | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [searchText, setSearchText] = useState("");

  const defaultBusiness: {
    BUSS_STREM: string;
    BUSS_TYPE: string;
    BUSS_CREATED_BY?: number;
    BUSS_UPDATED_BY?: number;
  } = {
    BUSS_STREM: "",
    BUSS_TYPE: "",
    BUSS_CREATED_BY: 1,
  };

  const [newBusiness, setNewBusiness] = useState(defaultBusiness);

  // Get Business
  const getBusiness = async () => {
    setLoading(true);
    const result = await fetchData("business");
    if (result && result.Business) {
      setData(result.Business);
    }
    setLoading(false);
  };

  useEffect(() => {
    getBusiness();
  }, []);

  // Handle Search
  const filteredData = data.filter(
    (item) =>
      item.BUSS_STREM.toLowerCase().includes(searchText.toLowerCase()) ||
      item.BUSS_TYPE.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBusiness((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = () => {
    setNewBusiness(defaultBusiness);
    setSelectedBusiness(null);
  };

  // Add new Business
  const handleSubmit = async () => {
    // const res = await postData("business", newBusiness);

    const res = await fetch(
      "https://node2-plum.vercel.app/api/admin/business",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(newBusiness),
      }
    );

    if (res) {
      getBusiness();
      toast.success("Business Added successfully");
      setShowModal(null);
    } else {
      toast.error("Failed to add Business!!!");
    }
  };

  // Open Edit Modal
  const handleEdit = (bussiness: any) => {
    setSelectedBusiness(bussiness);
    setNewBusiness({
      BUSS_STREM: bussiness.BUSS_STREM,
      BUSS_TYPE: bussiness.BUSS_TYPE,
      BUSS_UPDATED_BY: 1,
    });
    setShowModal("edit");
  };

  // Submit Edit hobby
  const handleUpdate = async () => {
    if (!selectedBusiness) return;

    const res = await fetch(
      `https://node2-plum.vercel.app/api/admin/business/${selectedBusiness.BUSS_ID}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(newBusiness),
      }
    );

    if (res) {
      getBusiness();
      toast.success("Successfully updated!!");
      setShowModal(null);
    } else {
      toast.error("Error updating Business!!!");
    }
  };

  // Delete a business
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this business?")) {
      //   const res = await deleteData("business", id);

      const res = await fetch(
        `https://node2-plum.vercel.app/api/admin/business/${id}`,
        {
          method: "DELETE",
        }
      );
      if (res) {
        getBusiness();
        toast.success("Successfully deleted!!!");
      } else {
        toast.error("Error deleting Business!!!");
      }
    }
  };

  const columns = [
    {
      name: "Business",
      selector: (row) => `${row.BUSS_ID} - ${row.BUSS_STREM}`,
      sortable: true,
    },
    // { name: "City Code", selector: (row) => row.CITY_CODE, sortable: true },
    {
      name: "Discription",
      selector: (row) => `${row.BUSS_TYPE}`,
      sortable: true,
    },
    // {
    //   name: "Active",
    //   selector: (row) => `${row.PROF_ACTIVE_YN}`,
    //   sortable: true,
    // },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleEdit(row)}
            className="bg-transparent text-white px-2 cursor-pointer py-1 rounded-full hover:bg-green-200"
          >
            <Pencil size={15} className="text-green-500" />
          </button>
          <button
            onClick={() => handleDelete(row.BUSS_ID)}
            className="bg-transparent text-white px-2 cursor-pointer py-1 rounded-full hover:bg-red-200"
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
        <TableHeader
          title="Business"
          text="Business"
          placeholder="Search for Business..."
          handleAdd={handleAdd}
          searchText={searchText}
          setSearchText={setSearchText}
        />

        <div className="flex flex-col lg:flex-row gap-6 mt-4">
          {/* Left - Table */}
          <div className="w-full lg:w-2/3">
            <DataTable
              columns={columns}
              data={filteredData}
              progressPending={loading}
              pagination
              progressComponent={
                <div className="flex justify-center items-center h-32">
                  <ColorRing
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="color-ring-loading"
                    colors={[
                      "#e15b64",
                      "#f47e60",
                      "#f8b26a",
                      "#abbd81",
                      "#849b87",
                    ]}
                  />
                </div>
              }
            />
          </div>

          {/* Right - Form Panel */}
          <div className="w-full lg:w-1/3 bg-white border border-gray-200 h-1/2 rounded-lg shadow p-6 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {selectedBusiness ? "Edit Business" : "Add New Business"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Business</label>
                <input
                  type="text"
                  name="BUSS_STREM"
                  value={newBusiness.BUSS_STREM}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Type</label>
                <input
                  type="text"
                  name="BUSS_TYPE"
                  value={newBusiness.BUSS_TYPE}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => {
                    setSelectedBusiness(null);
                    setNewBusiness(defaultBusiness);
                  }}
                  className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
                >
                  Reset
                </button>
                <button
                  onClick={selectedBusiness ? handleUpdate : handleSubmit}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  {selectedBusiness ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default BusinessTable;
