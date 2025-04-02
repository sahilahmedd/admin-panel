/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { fetchData, postData, updateData, deleteData } from "@/utils/api";
import { Pencil, CircleX } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { ColorRing } from "react-loader-spinner";

const ProfessionsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<"add" | "edit" | null>(null);
  const [selectedProf, setSelectedProf] = useState<any>(null);

  const defaultProf = {
    PROF_NAME: "",
    PROF_DESC: "",
    PROF_ACTIVE_YN: "",
    PROF_CREATED_BY: 1,
  };

  const [newProf, setNewProf] = useState(defaultProf);

  // Get Profession
  const getProfessions = async () => {
    setLoading(true);
    const result = await fetchData("professions");
    if (result && result.professions) {
      setData(result.professions);
    }
    setLoading(false);
  };

  useEffect(() => {
    getProfessions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProf((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = () => {
    setNewProf(defaultProf);
    setShowModal("add");
  };

  // Add new Profession
  const handleSubmit = async () => {
    const res = await postData("professions", newProf);
    if (res) {
      getProfessions();
      toast.success("Profession Added successfully");
      setShowModal(null);
    } else {
      toast.error("Failed to add Profession!!!");
    }
  };

  // Open Edit Modal
  const handleEdit = (prof: any) => {
    setSelectedProf(prof);
    setNewProf({
      PROF_NAME: prof.PROF_NAME,
      PROF_DESC: prof.PROF_DESC,
      PROF_ACTIVE_YN: prof.PROF_ACTIVE_YN,
      PROF_CREATED_BY: prof.PROF_CREATED_BY,
    });
    setShowModal("edit");
  };

  // Submit Edit hobby
  const handleUpdate = async () => {
    if (!selectedProf) return;
    const res = await updateData("professions", selectedProf.PROF_ID, newProf);
    if (res) {
      getProfessions();
      toast.success("Successfully updated!!");
      setShowModal(null);
    } else {
      toast.error("Error updating Profession!!!");
    }
  };

  // Delete a hobby
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this hobby?")) {
      const res = await deleteData("professions", id);
      if (res) {
        getProfessions();
        toast.success("Successfully deleted!!!");
      } else {
        toast.error("Error deleting Profession!!!");
      }
    }
  };

  const columns = [
    {
      name: "Profession",
      selector: (row) => `${row.PROF_ID} - ${row.PROF_NAME}`,
      sortable: true,
    },
    // { name: "City Code", selector: (row) => row.CITY_CODE, sortable: true },
    {
      name: "Discription",
      selector: (row) => `${row.PROF_DESC}`,
      sortable: true,
    },
    {
      name: "Active",
      selector: (row) => `${row.PROF_ACTIVE_YN}`,
      sortable: true,
    },
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
            onClick={() => handleDelete(row.PROF_ID)}
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
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Professions</h1>
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add New Profession
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
            title={showModal === "add" ? "Add New Profession" : "Edit Profession"}
            onClose={() => setShowModal(null)}
            onSubmit={showModal === "add" ? handleSubmit : handleUpdate}
            prof={newProf}
            onChange={handleChange}
          />
        )}
      </div>
    </>
  );
};


const Modal = ({ title, onClose, onSubmit, prof, onChange }: any) => (
  <div className="fixed inset-0 bg-gray-300/25 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4 md:mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium">Profession</label>
          <input
            type="text"
            name="PROF_NAME"
            value={prof.PROF_NAME}
            onChange={onChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <input
            type="text"
            name="PROF_DESC"
            value={prof.PROF_DESC}
            onChange={onChange}
            className="w-full p-2 border rounded"
          />
        </div>
        {/* <div>
          <label className="block text-sm font-medium">Active</label>
          <input
            type="checkbox"
            name="PROF_ACTIVE_YN"
            value={prof.PROF_ACTIVE_YN}
            onChange={onChange}
            className="w-full p-2 border rounded"
          />
        </div> */}
        <div>
        <label className="block text-sm font-medium">Active</label>
        <input
          type="checkbox"
          name="PROF_ACTIVE_YN"
          checked={prof.PROF_ACTIVE_YN === "Y"} // Check if value is "Y"
          onChange={(e) =>
            onChange({
              target: {
                name: "PROF_ACTIVE_YN",
                value: e.target.checked ? "Y" : "N", // "Y" when checked, "N" when unchecked
              },
            })
          }
          className="w-5 h-5 border rounded"
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

export default ProfessionsTable;
