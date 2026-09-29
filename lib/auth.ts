import "server-only";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminUsername || !adminPasswordHash) {
          console.error(
            "Admin login is disabled: ADMIN_USERNAME / ADMIN_PASSWORD_HASH are not set"
          );
          return null;
        }

        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Always run bcrypt so a wrong username takes as long as a wrong password
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          adminPasswordHash
        );

        if (credentials.username !== adminUsername || !passwordMatch) {
          return null;
        }

        return {
          id: "admin",
          name: credentials.username,
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
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
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

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin";
}

/**
 * Returns a 401 response when the request is not from a signed-in admin,
 * or null when the caller may proceed.
 */
export async function requireAdmin() {
  if (await isAdmin()) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
