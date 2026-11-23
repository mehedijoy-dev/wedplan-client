"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [message, setMessage] = useState("Checking...");

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.replace("/sign-in");
      return;
    }
    apiFetch<{ user: { email: string; role: string } }>("/api/me")
      .then((d) =>
        setMessage(`Server verified: ${d.user.email} (${d.user.role})`),
      )
      .catch((e: Error) => setMessage(`Error: ${e.message}`));
  }, [isPending, session, router]);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 p-8">
      <h1 className="font-heading text-3xl font-bold text-primary">
        Dashboard
      </h1>
      <p className="mt-4 text-muted-foreground">{message}</p>
    </main>
  );
}
