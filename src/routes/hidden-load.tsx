import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  CalendarClock,
  Info,
  LoaderCircle,
  MessageSquareText,
  Pencil,
  ScanSearch,
  Tag,
  Timer,
  Trash2,
  Waves,
  Wand2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/loadless/page-header";
import { StatusPill } from "@/components/loadless/status-pill";
import { demoMessage, extractedCommitment } from "@/data/loadless";
import { useLoadLessDemo } from "@/hooks/use-loadless-demo";

export const Route = createFileRoute("/hidden-load")({
  head: () => ({
    meta: [
      { title: "Hidden Load Inbox — LoadLess" },
      {
        name: "description",
        content:
          "Paste a message from WhatsApp, email or your LMS and turn the hidden request inside it into a commitment you can check.",
      },
      { property: "og:title", content: "Hidden Load Inbox — LoadLess" },
      {
        property: "og:description",
        content: "Turn a casual message into a clear commitment before you agree to it.",
      },
    ],
  }),
  component: HiddenLoad,
});

function HiddenLoad() {
  const navigate = useNavigate();
  const { message, setMessage, extracted, setExtracted, setSandboxChoice } = useLoadLessDemo();
  const [extracting, setExtracting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState({
    task: extractedCommitment.task,
    category: extractedCommitment.category,
    deadline: extractedCommitment.deadline,
    duration: extractedCommitment.duration,
    mentalEffort: extractedCommitment.mentalEffort,
    flexibility: extractedCommitment.flexibility,
  });

  const rows = [
    { icon: MessageSquareText, label: "Task", value: fields.task, key: "task" as const },
    { icon: Tag, label: "Category", value: fields.category, key: "category" as const },
    { icon: CalendarClock, label: "Deadline", value: fields.deadline, key: "deadline" as const },
    { icon: Timer, label: "Estimated duration", value: fields.duration, key: "duration" as const },
    {
      icon: Brain,
      label: "Mental effort",
      value: fields.mentalEffort,
      key: "mentalEffort" as const,
    },
    { icon: Waves, label: "Flexibility", value: fields.flexibility, key: "flexibility" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Hidden load"
        title="Hidden Load Inbox"
        description="Requests rarely arrive as calendar invites. Paste the message and LoadLess will pull out the commitment hiding inside it."
      />

      <Card className="rounded-2xl border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Paste a message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="message" className="text-xs text-muted-foreground">
            From WhatsApp, email, or your LMS
          </Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="min-h-36 resize-none rounded-xl text-sm leading-relaxed"
            placeholder="Paste the message here…"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              className="rounded-xl"
              disabled={extracting || message.trim().length === 0}
              onClick={() => {
                setExtracting(true);
                setExtracted(false);
                window.setTimeout(() => {
                  setExtracted(true);
                  setExtracting(false);
                  toast.success("Commitment extracted from the message");
                }, 650);
              }}
            >
              {extracting ? (
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Wand2 className="h-4 w-4" aria-hidden="true" />
              )}
              {extracting ? "Reading message…" : "Extract commitment"}
            </Button>
            <Button
              variant="ghost"
              className="rounded-xl"
              onClick={() => {
                setMessage(demoMessage);
                setExtracted(false);
                setEditing(false);
              }}
            >
              Reset to demo message
            </Button>
          </div>
        </CardContent>
      </Card>

      {extracted ? (
        <>
          <Card className="overflow-hidden rounded-2xl border-primary/20 shadow-lift">
            <CardHeader className="border-b border-border bg-primary text-primary-foreground">
              <CardTitle className="flex items-center gap-2 text-base">
                <ScanSearch className="h-4 w-4" aria-hidden="true" /> Evidence map
              </CardTitle>
              <p className="text-xs text-primary-foreground/70">
                The prototype shows which words produced each field, so Aina can verify the result.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <blockquote className="rounded-2xl border border-border bg-secondary/60 p-4 text-sm leading-7">
                Hi Aina, can you{" "}
                <mark className="rounded bg-positive-soft px-1 font-semibold text-foreground">
                  prepare the sponsorship deck
                </mark>{" "}
                for our society event{" "}
                <mark className="rounded bg-warning-soft px-1 font-semibold text-foreground">
                  by Wednesday
                </mark>
                ? It should take around{" "}
                <mark className="rounded bg-overload-soft px-1 font-semibold text-foreground">
                  three hours
                </mark>
                .
              </blockquote>
              <div className="grid gap-3 sm:grid-cols-3">
                <EvidenceField
                  source="prepare the sponsorship deck"
                  field="Task"
                  value="Prepare sponsorship deck"
                  tone="positive"
                />
                <EvidenceField
                  source="by Wednesday"
                  field="Deadline"
                  value="Wednesday"
                  tone="warning"
                />
                <EvidenceField
                  source="three hours"
                  field="Duration"
                  value="3 hours"
                  tone="overload"
                />
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Demo extraction only. The user remains in control: every field can be edited before
                the commitment enters the sandbox.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border shadow-soft">
            <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <CardTitle className="text-base">Extracted commitment</CardTitle>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  From {extractedCommitment.from} · {extractedCommitment.source}
                </p>
              </div>
              <StatusPill level="caution" label="Needs your confirmation" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {rows.map((row) => (
                  <div
                    key={row.label}
                    className="rounded-xl border border-border bg-background p-3"
                  >
                    <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <row.icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {row.label}
                    </p>
                    {editing ? (
                      <Input
                        value={row.value}
                        onChange={(e) => setFields((f) => ({ ...f, [row.key]: e.target.value }))}
                        className="mt-1.5 h-9 rounded-lg text-sm"
                        aria-label={row.label}
                      />
                    ) : (
                      <p className="mt-1 text-sm font-semibold">{row.value}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-warning/40 bg-warning-soft p-3.5">
                <Info
                  className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground"
                  aria-hidden="true"
                />
                <p className="text-xs leading-relaxed text-warning-foreground">
                  These details were read from the message text and may be wrong. Nothing is added
                  to your week until you confirm them.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  className="rounded-xl"
                  onClick={() => {
                    setSandboxChoice("accept");
                    navigate({ to: "/sandbox" });
                  }}
                >
                  Check impact
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    setEditing((v) => !v);
                    if (editing) toast.success("Commitment details updated");
                  }}
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  {editing ? "Save edits" : "Edit"}
                </Button>
                <Button
                  variant="ghost"
                  className="rounded-xl text-muted-foreground"
                  onClick={() => {
                    setExtracted(false);
                    setEditing(false);
                    toast("Commitment discarded");
                  }}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : extracting ? (
        <Card className="rounded-2xl border-border shadow-soft" aria-live="polite">
          <CardContent className="flex items-center justify-center gap-3 p-8 text-center">
            <LoaderCircle className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
            <div className="text-left">
              <p className="text-sm font-semibold">Finding the hidden commitment</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Checking the task, deadline, effort and flexibility.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl border-dashed border-border shadow-none">
          <CardContent className="p-8 text-center">
            <p className="text-sm font-semibold">No commitment extracted yet</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              Paste a message above and choose Extract commitment to see what it would actually cost
              your week.
            </p>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">
        Already know the numbers?{" "}
        <Link to="/sandbox" className="font-semibold text-foreground underline underline-offset-4">
          Go straight to the sandbox
        </Link>
        .
      </p>
    </div>
  );
}

function EvidenceField({
  source,
  field,
  value,
  tone,
}: {
  source: string;
  field: string;
  value: string;
  tone: "positive" | "warning" | "overload";
}) {
  const toneClass = {
    positive: "bg-positive",
    warning: "bg-warning",
    overload: "bg-overload",
  }[tone];

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-background p-3">
      <span className={`absolute inset-y-0 left-0 w-1 ${toneClass}`} aria-hidden="true" />
      <p className="pl-1 text-[11px] text-muted-foreground">“{source}”</p>
      <p className="mt-2 pl-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        becomes {field}
      </p>
      <p className="mt-0.5 pl-1 text-sm font-bold">{value}</p>
    </div>
  );
}
