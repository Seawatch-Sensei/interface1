import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Main configuration object for NextAuth.js authentication
export const authOptions = {
  // Configure authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // Custom callback functions for authentication flow
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle successful sign-in
      // Currently logs user info and allows all sign-ins
      console.log(user)
      return true;
    },
  },
  // Custom page routes for authentication
  pages: {
    signIn: '/login', // Custom login page path
  },
  // Session configuration using JWT
  session: {
    jwt: true,
  },
  // JWT configuration using environment secret
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
};

// Create the NextAuth handler with our configuration
const handler = NextAuth(authOptions);

// Export handler for API route
export { handler as GET, handler as POST };
