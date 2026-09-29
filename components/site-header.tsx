import Image from "next/image";
import Link from "next/link";
import { CartLink, MobileMenu, NavLinks } from "@/components/site-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="container-page grid h-16 grid-cols-[1fr_auto] items-center gap-4 md:h-[4.5rem] md:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className="flex items-center gap-2.5 justify-self-start rounded-full"
        >
          <Image
            src="/moxlogo-mark.png"
            alt=""
            width={44}
            height={44}
            priority
            className="size-10 md:size-11"
          />
          <span className="font-display text-2xl leading-none font-semibold tracking-tight">
            Mox Mini&apos;s
          </span>
        </Link>
        <NavLinks />
        <div className="flex items-center gap-1.5 justify-self-end">
          <CartLink />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
