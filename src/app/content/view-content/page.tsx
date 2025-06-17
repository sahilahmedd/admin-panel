// // File: pages/admin/pages/index.js (or app/admin/pages/page.js if App Router)
// "use client"
// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/router'; // Use useRouter for Pages Router navigation

// const API_BASE_URL = "https://node2-plum.vercel.app/api/admin";

// function PageList() {
//   const [pages, setPages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   // const router = useRouter(); // Initialize router for navigation (Pages Router)

//   useEffect(() => {
//     const fetchPages = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const response = await fetch(`${API_BASE_URL}/v1/pages`);

//         console.log("Content: ", response);
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         if (data.success) {
//           setPages(data.data);
//         } else {
//           setError(data.message || 'Failed to fetch pages.');
//         }
//       } catch (err) {
//         console.error("Error fetching pages:", err);
//         setError(`Failed to load pages: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPages();
//   }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm(`Are you sure you want to delete page with ID: ${id}?`)) {
//       return;
//     }
//     try {
//       const response = await fetch(`${API_BASE_URL}/v1/pages/${id}`, {
//         method: 'DELETE',
//       });
//       const data = await response.json();
//       if (response.ok && data.success) {
//         alert('Page deleted successfully!');
//         // Remove the deleted page from the state
//         setPages(pages.filter(page => page.id !== id));
//       } else {
//         throw new Error(data.message || 'Failed to delete page.');
//       }
//     } catch (err) {
//       console.error("Error deleting page:", err);
//       alert(`Error deleting page: ${err.message}`);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-5 max-w-4xl mx-auto text-center text-gray-700">
//         <p>Loading pages...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-5 max-w-4xl mx-auto text-center text-red-600">
//         <p>Error: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-5 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">Page Management</h1>

//       <div className="mb-6 flex justify-end">
//         <Link href="/admin/pages/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out">
//           Create New Page
//         </Link>
//       </div>

//       {pages.length === 0 ? (
//         <p className="text-gray-600">No pages found. Start by creating a new one!</p>
//       ) : (
//         <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {pages.map((page) => (
//                 <tr key={page.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{page.id}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{page.title}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{page.link_url}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {page.active_yn === 1 ? (
//                       <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Yes</span>
//                     ) : (
//                       <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">No</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <Link href={`/content/view-content/${page.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
//                       Edit
//                     </Link>
//                     <button
//                       onClick={() => handleDelete(page.id)}
//                       className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PageList;


import PageList from '@/components/pages/pageList'
import React from 'react'

const page = () => {
  return (
    <div>
      <PageList />
    </div>
  )
}

export default page
