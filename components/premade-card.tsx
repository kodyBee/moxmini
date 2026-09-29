import Image from "next/image";
import { AddPremadeButton } from "@/components/add-premade-button";
import type { PremadeProduct } from "@/lib/db";
import { formatPrice } from "@/lib/pricing";

// Photos uploaded through the admin live in Vercel Blob; anything else is
// shown as-is rather than routed through the image optimizer.
function isOptimizable(src: string) {
  if (src.startsWith("/")) return true;
  try {
    return new URL(src).hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export function PremadeCard({
  product,
  priority,
}: {
  product: PremadeProduct;
  priority?: boolean;
}) {
  const savings = product.originalPrice - product.price;
  const percentOff =
    product.originalPrice > 0
      ? Math.round((savings / product.originalPrice) * 100)
      : 0;

  return (
    <article className="group surface flex flex-col overflow-hidden transition-colors hover:border-primary/40">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          unoptimized={!isOptimizable(product.image)}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute top-3 left-3 rounded-full bg-background/80 px-3 py-1 text-[11px] font-semibold tracking-wider text-primary uppercase backdrop-blur">
          One of a kind
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-2xl leading-tight font-semibold">
          {product.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-4 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="text-2xl font-semibold text-primary">
            {formatPrice(product.price)}
          </span>
          {savings > 0 && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">
                Save {percentOff}%
              </span>
            </>
          )}
        </div>
        <div className="mt-auto pt-5">
          <AddPremadeButton product={product} />
        </div>
      </div>
    </article>
  );
}
