import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Extend the Session and User types to include token
// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name?: string;
//       email?: string;
//       token?: string;
//     };
//   }

//   interface User {
//     id: string;
//     name?: string;
//     email?: string;
//     token?: string;
//   }
// }

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials || {};

        // Replace this with your own validation logic or API call
        if (username === "admin" && password === "admin123") {
          return {
            id: "1",
            name: "Admin",
            email: "admin@example.com",
            token: "your-auth-token-here", // Add token to the user object
          };
        }

        // If login fails
        return null;
      },
    }),
  ],
});
