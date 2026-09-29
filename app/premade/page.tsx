import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/page-intro";
import { PremadeCard } from "@/components/premade-card";
import { listPremadeProductsForDisplay } from "@/lib/premade";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Prepainted Miniatures",
  description:
    "One-of-a-kind miniatures, hand-painted by Mox and ready for your next session.",
};

export default async function PremadePage() {
  const products = await listPremadeProductsForDisplay();

  return (
    <div className="container-page pt-14 md:pt-20">
      <PageIntro eyebrow="Ready to play" title="Prepainted favorites">
        One-of-a-kind miniatures, finished by hand and ready for your next
        session. Once a piece sells, it&apos;s gone for good.
      </PageIntro>

      {products.length > 0 ? (
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <PremadeCard
              key={product.id}
              product={product}
              priority={index < 3}
            />
          ))}
        </div>
      ) : (
        <div className="surface mx-auto mt-14 max-w-xl px-6 py-14 text-center">
          <h2 className="font-display text-3xl font-semibold">
            Fresh paint is drying
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every prepainted piece has found a home. New ones are on the
            workbench. In the meantime, pick any figure and have it painted just
            for you.
          </p>
          <Button asChild className="mt-7">
            <Link href="/figurefinder">
              Create your own
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
