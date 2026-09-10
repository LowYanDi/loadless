import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Coffee,
  Copy,
  Download,
  FileCheck2,
  PartyPopper,
} from "lucide-react";
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
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/loadless/page-header";
import { StatusPill } from "@/components/loadless/status-pill";
import { labelFor, levelFor, recommendations } from "@/data/loadless";
import { useLoadLessDemo } from "@/hooks/use-loadless-demo";

export const Route = createFileRoute("/after")({
  head: () => ({
    meta: [
      { title: "Your week, recovered — Easey" },
      {
        name: "description",
        content:
          "From 113% to 84%: the confirmed actions, the capacity you got back, and a short recovery block to protect it.",
      },
      { property: "og:title", content: "Your week, recovered — Easey" },
      {
        property: "og:description",
        content: "Capacity reduced by 29% and back within a realistic range.",
      },
    ],
  }),
  component: AfterState,
});

function AfterState() {
  const { selectedActions, forecastCapacity, projectedCapacity, savedCapacity, completeDemo } =
    useLoadLessDemo();
  const confirmedActions = recommendations.filter((recommendation) =>
    selectedActions.includes(recommendation.id),
  );
  const chartData = [
    { name: "Before action", value: forecastCapacity },
    { name: "After action", value: projectedCapacity },
  ];
  const receipt = [
    "LOADLESS DECISION RECEIPT",
    "Commitment: Sponsorship deck",
    `Capacity: ${forecastCapacity}% forecast → ${projectedCapacity}% final`,
    `Room created: ${savedCapacity}%`,
    ...confirmedActions.map((action) => `✓ ${action.title}: ${action.change}`),
    "Recovery protected: Wednesday, 6:15 PM (15 minutes)",
    "Boundary sent to: Mei, Society treasurer",
  ].join("\n");

  const copyReceipt = async () => {
    await navigator.clipboard.writeText(receipt);
    toast.success("Decision receipt copied");
  };

  const downloadReceipt = () => {
    const file = new Blob([receipt], { type: "text/plain;charset=utf-8" });
    const href = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = "easey-decision-receipt.txt";
    anchor.click();
    URL.revokeObjectURL(href);
    toast.success("Decision receipt downloaded");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Outcome"
        title="Your week is workable again"
        description="Mei has the reply, the deck is scoped, and Friday's errands moved to Sunday."
      />

      <Card className="rounded-2xl border-positive/40 shadow-soft">
        <CardContent className="grid gap-5 p-5 sm:grid-cols-3 sm:items-center">
          <div className="rounded-xl border border-border bg-background p-4 text-center">
            <p className="text-xs font-medium text-muted-foreground">Before action</p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-overload">
              {forecastCapacity}%
            </p>
          </div>
          <div className="rounded-xl border border-positive/40 bg-positive-soft p-4 text-center">
            <p className="text-xs font-medium text-positive">After action</p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-positive">
              {projectedCapacity}%
            </p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold">Capacity reduced by {savedCapacity}%</p>
            <div className="mt-2 flex justify-center sm:justify-start">
              <StatusPill level={levelFor(projectedCapacity)} label={labelFor(projectedCapacity)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-2xl border-primary/20 shadow-lift">
        <CardHeader className="border-b border-border bg-primary text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileCheck2 className="h-4 w-4" aria-hidden="true" /> Decision receipt
            </CardTitle>
            <p className="mt-1 text-xs text-primary-foreground/70">
              A portable record of what changed, why it worked, and what Aina protected.
            </p>
          </div>
          <span className="mt-2 w-fit rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold sm:mt-0">
            Ready to share
          </span>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ReceiptField label="Commitment" value="Outline + first 5 slides" />
            <ReceiptField label="Ownership" value="Aina designs · Faiz researches" />
            <ReceiptField label="Moved" value="Friday errands → Sunday" />
            <ReceiptField label="Recovery" value="Wednesday · 6:15 PM" />
            <ReceiptField
              label="Capacity decision"
              value={`${forecastCapacity}% → ${projectedCapacity}%`}
            />
            <ReceiptField label="Boundary" value="Sent to Mei" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-xl" onClick={copyReceipt}>
              <Copy className="h-4 w-4" aria-hidden="true" /> Copy summary
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={downloadReceipt}>
              <Download className="h-4 w-4" aria-hidden="true" /> Download receipt
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Before and after</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="name"
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
                  formatter={(v: number) => [`${v}%`, "Capacity"]}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} maxBarSize={90}>
                  {chartData.map((d) => (
                    <Cell
                      key={d.name}
                      fill={d.value >= 100 ? "var(--overload)" : "var(--positive)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Confirmed actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {confirmedActions.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-background p-3.5"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-positive" aria-hidden="true" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{r.title}</p>
                <p className="truncate text-xs text-muted-foreground">{r.change}</p>
              </div>
              <span className="shrink-0 text-sm font-bold tabular-nums text-positive">
                −{r.saving}%
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border bg-secondary shadow-soft">
        <CardContent className="flex items-start gap-3 p-5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-card">
            <Coffee className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">15-minute recovery block added</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Wednesday, 6:15 PM — after your last class and before the society call. No screens, no
              replies. It is scheduled so it does not get quietly taken back.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-positive/40 bg-positive-soft/40 shadow-soft">
        <CardContent className="flex items-start gap-3 p-5">
          <PartyPopper className="mt-0.5 h-5 w-5 shrink-0 text-positive" aria-hidden="true" />
          <p className="text-sm">
            Well done, Aina. You still helped your society, and you did it without borrowing hours
            from sleep or your assignments. That is the whole point.
          </p>
        </CardContent>
      </Card>

      <Button asChild size="lg" className="w-full rounded-xl sm:w-auto">
        <Link to="/" onClick={completeDemo}>
          View updated week
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );
}

function ReceiptField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
