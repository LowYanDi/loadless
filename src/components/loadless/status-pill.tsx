import { AlertTriangle, CheckCircle2, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LoadLevel } from "@/data/loadless";

const styles: Record<LoadLevel, string> = {
  healthy: "bg-positive-soft text-positive border-positive/30",
  caution: "bg-warning-soft text-warning-foreground border-warning/50",
  overload: "bg-overload-soft text-overload border-overload/30",
};

const icons: Record<LoadLevel, typeof CheckCircle2> = {
  healthy: CheckCircle2,
  caution: AlertTriangle,
  overload: TriangleAlert,
};

export function StatusPill({
  level,
  label,
  className,
}: {
  level: LoadLevel;
  label: string;
  className?: string;
}) {
  const Icon = icons[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        styles[level],
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {label}
    </span>
  );
}
