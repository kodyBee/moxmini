import { NextResponse } from "next/server";

export interface PremadeProduct {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  sku: string;
}

const products: PremadeProduct[] = [
  {
    id: 1,
    name: "Human Fighter",
    price: 30,
    originalPrice: 50,
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
    sku: "PREMADE-004",
  },
   {
    id: 6,
    name: "Premium Product 6",
    price: 59.99,
    originalPrice: 89.99,
    image: "https://via.placeholder.com/300x300",
    description: "Great value for money",
    sku: "PREMADE-004",
  },
   {
    id: 7,
    name: "Premium Product 7",
    price: 59.99,
    originalPrice: 89.99,
    image: "https://via.placeholder.com/300x300",
    description: "Great value for money",
    sku: "PREMADE-004",
  },
];

export async function GET() {
  return NextResponse.json(products);
}
