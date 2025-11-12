import { NextResponse } from "next/server";
import { getOrders } from "@/lib/db";

// Test endpoint to check database connection and orders
// Visit: https://your-app.vercel.app/api/admin/test
export async function GET() {
  try {
    console.log("Testing database connection...");
    
    const orders = await getOrders();
    
    return NextResponse.json({ 
      success: true, 
      message: "Database connection successful",
      orderCount: orders.length,
      orders: orders.slice(0, 3), // Show first 3 orders as sample
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database test error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Database connection failed",
        details: errorMessage,
        hint: "Make sure POSTGRES_URL is configured in Vercel environment variables"
      },
      { status: 500 }
    );
  }
}
