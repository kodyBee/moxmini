import Image from "next/image";
import Link from "next/link";
import { Ornament } from "@/components/ornament";
import { PAINTING_FEE, formatPrice } from "@/lib/pricing";

const LINKS = [
  {
    heading: "Shop",
    items: [
      { href: "/premade", label: "Prepainted minis" },
      { href: "/figurefinder", label: "Figure Finder" },
      { href: "/cart", label: "Your cart" },
    ],
  },
  {
    heading: "Studio",
    items: [
      { href: "/about", label: "About Mox" },
      { href: "/about#faq", label: "FAQ" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card/40">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div className="max-w-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-full"
          >
            <Image
              src="/moxlogo-mark.png"
              alt=""
              width={40}
              height={40}
              className="size-10"
            />
            <span className="font-display text-2xl font-semibold">
              Mox Mini&apos;s
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Hand-painted miniatures for legendary adventures, one brushstroke at
            a time.
          </p>
        </div>

        {LINKS.map((group) => (
          <nav key={group.heading} aria-label={group.heading}>
            <h2 className="eyebrow">{group.heading}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="eyebrow">Good to know</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              Custom painting: {formatPrice(PAINTING_FEE, { cents: false })} per
              mini
            </li>
            <li>Ships to the US &amp; Canada</li>
            <li>Secure checkout with Stripe</li>
          </ul>
        </div>
      </div>
      <div className="container-page pb-10">
        <Ornament className="mb-6 opacity-50" />
        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} Mox Mini&apos;s. All rights reserved.
          </p>
          <p>Unpainted figures are sculpted and cast by Reaper Miniatures.</p>
        </div>
      </div>
    </footer>
  );
}
