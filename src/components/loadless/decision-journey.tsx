import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const steps = [
  { to: "/hidden-load", short: "Capture", label: "Reveal the request" },
  { to: "/sandbox", short: "Simulate", label: "Test the impact" },
  { to: "/action-plan", short: "Rebalance", label: "Create room" },
  { to: "/boundary", short: "Respond", label: "Set the boundary" },
  { to: "/after", short: "Recover", label: "Protect the result" },
] as const;

export function DecisionJourney({ pathname }: { pathname: string }) {
  const currentIndex = steps.findIndex((step) => step.to === pathname);
  if (currentIndex < 0) return null;

  return (
    <section
      aria-label="Decision journey"
      className="mb-6 overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Decision journey
        </p>
        <p className="text-xs font-semibold tabular-nums">
          Step {currentIndex + 1} of {steps.length}
        </p>
      </div>
      <div className="grid grid-cols-5">
        {steps.map((step, index) => {
          const completed = index < currentIndex;
          const current = index === currentIndex;

          return (
            <Link
              key={step.to}
              to={step.to}
              aria-current={current ? "step" : undefined}
              aria-label={`${step.short}: ${step.label}`}
              className={cn(
                "relative flex min-w-0 flex-col items-center gap-1 px-1 py-3 text-center transition-colors hover:bg-secondary/60",
                current && "bg-secondary",
              )}
            >
              {index > 0 ? (
                <span
                  className={cn(
                    "absolute left-0 top-[1.7rem] h-px w-1/2",
                    index <= currentIndex ? "bg-positive" : "bg-border",
                  )}
                  aria-hidden="true"
                />
              ) : null}
              {index < steps.length - 1 ? (
                <span
                  className={cn(
                    "absolute right-0 top-[1.7rem] h-px w-1/2",
                    index < currentIndex ? "bg-positive" : "bg-border",
                  )}
                  aria-hidden="true"
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10 grid h-6 w-6 place-items-center rounded-full border text-[10px] font-bold tabular-nums",
                  completed && "border-positive bg-positive text-positive-foreground",
                  current &&
                    "border-primary bg-primary text-primary-foreground ring-4 ring-primary/10",
                  !completed && !current && "border-border bg-card text-muted-foreground",
                )}
              >
                {completed ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : index + 1}
              </span>
              <span
                className={cn(
                  "relative z-10 max-w-full truncate text-[10px] font-semibold sm:text-xs",
                  current ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.short}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
