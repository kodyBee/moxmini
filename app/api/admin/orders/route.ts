import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getOrders,
  updateOrderCompletion,
  deleteOrder as dbDeleteOrder,
  ensureDatabase,
  isDatabaseConfigured,
} from "@/lib/db";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    // Check if database is configured
    if (!isDatabaseConfigured()) {
      console.warn("POSTGRES_URL not configured, returning empty orders");
      return NextResponse.json({
        orders: [],
        warning: "Database not configured. Please set POSTGRES_URL environment variable."
      });
    }

    await ensureDatabase();
    const orders = await getOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { orders: [], error: "Database error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

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
  const denied = await requireAdmin();
  if (denied) return denied;

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
