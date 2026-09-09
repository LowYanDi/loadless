import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  Bot,
  BrainCircuit,
  Check,
  Copy,
  Gamepad2,
  History,
  Leaf,
  LockKeyhole,
  PauseCircle,
  RefreshCcw,
  Send,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  UsersRound,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { PageHeader } from "@/components/loadless/page-header";
import { StatusPill } from "@/components/loadless/status-pill";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  challengeRounds,
  dominoChains,
  dominoForecasts,
  innovationFeatures,
  missedRecoveryBlocks,
  recoveryHistory,
  relationshipHistory,
  relationshipMessages,
  teammates,
  type ChallengeOption,
  type InnovationFeatureId,
} from "@/data/innovation";
import { labelFor, levelFor } from "@/data/loadless";
import { useLoadLessDemo, type SandboxChoice } from "@/hooks/use-loadless-demo";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "Innovation Lab — LoadLess" },
      {
        name: "description",
        content:
          "Explore six interactive LoadLess concepts: domino forecasting, recovery debt, team-aware delegation, relationship patterns, grounded AI and a capacity challenge.",
      },
    ],
  }),
  component: InnovationLab,
});

const tabIcons = {
  domino: Zap,
  recovery: ShieldCheck,
  team: UsersRound,
  patterns: History,
  assistant: Bot,
  challenge: Gamepad2,
} satisfies Record<InnovationFeatureId, typeof Zap>;

