import "server-only";
import { getPremadeProducts, type PremadeProduct } from "@/lib/db";

// Shown only in local development when no database is configured
const DEMO_PRODUCTS: PremadeProduct[] = [
  {
    id: 1,
    name: "Human Fighter",
    price: 20,
    originalPrice: 30,
    image: "/fighterfront.jpeg",
    description: "Metal",
    sku: "1234567",
  },
];

/**
 * The prepainted miniatures currently for sale. Each one is one-of-a-kind and
 * is removed by the Stripe webhook once it sells.
 */
export async function listPremadeProducts(): Promise<PremadeProduct[]> {
  if (!process.env.POSTGRES_URL) {
    return DEMO_PRODUCTS;
  }
  return getPremadeProducts();
}
