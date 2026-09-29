export default function Loading() {
  return (
    <div className="container-page pt-8 md:pt-12" aria-busy>
      <p className="sr-only" role="status">
        Loading miniature…
      </p>
      <div className="h-5 w-28 animate-pulse rounded-full bg-muted" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
        <div className="surface aspect-square animate-pulse" />
        <div className="space-y-4">
          <div className="h-3 w-40 animate-pulse rounded bg-muted" />
          <div className="h-12 w-4/5 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="surface mt-8 h-24 animate-pulse" />
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="surface h-20 animate-pulse" />
            ))}
          </div>
          <div className="surface h-40 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
