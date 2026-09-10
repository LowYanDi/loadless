import { cn } from "@/lib/utils";
import { levelFor, type LoadLevel } from "@/data/loadless";
import { useEffect, useState } from "react";
import { capacityMood } from "@/lib/capacity-mood";

const strokeFor: Record<LoadLevel, string> = {
  healthy: "var(--positive)",
  caution: "var(--warning)",
  overload: "var(--overload)",
};

export function CapacityRing({
  value,
  size = 200,
  caption,
  className,
}: {
  value: number;
  size?: number;
  caption?: string;
  className?: string;
}) {
  const level = levelFor(value);
  const mood = capacityMood(value);
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const [displayedValue, setDisplayedValue] = useState(0);
  const pct = Math.min(displayedValue, 100) / 100;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setDisplayedValue(value));
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Weekly capacity ${value} percent. ${mood.label}`}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--muted)" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={strokeFor[level]}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="capacity-mood-face text-3xl" aria-hidden="true">
          {mood.emoji}
        </span>
        <span className="mt-0.5 text-3xl font-bold tabular-nums tracking-tight">
          {displayedValue}%
        </span>
        <span className="mt-0.5 max-w-[7.5rem] text-[11px] font-semibold leading-tight text-muted-foreground">
          {caption ?? mood.shortLabel}
        </span>
      </div>
    </div>
  );
}
