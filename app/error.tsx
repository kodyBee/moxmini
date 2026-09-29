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
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-24">
      <div className="surface mx-auto max-w-xl px-6 py-14 text-center">
        <h1 className="font-display text-4xl font-semibold">
          Something went wrong
        </h1>
        <p className="mt-3 text-muted-foreground">
          A spell misfired while loading this page. Please try again.
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
      </div>
    </div>
  );
}
