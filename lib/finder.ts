import "server-only";
import { getCatalog, type CatalogProduct } from "@/lib/catalog";
import { FILTERS, PAGE_SIZE, type FinderQuery } from "@/lib/finder-options";

function byPrice(direction: 1 | -1) {
  return (a: CatalogProduct, b: CatalogProduct) => {
    // Unpriced figures always sort last
    if (a.price === null) return b.price === null ? 0 : 1;
    if (b.price === null) return -1;
    return (a.price - b.price) * direction;
  };
}

export async function searchCatalog(query: FinderQuery) {
  const catalog = await getCatalog();
  const words = query.q.toLowerCase().split(/\s+/).filter(Boolean);

  const matches = catalog.filter((product) => {
    for (const filter of FILTERS) {
      const value = query.filters[filter.key];
      if (!value) continue;
      const ok =
        filter.key === "material"
          ? product.material === value
          : product.tags.includes(value);
      if (!ok) return false;
    }
    if (words.length > 0) {
      const haystack = `${product.name} ${product.sku}`.toLowerCase();
      return words.every((word) => haystack.includes(word));
    }
    return true;
  });

  switch (query.sort) {
    case "a-z":
      matches.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "oldest":
      matches.sort((a, b) => b.rank - a.rank);
      break;
    case "cheapest":
      matches.sort(byPrice(1));
      break;
    case "most expensive":
      matches.sort(byPrice(-1));
      break;
    default:
      // "most recent" is Reaper's own order
      matches.sort((a, b) => a.rank - b.rank);
  }

  const total = matches.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(query.page, pageCount);
  const start = (page - 1) * PAGE_SIZE;

  return {
    products: matches.slice(start, start + PAGE_SIZE),
    total,
    page,
    pageCount,
    start,
  };
}
