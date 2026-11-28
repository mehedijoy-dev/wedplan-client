import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Sign Up" },
];

const socials = [
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="border-t bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        {/* Mobile & Tablet: 2 Columns | PC: 3 Columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 lg:gap-12">
          {/* Brand Info: Mobile & Tablet-e full width (col-span-2), PC-te 1 column */}
          <div className="col-span-2 space-y-3 md:col-span-1">
            <Link href="/" className="group inline-flex items-center gap-2.5">
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
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Discover trusted wedding vendors, compare services and request
              bookings, all in one place.
            </p>
          </div>

          {/* Quick Links: Mobile-e Left Column */}
          <div className="space-y-3">
            <h3 className="font-serif text-base font-semibold tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Social: Mobile-e Right Column */}
          <div className="space-y-3">
            <h3 className="font-serif text-base font-semibold tracking-wide">
              Contact
            </h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="break-all">hello@wedplan.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary" />
                <span>+880 1XXX-XXXXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-primary" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border bg-background/50 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} WedPlan. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-primary"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
