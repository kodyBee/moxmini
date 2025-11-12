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
      console.error("Webhook error: No signature provided");
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log(`✅ Webhook verified: ${event.type}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error("❌ Webhook signature verification failed:", errorMessage);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`Processing checkout session: ${session.id}`);

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
      console.log(`📦 New orders received from webhook (${orders.length} items):`, 
        JSON.stringify(orders.map(o => ({ 
          id: o.id, 
          product: o.productName, 
          email: o.customerEmail 
        })), null, 2)
      );

      // Store orders in database
      try {
        const { storeOrders } = await import("@/app/api/admin/orders/route");
        await storeOrders(orders);
        console.log(`✅ Successfully stored ${orders.length} orders in database`);
      } catch (dbError) {
        const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown error';
        console.error("❌ Database error storing orders:", errorMessage);
        // Still return 200 to Stripe to prevent retries, but log the error
        return NextResponse.json({ 
          received: true, 
          warning: "Order received but database storage failed",
          error: errorMessage
        });
      }

      // Return success
      return NextResponse.json({ 
        received: true, 
        orderCount: orders.length,
        message: "Webhook processed successfully" 
      });
    }

    // Return success for other event types
    console.log(`ℹ️ Received ${event.type} event (not processed)`);
    return NextResponse.json({ received: true, type: event.type });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("❌ Webhook handler error:", errorMessage);
    if (errorStack) {
      console.error("Stack trace:", errorStack);
    }
    return NextResponse.json(
      { error: "Webhook handler failed", details: errorMessage },
      { status: 500 }
    );
  }
}
