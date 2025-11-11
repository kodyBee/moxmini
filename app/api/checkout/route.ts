import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

interface PaintingOptions {
  hairColor?: string;
  skinColor?: string;
  accessoryColor?: string;
  fabricColor?: string;
  specificDetails?: string;
}

interface CartItemProduct {
  name: string;
  sku: string;
  price: string;
  images?: { URL: string }[];
}

interface CartItemInput {
  product: CartItemProduct;
  paintingOptions: PaintingOptions;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: NextRequest) {
  try {
    const { cartItems } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Create line items for Stripe
    const lineItems = cartItems.map((item: CartItemInput) => {
      const price = parseFloat(item.product.price || "0");
      const priceInCents = Math.round(price * 100);

      //shorten shit to specific details to fit Stripe's 500 character limit per metadata value
      const truncateText = (text: string, maxLength: number = 500) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text;
      };

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
            description: `SKU: ${item.product.sku}`,
            images: item.product.images?.[0]?.URL 
              ? [item.product.images[0].URL] 
              : undefined,
            metadata: {
              sku: item.product.sku,
              hairColor: truncateText(item.paintingOptions.hairColor || "N/A", 100),
              skinColor: truncateText(item.paintingOptions.skinColor || "N/A", 100),
              accessoryColor: truncateText(item.paintingOptions.accessoryColor || "N/A", 100),
              fabricColor: truncateText(item.paintingOptions.fabricColor || "N/A", 100),
              specificDetails: truncateText(item.paintingOptions.specificDetails || "None", 490),
            },
          },
          unit_amount: priceInCents,
        },
        quantity: 1,
      };
    });

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/cart`,
      metadata: {
        itemCount: cartItems.length.toString(),
        // Store order details in a way that respects Stripe's 500 char limit per metadata value
        // For detailed order info, you would typically store this in your own database
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
