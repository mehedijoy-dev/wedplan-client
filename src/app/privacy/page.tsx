import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-12 sm:px-6">
      <h1 className="font-heading text-4xl font-bold text-primary">
        Privacy Policy
      </h1>
      <p className="text-sm text-muted-foreground">
        Last updated: November 2026
      </p>

      <section className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold">
          Information we collect
        </h2>
        <p className="text-muted-foreground">
          When you create a WedPlan account we collect your name, email address,
          password (stored securely hashed) and an optional profile image. If
          you sign in with Google, we receive your name, email address and
          profile picture from your Google account. We do not access any other
          Google data.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold">How we use it</h2>
        <p className="text-muted-foreground">
          We use your information to create and secure your account, show your
          profile to the vendors and customers you interact with, process
          booking requests and manage vendor subscriptions.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold">Payments</h2>
        <p className="text-muted-foreground">
          Vendor subscription payments are processed by Stripe. WedPlan does not
          store your card details.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold">Sharing</h2>
        <p className="text-muted-foreground">
          We do not sell your personal information. Booking details are shared
          only between the customer and the vendor involved in that booking.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold">Contact</h2>
        <p className="text-muted-foreground">
          For any privacy question, contact us at hello@wedplan.com.
        </p>
      </section>
    </main>
  );
}
