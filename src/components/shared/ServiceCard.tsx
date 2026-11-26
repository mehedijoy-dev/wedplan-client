import Link from "next/link";
import { Crown, MapPin } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import type { Service } from "@/types";

export default function ServiceCard({ service }: { service: Service }) {
  const vendorName =
    service.vendor?.businessName || service.vendor?.name || "Vendor";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-lg">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.images[0]}
          alt={service.serviceName}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Badge variant="secondary" className="w-fit">
          {service.category}
        </Badge>
        <h3 className="line-clamp-1 font-heading text-xl font-semibold">
          {service.serviceName}
        </h3>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-primary">
            {formatPrice(service.price)}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-3.5" /> {service.location}
          </span>
        </div>
        <div className="flex items-center gap-2 border-t pt-3 text-sm">
          <Avatar className="size-6">
            <AvatarImage
              src={service.vendor?.image ?? undefined}
              alt={vendorName}
            />
            <AvatarFallback className="text-xs">
              {vendorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-muted-foreground">{vendorName}</span>
          {service.vendor?.isPremium && (
            <Crown
              className="size-3.5 shrink-0 text-accent"
              aria-label="Premium vendor"
            />
          )}
        </div>
        <Link
          href={`/services/${service._id}`}
          className={buttonVariants({ className: "mt-auto w-full" })}
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
