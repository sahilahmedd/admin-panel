/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
// import { fetchData, postData, updateData, deleteData } from "@/utils/api";
// import { Pencil, CircleX } from "lucide-react";
// import Image from "next/image";
import TableHeader from "@/components/TableHeader";
// import Modal from "@/components/AddEdit";
// import Input from "@/components/FormInput";

const PaymentLogs = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const getLogs = async () => {
    setLoading(true);
    const response = await fetch("https://node2-plum.vercel.app/api/user/allDonationPayments")
    const data = await response.json()

    console.log("Data: ", data.data);
    setData(data.data)
    setLoading(false);
  };

  useEffect(() => {
    getLogs();
  }, []);

  // Handle search
  const filteredData = data.filter((item) =>
    item.PR_FULL_NAME.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleUpdate = async () => {
    try {
      // const res = await updateData("hobbies", selectedHobby.HOBBY_ID, newHobby);
      // if (res) {
      //   getUsers();
      //   toast.success("Hobby updated successfully!");
      //   setShowModal(null);
      // } else {
      //   toast.error("Failed to update hobby!");
      // }
    } catch (err: any) {
    //   toast.error(err.message);
    }
  };

  // const handleDelete = async (id: string) => {
  //   if (confirm("Are you sure you want to delete this hobby?")) {
  //     const res = await deleteData("hobbies", id);
  //     if (res) {
  //       loadData();
  //       toast.success("Hobby deleted!");
  //     } else {
  //       toast.error("Failed to delete hobby!");
  //     }
  //   }
  // };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "ENVIT_ID", selector: (row) => row.ENVIT_ID, sortable: true },
    { name: "Full Name", selector: (row) => row.PR_FULL_NAME || "N/A", sortable: true },
    { name: "Currency", selector: (row) => row.currency || "N/A", sortable: true },
    { name: "Amount", selector: (row) => row.amount|| "N/A", sortable: true },
    { name: "Amount in RS", selector: (row) => row.amountInRupees|| "N/A", sortable: true },
    { name: "Description", selector: (row) => row.description|| "N/A", sortable: true },
    { name: "Mobile", selector: (row) => row.contact|| "N/A", sortable: true },
    { name: "Email", selector: (row) => row.email|| "N/A", sortable: true },
    { name: "Entity", selector: (row) => row.entity|| "N/A", sortable: true },
    { name: "Payment ID", selector: (row) => row.paymentId|| "N/A", sortable: true },
    { name: "Payment Method", selector: (row) => row.method|| "N/A", sortable: true },
    { name: "International", selector: (row) => row.international == 0 ? "N" : "Y", sortable: true },
    { name: "Payment Status", selector: (row) => row.status || "N/A", sortable: true },
    { name: "TAX", selector: (row) => row.tax == 0 ? "N/A" : row.tax, sortable: true },
    { name: "VPA", selector: (row) => row.vpa == 0 ? "N/A" : row.vpa, sortable: true },
    { name: "Captured", selector: (row) => row.captured == false ? "N" : "Y", sortable: true },
    { name: "Refund Status", selector: (row) => row.refund_status == 0 ? "N" : "Y", sortable: true },
    { name: "Amount Refunded", selector: (row) => row.amount_refunded == 0 ? "N" : "Y", sortable: true },
    { name: "Invoice ID", selector: (row) => row.invoice_id || "N/A", sortable: true },
  ];

  return (
    
      <div className="p-6">
        {/* <TableHeader
          title="Payment Logs"
          text="Payment Logs"
          placeholder="Search..."
          searchText={searchText}
          setSearchText={setSearchText}
          handleAdd={handleAdd}
        /> */}

        <DataTable
          columns={columns}
          data={filteredData}
          progressPending={loading}
          pagination
        />

        {/* {showModal && (
          <Modal
            title={showModal === "add" ? "Add City" : "Edit City"}
            onClose={() => setShowModal(null)}
            onSubmit={showModal === "add" ? handleSubmit : handleUpdate}
          >
            <Input
              type="text"
              label="Hobby Name"
              name="HOBBY_NAME"
              value={newHobby.HOBBY_NAME}
              onChange={handleChange}
            />
            <Input
              type="file"
              label="Upload Icon"
              name="HOBBY_IMAGE_URL"
              value={newHobby.HOBBY_IMAGE_URL}
              onChange={handleChange}
            />
          </Modal>
        )} */}
      </div>
  );
};

export default PaymentLogs;
