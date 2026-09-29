"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Paintbrush, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart, type PaintingOptions } from "@/lib/cart";
import { PAINTING_FEE, formatPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";

type ColorKey = Exclude<keyof PaintingOptions, "specificDetails">;

const COLOR_FIELDS: Array<{ key: ColorKey; label: string; initial: string }> = [
  { key: "hairColor", label: "Hair", initial: "#8b4513" },
  { key: "skinColor", label: "Skin", initial: "#ffdab9" },
  { key: "accessoryColor", label: "Accessories", initial: "#c0c0c0" },
  { key: "fabricColor", label: "Fabric", initial: "#4169e1" },
];

// Stripe metadata allows 500 characters; checkout keeps 490 of them
const MAX_NOTES = 490;

export function PaintingForm({
  product,
}: {
  product: {
    sku: string;
    name: string;
    price: number | null;
    image: string | null;
    material: string;
  };
}) {
  const router = useRouter();
  const [wantsPainting, setWantsPainting] = useState(true);
  const [colors, setColors] = useState(
    () =>
      Object.fromEntries(COLOR_FIELDS.map((f) => [f.key, f.initial])) as Record<
        ColorKey,
        string
      >
  );
  const [notes, setNotes] = useState("");

  if (product.price === null) {
    return (
      <p className="surface mt-8 p-6 text-muted-foreground">
        This figure isn&apos;t available to order right now. Please pick another
        from the Figure Finder.
      </p>
    );
  }

  const price = product.price;
  const total = price + (wantsPainting ? PAINTING_FEE : 0);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addToCart({
      product: {
        sku: product.sku,
        name: product.name,
        price: price.toString(),
        images: product.image ? [{ URL: product.image }] : [],
        material: product.material,
      },
      paintingOptions: wantsPainting
        ? { ...colors, specificDetails: notes.trim() }
        : {
            hairColor: "",
            skinColor: "",
            accessoryColor: "",
            fabricColor: "",
            specificDetails: "Unpainted miniature - no custom painting service",
          },
      wantsPainting,
    });
    router.push("/cart");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {/* Painting service toggle */}
      <label
        className={cn(
          "flex items-start gap-4 rounded-2xl border p-5 transition-colors",
          wantsPainting
            ? "border-primary/50 bg-primary/[0.07]"
            : "border-border bg-card"
        )}
      >
        <span className="mt-0.5 hidden size-11 shrink-0 place-items-center rounded-full bg-primary/15 text-primary sm:grid">
          <Paintbrush className="size-5" aria-hidden />
        </span>
        <span className="flex-1">
          <span className="font-semibold">
            Custom painting by Mox{" "}
            <span className="whitespace-nowrap text-primary">
              +{formatPrice(PAINTING_FEE, { cents: false })}
            </span>
          </span>
          <span className="mt-1 block text-sm text-muted-foreground">
            {wantsPainting
              ? "Your miniature will be hand-painted with the colors you choose below."
              : "Turn on to have your miniature hand-painted in your colors."}
          </span>
        </span>
        <input
          type="checkbox"
          role="switch"
          checked={wantsPainting}
          onChange={(event) => setWantsPainting(event.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className="relative mt-2.5 h-6 w-11 shrink-0 rounded-full bg-foreground/20 transition-colors peer-checked:bg-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-foreground after:shadow after:transition-transform peer-checked:after:translate-x-5 peer-checked:after:bg-primary-foreground"
        />
      </label>

      {wantsPainting ? (
        <>
          <fieldset>
            <legend className="font-display text-2xl font-semibold">
              Choose your colors
            </legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {COLOR_FIELDS.map((field) => (
                <label
                  key={field.key}
                  className="surface flex items-center gap-4 p-3.5 transition-colors hover:border-foreground/25 has-[:focus-visible]:border-primary"
                >
                  <input
                    type="color"
                    value={colors[field.key]}
                    onChange={(event) =>
                      setColors((current) => ({
                        ...current,
                        [field.key]: event.target.value,
                      }))
                    }
                    className="size-12 shrink-0 rounded-full ring-2 ring-foreground/20 ring-offset-2 ring-offset-card outline-none"
                  />
                  <span className="min-w-0">
                    <span className="block font-medium">{field.label}</span>
                    <span className="block font-mono text-xs text-muted-foreground uppercase">
                      {colors[field.key]}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="font-display text-2xl font-semibold">
              Notes for the artist
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">
              Optional: weathering, battle damage, glowing eyes, a favorite
              shading style…
            </span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              maxLength={MAX_NOTES}
              rows={5}
              className="mt-3 w-full resize-y rounded-xl border border-input bg-background/60 px-4 py-3 text-sm transition-colors placeholder:text-muted-foreground/70 hover:border-foreground/30 focus-visible:border-primary"
              placeholder="e.g. Give the cloak a worn, muddy hem and make the sword look enchanted."
            />
            <span className="mt-1 block text-right text-xs text-muted-foreground">
              {notes.length}/{MAX_NOTES}
            </span>
          </label>
        </>
      ) : (
        <p className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">
          You&apos;ll receive an unpainted miniature. You can paint it yourself
          or leave it as is.
        </p>
      )}

      {/* Summary */}
      <div className="surface p-5">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Miniature</dt>
            <dd>{formatPrice(price)}</dd>
          </div>
          {wantsPainting && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Custom painting</dt>
              <dd>{formatPrice(PAINTING_FEE)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd className="text-primary">{formatPrice(total)}</dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row">
          <Button
            type="button"
            variant="ghost"
            className="sm:flex-1"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" size="lg" className="sm:flex-[2]">
            <ShoppingBag aria-hidden />
            Add to cart
          </Button>
        </div>
      </div>
    </form>
  );
}
