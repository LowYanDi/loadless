import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarRange, Lightbulb, ShieldCheck, TrendingDown } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/loadless/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { insights } from "@/data/loadless";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Weekly Insights — Easey" },
      {
        name: "description",
        content:
          "Understand which days and commitment categories are repeatedly using your capacity.",
      },
    ],
  }),
  component: Insights,
});

function Insights() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Patterns, not judgement"
        title="Weekly insights"
        description="Use recent patterns to protect the parts of next week that usually become overloaded."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border-border shadow-soft">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground">Current capacity</p>
            <p className="mt-1 text-3xl font-bold tabular-nums">82%</p>
            <p className="mt-2 text-xs text-muted-foreground">6 points below last week</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border shadow-soft">
          <CardContent className="p-5">
            <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <CalendarRange className="h-4 w-4" aria-hidden="true" /> Busiest day
            </p>
            <p className="mt-1 text-2xl font-bold">Wednesday</p>
            <p className="mt-2 text-xs text-muted-foreground">Highest in 4 of the last 5 weeks</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-positive/40 bg-positive-soft/40 shadow-soft">
          <CardContent className="p-5">
            <p className="flex items-center gap-2 text-xs font-medium text-positive">
              <TrendingDown className="h-4 w-4" aria-hidden="true" /> Boundary impact
            </p>
            <p className="mt-1 text-2xl font-bold">3 requests</p>
            <p className="mt-2 text-xs text-muted-foreground">Rescoped or declined this month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-overload/30 bg-overload-soft/45 shadow-soft">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-card">
              <ShieldCheck className="h-5 w-5 text-overload" aria-hidden="true" />
            </span>

            <div>
              <CardTitle className="text-base">Recovery Insight</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Recovery debt keeps track of planned recovery time that was repeatedly displaced by
                other commitments.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">Current recovery debt</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">4.5 h</p>
              <p className="mt-1 text-xs text-muted-foreground">Carried into this week</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">Deferred recovery blocks</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">3</p>
              <p className="mt-1 text-xs text-muted-foreground">Planned breaks were displaced</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">Debt direction</p>
              <p className="mt-1 text-2xl font-bold text-overload">Rising</p>
              <p className="mt-1 text-xs text-muted-foreground">Increased for 2 weeks</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm font-semibold">What this pattern means</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Recovery time has been repeatedly pushed aside when workload becomes high. Easey keeps
              this visible so that a new week does not automatically appear fully recovered when
              previous recovery time was missed.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild className="rounded-xl">
              <Link to="/reset">
                Start a Reset
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>

            <Button asChild variant="outline" className="rounded-xl bg-card">
              <Link to="/ai-assist">
                Ask Easey about recovery
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Capacity across five weeks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={insights.weeks} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis
                  domain={[0, 110]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`${value}%`, "Capacity used"]}
                />
                <Line
                  type="monotone"
                  dataKey="capacity"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "var(--card)", strokeWidth: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">What changed by category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insights.categoryTrend} margin={{ top: 8, right: 8, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => `${value}%`}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  dataKey="lastWeek"
                  name="Last week"
                  fill="var(--muted-foreground)"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="thisWeek"
                  name="This week"
                  fill="var(--positive)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {insights.notes.map((note) => (
          <Card key={note.title} className="rounded-2xl border-border shadow-soft">
            <CardContent className="p-5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-warning-soft">
                <Lightbulb className="h-4 w-4 text-warning-foreground" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-sm font-semibold">{note.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{note.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
