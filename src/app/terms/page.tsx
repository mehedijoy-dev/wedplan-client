import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-12 sm:px-6">
      <h1 className="font-heading text-4xl font-bold text-primary">
        Terms of Service
      </h1>
      <p className="text-sm text-muted-foreground">
        Last updated: November 2026
      </p>

      <section className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold">Using WedPlan</h2>
        <p className="text-muted-foreground">
          WedPlan connects customers with wedding service vendors. By creating
          an account you agree to provide accurate information and to use the
          platform lawfully.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold">Bookings</h2>
        <p className="text-muted-foreground">
          A booking request is not a confirmed booking until the vendor accepts
          it. WedPlan is not responsible for services delivered by vendors.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold">Vendors</h2>
        <p className="text-muted-foreground">
          Vendors are responsible for the accuracy of their listings. Services
          are reviewed by an administrator and may be rejected or removed if
          they violate platform rules. Premium subscriptions are billed through
          Stripe.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold">Accounts</h2>
        <p className="text-muted-foreground">
          We may block accounts that misuse the platform.
        </p>
      </section>
    </main>
  );
}
