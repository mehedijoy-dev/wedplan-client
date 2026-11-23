"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

import PageLoader from "@/components/shared/PageLoader";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Booking } from "@/types";

export default function VendorBookingsPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ bookings: Booking[] }>("/api/vendor/bookings")
      .then((d) => setBookings(d.bookings))
      .catch((e: Error) => {
        toast.error(e.message);
        setBookings([]);
      });
  }, []);

  async function updateStatus(b: Booking, status: "accepted" | "rejected") {
    setProcessing(b._id);
    try {
      await apiFetch(`/api/vendor/bookings/${b._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setBookings((prev) =>
        prev!.map((x) => (x._id === b._id ? { ...x, status } : x)),
      );
      toast.success(`Booking ${status}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update booking");
    } finally {
      setProcessing(null);
    }
  }

  if (!bookings) return <PageLoader label="Loading booking requests..." />;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-primary">
        Booking Requests
      </h1>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          No booking requests yet.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="space-y-3 rounded-2xl border bg-card p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold">
                    {b.service?.serviceName ?? "Service removed"}
                  </h2>
                  <StatusBadge status={b.status} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Requested {formatDate(b.createdAt)}
                </p>
              </div>

              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <p>
                  <span className="text-muted-foreground">Customer: </span>
                  {b.customer?.name} ({b.customer?.email})
                </p>
                <p>
                  <span className="text-muted-foreground">Event date: </span>
                  {formatDate(b.eventDate)}
                </p>
                <p className="sm:col-span-2">
                  <span className="text-muted-foreground">
                    Event location:{" "}
                  </span>
                  {b.eventLocation}
                </p>
                <p className="whitespace-pre-line sm:col-span-2">
                  <span className="text-muted-foreground">Message: </span>
                  {b.message || "No message"}
                </p>
              </div>

              {b.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={processing === b._id}
                    onClick={() => updateStatus(b, "accepted")}
                  >
                    <Check className="size-3.5" /> Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={processing === b._id}
                    onClick={() => updateStatus(b, "rejected")}
                  >
                    <X className="size-3.5" /> Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
