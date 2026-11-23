"use client";

import { useEffect, useState } from "react";
import { Check, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import ConfirmDialog from "@/components/shared/ConfirmDialog";
import PageLoader from "@/components/shared/PageLoader";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import type { Service } from "@/types";

type Status = "pending" | "approved" | "rejected";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [toDelete, setToDelete] = useState<Service | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (status) params.set("status", status);
        const d = await apiFetch<{ services: Service[] }>(
          `/api/admin/services?${params.toString()}`,
        );
        setServices(d.services);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load services");
        setServices([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [search, status]);

  async function setServiceStatus(s: Service, next: Status) {
    try {
      await apiFetch(`/api/admin/services/${s._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: next }),
      });
      setServices((prev) =>
        prev!.map((x) => (x._id === s._id ? { ...x, status: next } : x)),
      );
      toast.success(`Service ${next}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update status");
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setBusy(true);
    try {
      await apiFetch(`/api/admin/services/${toDelete._id}`, {
        method: "DELETE",
      });
      setServices((prev) => prev!.filter((x) => x._id !== toDelete._id));
      toast.success("Service deleted");
      setToDelete(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-primary">
        Manage Services
      </h1>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search by service name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {!services ? (
        <PageLoader label="Loading services..." />
      ) : services.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          No services found.
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((s) => (
            <div
              key={s._id}
              className="flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.images[0]}
                alt={s.serviceName}
                className="h-32 w-full rounded-xl object-cover sm:size-24"
              />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-semibold">{s.serviceName}</h2>
                  <StatusBadge status={s.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {s.category} · {s.location} · ৳{s.price.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Vendor:{" "}
                  {s.vendor?.businessName || s.vendor?.name || "Unknown"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {s.status !== "approved" && (
                  <Button
                    size="sm"
                    onClick={() => setServiceStatus(s, "approved")}
                  >
                    <Check className="size-3.5" /> Approve
                  </Button>
                )}
                {s.status !== "rejected" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setServiceStatus(s, "rejected")}
                  >
                    <X className="size-3.5" /> Reject
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setToDelete(s)}
                >
                  <Trash2 className="size-3.5" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete this service?"
        description={`"${toDelete?.serviceName ?? ""}" will be permanently removed from the platform.`}
        confirmLabel="Delete"
        loading={busy}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
