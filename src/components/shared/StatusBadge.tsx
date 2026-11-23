import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  accepted: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-muted text-muted-foreground",
  success: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-800",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("border-transparent capitalize", styles[status])}
    >
      {status}
    </Badge>
  );
}
