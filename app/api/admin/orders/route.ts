import { NextRequest, NextResponse } from "next/server";

// In-memory storage for orders (in production, use a database)
let orders: any[] = [];

export async function GET(req: NextRequest) {
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  try {
    const { orders: newOrders } = await req.json();
    
    if (newOrders && Array.isArray(newOrders)) {
      // Add new orders to the list
      orders = [...orders, ...newOrders];
      return NextResponse.json({ success: true, count: orders.length });
    }
    
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  } catch (error) {
    console.error("Error storing orders:", error);
    return NextResponse.json(
      { error: "Failed to store orders" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const updatedOrders = await req.json();
    orders = updatedOrders;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating orders:", error);
    return NextResponse.json(
      { error: "Failed to update orders" },
      { status: 500 }
    );
  }
}
