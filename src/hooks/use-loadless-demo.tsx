import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { boundaryMessages, demoMessage, recommendations, sandbox } from "@/data/loadless";

export type BoundaryTone = keyof typeof boundaryMessages;
export type SandboxChoice = "accept" | "reduce" | "decline";
export type EffortLevel = "Low" | "Medium" | "High";
export type DeadlineOption = "Wednesday" | "Friday" | "Next week";

export type IncomingBreakdown = {
  time: number;
  focus: number;
  urgency: number;
  contextSwitch: number;
};

type DemoState = {
  message: string;
  extracted: boolean;
  durationHours: number;
  effortLevel: EffortLevel;
  deadlineOption: DeadlineOption;
  sandboxChoice: SandboxChoice;
  selectedActions: string[];
  tone: BoundaryTone;
  boundaryMessage: string;
  messageSent: boolean;
  completed: boolean;
};

type DemoContextValue = DemoState & {
  currentCapacity: number;
  incomingLoad: number;
  incomingBreakdown: IncomingBreakdown;
  forecastCapacity: number;
  projectedCapacity: number;
  savedCapacity: number;
  setMessage: (message: string) => void;
  setExtracted: (extracted: boolean) => void;
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
  completeDemo: () => void;
  resetDemo: () => void;
};

const STORAGE_KEY = "loadless-demo-v1";

const initialState: DemoState = {
  message: demoMessage,
  extracted: false,
  durationHours: 3,
  effortLevel: "High",
  deadlineOption: "Wednesday",
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
  const forecastCapacity = sandbox.current + incomingLoad;
  const projectedCapacity = forecastCapacity - savedCapacity;
  const currentCapacity = state.completed ? projectedCapacity : sandbox.current;

  const value = useMemo<DemoContextValue>(
    () => ({
      ...state,
      currentCapacity,
      incomingLoad,
      incomingBreakdown,
      forecastCapacity,
      projectedCapacity,
      savedCapacity,
      setMessage: (message) => setState((current) => ({ ...current, message })),
      setExtracted: (extracted) => setState((current) => ({ ...current, extracted })),
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
      completeDemo: () =>
        setState((current) => ({ ...current, messageSent: true, completed: true })),
      resetDemo: () => {
        window.localStorage.removeItem(STORAGE_KEY);
        setState(initialState);
      },
    }),
    [
      currentCapacity,
      forecastCapacity,
      incomingBreakdown,
      incomingLoad,
      projectedCapacity,
      savedCapacity,
      state,
    ],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useLoadLessDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useLoadLessDemo must be used inside LoadLessDemoProvider");
  return context;
}
