import { Card, CardContent } from "@/components/ui/card";
import { ComponentType } from "react";

interface StatCardProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number;
  accent: "indigo" | "coral" | "green" | "amber";
}

export function StatCard({ icon: Icon, label, value, accent }: StatCardProps) {
  const accentColors = {
    indigo: "bg-indigo-50 text-indigo-600",
    coral: "bg-coral-50 text-coral-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <Card className="border-[#e8e8e8] shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className={`rounded-xl p-2.5 ${accentColors[accent]}`}>
            <Icon className="size-5" />
          </div>
          <div>
            <p className="font-display text-2xl font-semibold text-[#101010] leading-none">
              {value}
            </p>
            <p className="mt-1 text-xs text-[#6b6b6b]">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}