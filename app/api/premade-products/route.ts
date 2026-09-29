import { NextResponse } from "next/server";
import { listPremadeProducts } from "@/lib/premade";

export async function GET() {
  try {
    return NextResponse.json(await listPremadeProducts());
  } catch (error) {
    console.error("Error fetching premade products:", error);
    return NextResponse.json([]);
  }
}
