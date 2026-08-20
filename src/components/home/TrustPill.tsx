import { ComponentType } from "react";

interface TrustPillProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
}

export function TrustPill({ icon: Icon, label }: TrustPillProps) {
  return (
    <span className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
      <Icon className="size-4 text-primary" />
      {label}
    </span>
  );
}