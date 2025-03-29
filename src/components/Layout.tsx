"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("Admin");    
  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen && !e.target.closest(".sidebar")) {
        closeSidebar();
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  return (
    <div className="flex" onClick={closeSidebar}>
      <div className="sidebar">
        <Sidebar isOpen={isOpen} closeSidebar={closeSidebar} />
      </div>
      <div className="flex-1 min-h-screen" onClick={(e) => e.stopPropagation()}>
        <Navbar toggleSidebar={toggleSidebar} userName={userName} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
