import Link from "next/link";
import {
  Camera,
  Flower2,
  Landmark,
  Shirt,
  Sparkles,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

import FadeIn from "@/components/home/FadeIn";
import SectionHeading from "@/components/home/SectionHeading";

const items: { name: string; icon: LucideIcon; blurb: string }[] = [
  {
    name: "Photography & Videography",
    icon: Camera,
    blurb: "Capture every moment",
  },
  { name: "Wedding Venues", icon: Landmark, blurb: "Find the perfect setting" },
  {
    name: "Decoration & Florist",
    icon: Flower2,
    blurb: "Beautiful floral designs",
  },
  {
    name: "Catering Services",
    icon: UtensilsCrossed,
    blurb: "Delicious menus for guests",
  },
  { name: "Makeup & Styling", icon: Sparkles, blurb: "Look radiant all day" },
  { name: "Wedding Fashion", icon: Shirt, blurb: "Outfits for the big day" },
];

export default function Categories() {
  return (
    <section className="bg-secondary/40 py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <SectionHeading
          title="Explore by Category"
          subtitle="Everything you need for your wedding, organised by service type."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c, i) => (
            <FadeIn key={c.name} delay={i * 0.05}>
              <Link
                href={`/services?category=${encodeURIComponent(c.name)}`}
                className="group flex items-center gap-4 rounded-2xl border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-md"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <c.icon className="size-6" />
                </span>
                <span>
                  <span className="block font-heading text-xl font-semibold">
                    {c.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {c.blurb}
                  </span>
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
