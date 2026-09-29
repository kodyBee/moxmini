import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Ornament } from "@/components/ornament";
import { ClearCartOnce } from "./clear-cart-once";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: PageProps<"/checkout/success">) {
  const { session_id } = await searchParams;
  const sessionId = typeof session_id === "string" ? session_id : null;

  return (
    <div className="container-page pt-16 md:pt-24">
      {sessionId && <ClearCartOnce sessionId={sessionId} />}
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto grid size-20 place-items-center rounded-full border border-success/40 bg-success/10 text-success">
          <Check className="size-9" aria-hidden />
        </span>
        <p className="eyebrow mt-8">Payment successful</p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
          Thank you for your order!
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Your order is confirmed and on its way to Mox&apos;s workbench.
          You&apos;ll receive an email confirmation shortly with your order
          details.
        </p>

        {sessionId && (
          <p className="surface mt-8 px-5 py-4 text-sm text-muted-foreground">
            Order reference
            <span className="mt-1 block font-mono text-xs break-all text-foreground/80">
              {sessionId}
            </span>
          </p>
        )}

        <Ornament className="mx-auto mt-10 max-w-xs" />

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/figurefinder">
              Continue shopping
              <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
