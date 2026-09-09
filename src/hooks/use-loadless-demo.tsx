import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { boundaryMessages, demoMessage, recommendations, sandbox } from "@/data/loadless";
import {
  initialTaskImpact,
  initialTasks,
  taskImpact,
  type LoadLessTask,
  type TaskDraft,
  type TaskEffort,
} from "@/data/tasks";

export type BoundaryTone = keyof typeof boundaryMessages;
export type SandboxChoice = "accept" | "reduce" | "decline";
export type EffortLevel = TaskEffort;
export type DeadlineOption = "Wednesday" | "Friday" | "Next week";

export type CheckIn = {
  energy: number;
  sleepHours: number;
  stress: number;
  completed: boolean;
  updatedAt: string | null;
};

export function calculateCheckInAdjustment(
  checkIn: Pick<CheckIn, "energy" | "sleepHours" | "stress">,
): number {
  return Math.round(
    (3 - checkIn.energy) * 2 + (7 - checkIn.sleepHours) * 2 + (checkIn.stress - 3) * 2,
  );
}

export type IncomingBreakdown = {
  time: number;
  focus: number;
  urgency: number;
  contextSwitch: number;
};

type DemoState = {
  message: string;
  extracted: boolean;
  commitmentTask: string;
  commitmentCategory: string;
  commitmentFlexibility: string;
  durationHours: number;
  effortLevel: EffortLevel;
  deadlineOption: DeadlineOption;
  tasks: LoadLessTask[];
  checkIn: CheckIn;
  sandboxChoice: SandboxChoice;
  selectedActions: string[];
  tone: BoundaryTone;
  boundaryMessage: string;
  messageSent: boolean;
  completed: boolean;
};

type DemoContextValue = DemoState & {
  baseCapacity: number;
  currentCapacity: number;
  taskCapacityAdjustment: number;
  checkInAdjustment: number;
  incomingLoad: number;
  incomingBreakdown: IncomingBreakdown;
  forecastCapacity: number;
  projectedCapacity: number;
  savedCapacity: number;
  setMessage: (message: string) => void;
  setExtracted: (extracted: boolean) => void;
  setCommitmentTask: (task: string) => void;
  setCommitmentCategory: (category: string) => void;
  setCommitmentFlexibility: (flexibility: string) => void;
  setDurationHours: (hours: number) => void;
  setEffortLevel: (level: EffortLevel) => void;
  setDeadlineOption: (deadline: DeadlineOption) => void;
  setSandboxChoice: (choice: SandboxChoice) => void;
  setSelectedActions: (actions: string[]) => void;
  toggleAction: (id: string) => void;
  selectAllActions: () => void;
  setTone: (tone: BoundaryTone) => void;
  setBoundaryMessage: (message: string) => void;
  setMessageSent: (sent: boolean) => void;
  addTask: (task: TaskDraft) => void;
  updateTask: (id: string, task: TaskDraft) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  saveCheckIn: (checkIn: Pick<CheckIn, "energy" | "sleepHours" | "stress">) => void;
  completeDemo: () => void;
  resetDemo: () => void;
};

const STORAGE_KEY = "loadless-demo-v1";

const initialState: DemoState = {
  message: demoMessage,
  extracted: false,
  commitmentTask: "Prepare sponsorship deck",
  commitmentCategory: "Society",
  commitmentFlexibility: "Medium",
  durationHours: 3,
  effortLevel: "High",
  deadlineOption: "Wednesday",
  tasks: initialTasks,
  checkIn: {
    energy: 3,
    sleepHours: 7,
    stress: 3,
    completed: false,
    updatedAt: null,
  },
  sandboxChoice: "accept",
  selectedActions: [],
  tone: "Friendly",
  boundaryMessage: boundaryMessages.Friendly,
  messageSent: false,
  completed: false,
};

const DemoContext = createContext<DemoContextValue | null>(null);

function isDemoState(value: unknown): value is DemoState {
  return Boolean(value && typeof value === "object" && "selectedActions" in value);
}

