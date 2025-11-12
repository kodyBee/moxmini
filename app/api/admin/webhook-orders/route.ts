import { NextRequest, NextResponse } from "next/server";

interface OrderItem {
  id: string;
  orderId: string;
  customerEmail: string;
  productName: string;
  sku: string;
  paintingOptions: {
    hairColor: string;
    skinColor: string;
    accessoryColor: string;
    fabricColor: string;
    specificDetails: string;
  };
  timestamp: number;
  completed: boolean;
  price: string;
}

// Store orders in a way that persists
let pendingOrders: OrderItem[] = [];

export async function POST(req: NextRequest) {
  try {
    const { orders: newOrders } = await req.json() as { orders: OrderItem[] };
    
    if (newOrders && Array.isArray(newOrders)) {
      pendingOrders = [...pendingOrders, ...newOrders];
      console.log("Stored webhook orders:", pendingOrders.length);
      return NextResponse.json({ success: true, count: pendingOrders.length });
    }
    
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  } catch (error) {
    console.error("Error storing webhook orders:", error);
    return NextResponse.json(
      { error: "Failed to store orders" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return all pending orders
  const orders = [...pendingOrders];
  return NextResponse.json({ orders });
}

export async function DELETE(req: NextRequest) {
  // Clear orders after they've been fetched
  const url = new URL(req.url);
  const orderId = url.searchParams.get("orderId");
  
  if (orderId) {
    pendingOrders = pendingOrders.filter(o => o.id !== orderId);
  } else {
    pendingOrders = [];
  }
  
  return NextResponse.json({ success: true });
}
