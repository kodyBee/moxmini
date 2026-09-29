import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Ornament } from "@/components/ornament";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center md:py-32">
      <p className="font-display text-[9rem] leading-none font-bold text-primary sm:text-[12rem]">
        404
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
        Page not found
      </h1>
      <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
        The miniature you&apos;re looking for is currently running away from the
        plot.
      </p>
      <Ornament className="mx-auto mt-10 max-w-xs" />
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Return home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/figurefinder">
            Browse miniatures
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      </div>
    </div>
  );
}
