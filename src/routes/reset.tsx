import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  Copy,
  ExternalLink,
  Footprints,
  Gamepad2,
  Headphones,
  Leaf,
  MessageCircle,
  MoonStar,
  Pause,
  PersonStanding,
  Play,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Wind,
} from "lucide-react";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/loadless/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoadLessDemo } from "@/hooks/use-loadless-demo";


export const Route = createFileRoute("/reset")({
  head: () => ({
    meta: [
      { title: "Reset Mode — Easey" },
      {
        name: "description",
        content:
          "Choose a short, time-bounded recovery activity and check how you feel before returning to your week.",
      },
    ],
  }),
  component: ResetMode,
});

type ActivityId = "game" | "breathe" | "stretch" | "walk" | "listen" | "rest" | "connect";
type ResetState = "menu" | "activity" | "complete";
type CheckInResult = "better" | "same" | "more";

type ActivityDefinition = {
  id: ActivityId;
  title: string;
  description: string;
  duration: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  recommended?: boolean;
  screenFree?: boolean;
};

const activities: ActivityDefinition[] = [
  {
    id: "game",
    title: "Quick Game",
    description: "Take a short mental break with a simple game.",
    duration: "1-3 min",
    icon: Gamepad2,
    recommended: true,
  },
  {
    id: "breathe",
    title: "Breathe",
    description: "Follow one slow inhale, hold and exhale cycle at a time.",
    duration: "1 min",
    icon: Wind,
  },
  {
    id: "stretch",
    title: "Stretch",
    description: "Three gentle, desk-friendly movements with no performance target.",
    duration: "3 min",
    icon: PersonStanding,
  },
  {
    id: "walk",
    title: "Walk",
    description: "Put the screen down and take a short walk before the next decision.",
    duration: "5 min",
    icon: Footprints,
    screenFree: true,
  },
  {
    id: "listen",
    title: "Listen",
    description: "Open Aina's personal recovery playlist with a clear return timer.",
    duration: "5 min",
    icon: Headphones,
  },
  {
    id: "rest",
    title: "Rest",
    description: "Protect a quiet screen-free block without adding another task to complete.",
    duration: "5 min",
    icon: MoonStar,
    screenFree: true,
  },
  {
    id: "connect",
    title: "Connect",
    description: "Send a low-pressure check-in to a person Aina trusts.",
    duration: "2 min",
    icon: MessageCircle,
  },
];

function ResetMode() {
  const { currentCapacity } = useLoadLessDemo();
  const [state, setState] = useState<ResetState>("menu");
  const [activityId, setActivityId] = useState<ActivityId>("game");
  const [checkIn, setCheckIn] = useState<CheckInResult | null>(null);
  const activity = activities.find((item) => item.id === activityId) ?? activities[0]!;

  const openActivity = (id: ActivityId) => {
    setActivityId(id);
    setState("activity");
    setCheckIn(null);
  };

  const finishActivity = () => {
    setState("complete");
    setCheckIn(null);
  };

  return (
    <div className="space-y-6">
      {state === "menu" ? (
        <PageHeader
          eyebrow="Recovery intervention"
          title="How do you want to reset?"
          description="Choose one short activity. This is protected recovery time—not another productivity target."
        />
      ) : (
        <button
          type="button"
          onClick={() => setState("menu")}
          className="inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Recovery Menu
        </button>
      )}

      {state === "menu" ? (
        <RecoveryMenu currentCapacity={currentCapacity} onSelect={openActivity} />
      ) : state === "activity" ? (
        <ActivityScreen activity={activity} onComplete={finishActivity} />
      ) : (
        <ResetComplete
          activity={activity}
          result={checkIn}
          onResult={setCheckIn}
          onAgain={() => setState("menu")}
        />
      )}
    </div>
  );
}

