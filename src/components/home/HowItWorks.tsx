import FadeIn from "@/components/home/FadeIn";
import SectionHeading from "@/components/home/SectionHeading";

const steps = [
  {
    title: "Browse Services",
    text: "Explore photographers, venues, decorators, caterers and more.",
  },
  {
    title: "Request a Booking",
    text: "Pick your event date and location and send a request to the vendor.",
  },
  {
    title: "Celebrate",
    text: "Once the vendor accepts, your service is confirmed and you can relax.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-secondary/40 py-16">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <SectionHeading
          title="How WedPlan Works"
          subtitle="Three simple steps from idea to booked."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.1}>
              <div className="relative rounded-2xl border bg-card p-6 pt-10 text-center">
                <span className="absolute -top-5 left-1/2 flex size-10 -translate-x-1/2 items-center justify-center rounded-full bg-primary font-heading text-xl font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="font-heading text-xl font-semibold">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
