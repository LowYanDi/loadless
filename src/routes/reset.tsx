import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BellRing,
  Brain,
  Check,
  CircleCheck,
  Copy,
  ExternalLink,
  Footprints,
  Gamepad2,
  Headphones,
  Leaf,
  MessageCircle,
  Music2,
  MoonStar,
  Pause,
  PersonStanding,
  Play,
  RefreshCcw,
  Scissors,
  ShieldCheck,
  SkipForward,
  Sparkles,
  TimerReset,
  Volume2,
  Wind,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type MutableRefObject,
} from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/loadless/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useLoadLessDemo } from "@/hooks/use-loadless-demo";

export const Route = createFileRoute("/reset")({
  head: () => ({
    meta: [
      { title: "Reset Mode — Easey" },
      {
        name: "description",
        content:
          "Choose a recovery activity, personalised music, or a capacity-adaptive focus cycle.",
      },
    ],
  }),
  component: ResetMode,
});

type ActivityId =
  "focus" | "game" | "shred" | "breathe" | "stretch" | "walk" | "listen" | "rest" | "connect";
type ResetState = "menu" | "activity" | "complete";
type CheckInResult = "better" | "same" | "more";

type ActivityDefinition = {
  id: ActivityId;
  title: string;
  description: string;
  duration: string;
  emoji: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  recommended?: boolean;
  screenFree?: boolean;
};

