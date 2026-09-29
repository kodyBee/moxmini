"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin/dashboard", label: "Orders" },
  { href: "/admin/dashboard/products", label: "Prepainted products" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
      <nav
        aria-label="Dashboard"
        className="flex gap-1 rounded-full border border-border bg-card p-1"
      >
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={pathname === tab.href ? "page" : undefined}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
              "aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <Button
        variant="ghost"
        size="sm"
        className="self-start sm:self-auto"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
      >
        <LogOut aria-hidden />
        Sign out
      </Button>
    </div>
  );
}
