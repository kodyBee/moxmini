import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createPremadeProduct, getPremadeProducts } from "@/lib/db";

// Seed initial products (only if database is empty)
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if products already exist
    const existingProducts = await getPremadeProducts();
    if (existingProducts.length > 0) {
      return NextResponse.json({
        message: "Products already exist in database",
        count: existingProducts.length,
      });
    }

    // Seed initial products
    const initialProducts = [
      {
        name: "Human Fighter",
        price: 20,
        originalPrice: 30,
        image: "/fighterfront.jpeg",
        description: "Pre-painted metal miniature. Perfect for tabletop gaming.",
        sku: "1234567",
      },
      {
        name: "Dwarf Warrior",
        price: 79.99,
        originalPrice: 120,
        image: "https://via.placeholder.com/300x300",
        description: "Best seller with excellent reviews. Highly detailed dwarf warrior ready for battle.",
        sku: "PREMADE-002",
      },
      {
        name: "Elven Archer",
        price: 130,
        originalPrice: 200,
        image: "https://via.placeholder.com/300x300",
        description: "Limited edition exclusive item. Masterfully painted elven archer.",
        sku: "PREMADE-003",
      },
    ];

    for (const product of initialProducts) {
      await createPremadeProduct(product);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${initialProducts.length} products`,
      count: initialProducts.length,
    });
  } catch (error) {
    console.error("Error seeding products:", error);
    return NextResponse.json(
      { error: "Failed to seed products" },
      { status: 500 }
    );
  }
}