function InnovationLab() {
  const [activeFeature, setActiveFeature] = useState<InnovationFeatureId>("domino");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Interactive concepts"
        title="Innovation Lab"
        description="Six connected experiments built on the same LoadLess capacity engine. Try each one with Aina's demo week."
      />

      <Card className="overflow-hidden rounded-2xl border-primary/20 shadow-lift">
        <CardContent className="grid gap-4 bg-primary p-5 text-primary-foreground sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4" aria-hidden="true" /> One decision, six perspectives
            </p>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-primary-foreground/75">
              The lab extends the existing sponsorship-deck story. It does not use a live AI model
              or teammate accounts yet; interactions use transparent demo data.
            </p>
          </div>
          <span className="w-fit rounded-full bg-primary-foreground/10 px-3 py-1.5 text-xs font-semibold">
            UI prototype · local data
          </span>
        </CardContent>
      </Card>

      <Tabs
        value={activeFeature}
        onValueChange={(value) => setActiveFeature(value as InnovationFeatureId)}
        className="space-y-5"
      >
        <div className="overflow-x-auto pb-1">
          <TabsList className="grid h-auto min-w-[46rem] grid-cols-6 gap-1 rounded-2xl p-1.5">
            {innovationFeatures.map((feature) => {
              const Icon = tabIcons[feature.id];
              return (
                <TabsTrigger
                  key={feature.id}
                  value={feature.id}
                  className="gap-2 rounded-xl py-2.5"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {feature.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <TabsContent value="domino" className="mt-0">
          <DominoFeature />
        </TabsContent>
        <TabsContent value="recovery" className="mt-0">
          <RecoveryFeature />
        </TabsContent>
        <TabsContent value="team" className="mt-0">
          <TeamRippleFeature />
        </TabsContent>
        <TabsContent value="patterns" className="mt-0">
          <RelationshipFeature />
        </TabsContent>
        <TabsContent value="assistant" className="mt-0">
          <AssistantFeature />
        </TabsContent>
        <TabsContent value="challenge" className="mt-0">
          <ChallengeFeature />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FeatureHeading({ feature }: { feature: InnovationFeatureId }) {
  const item = innovationFeatures.find((current) => current.id === feature)!;
  const Icon = tabIcons[feature];

  return (
    <div className="flex items-start gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <h2 className="text-xl font-bold tracking-tight">{item.title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
      </div>
    </div>
  );
}

function DominoFeature() {
  const { sandboxChoice, setSandboxChoice, commitmentTask, baseCapacity, forecastCapacity } =
    useLoadLessDemo();
  const chartData = [...dominoForecasts[sandboxChoice]];
  const chain = dominoChains[sandboxChoice];
  const optionLabels: Record<SandboxChoice, string> = {
    accept: "Full yes",
    reduce: "Smaller yes",
    decline: "Decline",
  };

  return (
    <div className="space-y-5">
      <FeatureHeading feature="domino" />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card className="rounded-2xl border-border shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Try a response</CardTitle>
            <p className="text-sm text-muted-foreground">
              {commitmentTask} is added to a {baseCapacity}% week.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {(Object.keys(optionLabels) as SandboxChoice[]).map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => setSandboxChoice(choice)}
                aria-pressed={sandboxChoice === choice}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors ${
                  sandboxChoice === choice
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-secondary"
                }`}
              >
                <span>
                  <span className="block text-sm font-semibold">{optionLabels[choice]}</span>
                  <span
                    className={`mt-0.5 block text-xs ${
                      sandboxChoice === choice
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {choice === "accept"
                      ? `Keep the complete request · ${forecastCapacity}% forecast`
                      : choice === "reduce"
                        ? "Five slides, shared research · 84% after actions"
                        : `No new load · stay at ${baseCapacity}%`}
                  </span>
                </span>
                {sandboxChoice === choice ? <Check className="h-4 w-4" /> : null}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-soft">
          <CardHeader className="sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-base">Four-day chain reaction</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                A forward view of workload spillover, not just one final percentage.
              </p>
            </div>
            <StatusPill
              level={levelFor(Math.max(...chartData.map((day) => day.projected)))}
              label={`${Math.max(...chartData.map((day) => day.projected))}% peak`}
            />
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={[0, 140]}
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
                    dataKey="current"
                    name="Current"
                    fill="var(--chart-1)"
                    radius={[7, 7, 0, 0]}
                  />
                  <Bar dataKey="projected" name="After decision" radius={[7, 7, 0, 0]}>
                    {chartData.map((day) => (
                      <Cell
                        key={day.day}
                        fill={
                          day.projected >= 95
                            ? "var(--overload)"
                            : day.projected >= 75
                              ? "var(--warning)"
                              : "var(--positive)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">What gets sacrificed?</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-4">
          {chain.map((step, index) => (
            <div key={step.title} className="relative">
              <div className="h-full rounded-xl border border-border bg-background p-4">
                <span className="text-xs font-bold text-muted-foreground">0{index + 1}</span>
                <p className="mt-2 text-sm font-semibold">{step.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.detail}</p>
                <span className="mt-3 inline-flex rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold">
                  {step.status}
                </span>
              </div>
              {index < chain.length - 1 ? (
                <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 rounded-full bg-card text-muted-foreground md:block" />
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function RecoveryFeature() {
  const [protectedBlock, setProtectedBlock] = useState(false);
  const [coolingOff, setCoolingOff] = useState(false);
  const debt = protectedBlock ? 3.5 : 4.5;
  const trend = recoveryHistory.map((week, index) =>
    index === recoveryHistory.length - 1 ? { ...week, debt } : week,
  );

  return (
    <div className="space-y-5">
      <FeatureHeading feature="recovery" />

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Current recovery debt"
          value={`${debt} h`}
          detail="Carried across weeks"
        />
        <MetricCard
          label="Deferred blocks"
          value={protectedBlock ? "2" : "3"}
          detail="Last 7 days"
        />
        <MetricCard
          label="Debt direction"
          value={protectedBlock ? "Falling" : "Rising"}
          detail={protectedBlock ? "One block protected" : "For two consecutive weeks"}
          positive={protectedBlock}
        />
      </div>

      <Card className="rounded-2xl border-positive/40 bg-positive-soft/45 shadow-soft">
        <CardContent className="grid gap-4 p-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-card">
            <Leaf className="h-5 w-5 text-positive" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold">Recovery Menu</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Turn protected recovery time into a short action: Unload, breathe, stretch, walk,
              listen, rest or connect.
            </p>
          </div>
          <Button asChild className="rounded-xl">
            <Link to="/reset">
              Start a Reset
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <Card className="rounded-2xl border-border shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Debt carried across four weeks</CardTitle>
            <p className="text-xs text-muted-foreground">
              Skipped recovery is not erased by a new Monday.
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={[0, 6]}
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
                    formatter={(value: number) => [`${value} h`, "Recovery debt"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="debt"
                    stroke="var(--overload)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "var(--card)", strokeWidth: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4" /> Recovery Shield
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border bg-secondary/60 p-4">
              <p className="text-sm font-semibold">Friday · 7:00–8:00 PM</p>
              <p className="mt-1 text-xs text-muted-foreground">
                No tasks, society replies or rescheduling into this block.
              </p>
            </div>
            <Button
              className="w-full rounded-xl"
              variant={protectedBlock ? "secondary" : "default"}
              onClick={() => {
                setProtectedBlock((current) => !current);
                toast.success(
                  protectedBlock ? "Recovery block released" : "Recovery block protected",
                );
              }}
            >
              {protectedBlock ? <Check className="h-4 w-4" /> : <LockKeyhole className="h-4 w-4" />}
              {protectedBlock ? "Protected · debt −1 h" : "Protect this block"}
            </Button>

            <div className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <PauseCircle className="h-4 w-4" /> Cooling-off mode
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Hold non-urgent requests for 12 hours before Aina can accept them.
                </p>
              </div>
              <Switch checked={coolingOff} onCheckedChange={setCoolingOff} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Where the debt came from</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {missedRecoveryBlocks.map((block) => (
            <div
              key={`${block.day}-${block.time}`}
              className="grid gap-2 rounded-xl border border-border bg-background p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <div>
                <p className="text-sm font-semibold">
                  {block.day} · {block.time}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{block.reason}</p>
              </div>
              <span className="w-fit rounded-full bg-overload-soft px-3 py-1 text-xs font-bold text-overload">
                +{block.amount} h debt
              </span>
            </div>
          ))}
          <p className="text-xs leading-relaxed text-muted-foreground">
            Recovery Debt is a planning indicator based on protected time. It is not a medical or
            mental-health diagnosis.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function TeamRippleFeature() {
  const { forecastCapacity } = useLoadLessDemo();
  const [selectedId, setSelectedId] = useState("faiz");
  const [sent, setSent] = useState(false);
  const selected = teammates.find((person) => person.id === selectedId) ?? teammates[0];

  return (
    <div className="space-y-5">
      <FeatureHeading feature="team" />

      <Card className="rounded-2xl border-border shadow-soft">
        <CardContent className="grid gap-4 p-5 sm:grid-cols-3 sm:items-center">
          <CapacityPerson name="Aina" before={forecastCapacity} after={forecastCapacity - 10} />
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
              Sponsor research · 10 points
            </span>
            <ArrowDown className="h-5 w-5 text-muted-foreground sm:hidden" />
            <ArrowRight className="hidden h-5 w-5 text-muted-foreground sm:block" />
            <p className="text-xs text-muted-foreground">Moves only after confirmation</p>
          </div>
          <CapacityPerson
            name={selected.name}
            before={selected.capacity}
            after={selected.capacity + selected.added}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {teammates.map((person) => {
          const after = person.capacity + person.added;
          const active = selectedId === person.id;
          return (
            <button
              key={person.id}
              type="button"
              onClick={() => {
                setSelectedId(person.id);
                setSent(false);
              }}
              aria-pressed={active}
              className={`rounded-2xl border p-5 text-left shadow-soft transition-all ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:-translate-y-0.5 hover:shadow-lift"
              }`}
            >
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="block text-base font-semibold">{person.name}</span>
                  <span
                    className={`mt-0.5 block text-xs ${
                      active ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {person.role}
                  </span>
                </span>
                {person.id === "faiz" ? (
                  <span className="rounded-full bg-positive-soft px-2.5 py-1 text-[11px] font-bold text-positive">
                    Best fit
                  </span>
                ) : null}
              </span>
              <span className="mt-5 flex items-end justify-between gap-3">
                <span>
                  <span className="block text-xs opacity-70">Capacity ripple</span>
                  <span className="mt-1 block text-2xl font-bold tabular-nums">
                    {person.capacity}% → {after}%
                  </span>
                </span>
                <StatusPill level={levelFor(after)} label={labelFor(after)} />
              </span>
              <span
                className={`mt-3 block text-xs ${active ? "opacity-75" : "text-muted-foreground"}`}
              >
                {person.note}
              </span>
            </button>
          );
        })}
      </div>

      <Card className="rounded-2xl border-positive/40 bg-positive-soft/40 shadow-soft">
        <CardContent className="grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold">
              <UserRoundCheck className="h-4 w-4 text-positive" /> Mutual awareness check
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {selected.name} would move from {selected.capacity}% to{" "}
              {selected.capacity + selected.added}%. The work is not reassigned until{" "}
              {selected.name} confirms.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-xl" asChild>
              <Link to="/circle">
                <UsersRound className="h-4 w-4" /> Open Capacity Circle
              </Link>
            </Button>
            <Button
              className="rounded-xl"
              disabled={sent}
              onClick={() => {
                setSent(true);
                toast.success(`Delegation request sent to ${selected.name}`);
              }}
            >
              {sent ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              {sent ? "Awaiting confirmation" : `Ask ${selected.name}`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CapacityPerson({ name, before, after }: { name: string; before: number; after: number }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-xs font-medium text-muted-foreground">{name}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-2xl font-bold tabular-nums">
          {before}% <span className="text-sm text-muted-foreground">→</span> {after}%
        </p>
        <StatusPill level={levelFor(after)} label={labelFor(after)} />
      </div>
      <Progress value={Math.min(after, 100)} className="mt-3" />
    </div>
  );
}

type RelationshipChoice = keyof typeof relationshipMessages;

function RelationshipFeature() {
  const [historyEnabled, setHistoryEnabled] = useState(true);
  const [choice, setChoice] = useState<RelationshipChoice>("smaller");
  const message = historyEnabled
    ? relationshipMessages[choice]
    : "Hi Mei, I cannot complete the full deck by Wednesday. I can help with a smaller part if the research is assigned elsewhere.";

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      toast.success("Relationship-aware draft copied");
    } catch {
      toast.error("Could not copy — select the message manually");
    }
  };

  return (
    <div className="space-y-5">
      <FeatureHeading feature="patterns" />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <Card className="rounded-2xl border-border shadow-soft">
          <CardHeader className="sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-base">Request pattern · Society</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Private history stored on this device
              </p>
            </div>
            <Switch checked={historyEnabled} onCheckedChange={setHistoryEnabled} />
          </CardHeader>
          <CardContent className="space-y-3">
            {historyEnabled ? (
              <>
                <div className="rounded-xl border border-warning/40 bg-warning-soft p-4">
                  <p className="text-sm font-semibold text-warning-foreground">
                    You accepted the last 4 Society requests above 85% capacity.
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-warning-foreground/80">
                    This is a behavioural pattern, not a judgement about Mei or the society.
                  </p>
                </div>
                {relationshipHistory.map((item) => (
                  <div
                    key={`${item.date}-${item.request}`}
                    className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-xl border border-border p-3.5"
                  >
                    <div>
                      <p className="text-sm font-semibold">{item.request}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.date} · {item.decision}
                      </p>
                    </div>
                    <span className="rounded-full bg-overload-soft px-2.5 py-1 text-xs font-bold text-overload">
                      {item.capacity}%
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-8 text-center">
                <LockKeyhole className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-3 text-sm font-semibold">Pattern history is off</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  The assistant will use only the current request.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Protect the week and the relationship</CardTitle>
            <div className="flex flex-wrap gap-2 pt-2">
              {(
                [
                  ["smaller", "Smaller yes"],
                  ["delay", "Decide later"],
                  ["decline", "Decline kindly"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setChoice(id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    choice === id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{message}</p>
            </div>
            <div className="rounded-xl bg-positive-soft p-4">
              <p className="flex items-center gap-2 text-xs font-semibold text-positive">
                <BrainCircuit className="h-4 w-4" /> Why this draft changed
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {historyEnabled
                  ? "It avoids a fifth full yes, offers a concrete contribution and keeps enough notice for the group to re-plan."
                  : "History is disabled, so this version uses only the current workload and deadline."}
              </p>
            </div>
            <Button className="rounded-xl" onClick={copyMessage}>
              <Copy className="h-4 w-4" /> Copy draft
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type ChatMessage = { role: "assistant" | "user"; text: string };

function AssistantFeature() {
  const { baseCapacity, forecastCapacity, projectedCapacity, commitmentTask, selectedActions } =
    useLoadLessDemo();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: `I can explain Aina's capacity, forecast the cost of ${commitmentTask.toLowerCase()}, or suggest the safest next action.`,
    },
  ]);

  const answerFor = (question: string) => {
    const lower = question.toLowerCase();
    if (lower.includes("why") || lower.includes("wednesday")) {
      return `Wednesday is the pressure point because it is already at 94%. The new deck adds deep-focus work, urgency and a context switch, pushing the scenario to ${forecastCapacity}%.`;
    }
    if (lower.includes("reduce") || lower.includes("below") || lower.includes("action")) {
      return `The safest combination is: reduce the deck scope (−12), delegate sponsor research to Faiz (−10), and move flexible errands (−7). With all three, capacity becomes ${projectedCapacity}%.`;
    }
    if (lower.includes("recovery") || lower.includes("debt")) {
      return "Aina has deferred three recovery blocks, creating 4.5 hours of recovery debt. Protecting Friday 7:00–8:00 PM is the smallest immediate repair.";
    }
    if (lower.includes("faiz") || lower.includes("delegate") || lower.includes("team")) {
      return "Faiz is the safest demo match: 58% now and 71% after the research hand-off. LoadLess still waits for his confirmation before moving the work.";
    }
    if (lower.includes("message") || lower.includes("mei") || lower.includes("reply")) {
      return "Offer a smaller yes: commit to the outline and first five slides, ask someone else to own research, and state the Wednesday limit clearly.";
    }
    return `Aina is at ${baseCapacity}% now and would reach ${forecastCapacity}% with the full request. Ask me about Wednesday, recovery debt, delegation, actions or a reply to Mei.`;
  };

  const sendQuestion = (question: string) => {
    const cleaned = question.trim();
    if (!cleaned) return;
    setMessages((current) => [
      ...current,
      { role: "user", text: cleaned },
      { role: "assistant", text: answerFor(cleaned) },
    ]);
    setInput("");
  };

  const prompts = [
    "Why is Wednesday overloaded?",
    "How do I get below 90%?",
    "Is Faiz safe to delegate to?",
    "Draft a reply to Mei",
  ];

  return (
    <div className="space-y-5">
      <FeatureHeading feature="assistant" />

      <Card className="overflow-hidden rounded-2xl border-primary/20 shadow-lift">
        <CardHeader className="border-b border-border bg-primary text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="h-4 w-4" /> Ask LoadLess
            </CardTitle>
            <p className="mt-1 text-xs text-primary-foreground/70">
              Answers are grounded in the current demo scenario and visible calculations.
            </p>
          </div>
          <span className="mt-2 w-fit rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold sm:mt-0">
            Prototype response engine
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[28rem] min-h-80 space-y-4 overflow-y-auto p-5">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
                    message.role === "user"
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md border border-border bg-secondary"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendQuestion(prompt)}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendQuestion(input);
                }}
                placeholder="Ask about this week's capacity…"
                aria-label="Ask LoadLess a question"
                className="rounded-xl"
              />
              <Button
                className="rounded-xl"
                onClick={() => sendQuestion(input)}
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send question</span>
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Demo only: no external AI service is connected. {selectedActions.length} action
              {selectedActions.length === 1 ? " is" : "s are"} currently selected.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ChallengeFeature() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState<ChallengeOption | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const round = challengeRounds[roundIndex] ?? challengeRounds[0]!;
  const maximum = challengeRounds.length * 20;
  const rating =
    score >= 50 ? "Capacity protector" : score >= 30 ? "Pattern spotter" : "Fast yes-er";

  const choose = (option: ChallengeOption) => {
    if (selected) return;
    setSelected(option);
    setScore((current) => current + option.points);
  };

  const next = () => {
    if (roundIndex === challengeRounds.length - 1) {
      setFinished(true);
      return;
    }
    setRoundIndex((current) => current + 1);
    setSelected(null);
  };

  const restart = () => {
    setRoundIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="space-y-5">
      <FeatureHeading feature="challenge" />

      <Card className="overflow-hidden rounded-2xl border-primary/20 shadow-lift">
        <div className="bg-primary p-5 text-primary-foreground">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/60">
                The Cost of Yes
              </p>
              <h3 className="mt-1 text-xl font-bold">
                {finished
                  ? "Your capacity awareness result"
                  : `Round ${roundIndex + 1} of ${challengeRounds.length}`}
              </h3>
            </div>
            <span className="rounded-full bg-primary-foreground/10 px-3 py-1 text-sm font-bold tabular-nums">
              {score}/{maximum}
            </span>
          </div>
          <Progress
            value={
              finished ? 100 : ((roundIndex + (selected ? 1 : 0)) / challengeRounds.length) * 100
            }
            className="mt-4 bg-primary-foreground/15 [&>div]:bg-positive"
          />
        </div>

        {finished ? (
          <CardContent className="grid gap-6 p-6 text-center sm:p-8">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-positive-soft">
              <ShieldCheck className="h-8 w-8 text-positive" />
            </span>
            <div>
              <p className="text-4xl font-extrabold tabular-nums">
                {score}/{maximum}
              </p>
              <p className="mt-2 text-lg font-semibold">{rating}</p>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                You checked hidden cost, considered the receiver's capacity and protected recovery
                instead of treating it as leftover time.
              </p>
            </div>
            <Button className="mx-auto rounded-xl" onClick={restart}>
              <RefreshCcw className="h-4 w-4" /> Play again
            </Button>
          </CardContent>
        ) : (
          <CardContent className="space-y-5 p-5 sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {round.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{round.context}</p>
              <h3 className="mt-3 text-lg font-bold">{round.question}</h3>
            </div>

            <div className="grid gap-3">
              {round.options.map((option) => {
                const active = selected?.id === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => choose(option)}
                    disabled={Boolean(selected)}
                    className={`grid gap-2 rounded-xl border p-4 text-left transition-colors sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : selected
                          ? "border-border bg-background opacity-55"
                          : "border-border bg-background hover:bg-secondary"
                    }`}
                  >
                    <span className="text-sm font-semibold">{option.label}</span>
                    <span
                      className={`text-xs ${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                    >
                      {option.impact}
                    </span>
                  </button>
                );
              })}
            </div>

            {selected ? (
              <div className="rounded-xl border border-border bg-secondary p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{selected.points}/20 points</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {selected.feedback}
                    </p>
                  </div>
                  <Button className="shrink-0 rounded-xl" onClick={next}>
                    {roundIndex === challengeRounds.length - 1 ? "See result" : "Next"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        )}
      </Card>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  positive = false,
}: {
  label: string;
  value: string;
  detail: string;
  positive?: boolean;
}) {
  return (
    <Card
      className={`rounded-2xl shadow-soft ${positive ? "border-positive/40 bg-positive-soft/40" : "border-border"}`}
    >
      <CardContent className="p-5">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className={`mt-1 text-3xl font-bold tabular-nums ${positive ? "text-positive" : ""}`}>
          {value}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
