import {
  CalendarCheck,
  Search,
  ShieldCheck,
  Tag,
  type LucideIcon,
} from "lucide-react";

import FadeIn from "@/components/home/FadeIn";
import SectionHeading from "@/components/home/SectionHeading";

const reasons: { title: string; text: string; icon: LucideIcon }[] = [
  {
    title: "Reviewed Vendors",
    text: "Every service is reviewed by our admin team before it goes live.",
    icon: ShieldCheck,
  },
  {
    title: "Easy Discovery",
    text: "Search, filter by category and location, and sort by price in seconds.",
    icon: Search,
  },
  {
    title: "Simple Booking",
    text: "Send a booking request with your date and venue and track its status.",
    icon: CalendarCheck,
  },
  {
    title: "Clear Pricing",
    text: "See prices upfront so you can plan your budget with confidence.",
    icon: Tag,
  },
];

export default function WhyChoose() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        title="Why Choose WedPlan?"
        subtitle="Planning a wedding is stressful enough. We make finding the right vendors simple."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((r, i) => (
          <FadeIn key={r.title} delay={i * 0.08}>
            <div className="h-full rounded-2xl border bg-card p-6 text-center">
              <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-accent/20 text-primary">
                <r.icon className="size-7" />
              </span>
              <h3 className="font-heading text-xl font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
