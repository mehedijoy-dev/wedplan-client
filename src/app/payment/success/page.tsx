"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

type State = "checking" | "active" | "pending";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [state, setState] = useState<State>("checking");

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.replace("/sign-in");
      return;
    }

    // Frontend redirect ke bishwash kora hocche na.
    // Premium webhook er por server e activate hoy, tai ekhane sudhu poll kori.
    let stop = false;
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;

    const check = async () => {
      try {
        const d = await apiFetch<{ user: { isPremium: boolean } }>("/api/me");
        if (d.user.isPremium) {
          if (!stop) setState("active");
          return;
        }
      } catch {
        /* retry */
      }
      tries += 1;
      if (stop) return;
      if (tries >= 10) setState("pending");
      else timer = setTimeout(check, 2000);
    };
    check();

    return () => {
      stop = true;
      clearTimeout(timer);
    };
  }, [isPending, session, router]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      {state === "checking" && (
        <>
          <Loader2 className="size-12 animate-spin text-primary" />
          <h1 className="font-heading text-3xl font-bold">
            Confirming your payment...
          </h1>
          <p className="max-w-md text-muted-foreground">
            We are waiting for Stripe to confirm your payment. This usually
            takes a few seconds.
          </p>
        </>
      )}
      {state === "active" && (
        <>
          <CheckCircle2 className="size-14 text-emerald-600" />
          <h1 className="font-heading text-3xl font-bold text-primary">
            Payment successful!
          </h1>
          <p className="max-w-md text-muted-foreground">
            Your Premium subscription is now active. You can publish unlimited
            services.
          </p>
        </>
      )}
      {state === "pending" && (
        <>
          <Clock className="size-14 text-amber-600" />
          <h1 className="font-heading text-3xl font-bold">
            Payment is being processed
          </h1>
          <p className="max-w-md text-muted-foreground">
            Your payment has not been confirmed yet. Premium will activate
            automatically once Stripe confirms it. Please check your
            subscription page in a minute.
          </p>
        </>
      )}
      <Link href="/dashboard/vendor/subscription" className={buttonVariants()}>
        Go to Subscription
      </Link>
    </main>
  );
}
