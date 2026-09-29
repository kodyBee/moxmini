import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ImageOff } from "lucide-react";
import { findCatalogProduct } from "@/lib/catalog";
import { PaintingForm } from "./painting-form";

export async function generateMetadata({
  params,
}: PageProps<"/painting-options/[sku]">): Promise<Metadata> {
  const { sku } = await params;
  const product = await findCatalogProduct(sku);
  return {
    title: product ? `Customize ${product.name}` : "Figure not found",
  };
}

export default async function PaintingOptionsPage({
  params,
}: PageProps<"/painting-options/[sku]">) {
  const { sku } = await params;
  const product = await findCatalogProduct(sku);
  if (!product) notFound();

  return (
    <div className="container-page pt-8 md:pt-12">
      <Link
        href="/figurefinder"
        className="inline-flex items-center gap-1 rounded-full text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden />
        Figure Finder
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="surface grid aspect-square place-items-center overflow-hidden bg-stage">
            {product.image ? (
              /* eslint-disable-next-line @next/next/no-img-element -- Reaper's photos are served as-is */
              <img
                src={product.image}
                alt={product.name}
                className="size-full object-contain p-6 mix-blend-multiply"
              />
            ) : (
              <span className="flex flex-col items-center gap-2 text-sm text-stone-500">
                <ImageOff className="size-8" aria-hidden />
                No photo yet
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="eyebrow">Customize your miniature</p>
          <h1 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
            {product.name}
          </h1>
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
            <div className="flex gap-1.5">
              <dt>SKU</dt>
              <dd className="text-foreground">{product.sku}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt>Material</dt>
              <dd className="text-foreground capitalize">{product.material}</dd>
            </div>
          </dl>

          <PaintingForm
            product={{
              sku: product.sku,
              name: product.name,
              price: product.price,
              image: product.image,
              material: product.material,
            }}
          />
        </div>
      </div>
    </div>
  );
}