function RecoveryMenu({
  currentCapacity,
  onSelect,
}: {
  currentCapacity: number;
  onSelect: (id: ActivityId) => void;
}) {
  const highLoad = currentCapacity >= 90;

  return (
    <>
      <Card className="overflow-hidden rounded-2xl border-primary/20 shadow-lift">
        <CardContent className="grid gap-4 bg-primary p-5 text-primary-foreground sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-foreground/10">
            <Leaf className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold">
              {highLoad ? "Your week has very little recovery space" : "A short reset is available"}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-primary-foreground/70">
              Capacity is currently {currentCapacity}%. Easey recommends a short, bounded pause
              before the next commitment decision.
            </p>
          </div>
          <span className="w-fit rounded-full bg-primary-foreground/10 px-3 py-1.5 text-xs font-semibold">
            Suggested · Quick Game
          </span>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <button
              key={activity.id}
              type="button"
              onClick={() => onSelect(activity.id)}
              className={`group rounded-2xl border bg-card p-5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift ${
                activity.recommended ? "border-positive/50" : "border-border"
              }`}
            >
              <span className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" aria-hidden={true} />
                </span>
                <span className="flex flex-wrap justify-end gap-1.5">
                  {activity.recommended ? (
                    <span className="rounded-full bg-positive-soft px-2.5 py-1 text-[11px] font-bold text-positive">
                      Recommended
                    </span>
                  ) : null}
                  {activity.screenFree ? (
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                      Screen-free
                    </span>
                  ) : null}
                </span>
              </span>
              <span className="mt-4 block text-base font-semibold">{activity.title}</span>
              <span className="mt-1 block min-h-10 text-sm leading-relaxed text-muted-foreground">
                {activity.description}
              </span>
              <span className="mt-4 flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <TimerReset className="h-3.5 w-3.5" aria-hidden="true" /> {activity.duration}
                </span>
                <span className="flex items-center gap-1 text-foreground">
                  Start <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <Card className="rounded-2xl border-border bg-secondary/60 shadow-soft">
        <CardContent className="flex items-start gap-3 p-5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-positive" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold">Designed to end</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Every option is time-bounded, has no streak or leaderboard, and returns Aina to a real
              workload choice. It supports a pause; it does not diagnose or treat stress.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function ActivityScreen({
  activity,
  onComplete,
}: {
  activity: ActivityDefinition;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Reset Mode · {activity.duration}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{activity.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {activity.description}
        </p>
      </div>

      {activity.id === "game" ? <TicTacToeGame onComplete={onComplete} /> : null}
      {activity.id === "breathe" ? <BreathingReset onComplete={onComplete} /> : null}
      {activity.id === "stretch" ? <StretchReset onComplete={onComplete} /> : null}
      {activity.id === "walk" ? (
        <TimedReset
          title="Put the screen down"
          detail="Walk somewhere nearby without solving the sponsorship-deck problem. The timer will be here when you return."
          seconds={300}
          icon={Footprints}
          onComplete={onComplete}
        />
      ) : null}
      {activity.id === "listen" ? <ListenReset onComplete={onComplete} /> : null}
      {activity.id === "rest" ? (
        <TimedReset
          title="Nothing to complete"
          detail="Silence notifications, move away from the screen and let this five-minute block remain empty."
          seconds={300}
          icon={MoonStar}
          onComplete={onComplete}
        />
      ) : null}
      {activity.id === "connect" ? <ConnectReset onComplete={onComplete} /> : null}
    </div>
  );
}

type Player = "X" | "O";
type Cell = Player | null;

const winningLines: Array<readonly [number, number, number]> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(board: Cell[]): Player | null {
  for (const [a, b, c] of winningLines) {
    const first = board[a];

    if (first && first === board[b] && first === board[c]) {
      return first;
    }
  }

  return null;
}

function TicTacToeGame({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");

  const winner = getWinner(board);
  const isDraw = !winner && board.every((cell) => cell !== null);

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    const nextBoard = [...board];
    nextBoard[index] = currentPlayer;

    setBoard(nextBoard);

    if (!getWinner(nextBoard) && nextBoard.some((cell) => cell === null)) {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
  };

  return (
    <Card className="overflow-hidden rounded-3xl border-primary/20 shadow-lift">
      <CardContent className="grid min-h-[32rem] place-items-center bg-secondary/40 p-5 sm:p-7">
        <div className="w-full max-w-md text-center">

          {/* Icon */}
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Gamepad2 className="h-7 w-7" aria-hidden="true" />
          </span>

          {/* Title */}
          <h2 className="mt-4 text-xl font-bold">
            Tic-Tac-Toe
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Take a quick, low-pressure break. No score, no streak and nothing
            you need to achieve.
          </p>

          {/* Game status */}
          <div className="mt-5 rounded-xl border border-border bg-card p-3">
            {winner ? (
              <p className="text-sm font-semibold">
                {winner} wins 🎉
              </p>
            ) : isDraw ? (
              <p className="text-sm font-semibold">
                It&apos;s a draw — nice reset 🙂
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Turn:{" "}
                <span className="font-bold text-foreground">
                  {currentPlayer}
                </span>
              </p>
            )}
          </div>

          {/* Board */}
          <div className="mx-auto mt-5 grid max-w-xs grid-cols-3 gap-3">
            {board.map((cell, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleCellClick(index)}
                disabled={Boolean(cell) || Boolean(winner)}
                className="aspect-square rounded-2xl border border-border bg-card text-3xl font-bold shadow-soft transition-all hover:-translate-y-0.5 hover:bg-secondary disabled:cursor-default disabled:hover:translate-y-0"
                aria-label={`Tic tac toe cell ${index + 1}`}
              >
                {cell}
              </button>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={resetGame}
            >
              <RefreshCcw className="h-4 w-4" aria-hidden="true" />
              Play again
            </Button>

            <Button
              className="rounded-xl"
              onClick={onComplete}
            >
              Finish reset
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          {/* Explanation */}
          <div className="mt-5 rounded-xl border border-border bg-card p-4 text-left">
            <p className="text-xs leading-relaxed text-muted-foreground">
              This game is designed as a short mental pause, not another task
              to complete. You can stop at any time and return to your week.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


function BreathingReset({ onComplete }: { onComplete: () => void }) {
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const elapsed = 60 - remaining;
  const phaseSecond = elapsed % 12;
  const phase = phaseSecond < 4 ? "Inhale" : phaseSecond < 6 ? "Hold" : "Exhale";

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const timer = window.setTimeout(() => setRemaining((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [remaining, running]);

  return (
    <Card className="overflow-hidden rounded-3xl border-positive/30 shadow-lift">
      <CardContent className="grid min-h-[32rem] place-items-center bg-positive-soft/40 p-6 text-center">
        <div>
          <div
            className={`mx-auto grid h-48 w-48 place-items-center rounded-full bg-positive text-positive-foreground shadow-lift sm:h-56 sm:w-56 ${
              running ? "breathing-orb" : ""
            }`}
          >
            <div>
              <Wind className="mx-auto h-7 w-7" aria-hidden="true" />
              <p className="mt-3 text-2xl font-bold">{running ? phase : "Ready"}</p>
              <p className="mt-1 text-sm tabular-nums text-positive-foreground/75">
                {formatTime(remaining)}
              </p>
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
            Breathe normally and stop if this feels uncomfortable. There is no target to reach.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button className="rounded-xl" onClick={() => setRunning((current) => !current)}>
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? "Pause" : remaining < 60 ? "Continue" : "Begin"}
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={onComplete}>
              Finish reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StretchReset({ onComplete }: { onComplete: () => void }) {
  const steps = [
    { title: "Release your shoulders", detail: "Lift gently, hold, then let them drop." },
    {
      title: "Look away from the screen",
      detail: "Focus on something farther away for 20 seconds.",
    },
    { title: "Unclench hands and jaw", detail: "Notice tension without forcing it away." },
  ];
  const [done, setDone] = useState<number[]>([]);

  return (
    <Card className="rounded-3xl border-border shadow-lift">
      <CardContent className="p-5 sm:p-7">
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => {
            const complete = done.includes(index);
            return (
              <button
                key={step.title}
                type="button"
                onClick={() =>
                  setDone((current) =>
                    current.includes(index)
                      ? current.filter((currentIndex) => currentIndex !== index)
                      : [...current, index],
                  )
                }
                className={`rounded-2xl border p-5 text-left transition-colors ${
                  complete
                    ? "border-positive/50 bg-positive-soft/50"
                    : "border-border bg-background"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-sm font-bold">
                    {complete ? <Check className="h-5 w-5 text-positive" /> : `0${index + 1}`}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">About 1 min</span>
                </span>
                <span className="mt-5 block text-sm font-semibold">{step.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                  {step.detail}
                </span>
              </button>
            );
          })}
        </div>
        <Button className="mt-5 rounded-xl" disabled={done.length === 0} onClick={onComplete}>
          Complete stretch reset
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </CardContent>
    </Card>
  );
}

function TimedReset({
  title,
  detail,
  seconds,
  icon: Icon,
  onComplete,
}: {
  title: string;
  detail: string;
  seconds: number;
  icon: ActivityDefinition["icon"];
  onComplete: () => void;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const completed = useRef(false);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const timer = window.setTimeout(() => setRemaining((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [remaining, running]);

  useEffect(() => {
    if (remaining === 0 && !completed.current) {
      completed.current = true;
      onComplete();
    }
  }, [onComplete, remaining]);

  return (
    <Card className="overflow-hidden rounded-3xl border-primary/20 shadow-lift">
      <CardContent className="grid min-h-[30rem] place-items-center bg-primary p-6 text-center text-primary-foreground">
        <div>
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-primary-foreground/10">
            <Icon className="h-8 w-8" aria-hidden={true} />
          </span>
          <p className="mt-6 text-6xl font-extrabold tabular-nums sm:text-7xl">
            {formatTime(remaining)}
          </p>
          <h2 className="mt-5 text-xl font-bold">{title}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-primary-foreground/70">
            {detail}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button
              variant="secondary"
              className="rounded-xl"
              onClick={() => setRunning((current) => !current)}
            >
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? "Pause" : remaining < seconds ? "Continue" : "Start timer"}
            </Button>
            <Button
              variant="ghost"
              className="rounded-xl text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={onComplete}
            >
              Finish demo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ListenReset({ onComplete }: { onComplete: () => void }) {
  const [opened, setOpened] = useState(false);

  return (
    <Card className="rounded-3xl border-border shadow-lift">
      <CardContent className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center">
        <div>
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-positive-soft">
            <Headphones className="h-7 w-7 text-positive" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-xl font-bold">Aina's recovery shortcut</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Personal shortcuts are chosen by the user. Easey opens the activity and keeps the
            recovery block time-bounded instead of recommending an endless feed.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild className="rounded-xl" onClick={() => setOpened(true)}>
              <a href="https://open.spotify.com/" target="_blank" rel="noreferrer">
                Open Spotify
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={onComplete}>
              {opened ? "I am ready to return" : "Skip external shortcut"}
            </Button>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-secondary p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Personal recovery plan
          </p>
          <p className="mt-3 text-lg font-bold">Calm study playlist</p>
          <p className="mt-1 text-sm text-muted-foreground">Return reminder · 5 minutes</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-positive">
            <CircleCheck className="h-4 w-4" aria-hidden="true" /> Chosen by Aina
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ConnectReset({ onComplete }: { onComplete: () => void }) {
  const message =
    "Hey Sara, I am having a packed day. No need to solve anything—I just wanted to check in for a minute.";
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast.success("Check-in message copied");
    } catch {
      toast.error("Could not copy — select the message manually");
    }
  };

  return (
    <Card className="rounded-3xl border-border shadow-lift">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageCircle className="h-5 w-5" aria-hidden="true" /> Low-pressure connection
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Trusted contact: Sara · close friend. Aina controls this list.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-border bg-secondary p-5">
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="rounded-xl" onClick={copy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy check-in"}
          </Button>
          <Button variant="outline" className="rounded-xl" onClick={onComplete}>
            Finish connection reset
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Easey does not message anyone automatically. The user decides whether to contact their
          trusted person.
        </p>
      </CardContent>
    </Card>
  );
}

function ResetComplete({
  activity,
  result,
  onResult,
  onAgain,
}: {
  activity: ActivityDefinition;
  result: CheckInResult | null;
  onResult: (result: CheckInResult) => void;
  onAgain: () => void;
}) {
  const responses = [
    { id: "better" as const, label: "A little better", detail: "Return gently to one priority" },
    { id: "same" as const, label: "About the same", detail: "Protect more recovery space" },
    { id: "more" as const, label: "I need more time", detail: "Do not add another commitment" },
  ];

  return (
    <Card className="overflow-hidden rounded-3xl border-positive/35 shadow-lift">
      <div className="bg-positive-soft p-6 text-center sm:p-8">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-card shadow-soft">
          <Leaf className="h-8 w-8 text-positive" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-bold">You made some space.</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
          {activity.title} is complete. You do not need to become productive immediately; first
          notice whether the pause changed anything.
        </p>
      </div>
      <CardContent className="space-y-5 p-5 sm:p-7">
        <div>
          <p className="text-sm font-semibold">How do you feel now?</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {responses.map((response) => (
              <button
                key={response.id}
                type="button"
                onClick={() => onResult(response.id)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  result === response.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-secondary"
                }`}
              >
                <span className="block text-sm font-semibold">{response.label}</span>
                <span
                  className={`mt-1 block text-xs ${
                    result === response.id ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {response.detail}
                </span>
              </button>
            ))}
          </div>
        </div>

        {result ? (
          <div className="rounded-xl border border-border bg-secondary p-4">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4" aria-hidden="true" /> Suggested next step
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {result === "better"
                ? "Return to one already-planned priority. Keep new requests in Cooling-off Mode."
                : result === "same"
                  ? "Protect another ten minutes and move one flexible task before continuing."
                  : "Do not accept the new request yet. Open the Action Plan or contact someone you trust."}
            </p>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {result ? (
            <Button asChild className="rounded-xl">
              <Link to="/">
                Return to my week
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <Button className="rounded-xl" disabled>
              Choose how you feel first
            </Button>
          )}
          <Button variant="outline" className="rounded-xl" onClick={onAgain}>
            Choose another reset
          </Button>
          {result === "more" ? (
            <Button asChild variant="secondary" className="rounded-xl">
              <Link to="/action-plan">Open Action Plan</Link>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}
