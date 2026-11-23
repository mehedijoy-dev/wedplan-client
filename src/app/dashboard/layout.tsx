"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarCheck,
  Crown,
  LayoutDashboard,
  Package,
  PlusCircle,
  ReceiptText,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import PageLoader from "@/components/shared/PageLoader";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type Role = "vendor" | "customer" | "admin";
type NavItem = { href: string; label: string; icon: LucideIcon };

const navByRole: Record<Role, NavItem[]> = {
  vendor: [
    { href: "/dashboard/vendor", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/vendor/services", label: "My Services", icon: Package },
    {
      href: "/dashboard/vendor/services/add",
      label: "Add Service",
      icon: PlusCircle,
    },
    {
      href: "/dashboard/vendor/bookings",
      label: "Booking Requests",
      icon: CalendarCheck,
    },
    {
      href: "/dashboard/vendor/subscription",
      label: "Subscription",
      icon: Crown,
    },
    { href: "/dashboard/profile", label: "Profile Settings", icon: UserCog },
  ],
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    {
      href: "/dashboard/customer/bookings",
      label: "My Bookings",
      icon: CalendarCheck,
    },
    { href: "/dashboard/profile", label: "Profile Settings", icon: UserCog },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    {
      href: "/dashboard/admin/services",
      label: "Manage Services",
      icon: Package,
    },
    {
      href: "/dashboard/admin/transactions",
      label: "Transactions",
      icon: ReceiptText,
    },
    { href: "/dashboard/profile", label: "Profile Settings", icon: UserCog },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const rawRole = session?.user.role as string | undefined;
  const role: Role =
    rawRole === "vendor" || rawRole === "admin" ? rawRole : "customer";

  // /dashboard/<vendor|customer|admin>/... e onno role er area te dhukle block
  const area = pathname.split("/")[2];
  const wrongArea =
    ["vendor", "customer", "admin"].includes(area) && area !== role;

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.replace("/sign-in");
    } else if (wrongArea) {
      toast.error("You don't have access to that dashboard");
      router.replace(`/dashboard/${role}`);
    }
  }, [isPending, session, wrongArea, role, router]);

  if (isPending || !session || wrongArea) return <PageLoader />;

  if (session.user.isBlocked) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-destructive">
          Account Blocked
        </h1>
        <p className="max-w-md text-muted-foreground">
          Your account has been blocked by an administrator. Please contact
          support for help.
        </p>
      </div>
    );
  }

  const items = navByRole[role];
  const active = items
    .filter((i) => pathname === i.href || pathname.startsWith(i.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row">
      <aside className="md:w-60 md:shrink-0">
        <p className="hidden px-3 pb-3 font-heading text-xl font-semibold capitalize md:block">
          {role} Panel
        </p>
        <nav className="flex gap-2 overflow-x-auto pb-1 md:sticky md:top-24 md:flex-col md:overflow-visible">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active?.href === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="min-w-0 flex-1">{children}</section>
    </div>
  );
}
