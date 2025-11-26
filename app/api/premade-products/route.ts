import { NextResponse } from "next/server";
import { getPremadeProducts, type PremadeProduct } from "@/lib/db";

// Fallback products in case database is not configured
const fallbackProducts: PremadeProduct[] = [
  {
    id: 1,
    name: "Human Fighter",
    price: 20,
    originalPrice: 30,
    image: "/fighterfront.jpeg",
    description: "Metal",
    sku: "1234567",
  },
  {
    id: 2,
    name: "Premium Product 2",
    price: 79.99,
    originalPrice: 120,
    image: "https://via.placeholder.com/300x300",
    description: "Best seller with excellent reviews",
    sku: "PREMADE-002",
  },
  {
    id: 3,
    name: "Premium Product 3",
    price: 130,
    originalPrice: 200,
    image: "https://via.placeholder.com/300x300",
    description: "Limited edition exclusive item",
    sku: "PREMADE-003",
  },
  {
    id: 4,
    name: "Premium Product 4",
    price: 59.99,
    originalPrice: 89.99,
    image: "https://via.placeholder.com/300x300",
    description: "Great value for money",
    sku: "PREMADE-004",
  },
   {
    id: 5,
    name: "Premium Product 5",
    price: 59.99,
    originalPrice: 89.99,
    image: "https://via.placeholder.com/300x300",
    description: "Great value for money",
    sku: "PREMADE-005",
  },
   {
    id: 6,
    name: "Premium Product 6",
    price: 59.99,
    originalPrice: 89.99,
    image: "https://via.placeholder.com/300x300",
    description: "Great value for money",
    sku: "PREMADE-006",
  },
   {
    id: 7,
    name: "Premium Product 7",
    price: 59.99,
    originalPrice: 89.99,
    image: "https://via.placeholder.com/300x300",
    description: "Great value for money",
    sku: "PREMADE-007",
  },
];

export async function GET() {
  try {
    // Try to get products from database
    const products = await getPremadeProducts();
    
    // If database has products, return them
    if (products.length > 0) {
      return NextResponse.json(products);
    }
    
    // Otherwise, return fallback products
    console.log("No products in database, using fallback products");
    return NextResponse.json(fallbackProducts);
  } catch (error) {
    // If database fails, return fallback products
    console.error("Database error, using fallback products:", error);
    return NextResponse.json(fallbackProducts);
  }
}
