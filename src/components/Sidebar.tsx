"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Contact,
  TextCursorIcon,
  FileText,
  LayoutTemplate,
  ChevronDown,
  ChevronRight,
  X,
  Menu,
} from "lucide-react";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const [tablesOpen, setTablesOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);

  // Handle outside click to close sidebar
  useEffect(() => {
    // Only add the event listener if the sidebar is open
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      // Check if the click is outside the sidebar
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    };

    // Add event listener with a slight delay to prevent immediate triggering
    document.addEventListener("click", handleOutsideClick);

    // Clean up
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen, closeSidebar]);

  // Auto-expand section based on current path
  useEffect(() => {
    if (pathname?.includes("/tables")) setTablesOpen(true);
    if (pathname?.includes("/family")) setUserOpen(true);
    if (pathname?.includes("/content")) setContentOpen(true);
  }, [pathname]);

  const tableLinks = [
    { name: "Cities", path: "cities", icon: <Building2 className="w-4 h-4" /> },
    { name: "Hobbies", path: "hobbies", icon: <Heart className="w-4 h-4" /> },
    {
      name: "Professions",
      path: "professions",
      icon: <Briefcase className="w-4 h-4" />,
    },
    { name: "Events", path: "/events", icon: <Calendar className="w-4 h-4" /> },
    {
      name: "Education",
      path: "education",
      icon: <Book className="w-4 h-4" />,
    },
    {
      name: "Stream",
      path: "stream",
      icon: <LayoutGrid className="w-4 h-4" />,
    },
    {
      name: "Business",
      path: "business",
      icon: <Package className="w-4 h-4" />,
    },
    { name: "Contact", path: "contact", icon: <Contact className="w-4 h-4" /> },
    {
      name: "Categories",
      path: "category",
      icon: <LayoutGrid className="w-4 h-4" />,
    },
  ];

  const userLinks = [
    {
      name: "View",
      path: "userview",
      icon: <Database className="w-4 h-4" />,
    },
    { name: "Register", path: "register", icon: <Text className="w-4 h-4" /> },
  ];

  const contentSection = [
    {
      name: "Pages",
      path: "view-content",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      name: "Content",
      path: "add-new",
      icon: <LayoutTemplate className="w-4 h-4" />,
    },
  ];

  const isActivePath = (path) => {
    if (path.startsWith("/")) {
      return pathname === path;
    }
    if (pathname?.includes(`/tables/${path}`)) return true;
    if (pathname?.includes(`/family/${path}`)) return true;
    if (pathname?.includes(`/content/${path}`)) return true;
    return false;
  };

  // Stop propagation on sidebar clicks to prevent closing
  const handleSidebarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        ref={sidebarRef}
        onClick={handleSidebarClick}
        className={`fixed top-0 left-0 h-full bg-white text-gray-700 w-72 transition-all z-50 shadow-lg ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } duration-300 ease-in-out flex flex-col`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Admin Panel
          </h2>
          <button
            onClick={closeSidebar}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-gray-200">
          <nav>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    pathname === "/dashboard"
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              </li>

              {/* Table links as top-level items */}
              {tableLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    href={
                      item.path.startsWith("/")
                        ? item.path
                        : `/tables/${item.path}`
                    }
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActivePath(item.path)
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}

              {/* Users dropdown */}
              <li>
                <button
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all ${
                    pathname?.includes("/family")
                      ? "bg-gray-100 text-gray-800"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserOpen(!userOpen);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    <span>Users</span>
                  </div>
                  {userOpen ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                <div
                  className={`mt-1 overflow-hidden transition-all ${
                    userOpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <ul className="pl-10 pr-2 py-1 space-y-1">
                    {userLinks.map((item) => (
                      <li key={item.path}>
                        <Link
                          href={`/family/${item.path}`}
                          className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all ${
                            isActivePath(item.path)
                              ? "bg-indigo-50 text-indigo-700 font-medium"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>

              <li>
                <Link
                  href="/payment"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    pathname === "/payment"
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <BadgeDollarSign className="w-5 h-5" />
                  <span>Payment</span>
                </Link>
              </li>

              {/* Content Section dropdown */}
              <li>
                <button
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all ${
                    pathname?.includes("/content")
                      ? "bg-gray-100 text-gray-800"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setContentOpen(!contentOpen);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <TextCursorIcon className="w-5 h-5" />
                    <span>Content Section</span>
                  </div>
                  {contentOpen ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                <div
                  className={`mt-1 overflow-hidden transition-all ${
                    contentOpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <ul className="pl-10 pr-2 py-1 space-y-1">
                    {contentSection.map((item) => (
                      <li key={item.path}>
                        <Link
                          href={`/content/${item.path}`}
                          className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all ${
                            isActivePath(item.path)
                              ? "bg-indigo-50 text-indigo-700 font-medium"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
              <span className="font-medium text-sm">AP</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
