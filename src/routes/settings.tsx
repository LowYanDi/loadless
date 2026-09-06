import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, Contrast, LockKeyhole, RotateCcw, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/loadless/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { user } from "@/data/loadless";
import { useLoadLessDemo } from "@/hooks/use-loadless-demo";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — LoadLess" },
      {
        name: "description",
        content: "Adjust capacity assumptions, reminders, appearance and local demo data.",
      },
    ],
  }),
  component: Settings,
});

function Settings() {
  const navigate = useNavigate();
  const { resetDemo } = useLoadLessDemo();
  const [weeklyHours, setWeeklyHours] = useState(45);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [boundaryFollowUps, setBoundaryFollowUps] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const reset = () => {
    resetDemo();
    toast.success("Demo reset to Aina's original 82% week");
    navigate({ to: "/" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Your assumptions"
        title="Settings"
        description="Keep the capacity estimate personal, transparent and under your control."
      />

      <Card className="rounded-2xl border-border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserRound className="h-4 w-4" aria-hidden="true" /> Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs font-medium text-muted-foreground">Name</p>
            <p className="mt-1 text-sm font-semibold">{user.name}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs font-medium text-muted-foreground">Current role</p>
            <p className="mt-1 text-sm font-semibold">{user.role}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Weekly capacity target</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <Label htmlFor="weekly-hours">Realistic committed hours</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                Classes, paid work, focused study, societies and life administration.
              </p>
            </div>
            <p className="text-2xl font-bold tabular-nums">{weeklyHours}h</p>
          </div>
          <input
            id="weekly-hours"
            type="range"
            min="30"
            max="60"
            step="1"
            value={weeklyHours}
            onChange={(event) => setWeeklyHours(Number(event.target.value))}
            className="w-full accent-primary"
          />
          <p className="text-xs text-muted-foreground">
            This demo keeps the displayed score fixed so the 82% → 113% → 84% judging flow remains
            reproducible.
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4" aria-hidden="true" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingToggle
            id="deadline-alerts"
            label="Capacity alerts"
            description="Warn me when a new commitment would push a day above 95%."
            checked={deadlineAlerts}
            onCheckedChange={setDeadlineAlerts}
          />
          <SettingToggle
            id="boundary-follow-ups"
            label="Boundary follow-ups"
            description="Ask whether a rescope, delegation or decline was respected."
            checked={boundaryFollowUps}
            onCheckedChange={setBoundaryFollowUps}
          />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Contrast className="h-4 w-4" aria-hidden="true" /> Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SettingToggle
            id="dark-mode"
            label="Dark mode"
            description="Use the high-contrast dark colour system."
            checked={darkMode}
            onCheckedChange={setDarkMode}
          />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <LockKeyhole className="h-4 w-4" aria-hidden="true" /> Privacy and demo data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            This prototype stores only your demo progress in this browser. It does not connect to
            WhatsApp, a university system, a database or a medical service.
          </p>
          <Button variant="outline" className="rounded-xl" onClick={reset}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset demo to 82%
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingToggle({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background p-4">
      <div>
        <Label htmlFor={id}>{label}</Label>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
