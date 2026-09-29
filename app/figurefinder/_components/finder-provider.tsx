"use client";

import {
  createContext,
  use,
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, ZoomIn } from "lucide-react";
import { finderHref, type FinderQuery } from "@/lib/finder-options";
import { cn } from "@/lib/utils";

interface ZoomedImage {
  src: string;
  name: string;
}

interface FinderContextValue {
  /** The query being shown, updated optimistically while results load */
  query: FinderQuery;
  isPending: boolean;
  navigate: (
    next: FinderQuery,
    options?: { scrollToResults?: boolean }
  ) => void;
  zoom: (image: ZoomedImage) => void;
}

const FinderContext = createContext<FinderContextValue | null>(null);

export function useFinder() {
  const value = use(FinderContext);
  if (!value) throw new Error("useFinder must be used inside <FinderProvider>");
  return value;
}

export function FinderProvider({
  query: serverQuery,
  children,
}: {
  query: FinderQuery;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setOptimisticQuery] = useOptimistic(serverQuery);
  const [zoomed, setZoomed] = useState<ZoomedImage | null>(null);

  const navigate: FinderContextValue["navigate"] = (next, options) => {
    if (options?.scrollToResults) {
      document
        .getElementById("results")
        ?.scrollIntoView({ behavior: "smooth" });
    }
    startTransition(() => {
      setOptimisticQuery(next);
      router.push(finderHref(next), { scroll: false });
    });
  };

  return (
    <FinderContext value={{ query, isPending, navigate, zoom: setZoomed }}>
      {children}
      <Lightbox image={zoomed} onClose={() => setZoomed(null)} />
    </FinderContext>
  );
}

/** Dims the results while a new page of them is loading */
export function FinderResults({ children }: { children: React.ReactNode }) {
  const { isPending } = useFinder();
  return (
    <div
      aria-busy={isPending}
      className={cn(
        "transition-opacity duration-200",
        isPending && "opacity-50"
      )}
    >
      {children}
    </div>
  );
}

/** A link to another Figure Finder view that shows pending state while it loads */
export function FinderLink({
  to,
  scrollToResults,
  className,
  children,
  ...props
}: {
  to: Partial<FinderQuery>;
  scrollToResults?: boolean;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href">) {
  const { query, navigate } = useFinder();
  const next = { ...query, ...to };
  return (
    <Link
      {...props}
      href={finderHref(next)}
      className={className}
      onNavigate={(event) => {
        event.preventDefault();
        navigate(next, { scrollToResults });
      }}
    >
      {children}
    </Link>
  );
}

export function ZoomButton({ src, name }: ZoomedImage) {
  const { zoom } = useFinder();
  return (
    <button
      type="button"
      onClick={() => zoom({ src, name })}
      aria-label={`Enlarge photo of ${name}`}
      className="absolute top-2.5 right-2.5 z-10 grid size-9 place-items-center rounded-full bg-background/75 text-foreground opacity-90 backdrop-blur transition hover:bg-background hover:opacity-100 focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
    >
      <ZoomIn className="size-4" aria-hidden />
    </button>
  );
}

function Lightbox({
  image,
  onClose,
}: {
  image: ZoomedImage | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (image) dialogRef.current?.showModal();
  }, [image]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={image?.name}
      onClose={onClose}
      onClick={(event) => {
        // Clicking the backdrop (outside the content box) closes it
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      className="m-auto max-h-[92dvh] w-[min(56rem,calc(100vw-1.5rem))] overflow-visible bg-transparent p-0 text-foreground"
    >
      {image && (
        <figure className="overflow-hidden rounded-2xl border border-border bg-popover">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
            <figcaption className="font-display text-xl font-semibold">
              {image.name}
            </figcaption>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close"
              autoFocus
              className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-foreground/10"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <div className="grid max-h-[calc(92dvh-4rem)] place-items-center overflow-auto bg-stage p-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- Reaper's photos are served as-is */}
            <img
              src={image.src}
              alt={image.name}
              className="max-h-[calc(92dvh-6rem)] w-auto object-contain mix-blend-multiply"
            />
          </div>
        </figure>
      )}
    </dialog>
  );
}
