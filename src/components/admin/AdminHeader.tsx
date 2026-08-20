import { Sparkles } from "lucide-react";

export function AdminHeader() {
  return (
    <div className="mb-8">
      <h1 className="mt-1 font-display text-3xl font-semibold text-[#101010] tracking-tight">
        Review Queue
      </h1>
      <p className="mt-1 text-[#6b6b6b]">
        Verify people and approve jobs before they go live to the community.
      </p>
    </div>
  );
}