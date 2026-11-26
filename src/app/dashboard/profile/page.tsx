"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import PageLoader from "@/components/shared/PageLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient, useSession } from "@/lib/auth-client";
import { uploadImage } from "@/lib/upload";

export default function ProfileSettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const user = session?.user;

  if (!user) return <PageLoader label="Loading profile..." />;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const businessName = String(form.get("businessName") ?? "").trim();

    if (name.length < 2)
      return toast.error("Name must be at least 2 characters");
    if (user!.role === "vendor" && !businessName)
      return toast.error("Business name is required for vendors");

    setLoading(true);
    try {
      let image = user!.image ?? undefined;
      if (file) image = await uploadImage(file);

      const { error } = await authClient.updateUser({
        name,
        image,
        ...(user!.role === "vendor" ? { businessName } : {}),
      });
      if (error) throw new Error(error.message ?? "Failed to update profile");

      toast.success("Profile updated successfully");
      setFile(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-heading text-3xl font-bold text-primary">
        Profile Settings
      </h1>

      <div className="flex items-center gap-4 rounded-2xl border bg-card p-5">
        <Avatar className="size-16">
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback className="text-xl">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{user.name}</p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          <Badge variant="secondary" className="mt-1 capitalize">
            {user.role}
          </Badge>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border bg-card p-5 sm:p-6"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" defaultValue={user.name} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user.email} disabled readOnly />
        </div>

        {user.role === "vendor" && (
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              name="businessName"
              defaultValue={user.businessName ?? ""}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="image">Profile Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          {file && (
            <p className="text-xs text-muted-foreground">
              Selected: {file.name}
            </p>
          )}
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
