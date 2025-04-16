/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { fetchData } from "@/utils/api";
import TableHeader from "@/components/TableHeader";
// import Modal from '@/components/AddEdit'
// import Input from "@/components/FormInput";
// import Image from "next/image";

const EventsTable = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  // const [showModal, setShowModal] = useState<"add" | "edit" | null>(null);
  // const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // const defaultEvent = {
  //   CITY_PIN_CODE: "",
  //   CITY_CODE: 0,
  //   CITY_NAME: "",
  //   CITY_DS_CODE: "",
  //   CITY_DS_NAME: "",
  //   CITY_ST_CODE: "",
  //   CITY_ST_NAME: "",
  // };


  useEffect(() => {
    const getEvents = async () => {
      const result = await fetchData("events"); // Make sure the endpoint is correct
      if (result && result.events) {
        setData(result.events);
      }
      setLoading(false);
    };

    getEvents();
  }, []);

    const handleAdd = "";

    
  // Handle search
  // handle search
  const filteredData = data.filter(
    (item) =>
      item.ENVT_DESC.toLowerCase().includes(searchText.toLowerCase()) ||
      item.ENVT_CITY.toLowerCase().includes(searchText.toLowerCase()) ||
      item.ENVT_ADDRESS.toLowerCase().includes(searchText.toLowerCase())
  );

    // Open Add Modal
    // const handleAdd = () => {
    //   setNewCity(defaultCity);
    //   setShowModal("add");
    // };
  


  // Define columns similar to the City table
  const columns = [
    {
      name: "Event Info",
      selector: (row) => `${row.ENVT_ID} - ${row.ENVT_DESC}`,
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => `${row.ENVT_CITY}`,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => `${row.ENVT_ADDRESS}`,
      sortable: true,
    },
    {
      name: "Contact No.",
      selector: (row) => `${row.ENVT_CONTACT_NO}`,
      sortable: true,
    },
    {
      name: "Active",
      selector: (row) => `${row.EVET_ACTIVE_YN}`,
      sortable: true,
    },
    // {
    //     name: "Discription",
    //     selector: (row) => `${row.ENVT_EXCERPT}`,
    //     sortable: true,
    //   },
    // {
    //   name: "Details",
    //   selector: (row) => row.ENVT_DETAIL,
    //   sortable: true,
    // },
    // {
    //   name: "Banner",
    //   selector: (row) => row.ENVT_BANNER_IMAGE, cell: (row) => <Image height={10} src={row.ENVT_BANNER_IMAGE} alt={row.ENVT_DESC} width="50" />,
    //   sortable: true,
    // },
    // {
    //     name: "Gallary",
    //     selector: (row) => row.ENVT_BANNER_IMAGE, cell: (row) => <Image height={10} src={row.ENVT_BANNER_IMAGE} alt={row.ENVT_DESC} width="50" />,
    //     sortable: true,
    // },
  ];

  return (
    <div className="p-6">
      {/* <h1 className="text-2xl font-bold mb-4">Events</h1> */}
      <TableHeader
        title="Events"
        text="Event"
        placeholder="Search for events..."
        handleAdd={handleAdd}
        searchText={searchText}
        setSearchText={setSearchText}
      />
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
              type="number"
              label="State Code"
              name="CITY_ST_CODE"
              value={newEvent.CITY_ST_CODE}
              onChange={handleChange}
            />
          </Modal>
        )} */}
    </div>
  );
};

export default EventsTable;
