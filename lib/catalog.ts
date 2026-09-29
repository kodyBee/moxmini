import "server-only";

/**
 * Server-side access to the Reaper Miniatures catalog.
 *
 * The full product list is several megabytes, so it is fetched once per server
 * instance, trimmed to the fields the site uses, and kept in memory for an hour.
 * If a refresh fails, the last good copy keeps being served.
 */

const REAPER_PRODUCTS_URL =
  process.env.REAPER_PRODUCTS_URL ??
  "https://www.reapermini.com/api/productlist";
const CACHE_TTL_MS = 60 * 60 * 1000;

export interface CatalogProduct {
  sku: string;
  name: string;
  /** "metal" or "plastic" */
  material: string;
  /** Lower-cased Reaper tags (genre, race, gear, …) */
  tags: string[];
  /** Price in dollars, or null when Reaper doesn't list one */
  price: number | null;
  image: string | null;
  /** Position in Reaper's list, which is newest first */
  rank: number;
}

interface ReaperProduct {
  sku?: unknown;
  name?: unknown;
  material?: unknown;
  tags?: unknown;
  price?: unknown;
  images?: unknown;
}

const MINIATURE_MATERIALS = new Set(["metal", "plastic"]);

function toCatalogProduct(
  raw: ReaperProduct,
  rank: number
): CatalogProduct | null {
  const material = String(raw.material ?? "").toLowerCase();
  // Only figures: skip paints, books, accessories, etc.
  if (!MINIATURE_MATERIALS.has(material)) return null;
  if (raw.sku == null || raw.name == null) return null;

  const price = Number.parseFloat(String(raw.price ?? ""));
  const images = Array.isArray(raw.images) ? raw.images : [];
  const image = images.find(
    (img): img is { URL: string } =>
      typeof img?.URL === "string" && img.URL !== ""
  );

  return {
    sku: String(raw.sku),
    name: String(raw.name),
    material,
    tags: Array.isArray(raw.tags)
      ? raw.tags
          .filter((t): t is string => typeof t === "string")
          .map((t) => t.toLowerCase())
      : [],
    price: Number.isFinite(price) && price > 0 ? price : null,
    image: image?.URL ?? null,
    rank,
  };
}

async function fetchCatalog(): Promise<CatalogProduct[]> {
  // Too large for Next's data cache (2 MB limit), so it is cached in memory instead
  const res = await fetch(REAPER_PRODUCTS_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Reaper catalog request failed: ${res.status}`);
  }
  const data: unknown = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Reaper catalog response was not a list");
  }

  const products: CatalogProduct[] = [];
  data.forEach((raw: ReaperProduct) => {
    const product = toCatalogProduct(raw, products.length);
    if (product) products.push(product);
  });
  return products;
}

let cached: { fetchedAt: number; products: CatalogProduct[] } | null = null;
let inflight: Promise<CatalogProduct[]> | null = null;

export async function getCatalog(): Promise<CatalogProduct[]> {
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.products;
  }

  inflight ??= fetchCatalog()
    .then((products) => {
      cached = { fetchedAt: Date.now(), products };
      return products;
    })
    .finally(() => {
      inflight = null;
    });

  try {
    return await inflight;
  } catch (error) {
    if (cached) {
      console.error(
        "Reaper catalog refresh failed, serving stale copy:",
        error
      );
      return cached.products;
    }
    throw error;
  }
}

export async function findCatalogProduct(sku: string) {
  const catalog = await getCatalog();
  return catalog.find((product) => product.sku === sku) ?? null;
}
