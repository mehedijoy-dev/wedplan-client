import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <p className="font-heading text-7xl font-bold text-primary">404</p>
      <h1 className="font-heading text-3xl font-semibold">Page not found</h1>
      <p className="max-w-md text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className={buttonVariants()}>
        Back to Home
      </Link>
    </main>
  );
}
