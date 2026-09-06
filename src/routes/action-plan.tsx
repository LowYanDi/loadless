import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCheck, Gauge, Lightbulb, RotateCcw, TrendingDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader } from "@/components/loadless/page-header";
import { StatusPill } from "@/components/loadless/status-pill";
import { labelFor, levelFor, recommendations } from "@/data/loadless";
import { useLoadLessDemo } from "@/hooks/use-loadless-demo";

export const Route = createFileRoute("/action-plan")({
  head: () => ({
    meta: [
      { title: "Action Plan — LoadLess" },
      {
        name: "description",
        content:
          "Three explainable adjustments that bring a 113% week back to 84%, each with the reason behind it and the capacity it frees.",
      },
      { property: "og:title", content: "Action Plan — LoadLess" },
      {
        property: "og:description",
        content: "Pick the changes that bring your week back into a realistic range.",
      },
    ],
  }),
  component: ActionPlan,
});

function ActionPlan() {
  const navigate = useNavigate();
  const {
    selectedActions: selected,
    forecastCapacity,
    projectedCapacity: projected,
    savedCapacity: saved,
    toggleAction: toggle,
    selectAllActions,
    setSelectedActions,
  } = useLoadLessDemo();
  const level = levelFor(projected);
  const isWorkable = projected < 95;
  const ladder = recommendations.map((recommendation, index) => ({
    ...recommendation,
    capacity:
      forecastCapacity -
      recommendations.slice(0, index + 1).reduce((total, current) => total + current.saving, 0),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Action engine"
        title="A realistic plan for your week"
        description="Each suggestion is based on your actual schedule. Select the ones you are willing to do and watch the projection update."
      />

      <Card className="sticky top-16 z-10 rounded-2xl border-border shadow-lift lg:top-4">
        <CardContent className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">Projected capacity</p>
            <p className="text-3xl font-bold tabular-nums">{projected}%</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {saved > 0
                ? `${saved}% freed from ${selected.length} action${selected.length > 1 ? "s" : ""}`
                : "No actions selected yet"}
            </p>
          </div>
          <StatusPill level={level} label={labelFor(projected)} />
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-2xl border-border shadow-soft">
        <CardHeader className="border-b border-border bg-primary text-primary-foreground">
          <CardTitle className="flex items-center gap-2 text-base">
            <Gauge className="h-4 w-4" aria-hidden="true" /> Decision impact ladder
          </CardTitle>
          <p className="text-xs text-primary-foreground/70">
            A transparent preview of exactly where each recommendation creates room.
          </p>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-3 sm:grid-cols-4">
            <ImpactStep label="Request added" value={forecastCapacity} state="overload" active />
            {ladder.map((step) => (
              <ImpactStep
                key={step.id}
                label={
                  step.id === "scope" ? "Rescope" : step.id === "errands" ? "Move" : "Delegate"
                }
                value={step.capacity}
                state={levelFor(step.capacity)}
                active={selected.includes(step.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-xl" onClick={selectAllActions}>
            <CheckCheck className="h-4 w-4" aria-hidden="true" />
            Select recommended plan
          </Button>
          {selected.length > 0 ? (
            <Button variant="ghost" className="rounded-xl" onClick={() => setSelectedActions([])}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Clear selection
            </Button>
          ) : null}
        </div>
        {recommendations.map((r) => {
          const active = selected.includes(r.id);
          return (
            <Card
              key={r.id}
              className={`rounded-2xl shadow-soft transition-colors ${
                active ? "border-positive/50 bg-positive-soft/40" : "border-border"
              }`}
            >
              <CardContent className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 p-5">
                <Checkbox
                  id={r.id}
                  checked={active}
                  onCheckedChange={() => toggle(r.id)}
                  className="mt-1 h-5 w-5 shrink-0 rounded-md"
                  aria-label={`Select action: ${r.title}`}
                />
                <div className="min-w-0 space-y-3">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <label htmlFor={r.id} className="min-w-0 cursor-pointer">
                      <span className="block text-base font-semibold">{r.title}</span>
                    </label>
                    <span className="shrink-0 rounded-full bg-positive px-2.5 py-1 text-xs font-bold text-positive-foreground tabular-nums">
                      −{r.saving}%
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      What changes
                    </p>
                    <p className="mt-1 text-sm">{r.change}</p>
                  </div>
                  <div>
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <Lightbulb className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      Why this was suggested
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{r.why}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-2xl border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Ready to act?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Selecting all three brings you to {forecastCapacity - 29}%, back inside a range you can
            actually sustain. Next you will get a message you can send to Mei.
          </p>
          <Button
            size="lg"
            className="w-full rounded-xl"
            disabled={!isWorkable}
            onClick={() => navigate({ to: "/boundary" })}
          >
            Apply selected actions
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          {!isWorkable ? (
            <p className="text-xs text-muted-foreground" role="status">
              Choose enough actions to bring the projection below 95%. The recommended plan reaches{" "}
              {forecastCapacity - 29}%.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function ImpactStep({
  label,
  value,
  state,
  active,
}: {
  label: string;
  value: number;
  state: ReturnType<typeof levelFor>;
  active: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-3 transition-all duration-300 ${
        active ? "border-primary bg-secondary shadow-sm" : "border-border bg-background opacity-55"
      }`}
    >
      <div
        className={`absolute inset-y-0 left-0 w-1 ${
          state === "overload" ? "bg-overload" : state === "caution" ? "bg-warning" : "bg-positive"
        }`}
      />
      <p className="pl-1 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 pl-1 text-2xl font-bold tabular-nums">{value}%</p>
      <p className="mt-1 pl-1 text-[11px] text-muted-foreground">
        {active ? "Included in your plan" : "Preview only"}
      </p>
    </div>
  );
}
