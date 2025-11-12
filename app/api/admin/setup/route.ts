import { NextResponse } from "next/server";
import { initDatabase } from "@/lib/db";

// One-time setup endpoint to initialize database tables
// Visit: https://your-app.vercel.app/api/admin/setup
export async function GET() {
  try {
    console.log("Initializing database schema...");
    await initDatabase();
    
    return NextResponse.json({ 
      success: true, 
      message: "Database initialized successfully! Tables created." 
    });
  } catch (error) {
    console.error("Database initialization error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to initialize database",
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}
