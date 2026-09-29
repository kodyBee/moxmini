"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { useFinder } from "./finder-provider";
import {
  FILTERS,
  SORT_OPTIONS,
  type FinderQuery,
  type SortValue,
} from "@/lib/finder-options";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-11 w-full rounded-xl border border-input bg-background/60 px-3.5 text-sm text-foreground capitalize transition-colors hover:border-foreground/30 focus-visible:border-primary";

function activeFilterCount(query: FinderQuery) {
  return (
    Object.values(query.filters).filter(Boolean).length + (query.q ? 1 : 0)
  );
}

function SearchBox() {
  const { query, navigate } = useFinder();
  // Holds what's typed until it's been sent; otherwise the URL's query shows
  const [draft, setDraft] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const commit = (value: string) => {
    clearTimeout(timer.current);
    setDraft(null);
    if (value.trim() !== query.q)
      navigate({ ...query, q: value.trim(), page: 1 });
  };

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        commit(draft ?? query.q);
      }}
    >
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Search</span>
        <span className="relative block">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={draft ?? query.q}
            placeholder="Name or SKU"
            onChange={(event) => {
              const value = event.target.value;
              setDraft(value);
              clearTimeout(timer.current);
              timer.current = setTimeout(() => commit(value), 400);
            }}
            className={cn(fieldClass, "pl-10 normal-case")}
          />
        </span>
      </label>
    </form>
  );
}

function FilterFields() {
  const { query, navigate } = useFinder();
  const count = activeFilterCount(query);

  return (
    <div className="space-y-4">
      <SearchBox />
      {FILTERS.map((filter) => (
        <label key={filter.key} className="block">
          <span className="mb-1.5 block text-sm font-medium">
            {filter.label}
          </span>
          <span className="relative block">
            <select
              value={query.filters[filter.key] ?? ""}
              onChange={(event) =>
                navigate({
                  ...query,
                  filters: {
                    ...query.filters,
                    [filter.key]: event.target.value || undefined,
                  },
                  page: 1,
                })
              }
              className={cn(fieldClass, "appearance-none pr-10")}
            >
              <option value="">Any</option>
              {filter.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
          </span>
        </label>
      ))}
      {count > 0 && (
        <button
          type="button"
          onClick={() => navigate({ ...query, q: "", filters: {}, page: 1 })}
          className="inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-primary hover:underline"
        >
          <X className="size-3.5" aria-hidden />
          Clear all filters
        </button>
      )}
    </div>
  );
}

export function FinderFilters() {
  const { query } = useFinder();
  const count = activeFilterCount(query);

  return (
    <aside aria-label="Filters" className="lg:sticky lg:top-24 lg:self-start">
      {/* Collapsible on small screens */}
      <details className="group surface lg:hidden">
        <summary className="flex list-none items-center justify-between gap-3 px-5 py-4 font-medium [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="size-4" aria-hidden />
            Filters
            {count > 0 && (
              <span className="grid min-w-6 place-items-center rounded-full bg-primary px-1.5 text-xs leading-6 font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </span>
          <ChevronDown
            aria-hidden
            className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="border-t border-border px-5 pt-4 pb-5">
          <FilterFields />
        </div>
      </details>

      <div className="surface hidden p-5 lg:block">
        <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-semibold">
          <SlidersHorizontal className="size-4 text-primary" aria-hidden />
          Filters
        </h2>
        <FilterFields />
      </div>
    </aside>
  );
}

export function SortSelect() {
  const { query, navigate } = useFinder();
  return (
    <label className="flex items-center gap-2.5 text-sm">
      <span className="shrink-0 text-muted-foreground">Sort by</span>
      <span className="relative">
        <select
          value={query.sort}
          onChange={(event) =>
            navigate({
              ...query,
              sort: event.target.value as SortValue,
              page: 1,
            })
          }
          className={cn(
            fieldClass,
            "h-10 w-auto appearance-none pr-10 normal-case"
          )}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
      </span>
    </label>
  );
}

export function ActiveFilterChips() {
  const { query, navigate } = useFinder();
  const chips = [
    ...(query.q
      ? [{ label: `“${query.q}”`, clear: { ...query, q: "", page: 1 } }]
      : []),
    ...FILTERS.flatMap((filter) => {
      const value = query.filters[filter.key];
      return value
        ? [
            {
              label: `${filter.label}: ${value}`,
              clear: {
                ...query,
                filters: { ...query.filters, [filter.key]: undefined },
                page: 1,
              },
            },
          ]
        : [];
    }),
  ];

  if (chips.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Active filters">
      {chips.map((chip) => (
        <li key={chip.label}>
          <button
            type="button"
            onClick={() => navigate(chip.clear)}
            aria-label={`Remove filter ${chip.label}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 py-1 pr-2 pl-3 text-xs font-medium text-primary capitalize transition-colors hover:bg-primary/20"
          >
            {chip.label}
            <X className="size-3.5" aria-hidden />
          </button>
        </li>
      ))}
    </ul>
  );
}
