"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  ImageOff,
  LoaderCircle,
  Lock,
  Paintbrush,
  Pencil,
  Sparkles,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  cartTotals,
  clearCart,
  isPrepainted,
  itemPrice,
  removeFromCart,
  updatePaintingOptions,
  useCart,
  wantsCustomPainting,
  type CartItem,
  type PaintingOptions,
} from "@/lib/cart";
import { PAINTING_FEE, formatPrice } from "@/lib/pricing";

const COLOR_LABELS: Array<
  [Exclude<keyof PaintingOptions, "specificDetails">, string]
> = [
  ["hairColor", "Hair"],
  ["skinColor", "Skin"],
  ["accessoryColor", "Accessories"],
  ["fabricColor", "Fabric"],
];

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

function ItemBadge({ item }: { item: CartItem }) {
  if (isPrepainted(item)) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-accent/25 px-2.5 py-0.5 text-xs font-medium text-[oklch(0.85_0.08_305)]">
        <Sparkles className="size-3" aria-hidden />
        Prepainted
      </span>
    );
  }
  if (wantsCustomPainting(item)) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
        <Paintbrush className="size-3" aria-hidden />
        Custom painting +{formatPrice(PAINTING_FEE, { cents: false })}
      </span>
    );
  }
  return (
    <span className="rounded-full bg-foreground/10 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      Unpainted
    </span>
  );
}

