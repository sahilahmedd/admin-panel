// app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gray-100">
    //   <form onSubmit={handleLogin} className="bg-white p-8 shadow-md rounded">
    //     <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
    //     <input
    //       type="text"
    //       placeholder="Username"
    //       className="border p-2 w-full mb-4"
    //       value={username}
    //       onChange={(e) => setUsername(e.target.value)}
    //     />
    //     <input
    //       type="password"
    //       placeholder="Password"
    //       className="border p-2 w-full mb-4"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //     />
    //     <button type="submit" className="bg-blue-600 text-white px-4 py-2 w-full">
    //       Login
    //     </button>
    //   </form>
    // </div>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
  <form 
    onSubmit={handleLogin} 
    className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
  >
    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Admin Login</h2>
    
    <div className="mb-6">
      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
        Username
      </label>
      <input
        id="username"
        type="text"
        placeholder="Enter your username"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
    </div>

    <div className="mb-8">
      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
        Password
      </label>
      <input
        id="password"
        type="password"
        placeholder="••••••••"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>

    <button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.01]"
    >
      Sign In
    </button>

    {/* Optional: Forgot password link
    <p className="text-center mt-6 text-sm text-gray-600">
      Forgot password?{" "}
      <a href="#" className="text-blue-600 hover:underline">Reset here</a>
    </p> */}
  </form>
</div>
  );
}
