// This page needs the most work. I put in generic stuff and its pretty impersonal. Might convert to an FAQ page later on down the road
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Dices, Gem, Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Ornament } from "@/components/ornament";
import { PageIntro } from "@/components/page-intro";
import { PAINTING_FEE, formatPrice } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "About Mox",
  description:
    "Meet Mox, the miniature artist behind Mox Mini's, and find answers to common questions about custom painting, shipping and payment.",
};

const SKILLS = [
  {
    icon: Gem,
    title: "Sculpting",
    body: "Expert-level miniature sculpting and design",
  },
  {
    icon: Paintbrush,
    title: "Painting",
    body: "Professional miniature painting techniques",
  },
  {
    icon: Dices,
    title: "D&D expertise",
    body: "Deep knowledge of fantasy gaming aesthetics",
  },
];

const FAQ = [
  {
    question: "How much does custom painting cost?",
    answer: `A flat ${formatPrice(PAINTING_FEE, { cents: false })} per miniature, on top of the price of the figure itself. You'll see the full total in your cart before you check out.`,
  },
  {
    question: "Can I order a miniature unpainted?",
    answer:
      "Yes. On any figure's customize page, switch off custom painting and you'll receive it unpainted, for the price of the figure alone.",
  },
  {
    question: "Where do the figures come from?",
    answer:
      "Custom orders use metal and plastic miniatures from the Reaper Miniatures catalog, which you can search in the Figure Finder.",
  },
  {
    question: "What's different about the prepainted minis?",
    answer:
      "They're finished pieces Mox has already painted. Each one is one of a kind, so once it sells, it's gone.",
  },
  {
    question: "Where do you ship?",
    answer:
      "We ship to addresses in the United States and Canada. Shipping is calculated at checkout.",
  },
  {
    question: "How do I pay?",
    answer:
      "Checkout is handled securely by Stripe, and you can pay with any major credit or debit card.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-page pt-14 md:pt-20">
      <PageIntro eyebrow="The artist" title="Meet Mox">
        Master miniature artist
      </PageIntro>

      <div className="mt-14 grid gap-10 lg:grid-cols-[20rem_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="surface flex flex-col items-center p-8 text-center">
            <div className="grid size-56 place-items-center rounded-full border-4 border-accent/60 bg-[radial-gradient(circle_at_50%_40%,oklch(0.3_0.08_300),oklch(0.18_0.03_295))]">
              <Image
                src="/moxlogosimple.png"
                alt="Mox, the painting dragon"
                width={180}
                height={180}
                className="size-40"
              />
            </div>
            <p className="mt-6 font-display text-3xl font-semibold">Mox</p>
            <p className="text-sm text-muted-foreground">
              Sculptor · Painter · D&amp;D enthusiast
            </p>
          </div>
        </div>

        <article className="max-w-2xl text-lg leading-relaxed text-pretty text-foreground/85">
          <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
            About the artist
          </h2>
          <p className="mt-4">
            Mox is a hardworking and talented artist dedicated to creating
            world-class miniatures for Dungeons &amp; Dragons. With meticulous
            attention to detail and an unwavering passion for the craft, Mox
            brings fantasy worlds to life one miniature at a time.
          </p>

          <h2 className="mt-12 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Craftsmanship &amp; vision
          </h2>
          <p className="mt-4">
            Every piece created by Mox combines technical expertise with
            artistic vision. From heroic adventurers to fearsome monsters, each
            miniature is crafted with precision and care, designed to enhance
            your tabletop gaming experience.
          </p>

          <h2 className="mt-12 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Dedication to excellence
          </h2>
          <p className="mt-4">
            Through countless hours of sculpting, painting, and perfecting
            techniques, Mox has developed a reputation for producing miniatures
            that stand among the finest in the industry. Each creation reflects
            a commitment to quality and a deep understanding of what makes
            tabletop gaming truly immersive.
          </p>

          <figure className="mt-12 border-l-2 border-primary pl-6">
            <blockquote className="font-display text-3xl leading-snug text-foreground italic">
              &ldquo;Bringing imagination to the tabletop, one miniature at a
              time.&rdquo;
            </blockquote>
          </figure>
        </article>
      </div>

      <section aria-labelledby="skills-heading" className="mt-24">
        <h2 id="skills-heading" className="sr-only">
          Skills
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {SKILLS.map((skill) => (
            <li key={skill.title} className="surface p-7 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                <skill.icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-2xl font-semibold">
                {skill.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {skill.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="mx-auto mt-24 max-w-3xl"
      >
        <div className="text-center">
          <p className="eyebrow">Questions</p>
          <h2
            id="faq-heading"
            className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl"
          >
            Frequently asked
          </h2>
          <Ornament className="mx-auto mt-6 max-w-xs" />
        </div>
        <div className="mt-10 divide-y divide-border border-y border-border">
          {FAQ.map((item) => (
            <details key={item.question} name="faq" className="group py-1">
              <summary className="flex list-none items-center justify-between gap-4 rounded-lg py-4 text-left text-lg font-medium [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown
                  aria-hidden
                  className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="pb-5 text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="surface mx-auto mt-20 max-w-3xl p-8 text-center sm:p-12">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">
          Ready to bring your hero to life?
        </h2>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/figurefinder">
              Create your own
              <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/premade">Shop prepainted</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
