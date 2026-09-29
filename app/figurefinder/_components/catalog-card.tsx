import Link from "next/link";
import { ArrowRight, ImageOff } from "lucide-react";
import { ZoomButton } from "./finder-provider";
import type { CatalogProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/pricing";

export function CatalogCard({ product }: { product: CatalogProduct }) {
  return (
    <li className="group surface relative flex flex-col overflow-hidden transition-colors hover:border-primary/40 has-[a:focus-visible]:border-primary">
      <div className="relative aspect-square overflow-hidden bg-stage">
        {product.image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- thousands of Reaper photos; not worth optimizer quota */}
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="size-full object-contain p-3 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
            />
            <ZoomButton src={product.image} name={product.name} />
          </>
        ) : (
          <div className="grid size-full place-items-center gap-2 text-sm text-stone-500">
            <span className="flex flex-col items-center gap-2">
              <ImageOff className="size-6" aria-hidden />
              No photo yet
            </span>
          </div>
        )}
        <span className="absolute bottom-2.5 left-2.5 rounded-full bg-background/80 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-foreground/85 capitalize backdrop-blur">
          {product.material}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 leading-snug font-medium">
          {/* Stretched link: the whole card is clickable */}
          <Link
            href={`/painting-options/${product.sku}`}
            className="outline-none after:absolute after:inset-0 after:content-['']"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">SKU {product.sku}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <span className="text-lg font-semibold text-primary">
            {product.price !== null ? formatPrice(product.price) : "Price TBD"}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100 group-has-[a:focus-visible]:opacity-100">
            Customize
            <ArrowRight className="size-3.5" aria-hidden />
          </span>
        </div>
      </div>
    </li>
  );
}
