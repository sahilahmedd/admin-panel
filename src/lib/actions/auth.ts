"use server";
import { signIn } from "@/auth";

export const login = async () => {
    await signIn("CredentialsProvider", {redirectTo: "/dashboard"})
};

// export const logout = async () => {
//     await signOut({redirectTo: "/login"})
// };
