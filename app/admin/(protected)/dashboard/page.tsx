import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/auth";
import {
  ensureDatabase,
  getOrders,
  isDatabaseConfigured,
  type OrderItem,
} from "@/lib/db";
import { OrdersBoard } from "./orders-board";

export const metadata: Metadata = {
  title: "Orders",
};

export default async function DashboardPage() {
  await requireAdminPage();

  let orders: OrderItem[] = [];
  let problem: string | null = null;

  if (!isDatabaseConfigured()) {
    problem =
      "The database isn't configured. Set POSTGRES_URL to start receiving orders here.";
  } else {
    try {
      await ensureDatabase();
      orders = await getOrders();
    } catch (error) {
      console.error("Error loading orders:", error);
      problem =
        "Couldn't load orders from the database. Try refreshing in a moment.";
    }
  }

  return <OrdersBoard orders={orders} problem={problem} />;
}
