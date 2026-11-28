"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, UserCog } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user ?? null;
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Bespoke Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <circle cx="9" cy="13" r="6" />
              <circle cx="15" cy="11" r="6" />
              <path d="M15 5l1.5-2.5L18 5" />
            </svg>
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-primary">
            WedPlan
          </span>
        </Link>

        {/* Desktop links (always centered) */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive(link.href) ? "text-primary" : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar>
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  <LayoutDashboard className="size-4" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/profile")}
                >
                  <UserCog className="size-4" /> Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="size-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/sign-in"
                className={buttonVariants({ variant: "ghost" })}
              >
                Sign In
              </Link>
              <Link href="/sign-up" className={buttonVariants()}>
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-72">
          <SheetTitle className="px-4 pt-4 font-serif text-2xl font-bold text-primary">
            WedPlan
          </SheetTitle>
          <nav className="flex flex-col gap-1 px-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary",
                  isActive(link.href) ? "text-primary" : "text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
                >
                  Profile Settings
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="rounded-md px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants(), "mt-2")}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
