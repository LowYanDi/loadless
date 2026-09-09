import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  CalendarDays,
  Check,
  Clock3,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CapacityRing } from "@/components/loadless/capacity-ring";
import { PageHeader } from "@/components/loadless/page-header";
import { StatusPill } from "@/components/loadless/status-pill";
import {
  forecastLoad,
  labelFor,
  levelFor,
  sandbox,
  updatedWeeklyLoad,
  weeklyLoad,
} from "@/data/loadless";
import {
  useLoadLessDemo,
  type DeadlineOption,
  type EffortLevel,
  type SandboxChoice,
} from "@/hooks/use-loadless-demo";

export const Route = createFileRoute("/sandbox")({
  head: () => ({
    meta: [
      { title: "Commitment Sandbox — LoadLess" },
      {
        name: "description",
        content:
          "Simulate a new commitment before you accept it and see exactly what it does to your week, your busiest day and your mental load.",
      },
      { property: "og:title", content: "Commitment Sandbox — LoadLess" },
      {
        property: "og:description",
        content: "Try the commitment on before you say yes: 82% now, 113% if you accept as asked.",
      },
    ],
  }),
  component: Sandbox,
});

function Sandbox() {
  const navigate = useNavigate();
  const {
    sandboxChoice: choice,
    setSandboxChoice: setChoice,
    durationHours,
    setDurationHours,
    effortLevel,
    setEffortLevel,
    deadlineOption,
    setDeadlineOption,
    incomingBreakdown,
    incomingLoad,
    baseCapacity,
    forecastCapacity,
    commitmentTask,
    commitmentCategory,
  } = useLoadLessDemo();
  const options = [
    {
      id: "accept",
      title: "Accept as requested",
      detail: `${commitmentTask} · ${durationHours} hours · due ${deadlineOption}`,
      result: `${forecastCapacity}% · ${labelFor(forecastCapacity).toLowerCase()}`,
      capacity: forecastCapacity,
      level: levelFor(forecastCapacity),
      icon: Check,
    },
    {
      id: "reduce",
      title: "Accept with a realistic plan",
      detail: "Outline plus five slides, errands moved, research delegated",
      result: `${Math.max(0, forecastCapacity - 29)}% · ${labelFor(
        Math.max(0, forecastCapacity - 29),
      ).toLowerCase()}`,
      capacity: Math.max(0, forecastCapacity - 29),
      level: levelFor(Math.max(0, forecastCapacity - 29)),
      icon: Minus,
    },
    {
      id: "decline",
      title: "Decline",
      detail: "Suggest another society member takes it on",
      result: `${baseCapacity}% · unchanged`,
      capacity: baseCapacity,
      level: levelFor(baseCapacity),
      icon: X,
    },
  ];
  const selectedOption = options.find((option) => option.id === choice) ?? options[0]!;
  const choiceDelta = selectedOption.capacity - baseCapacity;
  const forecastScale = incomingLoad / sandbox.added;
  const comparisonData = weeklyLoad.map((day, index) => ({
    ...day,
    forecast:
      choice === "accept"
        ? day.load +
          Math.round(((forecastLoad[index]?.forecast ?? day.load) - day.load) * forecastScale)
        : choice === "reduce"
          ? (updatedWeeklyLoad[index]?.load ?? day.load)
          : day.load,
  }));
  const affectedDay = deadlineOption === "Next week" ? sandbox.affectedDay : deadlineOption;
  const affectedDayCurrent = weeklyLoad.find((day) => day.full === affectedDay)?.load ?? 94;
  const affectedDayForecast =
    comparisonData.find((day) => day.full === affectedDay)?.forecast ?? affectedDayCurrent;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Simulation"
        title="Commitment Sandbox"
        description={`Testing "${commitmentTask}" (${commitmentCategory}) against your current week. Nothing is committed here.`}
      />

      <Card className="overflow-hidden rounded-2xl border-primary/20 shadow-lift">
        <CardHeader className="border-b border-border bg-primary text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4" aria-hidden="true" /> Scenario Lab
            </CardTitle>
            <p className="mt-1 text-xs text-primary-foreground/70">
              Tune the commitment and see its cost before you say yes.
            </p>
          </div>
          <span className="mt-2 w-fit rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold sm:mt-0">
            Every point is explainable
          </span>
        </CardHeader>
        <CardContent className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="duration" className="flex items-center gap-2 text-sm font-semibold">
                  <Clock3 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  Estimated duration
                </label>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold tabular-nums">
                  {durationHours} hour{durationHours === 1 ? "" : "s"}
                </span>
              </div>
              <input
                id="duration"
                type="range"
                min="1"
                max="5"
                step="1"
                value={durationHours}
                onChange={(event) => setDurationHours(Number(event.target.value))}
                className="mt-3 h-2 w-full cursor-pointer accent-primary"
              />
              <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                <span>1 h</span>
                <span>5 h</span>
              </div>
            </div>

            <ScenarioChoice<EffortLevel>
              label="Mental effort"
              value={effortLevel}
              options={["Low", "Medium", "High"]}
              onChange={setEffortLevel}
            />

            <ScenarioChoice<DeadlineOption>
              label="Deadline pressure"
              value={deadlineOption}
              options={["Wednesday", "Friday", "Next week"]}
              onChange={setDeadlineOption}
            />

            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
              onClick={() => {
                setDurationHours(3);
                setEffortLevel("High");
                setDeadlineOption("Wednesday");
                setChoice("accept");
              }}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset judge demo
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Load anatomy</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Why this request costs +{incomingLoad}%
                </p>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-card shadow-sm">
                <Zap className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <LoadFactor label="Time cost" value={incomingBreakdown.time} />
              <LoadFactor label="Focus cost" value={incomingBreakdown.focus} />
              <LoadFactor label="Urgency" value={incomingBreakdown.urgency} />
              <LoadFactor label="Context switch" value={incomingBreakdown.contextSwitch} />
            </div>
            <div className="mt-3 flex items-end justify-between rounded-xl bg-primary p-3 text-primary-foreground">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-primary-foreground/65">
                  Incoming load
                </p>
                <p className="mt-0.5 text-xs text-primary-foreground/75">
                  Added to a {baseCapacity}% week
                </p>
              </div>
              <p className="text-3xl font-bold tabular-nums">+{incomingLoad}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border-border shadow-soft">
          <CardContent className="flex flex-col items-center gap-3 p-5">
            <CapacityRing value={baseCapacity} size={148} caption="right now" />
            <p className="text-sm font-semibold">Current capacity</p>
            <StatusPill level="caution" label="Approaching your limit" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-warning-soft shadow-soft">
          <CardContent className="flex h-full flex-col items-center justify-center gap-2 p-5 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-warning/40">
              <Plus className="h-5 w-5 text-warning-foreground" aria-hidden="true" />
            </span>
            <p className="text-3xl font-bold tabular-nums text-warning-foreground">
              {choiceDelta > 0 ? "+" : ""}
              {choiceDelta}%
            </p>
            <p className="text-sm font-semibold text-warning-foreground">Selected response</p>
            <p className="text-xs text-warning-foreground/80">
              {choice === "accept"
                ? "Full request added to your busiest day"
                : choice === "reduce"
                  ? "Smaller scope with research delegated"
                  : "No additional work added"}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-overload/40 shadow-soft">
          <CardContent className="flex flex-col items-center gap-3 p-5">
            <CapacityRing value={selectedOption.capacity} size={148} caption="with this response" />
            <p className="text-sm font-semibold">Projected capacity</p>
            <StatusPill
              level={selectedOption.level}
              label={selectedOption.result.split(" · ")[1] ?? selectedOption.result}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="rounded-2xl border-border shadow-soft">
          <CardContent className="flex items-start gap-3 p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-overload-soft">
              <Brain className="h-5 w-5 text-overload" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Highest affected area</p>
              <p className="text-lg font-bold">{sandbox.affectedArea}</p>
              <p className="text-xs text-muted-foreground">
                Deck writing is high-focus work stacked on top of two assignments.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border shadow-soft">
          <CardContent className="flex items-start gap-3 p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-overload-soft">
              <CalendarDays className="h-5 w-5 text-overload" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Highest affected day</p>
              <p className="text-lg font-bold">{sandbox.affectedDay}</p>
              <p className="text-xs text-muted-foreground">
                {affectedDay} moves from {affectedDayCurrent}% to {affectedDayForecast}% with this
                response.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Your week, before and after</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  domain={[0, 140]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                  formatter={(v: number) => `${v}%`}
                  labelFormatter={(l: string) => comparisonData.find((d) => d.day === l)?.full ?? l}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  dataKey="load"
                  name="Current"
                  fill="var(--chart-1)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={22}
                />
                <Bar
                  dataKey="forecast"
                  name="With selected response"
                  fill={selectedOption.capacity >= 95 ? "var(--overload)" : "var(--positive)"}
                  radius={[8, 8, 0, 0]}
                  maxBarSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">How do you want to answer?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {options.map((o) => {
            const active = choice === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setChoice(o.id as SandboxChoice)}
                aria-pressed={active}
                className={`grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                  active
                    ? "border-primary bg-secondary"
                    : "border-border bg-background hover:bg-secondary/60"
                }`}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-card">
                  <o.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{o.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{o.detail}</span>
                </span>
                <StatusPill level={o.level} label={o.result} className="hidden sm:inline-flex" />
              </button>
            );
          })}
          <Button
            size="lg"
            className="w-full rounded-xl"
            onClick={() => navigate({ to: "/action-plan" })}
          >
            Find a realistic plan
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={() => navigate({ to: "/lab" })}
          >
            Preview the four-day domino effect
            <Zap className="h-4 w-4" aria-hidden="true" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ScenarioChoice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold">{label}</legend>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition-all ${
              value === option
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-background text-muted-foreground hover:bg-secondary"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function LoadFactor({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-lg font-bold tabular-nums">+{value}%</p>
    </div>
  );
}
