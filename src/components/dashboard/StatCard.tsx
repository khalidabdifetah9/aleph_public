import { ComponentType } from "react";

interface StatCardProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  trend?: string;
}

export function StatCard({ icon: Icon, label, value, trend }: StatCardProps) {
  return (
    <div className="group border-r border-[#e8e8e8] bg-white p-6 transition-all hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#6b6b6b]">{label}</p>
          <p className="mt-1.5 font-display text-3xl font-semibold text-[#101010]">
            {value}
          </p>
          {trend && (
            <p className="mt-1 text-xs text-[#6b6b6b]">{trend}</p>
          )}
        </div>
        <div className="rounded-xl bg-[#f5f5f5] p-2.5 group-hover:bg-[#cdeb00]/10 transition-colors">
          <Icon className="size-5 text-[#6b6b6b] group-hover:text-[#cdeb00] transition-colors" />
        </div>
      </div>
    </div>
  );
}