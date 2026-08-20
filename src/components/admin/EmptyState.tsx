import { Card, CardContent } from "@/components/ui/card";
import { ComponentType } from "react";

interface EmptyStateProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  compact?: boolean;
}

export function EmptyState({ icon: Icon, title, description, compact = false }: EmptyStateProps) {
  return (
    <Card className={`border-2 border-dashed border-[#e8e8e8] bg-[#fafafa] ${compact ? '' : 'py-12'}`}>
      <CardContent className={`text-center ${compact ? 'p-6' : 'p-12'}`}>
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#f0f0f0]">
          <Icon className="size-6 text-[#6b6b6b]" />
        </div>
        <p className={`mt-3 font-medium text-[#101010] ${compact ? 'text-sm' : 'text-lg'}`}>
          {title}
        </p>
        <p className={`text-[#6b6b6b] ${compact ? 'text-xs' : 'text-sm'}`}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
}