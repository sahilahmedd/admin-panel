// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";
// import React from "react";
// import Link from "next/link";

// const Sidebar = ({ isOpen, closeSidebar }) => {
//   return (
//     <div
//       className={`fixed z-50 top-0 left-0 h-full bg-gray-900 text-white w-64 p-5 transition-transform ${
//         isOpen ? "translate-x-0" : "-translate-x-64"
//       }`}
//       onClick={(e) => e.stopPropagation()}
//     >
//       <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
//       <ul>
//         <li className="mb-1 p-2 rounded hover:bg-gray-800"><Link href="/">Dashboard</Link></li>
//         <li className="mb-1 p-2 rounded hover:bg-gray-800"><Link href="/users">Users</Link></li>
//         <li className="mb-1 p-2 rounded hover:bg-gray-800"><Link href="/settings">Settings</Link></li>
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;

"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Table,
  UserPen,
  Building,
  Briefcase,
  CalendarHeart,
  Settings,
} from "lucide-react";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const [tablesOpen, setTablesOpen] = useState(false);

  const tableLinks = [
    { name: "Cities", path: "cities", icon: <Building className="w-5 h-5" /> },
    { name: "Hobbies", path: "hobbies", icon: <UserPen className="w-5 h-5" /> },
    { name: "Professions", path: "professions", icon: <Briefcase className="w-5 h-5" /> },
    { name: "Events", path: "events", icon: <CalendarHeart className="w-5 h-5" /> },
  ];

  // console.log("Path: ", tableLinks[0].path);
  

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
        
        <li className="mb-4 flex items-center gap-2 hover:bg-gray-800 p-2 rounded-md transition">
          <Settings className="w-5 h-5" />
          <Link href="/settings">Settings</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;