import { Suspense } from "react";
import type { Metadata } from "next";

import PageLoader from "@/components/shared/PageLoader";
import ServicesBrowser from "@/components/services/ServicesBrowser";

export const metadata: Metadata = { title: "Browse Services" };

export default function ServicesPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
      <Suspense fallback={<PageLoader />}>
        <ServicesBrowser />
      </Suspense>
    </main>
  );
}
