import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { initDatabase } from "@/lib/db";

// Adds any columns an older database is missing (safe to run repeatedly)
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    await initDatabase();

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
