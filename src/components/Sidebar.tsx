"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Table,
  Building2,
  Heart,
  Calendar,
  Briefcase,
  Book,
  LayoutGrid,
  Users,
  Text,
  BadgeDollarSign,
  Database,
  Package,
  Contact
} from "lucide-react";


const Sidebar = ({ isOpen, closeSidebar }) => {
  const [tablesOpen, setTablesOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);


  const tableLinks = [
    { name: "Cities", path: "cities", icon: <Building2 className="w-5 h-5" /> },
    { name: "Hobbies", path: "hobbies", icon: <Heart className="w-5 h-5" /> },
    { name: "Professions", path: "professions", icon: <Briefcase className="w-5 h-5" /> },
    { name: "Events", path: "events", icon: <Calendar className="w-5 h-5" /> },
    { name: "Education", path: "education", icon: <Book className="w-5 h-5" /> },
    { name: "Stream", path: "stream", icon: <LayoutGrid className="w-5 h-5" /> },
    { name: "Business", path: "business", icon: <Package className="w-5 h-5" /> },
    { name: "Contact", path: "contact", icon: <Contact className="w-5 h-5" /> },
  ];

  const userLinks = [
    {name: "View", path: "userview  ", icon: <Database className="w-5 h-5" />},
    {name: "Register", path: "register", icon: <Text className="w-5 h-5" />},

  ]
  // console.log("Path: ", tableLinks[0].path);
  

  // const paymentLinks = [
  //   {name: "Logs", path: "userview  ", icon: <Database className="w-5 h-5" />},
  //   {name: "Register", path: "register", icon: <Text className="w-5 h-5" />},

  // ]

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-900 text-white w-64 p-5 transition-transform z-50 shadow-lg ${
        isOpen ? "translate-x-0" : "-translate-x-64"
      } duration-300 ease-in-out`}
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
    >
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <ul>
        <li className="mb-4 flex items-center gap-2 hover:bg-gray-800 p-2 rounded-md transition">
          <LayoutDashboard className="w-5 h-5" />
          <Link href="/dashboard">Dashboard</Link>
        </li>
        
        <li className="mb-4">
          <button
            className="flex items-center gap-2 w-full text-left hover:bg-gray-800 p-2 rounded-md transition"
            onClick={() => setTablesOpen(!tablesOpen)}
          >
            <Table className="w-5 h-5" /> Tables
          </button>
          {tablesOpen && (
            <ul className="ml-6 mt-2">
              {tableLinks.map((item) => (
                <li key={item.path} className="mb-3 flex items-center gap-2 hover:bg-gray-800 p-2 rounded-md transition">
                  {item.icon}
                  
                  <Link href={`/tables/${item.path}`}>{item.name}</Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      

      <li className="mb-4">
          <button
            className="flex items-center gap-2 w-full text-left hover:bg-gray-800 p-2 rounded-md transition"
            onClick={() => setUserOpen(!userOpen)}
          >
          <Users className="w-5 h-5" /> Users
          </button>
          {userOpen && (
            <ul className="ml-6 mt-2">
              {userLinks.map((item) => (
                <li key={item.path} className="mb-3 flex items-center gap-2 hover:bg-gray-800 p-2 rounded-md transition">
                  {item.icon}
                  <Link href={`/family/${item.path}`}>{item.name}</Link>
                </li>
              ))}
            </ul>
          )}
        </li>

        <li className="mb-4 flex items-center gap-2 hover:bg-gray-800 p-2 rounded-md transition">
          <BadgeDollarSign className="w-5 h-5" />
          <Link href="/payment">Payment</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;