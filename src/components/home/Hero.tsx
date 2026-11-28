"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const BG =
  "https://irp.cdn-website.com/28cd0bb4/dms3rep/multi/opt/traditional+american+wedding-1920w.jpeg";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[90vh] items-center justify-center overflow-hidden bg-black py-20">
      {/* Background Image with Slow Zoom Animation */}
      <div className="absolute inset-0 -z-25 overflow-hidden">
        <motion.img
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          src={BG}
          alt="Joyful Wedding Celebration"
          className="absolute inset-0 size-full object-cover object-center"
        />
      </div>

      {/* Rich Dark Luxury Gradient Overlay */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-black/75 via-black/45 to-black/85 backdrop-blur-[1px]" />

      <div className="mx-auto max-w-4xl px-4 text-center text-white relative z-10 space-y-8">
        {/* Top Glowing Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-accent text-xs sm:text-sm font-medium backdrop-blur-md shadow-lg"
        >
          <Sparkles className="size-4 animate-pulse" />
          <span>Plan Your Perfect Day With Elegance</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]"
        >
          Your Dream Wedding, <br />
          <span className="bg-gradient-to-r from-accent via-pink-200 to-white bg-clip-text text-transparent">
            Beautifully Planned
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-2xl text-base sm:text-lg text-gray-300 font-light leading-relaxed"
        >
          Discover trusted photographers, breathtaking venues, master decorators
          and luxury caterers, all curated in one magnificent platform.
        </motion.p>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center pt-4"
        >
          <Link
            href="/services"
            className={buttonVariants({
              size: "lg",
              className:
                "h-14 px-8 rounded-full bg-accent text-accent-foreground font-medium shadow-xl hover:bg-accent/90 hover:scale-105 transition-all duration-300 group border border-accent/30 text-base",
            })}
          >
            <span>Explore Wedding Services</span>
            <ArrowRight className="size-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
