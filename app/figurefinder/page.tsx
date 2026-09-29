// I'm the most proud of this page. It has complex filtering, sorting, pagination, and URL syncing and in general it was a blast to build.
// Filtering, sorting and paging now run on the server against a cached copy of
// the Reaper catalog, so the browser only receives the 40 figures it shows.
import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { searchCatalog } from "@/lib/finder";
import { parseFinderQuery } from "@/lib/finder-options";
import { CatalogCard } from "./_components/catalog-card";
import {
  ActiveFilterChips,
  FinderFilters,
  SortSelect,
} from "./_components/finder-filters";
import {
  FinderLink,
  FinderProvider,
  FinderResults,
} from "./_components/finder-provider";
import { Pagination } from "./_components/pagination";

export const metadata: Metadata = {
  title: "Figure Finder",
  description:
    "Search thousands of Reaper miniatures by race, gear and genre, then choose your colors and have Mox paint it for you.",
};

export default async function FigureFinderPage({
  searchParams,
}: PageProps<"/figurefinder">) {
  const query = parseFinderQuery(await searchParams);
  const { products, total, page, pageCount, start } =
    await searchCatalog(query);

  return (
    <div className="container-page pt-14 md:pt-20">
      <PageIntro eyebrow="Custom orders" title="Figure Finder">
        Find your perfect miniature, then choose exactly how Mox should paint
        it.
      </PageIntro>

      <FinderProvider query={{ ...query, page }}>
        <div className="mt-12 grid gap-8 lg:grid-cols-[17rem_1fr] xl:gap-10">
          <FinderFilters />

          <section
            id="results"
            aria-labelledby="results-heading"
            className="min-w-0 scroll-mt-24"
          >
            <h2 id="results-heading" className="sr-only">
              Results
            </h2>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground" aria-live="polite">
                {total === 0 ? (
                  "No miniatures found"
                ) : (
                  <>
                    Showing{" "}
                    <span className="font-medium text-foreground">
                      {start + 1}–{start + products.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-foreground">
                      {total.toLocaleString("en-US")}
                    </span>{" "}
                    miniatures
                  </>
                )}
              </p>
              <SortSelect />
            </div>

            <div className="mt-4">
              <ActiveFilterChips />
            </div>

            <FinderResults>
              {products.length > 0 ? (
                <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 2xl:grid-cols-4">
                  {products.map((product) => (
                    <CatalogCard key={product.sku} product={product} />
                  ))}
                </ul>
              ) : (
                <div className="surface mt-6 px-6 py-16 text-center">
                  <p className="font-display text-3xl font-semibold">
                    No figures match
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    Try removing a filter or searching for something broader.
                  </p>
                  <FinderLink
                    to={{ q: "", filters: {}, page: 1 }}
                    className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
                  >
                    Clear all filters
                  </FinderLink>
                </div>
              )}
              <Pagination page={page} pageCount={pageCount} />
            </FinderResults>
          </section>
        </div>
      </FinderProvider>
    </div>
  );
}
