import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BatteryMedium, Brain, CheckCircle2, Moon, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { CapacityRing } from "@/components/loadless/capacity-ring";
import { PageHeader } from "@/components/loadless/page-header";
import { StatusPill } from "@/components/loadless/status-pill";
import { labelFor, levelFor, sandbox } from "@/data/loadless";
import { calculateCheckInAdjustment, useLoadLessDemo } from "@/hooks/use-loadless-demo";

export const Route = createFileRoute("/check-in")({
  head: () => ({
    meta: [
      { title: "60-second Check-in — Easey" },
      {
        name: "description",
        content:
          "Update today's energy, sleep and stress so your workload capacity reflects reality.",
      },
    ],
  }),
  component: CheckInPage,
});

function CheckInPage() {
  const { checkIn, saveCheckIn, taskCapacityAdjustment } = useLoadLessDemo();
  const [energy, setEnergy] = useState(checkIn.energy);
  const [sleepHours, setSleepHours] = useState(checkIn.sleepHours);
  const [stress, setStress] = useState(checkIn.stress);

  const adjustment = calculateCheckInAdjustment({ energy, sleepHours, stress });
  const previewCapacity = Math.max(
    0,
    Math.min(150, sandbox.current + taskCapacityAdjustment + adjustment),
  );

  const resetInputs = () => {
    setEnergy(3);
    setSleepHours(7);
    setStress(3);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Daily reality check"
        title="60-second check-in"
        description="The same task list can feel very different after poor sleep or a demanding day. Update three inputs before trusting the score."
      />

      {checkIn.completed ? (
        <div className="flex items-start gap-3 rounded-2xl border border-positive/30 bg-positive-soft p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-positive" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold">Today’s check-in is active</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Update it whenever your energy or pressure changes. The dashboard will recalculate
              immediately.
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card className="rounded-2xl border-border shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">How are you working today?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-7">
            <CheckInSlider
              icon={BatteryMedium}
              label="Energy"
              value={energy}
              display={`${energy}/5 · ${energy <= 2 ? "Low" : energy >= 4 ? "Strong" : "Steady"}`}
              min={1}
              max={5}
              step={1}
              onChange={setEnergy}
              lowLabel="Drained"
              highLabel="Energised"
            />
            <CheckInSlider
              icon={Moon}
              label="Sleep last night"
              value={sleepHours}
              display={`${sleepHours.toFixed(1)} hours`}
              min={3}
              max={10}
              step={0.5}
              onChange={setSleepHours}
              lowLabel="3 h"
              highLabel="10 h"
            />
            <CheckInSlider
              icon={Brain}
              label="Current stress"
              value={stress}
              display={`${stress}/5 · ${stress <= 2 ? "Low" : stress >= 4 ? "High" : "Moderate"}`}
              min={1}
              max={5}
              step={1}
              onChange={setStress}
              lowLabel="Calm"
              highLabel="Under pressure"
            />

            <div className="flex flex-wrap gap-2">
              <Button
                className="rounded-xl"
                onClick={() => {
                  saveCheckIn({ energy, sleepHours, stress });
                  toast.success("Capacity updated from today’s check-in");
                }}
              >
                Save today’s check-in
              </Button>
              <Button variant="ghost" className="rounded-xl" onClick={resetInputs}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" /> Neutral baseline
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-primary/20 shadow-lift">
          <CardContent className="flex h-full flex-col items-center justify-center gap-3 p-5 text-center">
            <CapacityRing value={previewCapacity} size={164} caption="preview" />
            <div>
              <p className="text-sm font-semibold">Today’s adjusted capacity</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Check-in effect: {adjustment > 0 ? "+" : ""}
                {adjustment} points
              </p>
            </div>
            <StatusPill level={levelFor(previewCapacity)} label={labelFor(previewCapacity)} />
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-border bg-secondary/60 shadow-soft">
        <CardContent className="grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div>
            <p className="text-sm font-semibold">What changes the score?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Lower energy, less sleep and higher stress reduce usable capacity. Easey uses these
              inputs as a transparent planning adjustment, not a medical assessment.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/">
              View dashboard <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function CheckInSlider({
  icon: Icon,
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
  lowLabel,
  highLabel,
}: {
  icon: typeof BatteryMedium;
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  lowLabel: string;
  highLabel: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" /> {label}
        </p>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold tabular-nums">
          {display}
        </span>
      </div>
      <Slider
        className="mt-4"
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(values) => onChange(values[0] ?? value)}
        aria-label={label}
      />
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
