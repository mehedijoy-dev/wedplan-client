"use client";

import { useEffect, useState } from "react";
import { Check, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";

import ConfirmDialog from "@/components/shared/ConfirmDialog";
import PageLoader from "@/components/shared/PageLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";

type Me = { isPremium: boolean; subscriptionExpiresAt: string | null };

const freeFeatures = [
  "Maximum 3 active services",
  "Basic vendor dashboard",
  "Booking request management",
];
const premiumFeatures = [
  "Unlimited active services",
  "Premium Vendor badge",
  "All Free plan features",
];

export default function SubscriptionPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [busy, setBusy] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  useEffect(() => {
    apiFetch<{ user: Me }>("/api/me")
      .then((d) => setMe(d.user))
      .catch((e: Error) => toast.error(e.message));
  }, []);

  async function upgrade() {
    setBusy(true);
    try {
      const { url } = await apiFetch<{ url: string }>(
        "/api/payments/create-checkout-session",
        { method: "POST" },
      );
      window.location.href = url;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start checkout");
      setBusy(false);
    }
  }

  async function cancelSubscription() {
    setBusy(true);
    try {
      const d = await apiFetch<{ message: string }>(
        "/api/payments/cancel-subscription",
        { method: "POST" },
      );
      toast.success(d.message);
      setCancelOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not cancel");
    } finally {
      setBusy(false);
    }
  }

  if (!me) return <PageLoader label="Loading subscription..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-3xl font-bold text-primary">
          Subscription
        </h1>
        {me.isPremium && (
          <Badge className="gap-1 bg-accent text-accent-foreground">
            <Crown className="size-3.5" /> Premium Vendor
          </Badge>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Free */}
        <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6">
          <div>
            <h2 className="font-heading text-2xl font-semibold">Free Plan</h2>
            <p className="text-3xl font-bold">$0</p>
          </div>
          <ul className="flex-1 space-y-2 text-sm">
            {freeFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="size-4 text-primary" /> {f}
              </li>
            ))}
          </ul>
          <Button variant="outline" disabled>
            {me.isPremium ? "Free plan" : "Current plan"}
          </Button>
        </div>

        {/* Premium */}
        <div className="flex flex-col gap-4 rounded-2xl border-2 border-primary bg-card p-6">
          <div>
            <h2 className="flex items-center gap-2 font-heading text-2xl font-semibold">
              Premium Plan <Crown className="size-5 text-accent" />
            </h2>
            <p className="text-3xl font-bold">
              $10
              <span className="text-base font-normal text-muted-foreground">
                {" "}
                / month
              </span>
            </p>
          </div>
          <ul className="flex-1 space-y-2 text-sm">
            {premiumFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="size-4 text-primary" /> {f}
              </li>
            ))}
          </ul>

          {me.isPremium ? (
            <div className="space-y-2">
              {me.subscriptionExpiresAt && (
                <p className="text-sm text-muted-foreground">
                  Active until {formatDate(me.subscriptionExpiresAt)}
                </p>
              )}
              <Button variant="outline" onClick={() => setCancelOpen(true)}>
                Cancel Subscription
              </Button>
            </div>
          ) : (
            <Button onClick={upgrade} disabled={busy}>
              {busy && <Loader2 className="size-4 animate-spin" />}
              {busy ? "Redirecting to Stripe..." : "Upgrade to Premium"}
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel your Premium subscription?"
        description="You will keep Premium benefits until the end of the current billing period."
        confirmLabel="Yes, cancel"
        loading={busy}
        onConfirm={cancelSubscription}
      />
    </div>
  );
}
