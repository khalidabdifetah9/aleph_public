import { CheckCircle2 } from "lucide-react";

interface ProfileCheckProps {
  label: string;
  status: "complete" | "missing";
}

export function ProfileCheck({ label, status }: ProfileCheckProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-[#fafafa] p-3">
      <span className="text-sm text-[#6b6b6b]">{label}</span>
      {status === "complete" ? (
        <CheckCircle2 className="size-4 text-[#cdeb00]" />
      ) : (
        <span className="text-xs font-medium text-[#6b6b6b]">Add</span>
      )}
    </div>
  );
}