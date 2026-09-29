import { PageIntro } from "@/components/page-intro";

export default function Loading() {
  return (
    <div className="container-page pt-14 md:pt-20" aria-busy>
      <PageIntro eyebrow="Custom orders" title="Figure Finder">
        Find your perfect miniature, then choose exactly how Mox should paint
        it.
      </PageIntro>
      <p className="sr-only" role="status">
        Loading miniatures…
      </p>
      <div className="mt-12 grid gap-8 lg:grid-cols-[17rem_1fr] xl:gap-10">
        <div className="surface h-14 animate-pulse lg:h-[34rem]" />
        <div>
          <div className="h-10 w-64 animate-pulse rounded-full bg-muted" />
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 12 }, (_, i) => (
              <li key={i} className="surface overflow-hidden">
                <div className="aspect-square animate-pulse bg-muted" />
                <div className="space-y-2.5 p-4">
                  <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
                  <div className="h-5 w-1/4 animate-pulse rounded bg-muted pt-4" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
