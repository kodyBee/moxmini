import "server-only";
import { revalidatePath } from "next/cache";
import {
  getPremadeProducts,
  isDatabaseConfigured,
  type PremadeProduct,
} from "@/lib/db";

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
  if (!isDatabaseConfigured()) {
    return DEMO_PRODUCTS;
  }
  return getPremadeProducts();
}

/** Like listPremadeProducts, but a database outage renders as "nothing for sale" */
export async function listPremadeProductsForDisplay(): Promise<
  PremadeProduct[]
> {
  try {
    return await listPremadeProducts();
  } catch (error) {
    console.error("Error fetching premade products:", error);
    return [];
  }
}

/** Refresh the cached pages that show premade products */
export function revalidatePremadePages() {
  revalidatePath("/");
  revalidatePath("/premade");
}
