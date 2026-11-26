import Link from "next/link";
import { Heart, Mail, MapPin, Phone } from "lucide-react";

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
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        {/* Brand */}
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="size-5 fill-primary text-primary" />
            <span className="font-heading text-2xl font-bold text-primary">
              WedPlan
            </span>
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">
            Discover trusted wedding vendors, compare services and request
            bookings, all in one place.
          </p>
        </div>

        {/* Links */}
        <div className="space-y-3">
          <h3 className="font-heading text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + Social */}
        <div className="space-y-3">
          <h3 className="font-heading text-lg font-semibold">Contact</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-primary" /> hello@wedplan.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-primary" /> +880 1XXX-XXXXXX
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" /> Dhaka, Bangladesh
            </li>
          </ul>
          <div className="flex flex-wrap gap-2 pt-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-2 border-t px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} WedPlan. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-primary">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
