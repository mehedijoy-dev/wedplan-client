import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: {
    default: "WedPlan | Wedding Planning Platform",
    template: "%s | WedPlan",
  },
  description:
    "Discover trusted wedding vendors, compare services and request bookings, all in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased font-sans scroll-smooth",
        outfit.variable,
        playfair.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/20">
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
