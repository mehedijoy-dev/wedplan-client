"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import PageLoader from "@/components/shared/PageLoader";
import StatusBadge from "@/components/shared/StatusBadge";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Transaction } from "@/types";

export default function AdminTransactionsPage() {
  const [items, setItems] = useState<Transaction[] | null>(null);

  useEffect(() => {
    apiFetch<{ transactions: Transaction[] }>("/api/admin/transactions")
      .then((d) => setItems(d.transactions))
      .catch((e: Error) => {
        toast.error(e.message);
        setItems([]);
      });
  }, []);

  if (!items) return <PageLoader label="Loading transactions..." />;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-primary">
        Transactions
      </h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          No transactions yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Vendor</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t._id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">
                      {t.vendor?.businessName || t.vendor?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.vendor?.email}
                    </p>
                  </td>
                  <td className="px-4 py-3 capitalize">{t.plan}</td>
                  <td className="px-4 py-3">
                    {t.currency.toUpperCase()} {t.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3">{formatDate(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
