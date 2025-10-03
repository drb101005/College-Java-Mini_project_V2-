import { cn } from "@/lib/utils";

interface StatsBadgeProps {
  count: number;
  label: string;
  className?: string;
  icon?: React.ReactNode;
}

export function StatsBadge({ count, label, className, icon }: StatsBadgeProps) {
  return (
    <div className={cn("flex items-center gap-1.5 text-sm text-muted-foreground", className)}>
      {icon}
      <span className="font-medium">{count}</span>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}
