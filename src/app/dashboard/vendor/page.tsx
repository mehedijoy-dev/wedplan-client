import StatsOverview from "@/components/dashboard/StatsOverview";

export default function VendorOverview() {
  return (
    <StatsOverview
      title="Vendor Overview"
      endpoint="/api/vendor/stats"
      cards={[
        { key: "totalServices", label: "Total Services" },
        { key: "activeServices", label: "Active Services" },
        { key: "pendingBookings", label: "Pending Booking Requests" },
        { key: "acceptedBookings", label: "Accepted Bookings" },
        { key: "plan", label: "Current Subscription Plan" },
      ]}
    />
  );
}