export function LoadLessDemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (isDemoState(parsed)) setState({ ...initialState, ...parsed });
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const savedCapacity = recommendations
    .filter((recommendation) => state.selectedActions.includes(recommendation.id))
    .reduce((total, recommendation) => total + recommendation.saving, 0);

  const currentTaskImpact = state.tasks
    .filter((task) => task.status === "pending")
    .reduce((total, task) => total + taskImpact(task), 0);
  const taskCapacityAdjustment = currentTaskImpact - initialTaskImpact;
  const checkInAdjustment = state.checkIn.completed ? calculateCheckInAdjustment(state.checkIn) : 0;
  const baseCapacity = Math.max(
    0,
    Math.min(150, sandbox.current + taskCapacityAdjustment + checkInAdjustment),
  );

  const incomingBreakdown = useMemo<IncomingBreakdown>(
    () => ({
      time: state.durationHours * 4,
      focus: { Low: 2, Medium: 5, High: 8 }[state.effortLevel],
      urgency: { Wednesday: 7, Friday: 4, "Next week": 1 }[state.deadlineOption],
      contextSwitch: 4,
    }),
    [state.deadlineOption, state.durationHours, state.effortLevel],
  );
  const incomingLoad = Object.values(incomingBreakdown).reduce((total, value) => total + value, 0);
  const forecastCapacity = baseCapacity + incomingLoad;
  const projectedCapacity = forecastCapacity - savedCapacity;
  const currentCapacity = state.completed ? projectedCapacity : baseCapacity;

  const value = useMemo<DemoContextValue>(
    () => ({
      ...state,
      baseCapacity,
      currentCapacity,
      taskCapacityAdjustment,
      checkInAdjustment,
      incomingLoad,
      incomingBreakdown,
      forecastCapacity,
      projectedCapacity,
      savedCapacity,
      setMessage: (message) => setState((current) => ({ ...current, message })),
      setExtracted: (extracted) => setState((current) => ({ ...current, extracted })),
      setCommitmentTask: (commitmentTask) =>
        setState((current) => ({ ...current, commitmentTask })),
      setCommitmentCategory: (commitmentCategory) =>
        setState((current) => ({ ...current, commitmentCategory })),
      setCommitmentFlexibility: (commitmentFlexibility) =>
        setState((current) => ({ ...current, commitmentFlexibility })),
      setDurationHours: (durationHours) =>
        setState((current) => ({
          ...current,
          durationHours,
          selectedActions: [],
          completed: false,
        })),
      setEffortLevel: (effortLevel) =>
        setState((current) => ({
          ...current,
          effortLevel,
          selectedActions: [],
          completed: false,
        })),
      setDeadlineOption: (deadlineOption) =>
        setState((current) => ({
          ...current,
          deadlineOption,
          selectedActions: [],
          completed: false,
        })),
      setSandboxChoice: (sandboxChoice) => setState((current) => ({ ...current, sandboxChoice })),
      setSelectedActions: (selectedActions) =>
        setState((current) => ({ ...current, selectedActions })),
      toggleAction: (id) =>
        setState((current) => ({
          ...current,
          selectedActions: current.selectedActions.includes(id)
            ? current.selectedActions.filter((actionId) => actionId !== id)
            : [...current.selectedActions, id],
        })),
      selectAllActions: () =>
        setState((current) => ({
          ...current,
          selectedActions: recommendations.map((recommendation) => recommendation.id),
        })),
      setTone: (tone) =>
        setState((current) => ({
          ...current,
          tone,
          boundaryMessage: boundaryMessages[tone],
        })),
      setBoundaryMessage: (boundaryMessage) =>
        setState((current) => ({ ...current, boundaryMessage })),
      setMessageSent: (messageSent) => setState((current) => ({ ...current, messageSent })),
      addTask: (task) =>
        setState((current) => ({
          ...current,
          tasks: [
            ...current.tasks,
            {
              ...task,
              id:
                typeof crypto !== "undefined" && "randomUUID" in crypto
                  ? crypto.randomUUID()
                  : `task-${Date.now()}`,
              status: "pending",
            },
          ],
          completed: false,
        })),
      updateTask: (id, task) =>
        setState((current) => ({
          ...current,
          tasks: current.tasks.map((currentTask) =>
            currentTask.id === id ? { ...currentTask, ...task } : currentTask,
          ),
          completed: false,
        })),
      deleteTask: (id) =>
        setState((current) => ({
          ...current,
          tasks: current.tasks.filter((task) => task.id !== id),
          completed: false,
        })),
      toggleTaskStatus: (id) =>
        setState((current) => ({
          ...current,
          tasks: current.tasks.map((task) =>
            task.id === id
              ? { ...task, status: task.status === "pending" ? "done" : "pending" }
              : task,
          ),
          completed: false,
        })),
      saveCheckIn: (checkIn) =>
        setState((current) => ({
          ...current,
          checkIn: {
            ...checkIn,
            completed: true,
            updatedAt: new Date().toISOString(),
          },
          completed: false,
        })),
      completeDemo: () =>
        setState((current) => ({ ...current, messageSent: true, completed: true })),
      resetDemo: () => {
        window.localStorage.removeItem(STORAGE_KEY);
        setState(initialState);
      },
    }),
    [
      baseCapacity,
      checkInAdjustment,
      currentCapacity,
      forecastCapacity,
      incomingBreakdown,
      incomingLoad,
      projectedCapacity,
      savedCapacity,
      state,
      taskCapacityAdjustment,
    ],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useLoadLessDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useLoadLessDemo must be used inside LoadLessDemoProvider");
  return context;
}
