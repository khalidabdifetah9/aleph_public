import { ComponentType, ReactNode } from "react";

interface EmptyStateProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e8e8e8] bg-[#fafafa] px-6 py-16 text-center">
      <div className="rounded-full bg-[#f0f0f0] p-4">
        <Icon className="size-8 text-[#6b6b6b]" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[#101010]">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[#6b6b6b]">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}