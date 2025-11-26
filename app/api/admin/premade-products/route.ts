import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getPremadeProducts,
  createPremadeProduct,
  updatePremadeProduct,
  deletePremadeProduct,
} from "@/lib/db";

// GET - Fetch all premade products
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await getPremadeProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching premade products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - Create a new premade product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, price, originalPrice, image, description, sku } = body;

    // Validate required fields
    if (!name || !price || !originalPrice || !image || !description || !sku) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const product = await createPremadeProduct({
      name,
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice),
      image,
      description,
      sku,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating premade product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

// PATCH - Update an existing premade product
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Convert price fields to numbers if they exist
    if (updates.price !== undefined) {
      updates.price = parseFloat(updates.price);
    }
    if (updates.originalPrice !== undefined) {
      updates.originalPrice = parseFloat(updates.originalPrice);
    }

    await updatePremadeProduct(parseInt(id), updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating premade product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a premade product
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await deletePremadeProduct(parseInt(id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting premade product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
