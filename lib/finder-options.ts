// Filter and sort options for the Figure Finder, shared by the server-side
// search and the client-side filter controls. URL parameter names and values
// match the original page so existing links keep working.

// prettier-ignore
export const FILTERS = [
  { key: "material", label: "Material", options: ["metal", "plastic"] },
  {
    key: "genre",
    label: "Genre",
    options: ["fantasy", "modern", "sci-fi", "western", "superhero"],
  },
  { key: "gender", label: "Gender", options: ["female", "male"] },
  {
    key: "race",
    label: "Race",
    options: [
      "aberration", "bathalian", "celestial", "dark elf", "demon", "devil", "dire",
      "dragonman", "dwarf", "elf", "gnome", "goblin", "halfling", "hellborn", "human",
      "lupine", "monster", "orc", "reptus", "undead", "vampire", "were", "zombie",
    ],
  },
  {
    key: "holding",
    label: "Holding",
    options: [
      "axe", "book", "bow", "crossbow", "dagger", "flail", "hammer", "mace",
      "morning star", "hands", "orb", "pistol", "polearm", "rifle", "spell effect",
      "spiked chain", "staff", "sword", "wand", "whip",
    ],
  },
  {
    key: "wearing",
    label: "Wearing",
    options: [
      "chain", "cloak", "cape", "cloth", "clothing", "hat", "helmet", "leather",
      "hide", "nothing", "plate", "power armor", "robe", "scale", "shield",
    ],
  },
] as const;

export type FilterKey = (typeof FILTERS)[number]["key"];

export const SORT_OPTIONS = [
  { value: "most recent", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "a-z", label: "Name, A–Z" },
  { value: "cheapest", label: "Price, low to high" },
  { value: "most expensive", label: "Price, high to low" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export const DEFAULT_SORT: SortValue = "most recent";
export const PAGE_SIZE = 40;

export interface FinderQuery {
  q: string;
  filters: Partial<Record<FilterKey, string>>;
  sort: SortValue;
  page: number;
}

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/** Reads a FinderQuery from URL search params, ignoring unknown values */
export function parseFinderQuery(params: SearchParams): FinderQuery {
  const filters: FinderQuery["filters"] = {};
  for (const filter of FILTERS) {
    const value = first(params[filter.key])?.toLowerCase();
    if (value && (filter.options as readonly string[]).includes(value)) {
      filters[filter.key] = value;
    }
  }

  const sort = first(params.sort);
  const page = Number.parseInt(first(params.page) ?? "1", 10);

  return {
    q: (first(params.q) ?? "").trim().slice(0, 100),
    filters,
    sort: SORT_OPTIONS.some((o) => o.value === sort)
      ? (sort as SortValue)
      : DEFAULT_SORT,
    page: Number.isFinite(page) && page > 1 ? page : 1,
  };
}

/** Builds a Figure Finder URL, leaving out anything at its default */
export function finderHref(
  query: FinderQuery,
  changes: Partial<FinderQuery> = {}
) {
  const next = { ...query, ...changes };
  const params = new URLSearchParams();
  for (const filter of FILTERS) {
    const value = next.filters[filter.key];
    if (value) params.set(filter.key, value);
  }
  if (next.q) params.set("q", next.q);
  if (next.sort !== DEFAULT_SORT) params.set("sort", next.sort);
  if (next.page > 1) params.set("page", String(next.page));
  const search = params.toString();
  return search ? `/figurefinder?${search}` : "/figurefinder";
}
