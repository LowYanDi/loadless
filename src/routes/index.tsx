import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock,
  HeartPulse,
  Info,
  ListTodo,
  TrendingUp,
  WandSparkles,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CapacityRing } from "@/components/loadless/capacity-ring";
import { CategoryBar } from "@/components/loadless/category-bar";
import { StatusPill } from "@/components/loadless/status-pill";
import {
  categories,
  labelFor,
  levelFor,
  scoreFactors,
  updatedWeeklyLoad,
  user,
  weeklyLoad,
} from "@/data/loadless";
import { taskImpact, taskLoadLevel } from "@/data/tasks";
import { useLoadLessDemo } from "@/hooks/use-loadless-demo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Capacity Dashboard — LoadLess" },
      {
        name: "description",
        content:
          "See Aina's weekly capacity at a glance: load by category, the busiest day, and what is coming up next.",
      },
      { property: "og:title", content: "Capacity Dashboard — LoadLess" },
      {
        property: "og:description",
        content: "Your weekly capacity, load categories and upcoming commitments in one calm view.",
      },
    ],
  }),
  component: Dashboard,
});

const barColor = (v: number) =>
  v >= 90 ? "var(--overload)" : v >= 75 ? "var(--warning)" : "var(--positive)";

function Dashboard() {
  const [showFactors, setShowFactors] = useState(false);
  const { completed, currentCapacity, tasks, checkIn, checkInAdjustment } = useLoadLessDemo();
  const displayedWeek = completed ? updatedWeeklyLoad : weeklyLoad;
  const status = completed ? "Back within a realistic range" : labelFor(currentCapacity);
  const activeTasks = tasks.filter((task) => task.status === "pending").slice(0, 5);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Week 9 · Semester 1
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Good afternoon, {user.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Know your capacity before you say yes.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/tasks"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary">
              <ListTodo className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">Manage commitments</span>
              <span className="block truncate text-xs text-muted-foreground">
                {tasks.filter((task) => task.status === "pending").length} active tasks · add, edit
                or complete
              </span>
            </span>
          </span>
          <ArrowRight
            className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>

        <Link
          to="/check-in"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-positive-soft">
              <HeartPulse className="h-5 w-5 text-positive" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">60-second check-in</span>
              <span className="block truncate text-xs text-muted-foreground">
                {checkIn.completed
                  ? `Active · ${checkInAdjustment > 0 ? "+" : ""}${checkInAdjustment} capacity points`
                  : "Not checked today · update energy, sleep and stress"}
              </span>
            </span>
          </span>
          <ArrowRight
            className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>

        <Link
          to="/lab"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary p-4 text-primary-foreground shadow-lift transition-all hover:-translate-y-0.5 sm:col-span-2"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-foreground/10">
              <WandSparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">Explore the Innovation Lab</span>
              <span className="block text-xs text-primary-foreground/70">
                Domino forecast · recovery debt · team ripple · relationship patterns · Ask AI ·
                challenge
              </span>
            </span>
          </span>
          <ArrowRight
            className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>

      <Card className="rounded-2xl border-border shadow-soft">
        <CardContent className="grid gap-6 p-5 sm:p-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
          <div className="flex justify-center">
            <CapacityRing value={currentCapacity} size={188} />
          </div>
          <div className="min-w-0 space-y-4">
            <div className="space-y-2">
              <StatusPill level={levelFor(currentCapacity)} label={status} />
              <p className="text-sm text-muted-foreground">
                You have used {currentCapacity}% of a realistic 45-hour week.{" "}
                {completed
                  ? "Your confirmed changes protected Wednesday and moved flexible work into open space."
                  : "Around 8 hours of genuine slack remain, and most of it sits on the weekend."}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Highest-load day
                </p>
                <p className="mt-1 text-lg font-bold">{user.highestDay}</p>
                <p className="text-xs text-muted-foreground">94% load · 4 fixed commitments</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <TrendingUp className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Versus last week
                </p>
                <p className="mt-1 text-lg font-bold">+6 points</p>
                <p className="text-xs text-muted-foreground">Mostly academic deadlines</p>
              </div>
            </div>
            <Button asChild size="lg" className="w-full rounded-xl sm:w-auto">
              <Link to="/hidden-load">
                Check a new commitment
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border-border shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Load by category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {categories.map((c) => (
              <CategoryBar key={c.key} label={c.label} value={c.value} detail={c.detail} />
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Workload across the week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayedWeek} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  />
                  <YAxis
                    domain={[0, 120]}
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
                    formatter={(v: number) => [`${v}% load`, "Capacity used"]}
                    labelFormatter={(l: string) =>
                      displayedWeek.find((d) => d.day === l)?.full ?? l
                    }
                  />
                  <Bar dataKey="load" radius={[8, 8, 0, 0]} maxBarSize={38}>
                    {displayedWeek.map((d) => (
                      <Cell key={d.day} fill={barColor(d.load)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {completed
                ? "Wednesday is now below the overload threshold after the confirmed changes."
                : "Wednesday is marked in coral because it passes 90% of a realistic day."}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-border shadow-soft">
        <CardContent className="p-0">
          <button
            type="button"
            onClick={() => setShowFactors((v) => !v)}
            aria-expanded={showFactors}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <Info className="h-4.5 w-4.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="truncate text-sm font-semibold">What affects this score?</span>
            </span>
            <ChevronDown
              className={`h-4.5 w-4.5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                showFactors ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>
          {showFactors ? (
            <div className="grid gap-4 border-t border-border px-5 py-5 sm:grid-cols-2">
              {scoreFactors.map((f) => (
                <div key={f.title}>
                  <p className="text-sm font-semibold">{f.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Upcoming commitments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeTasks.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-background p-3.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{item.title}</p>
                <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {item.category} · {item.deadline} · {item.hours} h
                </p>
              </div>
              <StatusPill level={taskLoadLevel(item)} label={`+${taskImpact(item)} points`} />
            </div>
          ))}
          {activeTasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <p className="text-sm font-semibold">No active commitments</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add a task to rebuild your weekly capacity.
              </p>
            </div>
          ) : null}
          <p className="pt-1 text-xs text-muted-foreground">
            Task points combine estimated duration and mental effort. Manage them to keep the
            dashboard current.
          </p>
          <Button asChild variant="outline" className="w-full rounded-xl">
            <Link to="/tasks">Open task manager</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
