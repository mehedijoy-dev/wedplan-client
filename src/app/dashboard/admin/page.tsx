import StatsOverview from "@/components/dashboard/StatsOverview";

export default function AdminOverview() {
  return (
    <StatsOverview
      title="Admin Overview"
      endpoint="/api/admin/stats"
      cards={[
        { key: "totalUsers", label: "Total Registered Users" },
        { key: "totalVendors", label: "Total Vendors" },
        { key: "totalCustomers", label: "Total Customers" },
        { key: "totalServices", label: "Total Services" },
        { key: "pendingServices", label: "Pending Services" },
        { key: "totalTransactions", label: "Total Transactions" },
      ]}
    />
  );
}
