"use client";
import { getRedirectTarget } from "@/lib/redirect";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

const passwordRule = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"customer" | "vendor">("customer");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const businessName = String(form.get("businessName") ?? "").trim();
    const file = form.get("image");

    if (!name) return toast.error("Full name is required");
    if (!email) return toast.error("Email is required");
    if (!passwordRule.test(password)) {
      return toast.error(
        "Password must be 6+ characters with one uppercase and one lowercase letter",
      );
    }
    if (role === "vendor" && !businessName) {
      return toast.error("Business name is required for vendors");
    }

    setLoading(true);
    try {
      let image: string | undefined;
      if (file instanceof File && file.size > 0) {
        const fd = new FormData();
        fd.append("image", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Image upload failed");
        image = data.url;
      }

      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image,
        role,
        ...(role === "vendor" ? { businessName } : {}),
      });

      if (error) {
        toast.error(error.message ?? "Sign up failed");
        return;
      }

      toast.success("Account created successfully!");
      router.push(getRedirectTarget());
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: getRedirectTarget(),
    });
    if (error) toast.error(error.message ?? "Google sign up failed");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="space-y-1 text-center">
          <h1 className="font-heading text-3xl font-bold text-primary">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Join WedPlan as a customer or a vendor
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {(["customer", "vendor"] as const).map((r) => (
              <label
                key={r}
                className="cursor-pointer rounded-lg border p-3 text-center text-sm font-medium capitalize transition-colors has-[:checked]:border-primary has-[:checked]:bg-secondary has-[:checked]:text-primary"
              >
                <input
                  type="radio"
                  name="role"
                  value={r}
                  checked={role === r}
                  onChange={() => setRole(r)}
                  className="sr-only"
                />
                {r}
              </label>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="Your full name" />
          </div>

          {role === "vendor" && (
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                name="businessName"
                placeholder="e.g. Dream Moments Studio"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Min 6 chars, upper and lower case"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Profile Image (optional)</Label>
            <Input id="image" name="image" type="file" accept="image/*" />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> OR{" "}
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogle}>
          Continue with Google
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
