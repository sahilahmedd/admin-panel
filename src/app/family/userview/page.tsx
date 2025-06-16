/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import TableHeader from "@/components/TableHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface City {
  CITY_ID: string;
  CITY_NAME: string;
  CITY_PIN_CODE?: string;
  CITY_DS_NAME?: string;
  CITY_ST_NAME?: string;
}

const UserView = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const router = useRouter();

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://node2-plum.vercel.app/api/admin/users"
      );
      const json = await response.json();
      setData(json.data || []);
    } catch ({ error }: any) {
      toast.error("Failed to fetch users", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user deletion
  const handleDeleteUser = async (prId: string | number) => {
    if (
      window.confirm(
        `Are you sure you want to delete user with PR_ID: ${prId}?`
      )
    ) {
      try {
        const response = await fetch(
          `https://node2-plum.vercel.app/api/admin/users/${prId}`,
          {
            method: "DELETE",
          }
        );
        const result = await response.json();

        if (result.success) {
          toast.success(result.message);
          getUsers(); // Refresh the user list
        } else {
          toast.error(result.message || "Failed to delete user.");
        }
      } catch (error: any) {
        toast.error("Error deleting user: " + error.message);
      }
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const filteredData = data.filter((item) =>
    item.PR_FULL_NAME?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleViewDetails = (row: any) => {
    setSelectedRow(row);
    setShowDetailsModal(true);
  };

  const shortColumns = [
    { name: "ID", selector: (row) => row.PR_ID, sortable: true },
    {
      name: "Full Name",
      selector: (row) => row.PR_FULL_NAME || "N/A",
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.PR_MOBILE_NO || "N/A",
      sortable: true,
    },
    {
      name: "Gender",
      selector: (row) => row.PR_GENDER || "N/A",
      sortable: true,
    },
    {
      name: "View",
      cell: (row) => (
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm cursor-pointer"
          onClick={() => handleViewDetails(row)}
        >
          View
        </button>
      ),
    },
    {
      name: "Actions", // This is the new column
      cell: (row: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/family/userview/${row.PR_ID}`)} // This line handles the dynamic routing
            className="text-blue-600 hover:text-blue-900"
            title="Edit User"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDeleteUser(row.PR_ID)}
            className="text-red-600 hover:text-red-900"
          >
            <Trash2 className="h-5 w-5" />{" "}
            {/* Using Trash2 icon from lucide-react */}
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "100px",
    },
  ];

  return (
    <div className="p-6">
      <Breadcrumbs />
      {/* <TableHeader
        title="Users"
        text="Users"
        placeholder="Search for Users..."
        searchText={searchText}
        setSearchText={setSearchText}
        handleAdd={() => {}}
      /> */}

      <TableHeader
        title="Users"
        text="Users"
        placeholder="Search for Users..."
        searchText={searchText}
        setSearchText={setSearchText}
        // MODIFIED: Changed handleAdd to redirect to /family/register
        handleAdd={() => router.push("/family/register")}
      />

      <DataTable
        columns={shortColumns}
        data={filteredData}
        progressPending={loading}
        pagination
        highlightOnHover
      />

      {showDetailsModal && selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">User Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="hover:text-red-500 py-1 px-2 rounded hover:bg-gray-200 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <table className="w-full border border-gray-300 rounded-md">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border-b">KEY</th>
                  <th className="px-4 py-2 border-b">VALUE</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(selectedRow).map(([key, value]) => (
                  <tr key={key} className="hover:bg-gray-50 align-top">
                    <td className="px-4 py-2 border-b font-medium capitalize">
                      {key}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {key.toLowerCase() === "children" &&
                      Array.isArray(value) ? (
                        <div className="space-y-2">
                          {value.length === 0 ? (
                            <div className="">N/A</div>
                          ) : (
                            value.map((child: any, index: number) => (
                              <div key={child.id || index} className="p-2">
                                <div>
                                  <strong>ID:</strong> {child.id}
                                </div>
                                <div>
                                  <strong>Name:</strong> {child.name}
                                </div>
                                <div>
                                  <strong>DOB:</strong>{" "}
                                  {new Date(child.dob).toLocaleDateString()}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      ) : key.toLowerCase() === "city" &&
                        typeof value === "object" &&
                        value !== null ? (
                        (() => {
                          const city = value as City;
                          return (
                            <div className="space-y-1">
                              <div>
                                <strong>ID:</strong> {city.CITY_ID}
                              </div>
                              <div>
                                <strong>Name:</strong> {city.CITY_NAME}
                              </div>
                              <div>
                                <strong>Pincode:</strong> {city.CITY_PIN_CODE}
                              </div>
                              <div>
                                <strong>District:</strong> {city.CITY_DS_NAME}
                              </div>
                              <div>
                                <strong>State:</strong> {city.CITY_ST_NAME}
                              </div>
                            </div>
                          );
                        })()
                      ) : typeof value === "object" && value !== null ? (
                        <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                          {Object.entries(value).map(([subKey, subVal]) => (
                            <div key={subKey}>
                              <strong>{subKey}:</strong>{" "}
                              {subVal?.toString() || "N/A"}
                            </div>
                          ))}
                        </div>
                      ) : (
                        value?.toString() || "N/A"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserView;
