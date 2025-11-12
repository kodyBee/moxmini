import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

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
      console.log("New orders received:", orders);

      // Store orders in the admin API
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 
                      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
        
        await fetch(`${apiUrl}/api/admin/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orders }),
        });
      } catch (error) {
        console.error("Failed to store orders:", error);
        // Continue anyway - webhook still succeeded
      }

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
