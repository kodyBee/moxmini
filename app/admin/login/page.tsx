"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Navigation } from "@/components/ui/navigation";
import { Separator } from "@/components/ui/separator";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password");
        setIsLoading(false);
      } else if (result?.ok) {
        // Clear any old localStorage auth data
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminAuthTime");
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-gradient-to-r from-black via-[#001220] to-black text-white py-20 px-4">
        <div className="max-w-md mx-auto">
          <Separator className="mb-8 bg-white/20" />
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Admin Login</h1>
            <p className="text-gray-400">Artist Dashboard Access</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Enter password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold transition-colors"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>

          <Separator className="mt-8 bg-white/20" />
        </div>
      </main>
    </>
  );
}
