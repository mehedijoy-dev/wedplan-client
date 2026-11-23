"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import ConfirmDialog from "@/components/shared/ConfirmDialog";
import PageLoader from "@/components/shared/PageLoader";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { FREE_PLAN_LIMIT } from "@/lib/constants";
import type { Service } from "@/types";

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [toDelete, setToDelete] = useState<Service | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    apiFetch<{ services: Service[] }>("/api/vendor/services")
      .then((d) => setServices(d.services))
      .catch((e: Error) => {
        toast.error(e.message);
        setServices([]);
      });
  }, []);

  async function toggleAvailability(s: Service) {
    try {
      await apiFetch(`/api/vendor/services/${s._id}/availability`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !s.isActive }),
      });
      setServices((prev) =>
        prev!.map((x) =>
          x._id === s._id ? { ...x, isActive: !s.isActive } : x,
        ),
      );
      toast.success(s.isActive ? "Service paused" : "Service is now active");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setBusy(true);
    try {
      await apiFetch(`/api/vendor/services/${toDelete._id}`, {
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

  if (!services) return <PageLoader label="Loading your services..." />;

  const activeCount = services.filter(
    (s) => s.isActive && s.status !== "rejected",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">
            My Services
          </h1>
          <p className="text-sm text-muted-foreground">
            Active services: {activeCount} (Free plan limit: {FREE_PLAN_LIMIT})
          </p>
        </div>
        <Link
          href="/dashboard/vendor/services/add"
          className={buttonVariants()}
        >
          Add Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          You have not added any services yet.
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
                  {!s.isActive && (
                    <span className="text-xs text-muted-foreground">
                      (Paused)
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {s.category} · {s.location}
                </p>
                <p className="text-sm font-medium text-primary">
                  ৳{s.price.toLocaleString()}
                </p>
                {s.status === "rejected" && (
                  <p className="text-xs text-destructive">
                    Rejected by admin, not visible to customers.
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAvailability(s)}
                >
                  {s.isActive ? "Pause" : "Activate"}
                </Button>
                <Link
                  href={`/dashboard/vendor/services/${s._id}/edit`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <Pencil className="size-3.5" /> Edit
                </Link>
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
        description={`"${toDelete?.serviceName ?? ""}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        loading={busy}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
