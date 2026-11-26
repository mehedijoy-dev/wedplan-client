"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import ConfirmDialog from "@/components/shared/ConfirmDialog";
import PageLoader from "@/components/shared/PageLoader";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import type { Booking } from "@/types";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [toCancel, setToCancel] = useState<Booking | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    apiFetch<{ bookings: Booking[] }>("/api/bookings")
      .then((d) => setBookings(d.bookings))
      .catch((e: Error) => {
        toast.error(e.message);
        setBookings([]);
      });
  }, []);

  async function confirmCancel() {
    if (!toCancel) return;
    setBusy(true);
    try {
      await apiFetch(`/api/bookings/${toCancel._id}/cancel`, {
        method: "PATCH",
      });
      setBookings((prev) =>
        prev!.map((b) =>
          b._id === toCancel._id ? { ...b, status: "cancelled" } : b,
        ),
      );
      toast.success("Booking cancelled");
      setToCancel(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to cancel");
    } finally {
      setBusy(false);
    }
  }

  if (!bookings) return <PageLoader label="Loading your bookings..." />;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-primary">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          You have not made any booking requests yet.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center"
            >
              {b.service?.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={b.service.image}
                  alt={b.service.serviceName}
                  className="h-32 w-full rounded-xl object-cover sm:size-24"
                />
              )}
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-semibold">
                    {b.service?.serviceName ?? "Service removed"}
                  </h2>
                  <StatusBadge status={b.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Vendor:{" "}
                  {b.vendor?.businessName || b.vendor?.name || "Unknown"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Event: {formatDate(b.eventDate)} · {b.eventLocation}
                </p>
                <p className="text-xs text-muted-foreground">
                  Requested on {formatDate(b.createdAt)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelected(b)}
                >
                  Details
                </Button>
                {b.status === "pending" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setToCancel(b)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(o) => !o && setSelected(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selected?.service?.serviceName ?? "Booking details"}
            </DialogTitle>
            <DialogDescription>
              {selected?.service &&
                `${selected.service.category} · ${formatPrice(selected.service.price)}`}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <StatusBadge status={selected.status} />
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Vendor</dt>
                <dd>
                  {selected.vendor?.businessName || selected.vendor?.name}
                  {selected.vendor?.email && ` (${selected.vendor.email})`}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Event date</dt>
                <dd>{formatDate(selected.eventDate)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Event location</dt>
                <dd>{selected.eventLocation}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Your message</dt>
                <dd className="whitespace-pre-line">
                  {selected.message || "No message"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Requested on</dt>
                <dd>{formatDate(selected.createdAt)}</dd>
              </div>
            </dl>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(toCancel)}
        onOpenChange={(o) => !o && setToCancel(null)}
        title="Cancel this booking request?"
        description="The vendor will no longer see this request as pending."
        confirmLabel="Yes, cancel"
        loading={busy}
        onConfirm={confirmCancel}
      />
    </div>
  );
}
