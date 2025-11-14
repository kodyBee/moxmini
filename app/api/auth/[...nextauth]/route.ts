import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔐 Login attempt received");
        
        if (!credentials?.username || !credentials?.password) {
          console.error("❌ Missing credentials");
          return null;
        }

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        console.log("🔍 Checking environment variables:");
        console.log("  ADMIN_USERNAME:", adminUsername ? "✓ Set" : "✗ Missing");
        console.log("  ADMIN_PASSWORD_HASH:", adminPasswordHash ? "✓ Set" : "✗ Missing");
        console.log("  Provided username:", credentials.username);

        if (!adminUsername || !adminPasswordHash) {
          console.error("❌ Admin credentials not configured in environment variables");
          return null;
        }

        // Check username
        if (credentials.username !== adminUsername) {
          console.error(`❌ Username mismatch: '${credentials.username}' !== '${adminUsername}'`);
          return null;
        }
        console.log("✓ Username matches");

        // Check password with bcrypt
        console.log("🔑 Password length:", credentials.password.length);
        console.log("🔑 Hash length:", adminPasswordHash.length);
        console.log("🔑 Hash value:", adminPasswordHash);
        
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          adminPasswordHash
        );

        console.log("🔑 bcrypt.compare result:", passwordMatch);

        if (!passwordMatch) {
          console.error("❌ Password does not match hash");
          return null;
        }
        console.log("✓ Password matches");

        // Return user object on success
        console.log("✅ Login successful!");
        return {
          id: "admin",
          name: credentials.username,
          email: "admin@moxmini.com",
          role: "admin",
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
