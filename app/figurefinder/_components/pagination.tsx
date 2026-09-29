import { ChevronLeft, ChevronRight } from "lucide-react";
import { FinderLink } from "./finder-provider";
import { cn } from "@/lib/utils";

// Up to five numbered pages around the current one, plus first and last
function pageNumbers(page: number, pageCount: number) {
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  const end = Math.min(pageCount, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);

  const pages: Array<number | "gap"> = [];
  if (start > 1) pages.push(1);
  if (start > 2) pages.push("gap");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < pageCount - 1) pages.push("gap");
  if (end < pageCount) pages.push(pageCount);
  return pages;
}

const itemClass =
  "grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm font-medium transition-colors";

export function Pagination({
  page,
  pageCount,
}: {
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex flex-wrap items-center justify-center gap-1.5"
    >
      {page > 1 ? (
        <FinderLink
          to={{ page: page - 1 }}
          scrollToResults
          className={cn(
            itemClass,
            "gap-1 border border-border hover:bg-foreground/5"
          )}
        >
          <span className="inline-flex items-center gap-1">
            <ChevronLeft className="size-4" aria-hidden />
            Previous
          </span>
        </FinderLink>
      ) : (
        <span
          className={cn(itemClass, "border border-border opacity-40")}
          aria-disabled
        >
          <span className="inline-flex items-center gap-1">
            <ChevronLeft className="size-4" aria-hidden />
            Previous
          </span>
        </span>
      )}

      {pageNumbers(page, pageCount).map((item, index) =>
        item === "gap" ? (
          <span
            key={`gap-${index}`}
            className="px-1 text-muted-foreground"
            aria-hidden
          >
            …
          </span>
        ) : (
          <FinderLink
            key={item}
            to={{ page: item }}
            scrollToResults
            aria-current={item === page ? "page" : undefined}
            aria-label={`Page ${item}`}
            className={cn(
              itemClass,
              item === page
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            )}
          >
            {item}
          </FinderLink>
        )
      )}

      {page < pageCount ? (
        <FinderLink
          to={{ page: page + 1 }}
          scrollToResults
          className={cn(
            itemClass,
            "border border-border hover:bg-foreground/5"
          )}
        >
          <span className="inline-flex items-center gap-1">
            Next
            <ChevronRight className="size-4" aria-hidden />
          </span>
        </FinderLink>
      ) : (
        <span
          className={cn(itemClass, "border border-border opacity-40")}
          aria-disabled
        >
          <span className="inline-flex items-center gap-1">
            Next
            <ChevronRight className="size-4" aria-hidden />
          </span>
        </span>
      )}
    </nav>
  );
}