function PaintingDetails({ item }: { item: CartItem }) {
  const [editing, setEditing] = useState(false);
  const options = item.paintingOptions;

  return (
    <div className="mt-4 rounded-xl bg-background/50 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium">Painting details</h3>
        <button
          type="button"
          onClick={() => setEditing(!editing)}
          aria-expanded={editing}
          className="inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-primary hover:underline"
        >
          <Pencil className="size-3.5" aria-hidden />
          {editing ? "Done" : "Edit"}
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-4">
        {COLOR_LABELS.map(([key, label]) => {
          const value = options[key];
          const valid = HEX_COLOR.test(value);
          return (
            <div key={key} className="flex items-center gap-2.5">
              {editing ? (
                <input
                  type="color"
                  aria-label={`${label} color`}
                  value={valid ? value : "#000000"}
                  onChange={(event) =>
                    updatePaintingOptions(item.id, {
                      [key]: event.target.value,
                    })
                  }
                  className="size-8 shrink-0 rounded-full ring-2 ring-foreground/25 ring-offset-2 ring-offset-card"
                />
              ) : (
                <span
                  className="size-6 shrink-0 rounded-full ring-1 ring-foreground/25"
                  style={{ backgroundColor: valid ? value : "transparent" }}
                />
              )}
              <span className="min-w-0 text-xs">
                <span className="block text-muted-foreground">{label}</span>
                <span className="block font-mono uppercase">
                  {valid ? value : "—"}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 border-t border-border pt-3 text-sm">
        <span className="text-xs text-muted-foreground">
          Notes for the artist
        </span>
        {editing ? (
          <textarea
            value={options.specificDetails}
            onChange={(event) =>
              updatePaintingOptions(item.id, {
                specificDetails: event.target.value,
              })
            }
            maxLength={490}
            rows={3}
            aria-label="Notes for the artist"
            placeholder="Any specific instructions for the artist…"
            className="mt-1.5 w-full resize-y rounded-lg border border-input bg-background/60 px-3 py-2 text-sm focus-visible:border-primary"
          />
        ) : (
          <p className="mt-0.5 break-words text-foreground/85">
            {options.specificDetails || "No special instructions"}
          </p>
        )}
      </div>
    </div>
  );
}

function CartLine({ item }: { item: CartItem }) {
  const image = item.product.images?.[0]?.URL;

  return (
    <li className="surface flex gap-4 p-4 sm:gap-5 sm:p-5">
      <div
        className={
          isPrepainted(item)
            ? "relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-28"
            : "relative size-24 shrink-0 overflow-hidden rounded-xl bg-stage sm:size-28"
        }
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- mix of local, Blob and Reaper images
          <img
            src={image}
            alt=""
            className={
              isPrepainted(item)
                ? "size-full object-cover"
                : "size-full object-contain p-1.5 mix-blend-multiply"
            }
          />
        ) : (
          <span className="grid size-full place-items-center text-stone-500">
            <ImageOff className="size-5" aria-hidden />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="font-display text-xl leading-tight font-semibold break-words sm:text-2xl">
              {item.product.name}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              SKU {item.product.sku}
            </p>
            <div className="mt-2">
              <ItemBadge item={item} />
            </div>
          </div>
          <div className="shrink-0 sm:text-right">
            <p className="text-lg font-semibold text-primary">
              {formatPrice(itemPrice(item))}
            </p>
          </div>
        </div>

        {wantsCustomPainting(item) ? (
          <PaintingDetails item={item} />
        ) : isPrepainted(item) ? (
          item.product.description && (
            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
              {item.product.description}
            </p>
          )
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Delivered unpainted, with no custom painting service.
          </p>
        )}

        <Button
          variant="destructive"
          size="sm"
          className="mt-3 -ml-3"
          onClick={() => removeFromCart(item.id)}
        >
          <Trash2 aria-hidden />
          Remove
        </Button>
      </div>
    </li>
  );
}

function CartSkeleton() {
  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem]" aria-busy>
      <p className="sr-only" role="status">
        Loading your cart…
      </p>
      <div className="space-y-4">
        {[0, 1].map((i) => (
          <div key={i} className="surface h-40 animate-pulse" />
        ))}
      </div>
      <div className="surface h-72 animate-pulse" />
    </div>
  );
}

export function CartView() {
  const items = useCart();
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  if (items === null) return <CartSkeleton />;

  if (items.length === 0) {
    return (
      <div className="surface mt-10 px-6 py-16 text-center">
        <p className="font-display text-3xl font-semibold">
          Your cart is empty
        </p>
        <p className="mt-2 text-muted-foreground">
          You haven&apos;t added any miniatures yet. Find one to paint, or pick
          a finished piece.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/figurefinder">
              Browse miniatures
              <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/premade">Shop prepainted</Link>
          </Button>
        </div>
      </div>
    );
  }

  const totals = cartTotals(items);

  const checkout = async () => {
    setStatus("loading");
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: items }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.url) {
        throw new Error(
          data.error || "We couldn't start checkout. Please try again."
        );
      }
      window.location.assign(data.url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't start checkout. Please try again."
      );
      setStatus("idle");
    }
  };

  return (
    <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
      <section aria-label="Cart items">
        <p className="mb-4 text-sm text-muted-foreground">
          {items.length} item{items.length === 1 ? "" : "s"}
        </p>
        <ul className="space-y-4">
          {items.map((item) => (
            <CartLine key={item.id} item={item} />
          ))}
        </ul>
      </section>

      <aside
        aria-labelledby="summary-heading"
        className="surface p-6 lg:sticky lg:top-24"
      >
        <h2
          id="summary-heading"
          className="font-display text-2xl font-semibold"
        >
          Order summary
        </h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Miniatures</dt>
            <dd>{formatPrice(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">
              Custom painting
              {totals.paintedCount > 0 && (
                <span className="block text-xs">
                  {totals.paintedCount} × {formatPrice(PAINTING_FEE)}
                </span>
              )}
            </dt>
            <dd>{formatPrice(totals.painting)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd className="text-muted-foreground">Calculated at checkout</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-border pt-4 text-lg font-semibold">
            <dt>Total</dt>
            <dd className="text-primary">{formatPrice(totals.total)}</dd>
          </div>
        </dl>

        {error && (
          <p
            role="alert"
            className="mt-5 flex gap-2.5 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-[oklch(0.85_0.08_25)]"
          >
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            {error}
          </p>
        )}

        <Button
          size="lg"
          className="mt-6 w-full"
          onClick={checkout}
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <>
              <LoaderCircle className="animate-spin" aria-hidden />
              Starting checkout…
            </>
          ) : (
            <>
              <CreditCard aria-hidden />
              Checkout
            </>
          )}
        </Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3" aria-hidden />
          Secure payment with Stripe
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-5 text-sm">
          <Link
            href="/figurefinder"
            className="font-medium text-primary hover:underline"
          >
            Continue shopping
          </Link>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Remove everything from your cart?"))
                clearCart();
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear cart
          </button>
        </div>
      </aside>
    </div>
  );
}
