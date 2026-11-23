"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import PageLoader from "@/components/shared/PageLoader";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiFetch } from "@/lib/api";

type Props = {
  title: string;
  endpoint: string;
  cards: { key: string; label: string }[];
};

export default function StatsOverview({ title, endpoint, cards }: Props) {
  const [data, setData] = useState<Record<string, string | number> | null>(
    null,
  );

  useEffect(() => {
    apiFetch<Record<string, string | number>>(endpoint)
      .then(setData)
      .catch((e: Error) => {
        toast.error(e.message);
        setData({});
      });
  }, [endpoint]);

  if (!data) return <PageLoader label="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-primary">{title}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.key}>
            <CardHeader>
              <CardDescription>{c.label}</CardDescription>
              <CardTitle className="text-3xl capitalize">
                {data[c.key] ?? 0}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
