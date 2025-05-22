// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useEffect, useState } from "react";
// import DataTable from "react-data-table-component";
// // import { fetchData, postData, updateData, deleteData } from "@/utils/api";
// import toast from "react-hot-toast";
// // import { Pencil, CircleX } from "lucide-react";
// // import Image from "next/image";
// import TableHeader from "@/components/TableHeader";
// import Modal from "@/components/AddEdit";
// import Input from "@/components/FormInput";

// const HobbiesTable = () => {
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState<"add" | "edit" | null>(null);
//   // const [selectedHobby, setSelectedHobby] = useState<any>(null);
//   const [searchText, setSearchText] = useState("");

//   const defaultHobby = {
//     HOBBY_NAME: "",
//     HOBBY_IMAGE_URL: "",
//     HOBBY_CREATED_BY: 1
//   };

//   const [newHobby, setNewHobby] = useState(defaultHobby);

//   const getUsers = async () => {
//     setLoading(true);
//     const response = await fetch("https://node2-plum.vercel.app/api/admin/users")
//     const data = await response.json()

//     console.log("Data: ", data.data);
//     setData(data.data)
//     setLoading(false);
//   };

//   useEffect(() => {
//     getUsers();
//   }, []);

//   // Handle search
//   const filteredData = data.filter((item) =>
//     item.PR_FULL_NAME.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, files } = e.target;

//     if (type === "file" && files?.[0]) {
//       const formData = new FormData();
//       formData.append("image", files[0]);
//       console.log("Uploading file to /api/uploadImage:", files[0]);
//       try {
//         const response = await fetch("/api/uploadImage", {
//           method: "POST",
//           body: formData,
//         });

//         const result = await response.json();

//         if (result.status) {
//           const imageUrl = `https://rangrezsamaj.kunxite.com/${result.url}`;
//           console.log("Image: ", imageUrl);

//           setNewHobby((prev) => ({
//             ...prev,
//             [name]: imageUrl,
//           }));
//           console.log("Hobby: ", name);

//         } else {
//           toast.error("Image upload failed");
//         }
//       } catch (error) {
//         console.error("Upload error:", error);
//         toast.error("Image upload error");
//       }
//     } else {
//       setNewHobby((prev) => ({
//         ...prev,
//         [name]: type === "number" ? Number(value) || 0 : value,
//       }));
//     }
//   };

//   const handleAdd = () => {
//     setNewHobby(defaultHobby);
//     setShowModal("add");
//   };

//   const handleSubmit = async () => {
//     try {
//       // const res = await postData("hobbies", newHobby);
//       // if (res) {
//       //   getUsers();
//       //   toast.success("Hobby added successfully!");
//       //   setShowModal(null);
//       // } else {
//       //   toast.error("Failed to add hobby!");
//       // }
//     } catch (err: any) {
//       toast.error(err.message);
//     }
//   };

//   // const handleEdit = (hobby: any) => {
//   //   setSelectedHobby(hobby);
//   //   setNewHobby({
//   //     HOBBY_NAME: hobby.HOBBY_NAME,
//   //     HOBBY_IMAGE_URL: hobby.HOBBY_IMAGE_URL,
//   //     HOBBY_CREATED_BY: hobby.HOBBY_CREATED_BY
//   //   });
//   //   setShowModal("edit");
//   // };

//   const handleUpdate = async () => {
//     try {
//       // const res = await updateData("hobbies", selectedHobby.HOBBY_ID, newHobby);
//       // if (res) {
//       //   getUsers();
//       //   toast.success("Hobby updated successfully!");
//       //   setShowModal(null);
//       // } else {
//       //   toast.error("Failed to update hobby!");
//       // }
//     } catch (err: any) {
//       toast.error(err.message);
//     }
//   };

//   // const handleDelete = async (id: string) => {
//   //   if (confirm("Are you sure you want to delete this hobby?")) {
//   //     const res = await deleteData("hobbies", id);
//   //     if (res) {
//   //       loadData();
//   //       toast.success("Hobby deleted!");
//   //     } else {
//   //       toast.error("Failed to delete hobby!");
//   //     }
//   //   }
//   // };

