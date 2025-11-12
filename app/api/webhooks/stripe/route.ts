import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Get line items with expanded product data
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ["data.price.product"],
      });

      // Extract order details
      const orders = lineItems.data.map((item) => {
        const product = item.price?.product as Stripe.Product;
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
          timestamp: Date.now(),
          completed: false,
          price: ((item.amount_total || 0) / 100).toFixed(2),
        };
      });

      // Log the orders
      console.log("New orders received from webhook:", JSON.stringify(orders, null, 2));

      // Store orders directly in the shared orders array
      // Note: In production, this should use a database
      console.log("Storing orders in memory:", orders.length);
      
      // Import the orders storage directly
      const { storeOrders } = await import("@/app/api/admin/orders/route");
      storeOrders(orders);
      
      console.log("Orders stored successfully");

      // Return success
      return NextResponse.json({ 
        received: true, 
        orders,
        message: "Webhook processed successfully" 
      });
    }

    // Return success for other event types
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
