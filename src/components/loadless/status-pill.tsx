import { cn } from "@/lib/utils";
import type { LoadLevel } from "@/data/loadless";

const styles: Record<LoadLevel, string> = {
  healthy: "bg-positive-soft text-positive border-positive/30",
  caution: "bg-warning-soft text-warning-foreground border-warning/50",
  overload: "bg-overload-soft text-overload border-overload/30",
};

const faces: Record<LoadLevel, string> = {
  healthy: "😊",
  caution: "😮‍💨",
  overload: "😭",
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
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        styles[level],
        className,
      )}
    >
      <span className="emoji-sticker text-sm" aria-hidden="true">
        {faces[level]}
      </span>
      {label}
    </span>
  );
}