//   const columns = [
//     { name: "ID", selector: (row) => row.PR_ID, sortable: true },
//     { name: "Unique ID", selector: (row) => row.PR_UNIQUE_ID || "N/A", sortable: true },
//     { name: "Full Name", selector: (row) => row.PR_FULL_NAME || "N/A", sortable: true },
//     { name: "DOB", selector: (row) => row.PR_DOB || "N/A", sortable: true },
//     { name: "Gender", selector: (row) => row.PR_GENDER || "N/A", sortable: true },
//     { name: "Mobile No.", selector: (row) => row.PR_MOBILE_NO || "N/A", sortable: true },
//     { name: "Profession ID", selector: (row) => row.PR_PROFESSION_ID || "N/A", sortable: true },
//     { name: "Profession Details", selector: (row) => row.PR_PROFESSION_DETA || "N/A", sortable: true },
//     { name: "Education", selector: (row) => row.PR_EDUCATION || "N/A", sortable: true },
//     { name: "Education Desc", selector: (row) => row.PR_EDUCATION_DESC || "N/A", sortable: true },
//     { name: "Address", selector: (row) => row.PR_ADDRESS || "N/A", sortable: true },
//     { name: "Pin Code", selector: (row) => row.PR_PIN_CODE || "N/A", sortable: true },
//     { name: "Area Name", selector: (row) => row.PR_AREA_NAME || "N/A", sortable: true },
//     { name: "City Code", selector: (row) => row.PR_CITY_CODE || "N/A", sortable: true },
//     { name: "State Code", selector: (row) => row.PR_STATE_CODE || "N/A", sortable: true },
//     { name: "District Code", selector: (row) => row.PR_DISTRICT_CODE || "N/A", sortable: true },
//     { name: "Family No.", selector: (row) => row.PR_FAMILY_NO || "N/A", sortable: true },
//     { name: "Member No.", selector: (row) => row.PR_MEMBER_NO || "N/A", sortable: true },
//     { name: "Father ID", selector: (row) => row.PR_FATHER_ID || "N/A", sortable: true },
//     { name: "Mother ID", selector: (row) => row.PR_MOTHER_ID || "N/A", sortable: true },
//     { name: "Spouse ID", selector: (row) => row.PR_SPOUSE_ID || "N/A", sortable: true },
//     { name: "Married", selector: (row) => row.PR_MARRIED_YN || "N/A", sortable: true },
//     { name: "Father Name", selector: (row) => row.PR_FATHER_NAME || "N/A", sortable: true },
//     { name: "Mother Name", selector: (row) => row.PR_MOTHER_NAME || "N/A", sortable: true },
//     { name: "Spouse Name", selector: (row) => row.PR_SPOUSE_NAME || "N/A", sortable: true },
//     { name: "Business Code", selector: (row) => row.PR_BUSS_CODE || "N/A", sortable: true },
//     { name: "Business Interest", selector: (row) => row.PR_BUSS_INTER || "N/A", sortable: true },
//     { name: "Business Stream", selector: (row) => row.PR_BUSS_STREAM || "N/A", sortable: true },
//     { name: "Business Type", selector: (row) => row.PR_BUSS_TYPE || "N/A", sortable: true },
//     { name: "Hobby", selector: (row) => row.PR_HOBBY || "N/A", sortable: true },
//     { name: "Completed", selector: (row) => row.PR_IS_COMPLETED || "N/A", sortable: true },
//     { name: "Photo URL", selector: (row) => row.PR_PHOTO_URL || "N/A", sortable: true },
//     { name: "Created By", selector: (row) => row.PR_CREATED_BY || "N/A", sortable: true },
//     { name: "Created At", selector: (row) => row.PR_CREATED_AT || "N/A", sortable: true },
//     { name: "Updated By", selector: (row) => row.PR_UPDATED_BY || "N/A", sortable: true },
//     { name: "Updated At", selector: (row) => row.PR_UPDATED_AT || "N/A", sortable: true },
//     { name: "Role", selector: (row) => row.PR_ROLE || "N/A", sortable: true },
//     { name: "Children", selector: (row) => row.Children?.length || 0, sortable: true },
//     { name: "City", selector: (row) => row.City?.name || "N/A", sortable: true },
//     { name: "Profession", selector: (row) => row.Profession?.name || "N/A", sortable: true },
//     { name: "Business", selector: (row) => row.BUSSINESS?.name || "N/A", sortable: true },
//     {
//       name: "Contacts",
//       selector: (row) =>
//         Array.isArray(row.Contact) ? row.Contact.map((c) => c.phone).join(", ") : "N/A",
//       sortable: false,
//     },
//   ];

