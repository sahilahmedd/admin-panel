// "use client";
// import React, { useState } from "react";
// import { UserCircle, LogOut, KeyRound, Menu } from "lucide-react";
// // import { logout } from "@/lib/actions/auth";
// import { signOut } from "next-auth/react";

// const Navbar = ({ toggleSidebar, userName }) => {
//     const [dropdownOpen, setDropdownOpen] = useState(false);
  
//     return (
//       <nav className="bg-gray-800 z-50 text-white flex items-center justify-between px-6 py-4 relative">
//         <div className="flex items-center gap-4">
//           <Menu className="text-xl cursor-pointer" onClick={toggleSidebar} />
//           <h1 className="text-lg font-bold">Admin Panel</h1>
//         </div>
//         <div className="relative flex items-center gap-3">
//           <span className="text-sm font-medium">{userName}</span>
//           <button
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//             className="flex items-center gap-2"
//           >
//             <UserCircle className="w-6 h-6" />
//           </button>
//           {dropdownOpen && (
//             <div className="absolute right-0 top-5 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-2">
//               <button className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-200">
//                 <KeyRound className="w-5 h-5" /> Change Password
//               </button>
//               <button onClick={()=>signOut({ redirect: true, redirectTo: "/login" })} className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-200">
//                 <LogOut className="w-5 h-5 text-red-500" /> Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </nav>
//     );
// };

// export default Navbar;

"use client";
import React, { useState, useEffect, useRef } from "react";
import { UserCircle, LogOut, KeyRound, Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

const Navbar = ({ toggleSidebar, userName }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="bg-gray-800 z-50 text-white flex items-center justify-between px-6 py-4 relative">
      <div className="flex items-center gap-4">
        <Menu className="text-xl cursor-pointer" onClick={toggleSidebar} />
        <h1 className="text-lg font-bold">Admin Panel</h1>
      </div>
      <div className="relative flex items-center gap-3">
        <span className="text-sm font-medium">{userName}</span>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2"
        >
          <UserCircle className="w-6 h-6" />
        </button>

        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 top-5 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-2"
          >
            <button className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-200">
            <KeyRound className="w-5 h-5" /><Link href="/changepassword">Change Password</Link>
            </button>
            <button
              onClick={() =>
                signOut({ redirect: true, callbackUrl: "/login" })
              }
              className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-200"
            >
              <LogOut className="w-5 h-5 text-red-500" /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
