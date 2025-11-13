import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Add shipping columns if they don't exist
    await sql`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS shipping_name TEXT,
      ADD COLUMN IF NOT EXISTS shipping_line1 TEXT,
      ADD COLUMN IF NOT EXISTS shipping_line2 TEXT,
      ADD COLUMN IF NOT EXISTS shipping_city TEXT,
      ADD COLUMN IF NOT EXISTS shipping_state TEXT,
      ADD COLUMN IF NOT EXISTS shipping_postal_code TEXT,
      ADD COLUMN IF NOT EXISTS shipping_country TEXT
    `;

    return NextResponse.json({
      success: true,
      message: "Database migration completed successfully! Shipping columns added.",
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Migration failed",
      },
      { status: 500 }
    );
  }
}
