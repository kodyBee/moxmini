"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LoaderCircle, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-input bg-background/60 px-3.5 text-foreground transition-colors hover:border-foreground/30 focus-visible:border-primary";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username: form.get("username"),
        password: form.get("password"),
        redirect: false,
      });

      if (result?.ok && !result.error) {
        // Clear auth data left behind by the old dashboard
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminAuthTime");
        localStorage.removeItem("adminOrders");
        router.replace("/admin/dashboard");
        router.refresh();
        return;
      }
      setError("Invalid username or password");
    } catch {
      setError("An error occurred. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="surface mt-8 space-y-5 p-6 sm:p-8">
      {error && (
        <p
          role="alert"
          className="flex gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-[oklch(0.85_0.08_25)]"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}

      <label className="block text-sm font-medium">
        Username
        <input
          name="username"
          type="text"
          autoComplete="username"
          required
          className={inputClass}
        />
      </label>

      <label className="block text-sm font-medium">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </label>

      <Button type="submit" size="lg" disabled={isLoading} className="w-full">
        {isLoading && <LoaderCircle className="animate-spin" aria-hidden />}
        {isLoading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
