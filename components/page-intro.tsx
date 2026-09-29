import { Ornament } from "@/components/ornament";
import { cn } from "@/lib/utils";

export function PageIntro({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mx-auto max-w-3xl text-center", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
        {title}
      </h1>
      {children && (
        <div className="mt-4 text-base text-pretty text-muted-foreground sm:text-lg">
          {children}
        </div>
      )}
      <Ornament className="mx-auto mt-8 max-w-xs" />
    </header>
  );
}
