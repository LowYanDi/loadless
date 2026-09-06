import { cn } from "@/lib/utils";
import { levelFor, type LoadLevel } from "@/data/loadless";

const fill: Record<LoadLevel, string> = {
  healthy: "bg-positive",
  caution: "bg-warning",
  overload: "bg-overload",
};

const wordFor: Record<LoadLevel, string> = {
  healthy: "Comfortable",
  caution: "Heavy",
  overload: "Overloaded",
};

export function CategoryBar({
  label,
  value,
  detail,
  className,
}: {
  label: string;
  value: number;
  detail?: string;
  className?: string;
}) {
  const level = levelFor(value);
  return (
    <div className={cn("space-y-2", className)}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
        <span className="truncate text-sm font-semibold">{label}</span>
        <span className="shrink-0 text-sm font-semibold tabular-nums">{value}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", fill[level])}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        {detail ? (
          <p className="min-w-0 truncate text-xs text-muted-foreground">{detail}</p>
        ) : (
          <span />
        )}
        <span className="shrink-0 text-xs font-medium text-muted-foreground">{wordFor[level]}</span>
      </div>
    </div>
  );
}
