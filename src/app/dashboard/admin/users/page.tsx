"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import ConfirmDialog from "@/components/shared/ConfirmDialog";
import PageLoader from "@/components/shared/PageLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { AppUser } from "@/types";

export default function ManageUsersPage() {
  const [users, setUsers] = useState<AppUser[] | null>(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [selected, setSelected] = useState<AppUser | null>(null);
  const [toBlock, setToBlock] = useState<AppUser | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (role) params.set("role", role);
        const d = await apiFetch<{ users: AppUser[] }>(
          `/api/admin/users?${params.toString()}`,
        );
        setUsers(d.users);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load users");
        setUsers([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [search, role]);

  async function setBlocked(u: AppUser, isBlocked: boolean) {
    setBusy(true);
    try {
      await apiFetch(`/api/admin/users/${u._id}/block`, {
        method: "PATCH",
        body: JSON.stringify({ isBlocked }),
      });
      setUsers((prev) =>
        prev!.map((x) => (x._id === u._id ? { ...x, isBlocked } : x)),
      );
      toast.success(isBlocked ? "User blocked" : "User unblocked");
      setToBlock(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-primary">
        Manage Users
      </h1>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="">All roles</option>
          <option value="customer">Customers</option>
          <option value="vendor">Vendors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {!users ? (
        <PageLoader label="Loading users..." />
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          No users found.
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div
              key={u._id}
              className="flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center"
            >
              <Avatar>
                <AvatarImage src={u.image ?? undefined} alt={u.name} />
                <AvatarFallback>
                  {u.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-semibold">{u.name}</p>
                  <Badge variant="secondary" className="capitalize">
                    {u.role}
                  </Badge>
                  {u.isBlocked && <Badge variant="destructive">Blocked</Badge>}
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {u.email}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelected(u)}
                >
                  Details
                </Button>
                {u.role !== "admin" &&
                  (u.isBlocked ? (
                    <Button
                      size="sm"
                      disabled={busy}
                      onClick={() => setBlocked(u, false)}
                    >
                      Unblock
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setToBlock(u)}
                    >
                      Block
                    </Button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(o) => !o && setSelected(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd>{selected.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd>{selected.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Role</dt>
                <dd className="capitalize">{selected.role}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Status</dt>
                <dd>{selected.isBlocked ? "Blocked" : "Active"}</dd>
              </div>
              {selected.role === "vendor" && (
                <>
                  <div>
                    <dt className="text-muted-foreground">Business name</dt>
                    <dd>{selected.businessName || "Not set"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Subscription plan</dt>
                    <dd className="capitalize">
                      {selected.subscriptionPlan || "free"}
                    </dd>
                  </div>
                  {selected.subscriptionExpiresAt && (
                    <div>
                      <dt className="text-muted-foreground">Plan expires</dt>
                      <dd>{formatDate(selected.subscriptionExpiresAt)}</dd>
                    </div>
                  )}
                </>
              )}
              <div>
                <dt className="text-muted-foreground">Joined</dt>
                <dd>{formatDate(selected.createdAt)}</dd>
              </div>
            </dl>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(toBlock)}
        onOpenChange={(o) => !o && setToBlock(null)}
        title={`Block ${toBlock?.name ?? "this user"}?`}
        description="Blocked users cannot access protected features such as dashboards, bookings and service management."
        confirmLabel="Block user"
        loading={busy}
        onConfirm={() => toBlock && setBlocked(toBlock, true)}
      />
    </div>
  );
}