//   return (

//       <div className="p-6">
//         <TableHeader
//           title="Users"
//           text="Users"
//           placeholder="Search for Users..."
//           searchText={searchText}
//           setSearchText={setSearchText}
//           handleAdd={handleAdd}
//         />

//         <DataTable
//           columns={columns}
//           data={filteredData}
//           progressPending={loading}
//           pagination
//         />

//         {showModal && (
//           <Modal
//             title={showModal === "add" ? "Add City" : "Edit City"}
//             onClose={() => setShowModal(null)}
//             onSubmit={showModal === "add" ? handleSubmit : handleUpdate}
//           >
//             <Input
//               type="text"
//               label="Hobby Name"
//               name="HOBBY_NAME"
//               value={newHobby.HOBBY_NAME}
//               onChange={handleChange}
//             />
//             <Input
//               type="file"
//               label="Upload Icon"
//               name="HOBBY_IMAGE_URL"
//               value={newHobby.HOBBY_IMAGE_URL}
//               onChange={handleChange}
//             />
//           </Modal>
//         )}
//       </div>
//   );
// };

// export default HobbiesTable;

"use client";

import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import TableHeader from "@/components/TableHeader";
import Modal from "@/components/AddEdit";

const HobbiesTable = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://node2-plum.vercel.app/api/admin/users"
      );
      const json = await response.json();
      setData(json.data || []);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
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
          className="px-2 py-2 bg-sky-600 duration-200 ease-in hover:bg-sky-700 rounded-lg text-white cursor-pointer"
          onClick={() => handleViewDetails(row)}
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <TableHeader
        title="Users"
        text="Users"
        placeholder="Search for Users..."
        searchText={searchText}
        setSearchText={setSearchText}
        handleAdd={() => {}}
      />

      <DataTable
        columns={shortColumns}
        data={filteredData}
        progressPending={loading}
        pagination
        highlightOnHover
      />

      {/* Full Row Details Modal */}
      {/* {showDetailsModal && selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white max-w-2xl w-full rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">User Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-red-500 font-bold text-lg"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(selectedRow).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong>{" "}
                  {Array.isArray(value)
                    ? value.map((v: any, i: number) => <span key={i}>{JSON.stringify(v)} </span>)
                    : typeof value === "object" && value !== null
                    ? JSON.stringify(value)
                    : value?.toString() || "N/A"}
                </div>
              ))}
            </div>
          </div>
        </div>
      )} */}
      {showDetailsModal && selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">User Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-red-500 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <table className="w-full border border-gray-300 rounded-md">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border-b">Field</th>
                  <th className="px-4 py-2 border-b">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(selectedRow).map(([key, value]) => (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b font-medium">{key}</td>
                    <td className="px-4 py-2 border-b">
                      {Array.isArray(value)
                        ? value.map((v: any, i: number) => (
                            <span key={i}>{JSON.stringify(v)} </span>
                          ))
                        : typeof value === "object" && value !== null
                        ? JSON.stringify(value)
                        : value?.toString() || "N/A"}
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

export default HobbiesTable;
