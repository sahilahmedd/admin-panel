"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Breadcrumbs from "./Breadcrumbs";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("Admin");
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const isLoginPage = pathname === "/login";

  // Auto-close sidebar when navigating
  useEffect(() => {
    closeSidebar();
  }, [pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Always ensure sidebar is closed by default
      setIsOpen(false);
    };

    // Add resize listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show nothing while session is loading
  if (status === "loading") return null;

  // If not logged in and not on login page, redirect to login
  if (!session && !isLoginPage) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  // If user is on the login page, show children without navbar/sidebar
  if (!session && isLoginPage) {
    return <>{children}</>;
  }

  // Authenticated layout
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isOpen} closeSidebar={closeSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          toggleSidebar={toggleSidebar}
          userName={session?.user?.name || userName}
        />

        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">
            <Breadcrumbs />
            <div className="mt-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