const activities: ActivityDefinition[] = [
  {
    id: "focus",
    title: "Start a Focus Cycle",
    description: "Use a focus-and-break rhythm that adapts to your current capacity.",
    duration: "Adaptive · 15–45 min",
    emoji: "🍅",
    icon: Brain,
    recommended: true,
  },
  {
    id: "game",
    title: "Tic-Tac-Toe",
    description: "Take a short, no-score mental break with a familiar game.",
    duration: "1-3 min",
    emoji: "⭕",
    icon: Gamepad2,
  },
  {
    id: "shred",
    title: "Tap & Tear",
    description: "Tap the pretend assignment, hear it rip, then watch a fresh page return.",
    duration: "1–2 min",
    emoji: "📝",
    icon: Scissors,
  },
  {
    id: "breathe",
    title: "Breathe",
    description: "Follow one slow inhale, hold and exhale cycle at a time.",
    duration: "1 min",
    emoji: "🫧",
    icon: Wind,
  },
  {
    id: "stretch",
    title: "Stretch",
    description: "Three gentle, desk-friendly movements with no performance target.",
    duration: "3 min",
    emoji: "🙆",
    icon: PersonStanding,
  },
  {
    id: "walk",
    title: "Walk",
    description: "Put the screen down and take a short walk before the next decision.",
    duration: "5 min",
    emoji: "🌿",
    icon: Footprints,
    screenFree: true,
  },
  {
    id: "listen",
    title: "Personalised Music",
    description: "Listen without a forced timer and keep an optional return reminder.",
    duration: "No forced limit",
    emoji: "🎧",
    icon: Headphones,
  },
  {
    id: "rest",
    title: "Rest",
    description: "Protect a quiet screen-free block without adding another task to complete.",
    duration: "5 min",
    emoji: "😴",
    icon: MoonStar,
    screenFree: true,
  },
  {
    id: "connect",
    title: "Connect",
    description: "Send a low-pressure check-in to a person Aina trusts.",
    duration: "2 min",
    emoji: "💬",
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
          title="How do you want to reset or focus?"
          description="Choose a short recovery activity, personalised music, or a capacity-adaptive focus cycle."
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
        <ActivityScreen
          activity={activity}
          currentCapacity={currentCapacity}
          onComplete={finishActivity}
        />
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
  const recommendedPreset = focusPresetForCapacity(currentCapacity);

  return (
    <>
      <Card className="overflow-hidden rounded-2xl border-primary/20 shadow-lift">
        <CardContent className="grid gap-4 bg-primary p-5 text-primary-foreground sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-foreground/10">
            <Leaf className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold">
              {highLoad
                ? "Your week has very little recovery space"
                : "Your focus rhythm can adapt"}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-primary-foreground/70">
              Capacity is currently {currentCapacity}%. Easey recommends {recommendedPreset.focus}
              minutes of focus followed by a {recommendedPreset.break} minute break.
            </p>
          </div>
          <span className="w-fit rounded-full bg-primary-foreground/10 px-3 py-1.5 text-xs font-semibold">
            Suggested · Focus Cycle
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
              className={`playful-card group rounded-2xl border bg-card p-5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift ${
                activity.recommended ? "border-positive/50" : "border-border"
              }`}
            >
              <span className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" aria-hidden={true} />
                </span>
                <span className="flex flex-wrap justify-end gap-1.5">
                  <span
                    className="emoji-sticker grid h-9 w-9 place-items-center rounded-xl bg-warning-soft text-xl"
                    aria-hidden="true"
                  >
                    {activity.emoji}
                  </span>
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
            <p className="text-sm font-semibold">User-controlled, not addictive</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Short resets are time-bounded. Music has no forced limit but can use an optional
              reminder. There are no streaks or leaderboards, and Easey does not diagnose or treat
              stress.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function ActivityScreen({
  activity,
  currentCapacity,
  onComplete,
}: {
  activity: ActivityDefinition;
  currentCapacity: number;
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

      {activity.id === "focus" ? (
        <FocusCycle currentCapacity={currentCapacity} onComplete={onComplete} />
      ) : null}
      {activity.id === "game" ? <TicTacToeGame onComplete={onComplete} /> : null}
      {activity.id === "shred" ? <AssignmentShredGame onComplete={onComplete} /> : null}
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
      {activity.id === "listen" ? (
        <ListenReset currentCapacity={currentCapacity} onComplete={onComplete} />
      ) : null}
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

type FocusPreset = {
  id: "gentle" | "balanced" | "deep";
  name: string;
  focus: number;
  break: number;
  capacityNote: string;
};

const focusPresets: FocusPreset[] = [
  {
    id: "gentle",
    name: "Gentle",
    focus: 15,
    break: 5,
    capacityNote: "For very high load or low energy",
  },
  {
    id: "balanced",
    name: "Balanced",
    focus: 25,
    break: 5,
    capacityNote: "For an approaching-limit week",
  },
  {
    id: "deep",
    name: "Deep",
    focus: 45,
    break: 10,
    capacityNote: "For a steady week with enough energy",
  },
];

function focusPresetForCapacity(capacity: number) {
  if (capacity >= 90) return focusPresets[0]!;
  if (capacity >= 70) return focusPresets[1]!;
  return focusPresets[2]!;
}

function FocusCycle({
  currentCapacity,
  onComplete,
}: {
  currentCapacity: number;
  onComplete: () => void;
}) {
  const recommendation = focusPresetForCapacity(currentCapacity);
  const [preset, setPreset] = useState<FocusPreset>(recommendation);
  const [phase, setPhase] = useState<"focus" | "break">("focus");
  const [remaining, setRemaining] = useState(recommendation.focus * 60);
  const [running, setRunning] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [task, setTask] = useState("slides");
  const [music, setMusic] = useState("lofi");
  const [musicOn, setMusicOn] = useState(true);

  const phaseMinutes = phase === "focus" ? preset.focus : preset.break;
  const totalSeconds = phaseMinutes * 60;
  const elapsedPercent = Math.min(100, ((totalSeconds - remaining) / totalSeconds) * 100);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const timer = window.setTimeout(
      () => setRemaining((current) => Math.max(0, current - 1)),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [remaining, running]);

  useEffect(() => {
    if (remaining !== 0) return;
    setRunning(false);
    if (phase === "focus") {
      setCompletedCycles((current) => current + 1);
      setPhase("break");
      setRemaining(preset.break * 60);
      toast.success("Focus block complete — your break is ready");
    } else {
      setPhase("focus");
      setRemaining(preset.focus * 60);
      toast.success("Break complete — begin again when you are ready");
    }
  }, [phase, preset.break, preset.focus, remaining]);

  const choosePreset = (nextPreset: FocusPreset) => {
    setPreset(nextPreset);
    setPhase("focus");
    setRemaining(nextPreset.focus * 60);
    setRunning(false);
  };

  const skipPhase = () => {
    setRunning(false);
    if (phase === "focus") {
      setCompletedCycles((current) => current + 1);
      setPhase("break");
      setRemaining(preset.break * 60);
    } else {
      setPhase("focus");
      setRemaining(preset.focus * 60);
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
      <Card className="overflow-hidden rounded-3xl border-primary/20 shadow-lift">
        <CardContent className="grid min-h-[34rem] place-items-center bg-primary p-6 text-center text-primary-foreground">
          <div className="w-full max-w-xl">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold">
                {phase === "focus" ? "Focus block" : "Recovery break"}
              </span>
              <span className="rounded-full bg-positive/20 px-3 py-1 text-xs font-semibold text-positive-soft">
                {preset.focus}/{preset.break} · {preset.name}
              </span>
            </div>
            <p className="mt-8 text-6xl font-extrabold tabular-nums sm:text-7xl">
              {formatTime(remaining)}
            </p>
            <p className="mt-4 text-lg font-bold">
              {phase === "focus" ? "One task, gently" : "Step away and recover"}
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-primary-foreground/70">
              {phase === "focus"
                ? "Easey will not add a new task during this block. Pause if your capacity changes."
                : "This break is part of the cycle, not time you need to earn."}
            </p>
            <Progress
              value={elapsedPercent}
              className="mx-auto mt-6 h-2 max-w-md bg-primary-foreground/15"
            />
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button
                variant="secondary"
                className="rounded-xl"
                onClick={() => setRunning((current) => !current)}
              >
                {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {running ? "Pause" : remaining < totalSeconds ? "Continue" : "Start cycle"}
              </Button>
              <Button
                variant="ghost"
                className="rounded-xl text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                onClick={skipPhase}
              >
                <SkipForward className="h-4 w-4" /> Skip to {phase === "focus" ? "break" : "focus"}
              </Button>
            </div>
            <p className="mt-5 text-xs text-primary-foreground/60">
              {completedCycles} focus {completedCycles === 1 ? "block" : "blocks"} completed · no
              streak pressure
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="rounded-2xl border-positive/35 shadow-soft">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-positive-soft">
                <Sparkles className="h-5 w-5 text-positive" />
              </span>
              <div>
                <p className="text-sm font-semibold">Capacity-adaptive recommendation</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  At {currentCapacity}% capacity, Easey suggests {recommendation.focus} minutes of
                  focus and a {recommendation.break}-minute break. You stay in control and may
                  override it.
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {focusPresets.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={preset.id === item.id}
                  onClick={() => choosePreset(item)}
                  className={`rounded-xl border p-3 text-left transition-colors ${
                    preset.id === item.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  <span className="block text-xs font-bold">
                    {item.focus}/{item.break}
                  </span>
                  <span className="mt-1 block text-[10px] opacity-70">{item.name}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">{preset.capacityNote}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-soft">
          <CardContent className="space-y-4 p-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold" htmlFor="focus-music">
                Music companion
              </label>
              <Select value={music} onValueChange={setMusic}>
                <SelectTrigger id="focus-music" className="h-10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lofi">Lo-fi focus · no lyrics</SelectItem>
                  <SelectItem value="piano">Quiet piano</SelectItem>
                  <SelectItem value="nature">Rain and nature</SelectItem>
                  <SelectItem value="none">No music</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-secondary/60 p-3">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <div>
                  <p className="text-xs font-semibold">Play during focus</p>
                  <p className="text-[11px] text-muted-foreground">Prototype player</p>
                </div>
              </div>
              <Switch
                checked={music !== "none" && musicOn}
                disabled={music === "none"}
                onCheckedChange={setMusicOn}
                aria-label="Play music during focus"
              />
            </div>
            <Button variant="outline" className="w-full rounded-xl" onClick={onComplete}>
              <CircleCheck className="h-4 w-4" /> Finish this Focus Cycle
            </Button>
          </CardContent>
        </Card>
      </div>
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

function TicTacToeGame({ onComplete }: { onComplete: () => void }) {
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
          <h2 className="mt-4 text-xl font-bold">Tic-Tac-Toe</h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Take a quick, low-pressure break. No score, no streak and nothing you need to achieve.
          </p>

          {/* Game status */}
          <div className="mt-5 rounded-xl border border-border bg-card p-3">
            {winner ? (
              <p className="text-sm font-semibold">{winner} wins 🎉</p>
            ) : isDraw ? (
              <p className="text-sm font-semibold">It&apos;s a draw — nice reset 🙂</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Turn: <span className="font-bold text-foreground">{currentPlayer}</span>
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
            <Button variant="outline" className="rounded-xl" onClick={resetGame}>
              <RefreshCcw className="h-4 w-4" aria-hidden="true" />
              Play again
            </Button>

            <Button className="rounded-xl" onClick={onComplete}>
              Finish reset
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          {/* Explanation */}
          <div className="mt-5 rounded-xl border border-border bg-card p-4 text-left">
            <p className="text-xs leading-relaxed text-muted-foreground">
              This game is designed as a short mental pause, not another task to complete. You can
              stop at any time and return to your week.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const paperShards = [
  { x: -132, y: -94, rotate: -42, delay: 0 },
  { x: -88, y: -142, rotate: 24, delay: 18 },
  { x: -38, y: -126, rotate: -68, delay: 36 },
  { x: 24, y: -146, rotate: 52, delay: 12 },
  { x: 82, y: -118, rotate: -18, delay: 44 },
  { x: 138, y: -82, rotate: 74, delay: 24 },
  { x: -152, y: -18, rotate: 38, delay: 54 },
  { x: 148, y: 8, rotate: -56, delay: 30 },
  { x: -126, y: 76, rotate: -26, delay: 42 },
  { x: -64, y: 132, rotate: 66, delay: 10 },
  { x: 4, y: 148, rotate: -48, delay: 50 },
  { x: 72, y: 126, rotate: 34, delay: 22 },
  { x: 138, y: 72, rotate: -72, delay: 58 },
  { x: -12, y: -82, rotate: 86, delay: 34 },
];

function AssignmentPaperContent() {
  return (
    <span className="assignment-paper-content">
      <span className="assignment-paper-kicker">COURSEWORK</span>
      <span className="assignment-paper-title">Final Assignment</span>
      <span className="assignment-paper-line assignment-paper-line-long" />
      <span className="assignment-paper-line" />
      <span className="assignment-paper-line assignment-paper-line-short" />
      <span className="assignment-paper-line assignment-paper-line-long" />
      <span className="assignment-paper-line" />
      <span className="assignment-paper-line assignment-paper-line-short" />
      <span className="assignment-paper-stamp">DUE WEDNESDAY</span>
    </span>
  );
}

function playTearSound(audioContextRef: MutableRefObject<AudioContext | null>) {
  if (typeof window === "undefined") return;

  const AudioContextConstructor =
    window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextConstructor) return;

  const audioContext = audioContextRef.current ?? new AudioContextConstructor();
  audioContextRef.current = audioContext;
  if (audioContext.state === "suspended") void audioContext.resume();

  const duration = 0.24;
  const sampleCount = Math.floor(audioContext.sampleRate * duration);
  const buffer = audioContext.createBuffer(1, sampleCount, audioContext.sampleRate);
  const channel = buffer.getChannelData(0);

  for (let index = 0; index < sampleCount; index += 1) {
    const fade = 1 - index / sampleCount;
    const scratch = Math.random() * 2 - 1;
    const crackle = index % 97 < 5 ? scratch * 1.8 : scratch;
    channel[index] = crackle * fade;
  }

  const source = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();
  source.buffer = buffer;
  filter.type = "bandpass";
  filter.frequency.value = 1850;
  filter.Q.value = 0.75;
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.16, audioContext.currentTime + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);
  source.start();
}

function AssignmentShredGame({ onComplete }: { onComplete: () => void }) {
  const [tearCount, setTearCount] = useState(0);
  const [isTearing, setIsTearing] = useState(false);
  const restoreTimerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const tension = Math.max(20, 82 - tearCount * 4);
  const face = tearCount === 0 ? "😣" : tearCount < 4 ? "😮‍💨" : tearCount < 8 ? "🙂" : "😊";

  useEffect(
    () => () => {
      if (restoreTimerRef.current !== null) window.clearTimeout(restoreTimerRef.current);
      if (audioContextRef.current) void audioContextRef.current.close();
    },
    [],
  );

  const tearOnce = () => {
    if (isTearing) return;

    setTearCount((current) => current + 1);
    setIsTearing(true);
    playTearSound(audioContextRef);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(35);

    restoreTimerRef.current = window.setTimeout(() => {
      setIsTearing(false);
      restoreTimerRef.current = null;
    }, 720);
  };

  const resetCounter = () => {
    if (restoreTimerRef.current !== null) window.clearTimeout(restoreTimerRef.current);
    restoreTimerRef.current = null;
    setIsTearing(false);
    setTearCount(0);
  };

  return (
    <Card className="overflow-hidden rounded-3xl border-warning/35 shadow-lift">
      <CardContent className="tear-game-surface p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Tap · Rip · Reset · Repeat
            </p>
            <h2 className="mt-1 text-xl font-bold">Tear away the pressure</h2>
          </div>
          <div
            key={tearCount}
            className="tear-counter-pop rounded-2xl border border-warning/35 bg-card/90 px-5 py-3 text-center shadow-soft"
            aria-live="polite"
          >
            <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Total tears
            </span>
            <span className="block text-3xl font-black tabular-nums text-primary">{tearCount}</span>
          </div>
        </div>

        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center">
          <button
            type="button"
            onClick={tearOnce}
            className={`paper-shred-stage group relative min-h-[30rem] overflow-hidden rounded-3xl border border-warning/35 p-5 text-center shadow-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-warning/30 ${
              isTearing ? "is-tearing" : ""
            }`}
            aria-label="Tear the pretend assignment once"
          >
            <span className="absolute left-5 top-5 z-30 rounded-full bg-card/90 px-3 py-1.5 text-xs font-bold text-primary shadow-soft">
              {isTearing ? "Riiip! A fresh page is coming…" : "Tap anywhere to tear"}
            </span>
            <span
              key={`${tearCount}-${isTearing}`}
              className="emoji-sticker absolute right-5 top-4 z-30 text-3xl"
              aria-hidden="true"
            >
              {face}
            </span>

            <span
              className="relative mx-auto mt-14 block h-[22rem] w-[17rem] max-w-full"
              aria-hidden="true"
            >
              <span className="assignment-paper-whole">
                <AssignmentPaperContent />
              </span>

              <span className="assignment-paper-half assignment-paper-half-left">
                <AssignmentPaperContent />
              </span>
              <span className="assignment-paper-half assignment-paper-half-right">
                <AssignmentPaperContent />
              </span>

              {paperShards.map((shard, index) => (
                <span
                  key={index}
                  className="paper-shard"
                  style={
                    {
                      "--shard-x": `${shard.x}px`,
                      "--shard-y": `${shard.y}px`,
                      "--shard-r": `${shard.rotate}deg`,
                      "--shard-delay": `${shard.delay}ms`,
                    } as CSSProperties
                  }
                />
              ))}

              <span className="tear-burst-word">RIP!</span>
            </span>

            <span className="relative z-30 mt-3 block text-sm font-semibold">
              {isTearing
                ? `Tear ${tearCount} released — the pretend page will reset automatically.`
                : tearCount === 0
                  ? "One tap shreds the whole pretend assignment."
                  : "Ready again. Tap for another satisfying rip."}
            </span>
          </button>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">Tears released</span>
                <span className="text-2xl font-bold tabular-nums text-primary" aria-live="polite">
                  {tearCount}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">Playful tension check</span>
                <span className="text-lg font-bold tabular-nums">{tension}%</span>
              </div>
              <Progress value={100 - tension} className="mt-2 h-2.5" />
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Each tap gives visual, sound and gentle vibration feedback. This number is playful
                feedback only and is separate from your real capacity score.
              </p>
            </div>

            <div className="rounded-2xl border border-positive/25 bg-positive-soft/65 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <span className="emoji-sticker text-xl" aria-hidden="true">
                  🫶
                </span>
                The real assignment is safe
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                This is only a symbolic reset. It does not delete work, change deadlines or claim to
                measure mental health.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={resetCounter}
                disabled={tearCount === 0}
              >
                <RefreshCcw className="h-4 w-4" aria-hidden="true" />
                Reset counter
              </Button>
              <Button className="rounded-xl" onClick={onComplete}>
                Finish reset
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
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

const recoveryPlaylists = [
  {
    id: "soft",
    title: "Soft Landing",
    mood: "Lo-fi · instrumental · low tempo",
    track: "Quiet Window",
    reason: "Chosen for high capacity: predictable rhythm, no lyrics, and a softer energy level.",
  },
  {
    id: "calm",
    title: "Calm Study Flow",
    mood: "Acoustic · piano · steady",
    track: "Library Light",
    reason: "Matches Aina's saved interest in calm acoustic music while keeping the pace steady.",
  },
  {
    id: "nature",
    title: "Rain Without Rush",
    mood: "Nature · ambient · no lyrics",
    track: "Evening Rain",
    reason: "Recommended when Aina selects nature sounds and wants minimal musical distraction.",
  },
];

function ListenReset({
  currentCapacity,
  onComplete,
}: {
  currentCapacity: number;
  onComplete: () => void;
}) {
  const [playlistId, setPlaylistId] = useState(currentCapacity >= 90 ? "soft" : "calm");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(24);
  const [reminder, setReminder] = useState("none");
  const playlist =
    recoveryPlaylists.find((item) => item.id === playlistId) ?? recoveryPlaylists[0]!;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(
      () => setProgress((current) => (current >= 100 ? 0 : current + 1)),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [playing, progress]);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
      <Card className="overflow-hidden rounded-3xl border-primary/20 shadow-lift">
        <CardContent className="grid min-h-[31rem] place-items-center bg-primary p-6 text-center text-primary-foreground">
          <div className="w-full max-w-lg">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-primary-foreground/10">
              <Music2 className="h-8 w-8" aria-hidden="true" />
            </span>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/60">
              Now playing · prototype preview
            </p>
            <h2 className="mt-3 text-2xl font-bold">{playlist.track}</h2>
            <p className="mt-1 text-sm text-primary-foreground/70">{playlist.title}</p>
            <Progress
              value={progress}
              className="mx-auto mt-6 h-2 max-w-sm bg-primary-foreground/15"
            />
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button
                variant="secondary"
                className="rounded-xl"
                onClick={() => setPlaying((current) => !current)}
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {playing ? "Pause" : "Play preview"}
              </Button>
              <Button
                variant="ghost"
                className="rounded-xl text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                onClick={onComplete}
              >
                Finish listening
              </Button>
            </div>
            <p className="mt-5 text-xs text-primary-foreground/60">
              No forced time limit · pause or leave whenever you choose
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="rounded-2xl border-positive/35 shadow-soft">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-positive" /> Personal recommendation
                </CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  AI-ready concept · controlled demo logic
                </p>
              </div>
              <span className="rounded-full bg-positive-soft px-2.5 py-1 text-[10px] font-bold text-positive">
                For {currentCapacity}% capacity
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={playlistId} onValueChange={setPlaylistId}>
              <SelectTrigger className="h-10 rounded-xl" aria-label="Recovery playlist">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {recoveryPlaylists.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="rounded-xl bg-secondary/60 p-4">
              <p className="text-sm font-semibold">{playlist.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{playlist.mood}</p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {playlist.reason}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Saved interests</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Lo-fi", "Instrumental", "Acoustic", "Nature"].map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-soft">
          <CardContent className="space-y-4 p-5">
            <div className="space-y-2">
              <label
                htmlFor="music-reminder"
                className="flex items-center gap-2 text-sm font-semibold"
              >
                <BellRing className="h-4 w-4" /> Optional return reminder
              </label>
              <Select
                value={reminder}
                onValueChange={(value) => {
                  setReminder(value);
                  toast.success(
                    value === "none" ? "Reminder turned off" : "Reminder preference saved",
                  );
                }}
              >
                <SelectTrigger id="music-reminder" className="h-10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No reminder</SelectItem>
                  <SelectItem value="10">Remind me in 10 minutes</SelectItem>
                  <SelectItem value="25">Remind me in 25 minutes</SelectItem>
                  <SelectItem value="track">When this track ends</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button asChild variant="outline" className="w-full rounded-xl">
              <a href="https://open.spotify.com/" target="_blank" rel="noreferrer">
                Open my music service
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <div className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-positive" />A future version
              would use opt-in music preferences. Listening history is not shared with the Capacity
              Circle.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
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
          {activity.id === "focus"
            ? "Your Focus Cycle is complete. Notice your capacity before choosing whether to start another block."
            : `${activity.title} is complete. You do not need to become productive immediately; first notice whether the pause changed anything.`}
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
