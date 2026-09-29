import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin/dashboard");

  return (
    <div className="container-page py-20 md:py-28">
      <div className="mx-auto max-w-sm">
        <div className="text-center">
          <p className="eyebrow">Artist dashboard</p>
          <h1 className="mt-3 font-display text-4xl font-semibold">Sign in</h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
