import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package, Palette, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Ornament } from "@/components/ornament";
import { PremadeCard } from "@/components/premade-card";
import { listPremadeProductsForDisplay } from "@/lib/premade";
import { PAINTING_FEE, formatPrice } from "@/lib/pricing";
import heroImage from "@/public/background.jpeg";

// Premade stock changes when pieces sell; admin edits refresh it immediately
export const revalidate = 60;

const STEPS = [
  {
    icon: Search,
    title: "Find your figure",
    body: "Search thousands of metal and plastic Reaper miniatures by race, gear, genre and more.",
  },
  {
    icon: Palette,
    title: "Choose your colors",
    body: "Pick hair, skin, fabric and accessory colors, and leave notes for the artist.",
  },
  {
    icon: Package,
    title: "Painted & shipped",
    body: "Mox paints your miniature by hand and ships it to you anywhere in the US or Canada.",
  },
];

export default async function Home() {
  const featured = (await listPremadeProductsForDisplay()).slice(0, 3);

  return (
    <>
      {/* Hero: slides up under the translucent header */}
      <section className="relative isolate -mt-16 flex min-h-[88svh] items-end overflow-hidden md:-mt-[4.5rem]">
        <Image
          src={heroImage}
          alt="Hand-painted adventurers facing a beholder on a dungeon tile board"
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="-z-20 object-cover object-[center_15%]"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-background via-background/55 to-background/10" />
        <div className="absolute inset-0 -z-10 bg-background/35 md:hidden" />
        <div className="absolute inset-0 -z-10 hidden bg-linear-to-r from-background/85 via-background/30 to-transparent md:block" />

        <div className="container-page pt-40 pb-16 md:pb-24">
          <p className="eyebrow">Hand-painted tabletop miniatures</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[0.95] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl xl:text-8xl">
            Epic miniatures for legendary adventures
          </h1>
          <p className="mt-6 max-w-xl text-lg text-pretty text-foreground/80 sm:text-xl">
            Professionally painted miniatures that transform your D&amp;D
            campaigns into unforgettable stories.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/premade">Shop prepainted</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-background/30 backdrop-blur"
            >
              <Link href="/figurefinder">
                Create your own
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-2 text-sm text-foreground/70">
            <li>Thousands of figures to choose from</li>
            <li>
              Custom painting {formatPrice(PAINTING_FEE, { cents: false })} per
              mini
            </li>
            <li>Ships to the US &amp; Canada</li>
          </ul>
        </div>
      </section>

      {/* How custom orders work */}
      <section
        aria-labelledby="how-heading"
        className="container-page mt-20 md:mt-28"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Custom orders</p>
          <h2
            id="how-heading"
            className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
          >
            Your character, painted your way
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            Bring the hero from your character sheet to the table in three
            steps.
          </p>
        </div>

        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="surface relative overflow-hidden p-7"
            >
              <span
                aria-hidden
                className="absolute top-3 right-6 font-display text-6xl leading-none font-semibold text-primary/15"
              >
                {["I", "II", "III"][index]}
              </span>
              <span className="grid size-12 place-items-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                <step.icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col items-center justify-between gap-5 rounded-2xl border border-primary/20 bg-primary/[0.06] p-6 text-center md:flex-row md:px-8 md:text-left">
          <p className="text-pretty text-foreground/85">
            Custom painting is a flat{" "}
            <strong className="text-primary">
              {formatPrice(PAINTING_FEE, { cents: false })}
            </strong>{" "}
            per miniature, on top of the figure. Rather paint it yourself? Order
            any figure unpainted.
          </p>
          <Button asChild>
            <Link href="/figurefinder">
              Open the Figure Finder
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </section>

      {/* Featured prepainted pieces */}
      {featured.length > 0 && (
        <section
          aria-labelledby="featured-heading"
          className="container-page mt-24 md:mt-32"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow">Ready to play</p>
              <h2
                id="featured-heading"
                className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl"
              >
                Prepainted favorites
              </h2>
              <p className="mt-3 text-muted-foreground">
                Finished pieces straight from Mox&apos;s workbench. Each is one
                of a kind.
              </p>
            </div>
            <Button
              asChild
              variant="link"
              className="self-start px-0 sm:self-auto"
            >
              <Link href="/premade">
                View all
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <PremadeCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Meet the artist */}
      <section
        aria-labelledby="mox-heading"
        className="container-page mt-24 md:mt-32"
      >
        <div className="surface grid items-center gap-10 overflow-hidden p-8 md:grid-cols-[auto_1fr] md:gap-14 md:p-12">
          <div className="relative mx-auto grid size-56 place-items-center rounded-full border-4 border-accent/60 bg-[radial-gradient(circle_at_50%_40%,oklch(0.3_0.08_300),oklch(0.18_0.03_295))] md:size-64">
            <Image
              src="/moxlogosimple.png"
              alt="Mox, the painting dragon"
              width={200}
              height={200}
              className="size-40 md:size-48"
            />
          </div>
          <div>
            <p className="eyebrow">The artist</p>
            <h2
              id="mox-heading"
              className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl"
            >
              Meet Mox
            </h2>
            <Ornament className="mt-5 max-w-40" />
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
              Mox is a hardworking and talented artist dedicated to creating
              world-class miniatures for Dungeons &amp; Dragons. With meticulous
              attention to detail and an unwavering passion for the craft, Mox
              brings fantasy worlds to life one miniature at a time.
            </p>
            <Button asChild variant="outline" className="mt-7">
              <Link href="/about">
                More about Mox
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
