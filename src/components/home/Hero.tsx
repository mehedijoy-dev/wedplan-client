"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { buttonVariants } from "@/components/ui/button";

const BG =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[80vh] items-center justify-center overflow-hidden bg-primary">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BG}
        alt=""
        className="absolute inset-0 -z-20 size-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      <div className="mx-auto max-w-3xl px-4 text-center text-white">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-accent"
        >
          Plan your perfect day
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-5xl font-bold leading-tight sm:text-6xl md:text-7xl"
        >
          Your Dream Wedding, Beautifully Planned
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-5 max-w-xl text-base text-white/85 sm:text-lg"
        >
          Discover trusted photographers, venues, decorators and more, compare
          services and request bookings in one place.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <Link
            href="/services"
            className={buttonVariants({
              size: "lg",
              className:
                "h-12 bg-accent px-8 text-base text-accent-foreground hover:bg-accent/90",
            })}
          >
            Explore Wedding Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
