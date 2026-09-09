import { Link, useRouterState } from "@tanstack/react-router";
import {
  Gauge,
  HeartPulse,
  Inbox,
  FlaskConical,
  ListChecks,
  ListTodo,
  Leaf,
  LineChart,
  Settings as SettingsIcon,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { user } from "@/data/loadless";
import { useLoadLessDemo } from "@/hooks/use-loadless-demo";
import { DecisionJourney } from "@/components/loadless/decision-journey";

const primaryNav = [
  { to: "/", label: "Dashboard", short: "Home", icon: Gauge },
  { to: "/tasks", label: "Commitments", short: "Tasks", icon: ListTodo },
  { to: "/check-in", label: "60-sec Check-in", short: "Check-in", icon: HeartPulse },
  { to: "/hidden-load", label: "Hidden Load", short: "Inbox", icon: Inbox },
  { to: "/sandbox", label: "Sandbox", short: "Sandbox", icon: FlaskConical },
  { to: "/action-plan", label: "Action Plan", short: "Plan", icon: ListChecks },
] as const;

const secondaryNav = [
  { to: "/reset", label: "Reset Mode", short: "Reset", icon: Leaf },
  { to: "/lab", label: "Innovation Lab", short: "Lab", icon: WandSparkles },
  { to: "/insights", label: "Insights", short: "Insights", icon: LineChart },
  { to: "/settings", label: "Settings", short: "Settings", icon: SettingsIcon },
] as const;

const desktopNav = [...primaryNav, ...secondaryNav] as const;

const planPaths = ["/action-plan", "/boundary", "/after"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { currentCapacity } = useLoadLessDemo();

  const isActive = (to: string) =>
    to === "/action-plan" ? planPaths.includes(pathname) : pathname === to;

  return (
    <div className="min-h-screen w-full bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-sidebar px-4 py-6 lg:flex">
        <Link to="/" className="flex items-center gap-2.5 px-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-bold tracking-tight">LoadLess</span>
            <span className="block truncate text-[11px] text-muted-foreground">
              Know your capacity
            </span>
          </span>
        </Link>

        <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Main">
          {desktopNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(item.to)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
              )}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-positive-soft text-sm font-bold text-positive">
            A
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{user.name}</span>
            <span className="block truncate text-[11px] text-muted-foreground">{user.role}</span>
          </span>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
          <span className="flex items-center gap-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-base font-bold tracking-tight">LoadLess</span>
          </span>
          <span className="flex items-center gap-2">
            <Link
              to="/reset"
              aria-label="Open Reset Mode"
              className="grid h-8 w-8 place-items-center rounded-lg border border-positive/30 bg-positive-soft text-positive"
            >
              <Leaf className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/lab"
              aria-label="Open Innovation Lab"
              className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-card text-foreground"
            >
              <WandSparkles className="h-4 w-4" aria-hidden="true" />
            </Link>
            <span className="rounded-full bg-warning-soft px-3 py-1 text-xs font-semibold text-warning-foreground">
              {currentCapacity}% used
            </span>
          </span>
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 sm:px-6 lg:pb-14 lg:pt-10">
          <DecisionJourney pathname={pathname} />
          {children}
          <p className="mt-10 border-t border-border pt-5 text-center text-xs leading-relaxed text-muted-foreground">
            LoadLess estimates workload capacity and is not a medical diagnostic tool.
          </p>
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-border bg-card/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
        aria-label="Main"
      >
        {primaryNav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
              isActive(item.to) ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="truncate">{item.short}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
