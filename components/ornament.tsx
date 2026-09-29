import { cn } from "@/lib/utils";

/** Gold rule with a diamond in the middle, echoing the logo's wordmark */
export function Ornament({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("flex items-center gap-3 text-primary", className)}
    >
      <span className="h-px flex-1 bg-linear-to-r from-transparent to-primary/60" />
      <span className="size-1.5 rotate-45 bg-primary" />
      <span className="h-px flex-1 bg-linear-to-l from-transparent to-primary/60" />
    </div>
  );
}
