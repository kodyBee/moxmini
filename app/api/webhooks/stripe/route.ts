import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import {
  deletePremadeProductBySku,
  ensureDatabase,
  storeOrders,
  type OrderItem,
} from "@/lib/db";
import { revalidatePremadePages } from "@/lib/premade";

function getShippingAddress(
  session: Stripe.Checkout.Session
): OrderItem["shippingAddress"] {
  // With shipping_address_collection, the shipping address lives on
  // collected_information. customer_details.address is the billing address,
  // used only as a fallback.
  const shipping = session.collected_information?.shipping_details;
  const name = shipping?.name ?? session.customer_details?.name ?? "";
  const address = shipping?.address ?? session.customer_details?.address;
  if (!address) return undefined;

  return {
    name,
    address: {
      line1: address.line1 || "",
      line2: address.line2 || undefined,
      city: address.city || "",
      state: address.state || "",
      postal_code: address.postal_code || "",
      country: address.country || "",
    },
  };
}

async function fulfillCheckout(sessionId: string) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status === "unpaid") {
    console.log(
      `Checkout ${session.id} is not paid yet, waiting for async payment`
    );
    return { orderCount: 0 };
  }

  const shippingAddress = getShippingAddress(session);
  if (!shippingAddress) {
    console.warn(`No shipping address found for session ${session.id}`);
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ["data.price.product"],
    limit: 100,
  });

  const miniatures = lineItems.data
    .map((item) => ({ item, product: item.price?.product as Stripe.Product }))
    .filter(({ product }) => product.name !== "Custom Painting Service");

  const orders: OrderItem[] = miniatures.map(({ item, product }) => {
    const metadata = product.metadata || {};
    return {
      id: `${session.id}-${item.id}`,
      orderId: session.id,
      customerEmail: session.customer_details?.email || "No email",
      productName: product.name || item.description || "Unknown Product",
      sku: metadata.sku || "N/A",
      paintingOptions: {
        hairColor: metadata.hairColor || "N/A",
        skinColor: metadata.skinColor || "N/A",
        accessoryColor: metadata.accessoryColor || "N/A",
        fabricColor: metadata.fabricColor || "N/A",
        specificDetails: metadata.specificDetails || "None",
      },
      shippingAddress,
      timestamp: Date.now(),
      completed: false,
      price: ((item.amount_total || 0) / 100).toFixed(2),
    };
  });

  await ensureDatabase();
  await storeOrders(orders);
  console.log(
    `Stored ${orders.length} order item(s) for checkout ${session.id}`
  );

  // Prepainted pieces are one-of-a-kind: take them off the shelf once sold
  let soldPremade = false;
  for (const { product } of miniatures) {
    const sku = product.metadata?.sku;
    if (product.metadata?.material === "prepainted" && sku) {
      try {
        soldPremade = (await deletePremadeProductBySku(sku)) || soldPremade;
      } catch (error) {
        console.error(`Failed to remove sold premade product ${sku}:`, error);
      }
    }
  }
  if (soldPremade) revalidatePremadePages();

  return { orderCount: orders.length };
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return NextResponse.json({ received: true, type: event.type });
  }

  try {
    const { orderCount } = await fulfillCheckout(event.data.object.id);
    return NextResponse.json({ received: true, orderCount });
  } catch (error) {
    // A 500 makes Stripe retry later; storing orders is idempotent
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
