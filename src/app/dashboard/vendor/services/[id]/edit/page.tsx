"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import ServiceForm from "@/components/dashboard/ServiceForm";
import PageLoader from "@/components/shared/PageLoader";
import { apiFetch } from "@/lib/api";
import type { Service } from "@/types";

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<{ service: Service }>(`/api/vendor/services/${id}`)
      .then((d) => setService(d.service))
      .catch((e: Error) => setError(e.message));
  }, [id]);

  if (error) return <p className="text-destructive">{error}</p>;
  if (!service) return <PageLoader label="Loading service..." />;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-primary">
        Edit Service
      </h1>
      <ServiceForm service={service} />
    </div>
  );
}
