"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";

type Props = {
  serviceId: string;
  serviceName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function BookingDialog({
  serviceId,
  serviceName,
  open,
  onOpenChange,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const eventDate = String(form.get("eventDate") ?? "");
    const eventLocation = String(form.get("eventLocation") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    if (!eventDate) return toast.error("Please choose an event date");
    if (eventDate < today)
      return toast.error("Event date cannot be in the past");
    if (!eventLocation) return toast.error("Event location is required");

    setLoading(true);
    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({ serviceId, eventDate, eventLocation, message }),
      });
      toast.success("Booking request sent to the vendor!");
      onOpenChange(false);
      router.push("/dashboard/customer/bookings");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send request",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Booking</DialogTitle>
          <DialogDescription>{serviceName}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eventDate">Event Date</Label>
            <Input id="eventDate" name="eventDate" type="date" min={today} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventLocation">Event Location</Label>
            <Input
              id="eventLocation"
              name="eventLocation"
              placeholder="e.g. Hotel Sonargaon, Dhaka"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Additional Message</Label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Tell the vendor about your event..."
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "Sending..." : "Send Booking Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
