"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { href: "/premade", label: "Prepainted" },
  { href: "/figurefinder", label: "Figure Finder" },
  { href: "/about", label: "About" },
];

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks() {
  const isActive = useIsActive();
  return (
    <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item.href) ? "page" : undefined}
          className={cn(
            "relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
            "aria-[current=page]:text-foreground",
            "after:absolute after:inset-x-4 after:-bottom-px after:h-px after:scale-x-0 after:bg-primary after:transition-transform aria-[current=page]:after:scale-x-100"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function CartLink() {
  const items = useCart();
  const count = items?.length ?? 0;
  return (
    <Link
      href="/cart"
      aria-label={
        count > 0 ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"
      }
      className="relative inline-flex h-10 items-center gap-2 rounded-full border border-foreground/15 px-3.5 text-sm font-medium transition-colors hover:border-foreground/35 hover:bg-foreground/5 sm:px-4"
    >
      <ShoppingBag className="size-4" aria-hidden />
      <span className="hidden sm:inline">Cart</span>
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 grid min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] leading-5 font-bold text-primary-foreground sm:static sm:min-w-6 sm:leading-6">
          {count}
        </span>
      )}
    </Link>
  );
}

// Uses the browser's popover API: light-dismiss and Escape come for free
export function MobileMenu() {
  const isActive = useIsActive();
  const close = () => document.getElementById("mobile-nav")?.hidePopover();

  return (
    <>
      <button
        type="button"
        popoverTarget="mobile-nav"
        aria-label="Open menu"
        className="grid size-10 place-items-center rounded-full text-foreground hover:bg-foreground/[0.07] md:hidden"
      >
        <Menu className="size-5" aria-hidden />
      </button>
      <div
        id="mobile-nav"
        popover="auto"
        className="inset-x-3 top-3 m-0 w-auto rounded-2xl border border-border bg-popover p-3 text-foreground shadow-2xl shadow-black/50 backdrop:bg-background/60 backdrop:backdrop-blur-sm md:hidden"
      >
        <div className="flex items-center justify-between px-3 pt-1 pb-3">
          <span className="font-display text-xl font-semibold">
            Mox Mini&apos;s
          </span>
          <button
            type="button"
            popoverTarget="mobile-nav"
            popoverTargetAction="hide"
            aria-label="Close menu"
            className="grid size-9 place-items-center rounded-full hover:bg-foreground/[0.07]"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <nav aria-label="Main" className="flex flex-col gap-1">
          {[
            { href: "/", label: "Home" },
            ...NAV_ITEMS,
            { href: "/cart", label: "Cart" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              aria-current={
                (item.href === "/" ? false : isActive(item.href))
                  ? "page"
                  : undefined
              }
              className="rounded-xl px-3 py-3 text-base font-medium text-muted-foreground hover:bg-foreground/5 hover:text-foreground aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
