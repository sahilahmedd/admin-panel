/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import Link from "next/link";

const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    <div
      className={`fixed z-50 top-0 left-0 h-full bg-gray-900 text-white w-64 p-5 transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-64"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <ul>
        <li className="mb-1 p-2 rounded hover:bg-gray-800"><Link href="/">Dashboard</Link></li>
        <li className="mb-1 p-2 rounded hover:bg-gray-800"><Link href="/users">Users</Link></li>
        <li className="mb-1 p-2 rounded hover:bg-gray-800"><Link href="/settings">Settings</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;