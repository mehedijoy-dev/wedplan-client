import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-[70vh] flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-5xl font-semibold text-primary">WedPlan</h1>
      <p className="max-w-md text-muted-foreground">
        Discover trusted wedding vendors and request bookings in one place.
      </p>
      <Button>Explore Wedding Services</Button>
    </main>
  );
}
