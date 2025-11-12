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

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
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

      // Get image URL - only include if it's a valid external HTTPS URL
      let imageUrl: string | undefined = undefined;
      const rawImageUrl = item.product.images?.[0]?.URL;
      
      if (rawImageUrl) {
        // Only include if it's already an absolute HTTPS URL (not relative paths)
        // Stripe requires publicly accessible HTTPS URLs
        if (rawImageUrl.startsWith('https://')) {
          imageUrl = rawImageUrl;
          console.log('Using image URL:', imageUrl);
        } else {
          console.log('Skipping non-HTTPS image URL:', rawImageUrl);
        }
      }

      const productData: {
        name: string;
        description: string;
        images?: string[];
        metadata: Record<string, string>;
      } = {
        name: item.product.name,
        description: `SKU: ${item.product.sku}`,
        metadata: {
          sku: item.product.sku,
          hairColor: truncateText(item.paintingOptions.hairColor || "N/A", 100),
          skinColor: truncateText(item.paintingOptions.skinColor || "N/A", 100),
          accessoryColor: truncateText(item.paintingOptions.accessoryColor || "N/A", 100),
          fabricColor: truncateText(item.paintingOptions.fabricColor || "N/A", 100),
          specificDetails: truncateText(item.paintingOptions.specificDetails || "None", 490),
        },
      };

      // Only add images array if we have a valid URL
      if (imageUrl) {
        productData.images = [imageUrl];
      }

      return {
        price_data: {
          currency: "usd",
          product_data: productData,
          unit_amount: priceInCents,
        },
        quantity: 1,
      };
    });

    // Add $25 custom painting service charge for each item
    const paintingServiceItems = cartItems.map(() => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Custom Painting Service",
          description: "Professional custom painting for your miniature",
        },
        unit_amount: 2500, // $25.00
      },
      quantity: 1,
    }));

    // Combine miniature products and painting services
    const allLineItems = [...lineItems, ...paintingServiceItems];

    // Create Checkout Session with shipping address collection
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: allLineItems,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US", "CA"], // Add more countries as needed
      },
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
