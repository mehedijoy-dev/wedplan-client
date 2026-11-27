"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import FadeIn from "@/components/home/FadeIn";
import SectionHeading from "@/components/home/SectionHeading";
import PageLoader from "@/components/shared/PageLoader";
import ServiceCard from "@/components/shared/ServiceCard";
import { buttonVariants } from "@/components/ui/button";
import type { Service } from "@/types";
import { API_URL } from "@/lib/config";
export default function FeaturedServices() {
  const [services, setServices] = useState<Service[] | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/services?limit=6&sort=newest`)
      .then((r) => r.json())
      .then((d) => setServices(d.services ?? []))
      .catch(() => setServices([]));
  }, []);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        title="Featured Wedding Services"
        subtitle="Hand-picked services from trusted vendors, ready to be booked."
      />
      {!services ? (
        <PageLoader label="Loading services..." />
      ) : services.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          No services published yet. Please check back soon.
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <FadeIn key={s._id} delay={i * 0.05}>
                <ServiceCard service={s} />
              </FadeIn>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/services"
              className={buttonVariants({ variant: "outline" })}
            >
              View All Services
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
