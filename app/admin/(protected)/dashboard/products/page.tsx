import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/auth";
import {
  ensureDatabase,
  getPremadeProducts,
  isDatabaseConfigured,
  type PremadeProduct,
} from "@/lib/db";
import { ProductsManager } from "./products-manager";

export const metadata: Metadata = {
  title: "Prepainted Products",
};

export default async function ProductsPage() {
  await requireAdminPage();

  let products: PremadeProduct[] = [];
  let problem: string | null = null;

  if (!isDatabaseConfigured()) {
    problem =
      "The database isn't configured. Set POSTGRES_URL to manage prepainted products.";
  } else {
    try {
      await ensureDatabase();
      products = await getPremadeProducts();
    } catch (error) {
      console.error("Error loading premade products:", error);
      problem =
        "Couldn't load products from the database. Try refreshing in a moment.";
    }
  }

  return <ProductsManager products={products} problem={problem} />;
}
