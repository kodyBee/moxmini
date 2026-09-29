"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("Figure Finder Error:", error);
  }, [error]);

  return (
    <div className="container-page py-24">
      <div className="surface mx-auto max-w-xl px-6 py-14 text-center">
        <p className="eyebrow">Figure Finder</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">
          The catalog didn&apos;t load
        </h1>
        <p className="mt-3 text-muted-foreground">
          We couldn&apos;t reach the miniature catalog. This is usually a brief
          network hiccup, so please try again in a moment.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={() => retry()}>
            <RefreshCw aria-hidden />
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go home</Link>
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <p className="mt-8 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-left font-mono text-xs text-[oklch(0.8_0.1_25)]">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
}
