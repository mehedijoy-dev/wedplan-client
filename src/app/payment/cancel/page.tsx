import Link from "next/link";
import { XCircle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <XCircle className="size-14 text-destructive" />
      <h1 className="font-heading text-3xl font-bold">Payment cancelled</h1>
      <p className="max-w-md text-muted-foreground">
        No payment was made and your plan has not changed. You can upgrade any
        time.
      </p>
      <Link href="/dashboard/vendor/subscription" className={buttonVariants()}>
        Back to Subscription
      </Link>
    </main>
  );
}
