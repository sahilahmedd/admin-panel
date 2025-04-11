import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
              };
            }
    
            // If login fails
            return null;
          },
        }),
      ],
})