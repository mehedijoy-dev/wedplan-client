"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Crown, MapPin } from "lucide-react";
import { toast } from "sonner";

import BookingDialog from "@/components/services/BookingDialog";
import PageLoader from "@/components/shared/PageLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";
import { API_URL } from "@/lib/config";
export default function ServiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const signedIn = Boolean(session);

  const [service, setService] = useState<Service | null>(null);
  const [error, setError] = useState("");
  const [active, setActive] = useState(0);
  const [bookOpen, setBookOpen] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!signedIn) {
      toast.error("Please sign in to view service details");
      router.replace(`/sign-in?redirect=/services/${id}`);
      return;
    }
    fetch(`${API_URL}/api/services/${id}`)
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.message || "Failed to load service");
        setService(json.service);
      })
      .catch((e: Error) => setError(e.message));
  }, [isPending, signedIn, id, router]);

  if (isPending || !signedIn) return <PageLoader />;

  if (error) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-primary">
          Service not found
        </h1>
        <p className="text-muted-foreground">{error}</p>
        <Link href="/services" className={buttonVariants()}>
          Back to Browse Services
        </Link>
      </main>
    );
  }

  if (!service) return <PageLoader label="Loading service..." />;

  const role = session?.user.role as string | undefined;
  const isOwner = session?.user.id === service.vendorId;
  const vendorName =
    service.vendor?.businessName || service.vendor?.name || "Vendor";

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <Link
        href="/services"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Back to services
      </Link>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Gallery */}
        <div className="space-y-3 lg:col-span-3">
          <div className="aspect-[16/10] overflow-hidden rounded-2xl border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={service.images[active]}
              alt={service.serviceName}
              className="size-full object-cover"
            />
          </div>
          {service.images.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {service.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActive(i)}
                  className={cn(
                    "size-16 overflow-hidden rounded-lg border-2",
                    i === active ? "border-primary" : "border-transparent",
                  )}
                  aria-label={`Show image ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5 lg:col-span-2">
          <Badge variant="secondary">{service.category}</Badge>
          <h1 className="font-heading text-4xl font-bold leading-tight">
            {service.serviceName}
          </h1>
          <p className="text-3xl font-semibold text-primary">
            {formatPrice(service.price)}
          </p>
          <p className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="size-4" /> {service.location}
          </p>

          <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
            <Avatar>
              <AvatarImage
                src={service.vendor?.image ?? undefined}
                alt={vendorName}
              />
              <AvatarFallback>
                {vendorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="flex items-center gap-1.5 font-medium">
                {vendorName}
                {service.vendor?.isPremium && (
                  <Crown
                    className="size-4 text-accent"
                    aria-label="Premium vendor"
                  />
                )}
              </p>
              <p className="text-xs text-muted-foreground">Service provider</p>
            </div>
          </div>

          {role === "vendor" ? (
            <p className="rounded-xl bg-secondary p-4 text-sm text-secondary-foreground">
              {isOwner
                ? "This is your own service. You cannot book it."
                : "Vendor accounts cannot submit booking requests. Please use a customer account."}
            </p>
          ) : role === "admin" ? (
            <p className="rounded-xl bg-secondary p-4 text-sm text-secondary-foreground">
              Admin accounts cannot submit booking requests.
            </p>
          ) : (
            <Button
              size="lg"
              className="w-full"
              onClick={() => setBookOpen(true)}
            >
              Request Booking
            </Button>
          )}
        </div>
      </div>

      <section className="mt-10 space-y-3">
        <h2 className="font-heading text-2xl font-semibold">
          About this service
        </h2>
        <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
          {service.description}
        </p>
      </section>

      <BookingDialog
        serviceId={service._id}
        serviceName={service.serviceName}
        open={bookOpen}
        onOpenChange={setBookOpen}
      />
    </main>
  );
}
