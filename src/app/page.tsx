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

// import { redirect } from "next/navigation";
// "use client"

// import { login } from "@/lib/actions/auth"

// export default function Home() {
//   // redirect("/dashboard");
//   return (
//     <>
//         <h1>Login now</h1>
//         <button onClick={() => login()} >GitHub Login</button>
//     </>
//   )
// }

// "use client";

// import { signIn } from "next-auth/react";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const router = useRouter();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const res = await signIn("credentials", {
//       username,
//       password,
//       redirect: false,
//     });

//     if (res?.error) {
//       setError("Invalid username or password");
//     } else {
//       router.push("/dashboard"); // Redirect after successful login
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
//         <h2 className="text-2xl font-bold mb-6">Login</h2>
//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="w-full p-2 mb-4 border rounded"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 mb-6 border rounded"
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//         >
//           Sign In
//         </button>
//       </form>
//     </div>
//   );
// }

// app/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  redirect("/dashboard");
}
