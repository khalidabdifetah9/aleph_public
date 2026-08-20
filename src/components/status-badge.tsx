import { Badge } from "@/components/ui/badge";
import { JOB_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  PAYMENT_PENDING: "bg-coral/15 text-coral border-coral/30",
  PENDING_REVIEW: "bg-gold/15 text-gold border-gold/30",
  POSTED: "bg-mint/15 text-mint border-mint/30",
  ASSIGNED: "bg-primary/10 text-primary border-primary/25",
  CLOSED: "bg-muted text-muted-foreground border-border",
  REJECTED: "bg-destructive/10 text-destructive border-destructive/25",
};

export function JobStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full font-medium", STYLES[status])}
    >
      {status === "POSTED" && (
        <span className="mr-1 size-1.5 rounded-full bg-mint" />
      )}
      {JOB_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}

export function ApplicationStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-gold/15 text-gold border-gold/30",
    ACCEPTED: "bg-mint/15 text-mint border-mint/30",
    REJECTED: "bg-destructive/10 text-destructive border-destructive/25",
  };
  const label: Record<string, string> = {
    PENDING: "Pending",
    ACCEPTED: "Accepted",
    REJECTED: "Not selected",
  };
  return (
    <Badge variant="outline" className={cn("rounded-full", map[status])}>
      {label[status] ?? status}
    </Badge>
  );
}
