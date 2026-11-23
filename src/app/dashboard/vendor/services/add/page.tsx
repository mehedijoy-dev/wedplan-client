import ServiceForm from "@/components/dashboard/ServiceForm";

export default function AddServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary">
          Add Service
        </h1>
        <p className="text-sm text-muted-foreground">
          New services are reviewed by an admin before they appear publicly.
        </p>
      </div>
      <ServiceForm />
    </div>
  );
}
