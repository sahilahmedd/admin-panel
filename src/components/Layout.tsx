/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("Admin");

  const setUsername = (name: string) => {
    setUserName(name);
  };

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
    if (isOpen && !(e.target as HTMLElement)?.closest(".sidebar")) {
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
