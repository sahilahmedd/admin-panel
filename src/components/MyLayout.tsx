// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";
// import React, { useState, useEffect, ReactNode } from "react";
// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";

// interface LayoutProps {
//   children: ReactNode;
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [userName, setUserName] = useState("Admin");

//   const setUsername = (name: string) => {
//     setUserName(name);
//   };

//   const toggleSidebar = () => setIsOpen(!isOpen);
//   const closeSidebar = () => setIsOpen(false);

//   useEffect(() => {
//     const handleOutsideClick = (e: MouseEvent) => {
//     if (isOpen && !(e.target as HTMLElement)?.closest(".sidebar")) {
//             closeSidebar();
//      }
//     };

//     document.addEventListener("click", handleOutsideClick);
//     return () => document.removeEventListener("click", handleOutsideClick);
//   }, [isOpen]);

//   return (
//     <div className="flex" onClick={closeSidebar}>
//       <div className="sidebar">
//         <Sidebar isOpen={isOpen} closeSidebar={closeSidebar} />
//       </div>
//       <div className="flex-1 min-h-screen" onClick={(e) => e.stopPropagation()}>
//         <Navbar toggleSidebar={toggleSidebar} userName={userName} />
//         <main className="p-6">{children}</main>
//       </div>
//     </div>
//   );
// };

// export default Layout;


"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

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

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isOpen && !(e.target as HTMLElement)?.closest(".sidebar")) {
        closeSidebar();
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

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
    <div className="flex" onClick={closeSidebar}>
      <div className="sidebar">
        <Sidebar isOpen={isOpen} closeSidebar={closeSidebar} />
      </div>
      <div className="flex-1 min-h-screen" onClick={(e) => e.stopPropagation()}>
        <Navbar toggleSidebar={toggleSidebar} userName={session?.user?.name || userName} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
