import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getCatalog } from "@/lib/catalog";
import { listPremadeProducts } from "@/lib/premade";
import { PAINTING_FEE } from "@/lib/pricing";

const MAX_CART_ITEMS = 50;

// What the browser tells us about each cart item. Names and prices sent by the
// browser are ignored: everything billable is looked up on the server.
interface CheckoutItem {
  sku: string;
  name: string;
  premade: boolean;
  wantsPainting: boolean;
  colors: Record<"hairColor" | "skinColor" | "accessoryColor" | "fabricColor", string>;
  specificDetails: string;
}

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

function truncate(text: string, maxLength: number) {
  return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
}

function parseCartItem(raw: unknown): CheckoutItem | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { product, paintingOptions, wantsPainting } = raw as {
    product?: { sku?: unknown; name?: unknown; material?: unknown };
    paintingOptions?: Record<string, unknown>;
    wantsPainting?: unknown;
  };
  if (typeof product?.sku !== "string" || product.sku === "") return null;

  const premade = product.material === "prepainted";
  const painted = !premade && wantsPainting !== false;
  const color = (value: unknown) =>
    painted && typeof value === "string" && HEX_COLOR.test(value) ? value : "N/A";
  const details = paintingOptions?.specificDetails;

  return {
    sku: product.sku,
    name: typeof product.name === "string" ? product.name : product.sku,
    premade,
    wantsPainting: painted,
    colors: {
      hairColor: color(paintingOptions?.hairColor),
      skinColor: color(paintingOptions?.skinColor),
      accessoryColor: color(paintingOptions?.accessoryColor),
      fabricColor: color(paintingOptions?.fabricColor),
    },
    specificDetails:
      painted && typeof details === "string" && details.trim() !== ""
        ? truncate(details.trim(), 490)
        : "None",
  };
}

function httpsImage(image: string | null | undefined, origin: string) {
  if (!image) return undefined;
  try {
    const url = new URL(image, origin);
    // Stripe only accepts publicly reachable HTTPS images
    return url.protocol === "https:" ? [url.toString()] : undefined;
  } catch {
    return undefined;
  }
}

function unavailable(message: string) {
  return NextResponse.json({ error: message }, { status: 409 });
}

export async function POST(req: NextRequest) {
  let cartItems: unknown;
  try {
    ({ cartItems } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }
  if (cartItems.length > MAX_CART_ITEMS) {
    return NextResponse.json(
      { error: `Checkout is limited to ${MAX_CART_ITEMS} items per order` },
      { status: 400 }
    );
  }

  const items = cartItems.map(parseCartItem);
  if (items.some((item) => item === null)) {
    return NextResponse.json({ error: "Your cart contains an invalid item" }, { status: 400 });
  }

  try {
    const origin = req.nextUrl.origin;
    const hasPremade = items.some((item) => item!.premade);
    const hasCustom = items.some((item) => !item!.premade);
    const [premadeProducts, catalog] = await Promise.all([
      hasPremade ? listPremadeProducts() : [],
      hasCustom ? getCatalog() : [],
    ]);

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const premadeInCart = new Set<string>();
    let paintedCount = 0;

    for (const item of items as CheckoutItem[]) {
      if (item.premade) {
        const product = premadeProducts.find((p) => p.sku === item.sku);
        if (!product) {
          return unavailable(
            `"${item.name}" has already sold. Remove it from your cart to continue.`
          );
        }
        if (premadeInCart.has(product.sku)) {
          return unavailable(
            `"${product.name}" is one-of-a-kind. Remove the extra copy from your cart to continue.`
          );
        }
        premadeInCart.add(product.sku);

        lineItems.push({
          price_data: {
            currency: "usd",
            unit_amount: Math.round(product.price * 100),
            product_data: {
              name: product.name,
              description: `SKU: ${product.sku}`,
              images: httpsImage(product.image, origin),
              metadata: {
                sku: product.sku,
                material: "prepainted",
                wantsPainting: "false",
                hairColor: "N/A",
                skinColor: "N/A",
                accessoryColor: "N/A",
                fabricColor: "N/A",
                specificDetails: "Premade - Already Painted",
              },
            },
          },
          quantity: 1,
        });
        continue;
      }

      const product = catalog.find((p) => p.sku === item.sku);
      if (!product || product.price === null) {
        return unavailable(
          `"${item.name}" is no longer available. Remove it from your cart to continue.`
        );
      }

      if (item.wantsPainting) paintedCount++;
      lineItems.push({
        price_data: {
          currency: "usd",
          unit_amount: Math.round(product.price * 100),
          product_data: {
            name: product.name,
            description: `SKU: ${product.sku}`,
            images: httpsImage(product.image, origin),
            metadata: {
              sku: product.sku,
              material: product.material,
              wantsPainting: String(item.wantsPainting),
              ...item.colors,
              specificDetails: item.specificDetails,
            },
          },
        },
        quantity: 1,
      });
    }

    if (paintedCount > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          unit_amount: PAINTING_FEE * 100,
          product_data: {
            name: "Custom Painting Service",
            description: "Professional custom painting for your miniature",
          },
        },
        quantity: paintedCount,
      });
    }

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      metadata: {
        itemCount: items.length.toString(),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "We couldn't start checkout. Please try again in a moment." },
      { status: 500 }
    );
  }
}
