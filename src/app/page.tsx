// import Image from "next/image";
// import Citytable from "@/components/Citytable";
// import Layout from "@/components/Layout";

// import AdminPanel from "@/components/AdminDash";

// export default function Home() {
//   return (
//     <div>
//       {/* <AdminPanel /> */}
//       {/* <Citytable /> */}
//     </div>
// );
// }

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
