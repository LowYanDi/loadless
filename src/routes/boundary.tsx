import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Copy, History, Pencil, Send, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/loadless/page-header";
import { useLoadLessDemo, type BoundaryTone } from "@/hooks/use-loadless-demo";

export const Route = createFileRoute("/boundary")({
  head: () => ({
    meta: [
      { title: "Boundary Assistant — Easey" },
      {
        name: "description",
        content:
          "A ready-to-send message that offers real help, states a clear limit, and protects the capacity you just recovered.",
      },
      { property: "og:title", content: "Boundary Assistant — LoadLess" },
      {
        property: "og:description",
        content: "Say yes to part of it, and no to the part that would break your week.",
      },
    ],
  }),
  component: Boundary,
});

const tones = ["Friendly", "Professional", "Direct"] as const;

function Boundary() {
  const navigate = useNavigate();
  const {
    tone,
    setTone,
    boundaryMessage: message,
    setBoundaryMessage: setMessage,
    setMessageSent,
  } = useLoadLessDemo();
  const [editing, setEditing] = useState(false);

  const pickTone = (t: (typeof tones)[number]) => {
    setTone(t as BoundaryTone);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      toast.success("Message copied");
    } catch {
      toast.error("Could not copy — select the text and copy manually");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Boundary assistant"
        title="Your reply to Mei"
        description="Offer what you can genuinely deliver, and be specific about what you cannot. Specific beats apologetic."
      />

      <Card className="rounded-2xl border-border shadow-soft">
        <CardHeader className="gap-3">
          <CardTitle className="text-base">Tone</CardTitle>
          <div className="flex flex-wrap gap-2">
            {tones.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => pickTone(t)}
                aria-pressed={tone === t}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  tone === t
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-secondary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {editing ? (
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={7}
              className="min-h-44 resize-none rounded-xl text-sm leading-relaxed"
              aria-label="Boundary message"
            />
          ) : (
            <p className="whitespace-pre-wrap rounded-xl border border-border bg-background p-4 text-sm leading-relaxed">
              {message}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button className="rounded-xl" onClick={copy}>
              <Copy className="h-4 w-4" aria-hidden="true" />
              Copy message
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                setEditing((v) => !v);
                if (editing) toast.success("Message updated");
              }}
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
              {editing ? "Done editing" : "Edit"}
            </Button>
            <Button
              variant="secondary"
              className="rounded-xl"
              onClick={() => {
                toast.success("Marked as sent");
                setMessageSent(true);
                navigate({ to: "/after" });
              }}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Mark as sent
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-warning/40 bg-warning-soft shadow-soft">
        <CardContent className="grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-card">
              <History className="h-5 w-5 text-warning-foreground" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-warning-foreground">
                You accepted the last 4 Society requests above 85% capacity
              </p>
              <p className="mt-1 text-sm text-warning-foreground/75">
                Relationship-aware mode can use this private pattern to offer a smaller yes.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="rounded-xl bg-card"
            onClick={() => navigate({ to: "/insights" })}
          >
            Review pattern
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-positive/40 bg-positive-soft/40 shadow-soft">
        <CardContent className="flex items-start gap-3 p-5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-card">
            <ShieldCheck className="h-5 w-5 text-positive" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Why this protects your capacity</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li>It commits to a specific, smaller deliverable instead of an open-ended yes.</li>
              <li>It names the part someone else must own, so the work does not drift back.</li>
              <li>It sets the limit now, while there is still time for the society to re-plan.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Button variant="ghost" className="rounded-xl" onClick={() => navigate({ to: "/after" })}>
        Skip to the outcome
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
