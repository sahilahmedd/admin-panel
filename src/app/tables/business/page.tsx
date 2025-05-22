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
    setShowModal("add");
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

    const res = await fetch(`https://node2-plum.vercel.app/api/admin/business/${id}`, {
        method: "DELETE"
    })
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
        <DataTable
          columns={columns}
          data={filteredData}
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
            title={showModal === "add" ? "Add New Business" : "Edit Business"}
            onClose={() => setShowModal(null)}
            onSubmit={showModal === "add" ? handleSubmit : handleUpdate}
            business={newBusiness}
            onChange={handleChange}
          />
        )}
      </div>
    </>
  );
};

const Modal = ({ title, onClose, onSubmit, business, onChange }: any) => (
  <div className="fixed inset-0 bg-gray-300/25 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4 md:mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium">Business</label>
          <input
            type="text"
            name="BUSS_STREM"
            value={business.BUSS_STREM}
            onChange={onChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <input
            type="text"
            name="BUSS_TYPE"
            value={business.BUSS_TYPE}
            onChange={onChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex w-full justify-end mt-4 gap-2">
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
  </div>
);

export default BusinessTable;
