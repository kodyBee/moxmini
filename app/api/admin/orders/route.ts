import { NextRequest, NextResponse } from "next/server";
import {
  getOrders,
  storeOrders as dbStoreOrders,
  updateOrderCompletion,
  deleteOrder as dbDeleteOrder,
  initDatabase,
  type OrderItem,
} from "@/lib/db";

// Initialize database on first load
let dbInitialized = false;
async function ensureDatabase() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

// Helper function to store orders (can be called from webhook)
export async function storeOrders(newOrders: OrderItem[]) {
  await ensureDatabase();
  await dbStoreOrders(newOrders);
  console.log("Orders stored in database, count:", newOrders.length);
}

export async function GET() {
  try {
    await ensureDatabase();
    const orders = await getOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ orders: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { orders: newOrders } = (await req.json()) as { orders: OrderItem[] };

    if (newOrders && Array.isArray(newOrders)) {
      await ensureDatabase();
      await dbStoreOrders(newOrders);
      return NextResponse.json({ success: true, count: newOrders.length });
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

export async function PATCH(req: NextRequest) {
  try {
    await ensureDatabase();
    const { orderId, completed } = (await req.json()) as {
      orderId: string;
      completed: boolean;
    };

    await updateOrderCompletion(orderId, completed);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureDatabase();
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    await dbDeleteOrder(orderId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
