"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import PageLoader from "@/components/shared/PageLoader";
import { useSession } from "@/lib/auth-client";

export default function DashboardRedirect() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending || !session) return;
    const r = session.user.role as string | undefined;
    router.replace(
      `/dashboard/${r === "vendor" || r === "admin" ? r : "customer"}`,
    );
  }, [isPending, session, router]);

  return <PageLoader />;
}
