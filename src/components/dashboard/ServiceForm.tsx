"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import { uploadImage } from "@/lib/upload";
import type { Service } from "@/types";

const fieldClass =
  "w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function ServiceForm({ service }: { service?: Service }) {
  const router = useRouter();
  const isEdit = Boolean(service);
  const [loading, setLoading] = useState(false);
  const [existing, setExisting] = useState<string[]>(service?.images ?? []);
  const [files, setFiles] = useState<File[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      serviceName: String(form.get("serviceName") ?? "").trim(),
      category: String(form.get("category") ?? ""),
      description: String(form.get("description") ?? "").trim(),
      price: Number(form.get("price")),
      location: String(form.get("location") ?? "").trim(),
    };

    if (!payload.serviceName) return toast.error("Service name is required");
    if (!payload.category) return toast.error("Please select a category");
    if (payload.description.length < 10)
      return toast.error("Description must be at least 10 characters");
    if (!(payload.price > 0)) return toast.error("Enter a valid price");
    if (!payload.location) return toast.error("Location is required");
    const total = existing.length + files.length;
    if (total === 0) return toast.error("Please upload at least one image");
    if (total > 5) return toast.error("Maximum 5 images allowed");

    setLoading(true);
    try {
      const uploaded = await Promise.all(files.map(uploadImage));
      await apiFetch(
        isEdit
          ? `/api/vendor/services/${service!._id}`
          : "/api/vendor/services",
        {
          method: isEdit ? "PATCH" : "POST",
          body: JSON.stringify({
            ...payload,
            images: [...existing, ...uploaded],
          }),
        },
      );
      toast.success(
        isEdit ? "Service updated" : "Service submitted for admin approval",
      );
      router.push("/dashboard/vendor/services");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border bg-card p-5 sm:p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="serviceName">Service Name</Label>
        <Input
          id="serviceName"
          name="serviceName"
          defaultValue={service?.serviceName}
          placeholder="e.g. Cinematic Wedding Photography"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            defaultValue={service?.category ?? ""}
            className={fieldClass}
          >
            <option value="" disabled>
              Select category
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (BDT)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="1"
            defaultValue={service?.price}
            placeholder="e.g. 50000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          defaultValue={service?.location}
          placeholder="e.g. Dhaka"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={service?.description}
          placeholder="Describe what is included in this service..."
          className={fieldClass}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Images (1 to 5)</Label>
        {existing.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {existing.map((url) => (
              <div key={url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt="Service"
                  className="size-20 rounded-lg border object-cover"
                />
                <button
                  type="button"
                  onClick={() => setExisting((p) => p.filter((u) => u !== url))}
                  className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white"
                  aria-label="Remove image"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <Input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        />
        {files.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {files.length} new image(s) selected
          </p>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading && <Loader2 className="size-4 animate-spin" />}
        {loading ? "Saving..." : isEdit ? "Update Service" : "Submit Service"}
      </Button>
    </form>
  );
}
