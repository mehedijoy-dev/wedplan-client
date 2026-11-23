import StatsOverview from "@/components/dashboard/StatsOverview";

export default function CustomerOverview() {
  return (
    <StatsOverview
      title="Customer Overview"
      endpoint="/api/bookings/stats"
      cards={[
        { key: "totalBookings", label: "Total Booking Requests" },
        { key: "pendingBookings", label: "Pending Bookings" },
        { key: "acceptedBookings", label: "Accepted Bookings" },
        { key: "rejectedBookings", label: "Rejected Bookings" },
      ]}
    />
  );
}
