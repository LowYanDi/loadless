import { createFileRoute } from "@tanstack/react-router";
import {
  BellRing,
  Check,
  ClipboardCheck,
  CirclePlus,
  Clock3,
  FileCheck2,
  Eye,
  EyeOff,
  HandHelping,
  ListChecks,
  LockKeyhole,
  MessageSquareText,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Upload,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/loadless/page-header";
import { StatusPill } from "@/components/loadless/status-pill";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { labelFor, levelFor } from "@/data/loadless";
import { useLoadLessDemo } from "@/hooks/use-loadless-demo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/circle")({
  head: () => ({
    meta: [
      { title: "Capacity Circle — Easey" },
      {
        name: "description",
        content:
          "Create a privacy-aware capacity group, see who has room, and ask for help without transferring overload.",
      },
    ],
  }),
  component: CapacityCircle,
});

type CapacityVisibility = "exact" | "status" | "private";

type CircleMember = {
  id: string;
  name: string;
  initials: string;
  role: string;
  capacity: number;
  visibility: CapacityVisibility;
  availableHours: number | null;
  strengths: string[] | null;
  recoveryStatus: string | null;
  acceptsHelpRequests: boolean;
};

type HelpTask = {
  id: string;
  title: string;
  load: number;
  hours: number;
  bestMatches: string[];
};

type WorkStatus = "To do" | "In progress" | "Submitted" | "Needs changes" | "Approved";

type AssignmentPart = {
  id: string;
  title: string;
  assigneeId: string;
  deadline: string;
  hours: number;
  capacityPoints: number;
  progress: number;
  status: WorkStatus;
  submission: string | null;
  leaderComment: string | null;
  updated: string;
};

const initialAssignmentParts: AssignmentPart[] = [
  {
    id: "part-research",
    title: "Sponsor and user research",
    assigneeId: "faiz",
    deadline: "11 Sep",
    hours: 2,
    capacityPoints: 13,
    progress: 100,
    status: "Submitted",
    submission: "Research findings · v1",
    leaderComment: null,
    updated: "Today, 10:20",
  },
  {
    id: "part-slides",
    title: "Presentation visual design",
    assigneeId: "jia",
    deadline: "12 Sep",
    hours: 3,
    capacityPoints: 16,
    progress: 72,
    status: "In progress",
    submission: null,
    leaderComment: "Keep the capacity journey on one slide and enlarge the forecast number.",
    updated: "Today, 09:05",
  },
  {
    id: "part-references",
    title: "Report references and appendix",
    assigneeId: "daniel",
    deadline: "12 Sep",
    hours: 1,
    capacityPoints: 6,
    progress: 100,
    status: "Approved",
    submission: "Reference list · checked",
    leaderComment: "Approved. Citation format is consistent.",
    updated: "Yesterday, 18:40",
  },
  {
    id: "part-conclusion",
    title: "Final conclusion and demo handoff",
    assigneeId: "aina",
    deadline: "13 Sep",
    hours: 1.5,
    capacityPoints: 8,
    progress: 35,
    status: "In progress",
    submission: null,
    leaderComment: null,
    updated: "Yesterday, 16:15",
  },
];

const helpTasks: HelpTask[] = [
  {
    id: "research",
    title: "Sponsor research",
    load: 13,
    hours: 2,
    bestMatches: ["faiz", "daniel"],
  },
  {
    id: "slides",
    title: "Deck visual clean-up",
    load: 8,
    hours: 1.5,
    bestMatches: ["jia", "faiz"],
  },
  {
    id: "references",
    title: "Reference checking",
    load: 6,
    hours: 1,
    bestMatches: ["daniel", "jia"],
  },
];

const demoMembers: CircleMember[] = [
  {
    id: "aina",
    name: "Aina",
    initials: "A",
    role: "You · Project lead",
    capacity: 82,
    visibility: "exact",
    availableHours: 0.5,
    strengths: ["Planning", "Presentation"],
    recoveryStatus: "Recovery block protected",
    acceptsHelpRequests: false,
  },
  {
    id: "faiz",
    name: "Faiz",
    initials: "F",
    role: "Research",
    capacity: 58,
    visibility: "exact",
    availableHours: 4,
    strengths: ["Sponsor research", "Outreach"],
    recoveryStatus: "Comfortable today",
    acceptsHelpRequests: true,
  },
  {
    id: "mei",
    name: "Mei",
    initials: "M",
    role: "Society coordinator",
    capacity: 87,
    visibility: "status",
    availableHours: null,
    strengths: ["Coordination"],
    recoveryStatus: null,
    acceptsHelpRequests: true,
  },
  {
    id: "jia",
    name: "Jia",
    initials: "J",
    role: "Design",
    capacity: 46,
    visibility: "exact",
    availableHours: 5,
    strengths: ["Slides", "Visual design"],
    recoveryStatus: "Available after 3 PM",
    acceptsHelpRequests: true,
  },
  {
    id: "daniel",
    name: "Daniel",
    initials: "D",
    role: "Documentation",
    capacity: 76,
    visibility: "exact",
    availableHours: 2.5,
    strengths: ["References", "Proofreading"],
    recoveryStatus: null,
    acceptsHelpRequests: true,
  },
  {
    id: "nadia",
    name: "Nadia",
    initials: "N",
    role: "Logistics",
    capacity: 64,
    visibility: "private",
    availableHours: null,
    strengths: null,
    recoveryStatus: null,
    acceptsHelpRequests: false,
  },
];

function CapacityCircle() {
  const { currentCapacity, forecastCapacity } = useLoadLessDemo();
  const [circleName, setCircleName] = useState("Society Event Crew");
  const [circleLimit, setCircleLimit] = useState(12);
  const [draftName, setDraftName] = useState(circleName);
  const [draftLimit, setDraftLimit] = useState(circleLimit);
  const [circleDialogOpen, setCircleDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [taskId, setTaskId] = useState("research");
  const [selectedMemberId, setSelectedMemberId] = useState("faiz");
  const [lastRequest, setLastRequest] = useState<{
    member: string;
    task: string;
    status: "Awaiting response";
  } | null>(null);
  const [sharing, setSharing] = useState({
    exactCapacity: true,
    availableHours: true,
    loadCategories: true,
    recoveryStatus: false,
  });
  const [assignmentParts, setAssignmentParts] = useState(initialAssignmentParts);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewPartId, setReviewPartId] = useState(initialAssignmentParts[0]!.id);
  const [reviewDecision, setReviewDecision] = useState<"Approved" | "Needs changes">("Approved");
  const [reviewDraft, setReviewDraft] = useState("");

  const members = useMemo(
    () =>
      demoMembers.map((member) =>
        member.id === "aina" ? { ...member, capacity: currentCapacity } : member,
      ),
    [currentCapacity],
  );
  const selectedTask = helpTasks.find((task) => task.id === taskId) ?? helpTasks[0]!;

  const candidates = useMemo(
    () =>
      members
        .filter(
          (member) =>
            member.id !== "aina" &&
            member.acceptsHelpRequests &&
            member.visibility !== "private" &&
            member.capacity + selectedTask.load < 95,
        )
        .map((member) => ({
          ...member,
          after: member.capacity + selectedTask.load,
          matchScore:
            (selectedTask.bestMatches.includes(member.id) ? 40 : 10) +
            Math.max(0, 95 - member.capacity),
        }))
        .sort((a, b) => b.matchScore - a.matchScore),
    [members, selectedTask],
  );

  const selectedCandidate =
    candidates.find((member) => member.id === selectedMemberId) ?? candidates[0];
  const protectedMembers = members.filter(
    (member) =>
      member.id !== "aina" &&
      member.acceptsHelpRequests &&
      (member.visibility === "private" || member.capacity + selectedTask.load >= 95),
  );
  const visibleCapacities = members.filter((member) => member.visibility !== "private");
  const averageCapacity = Math.round(
    visibleCapacities.reduce((total, member) => total + member.capacity, 0) /
      visibleCapacities.length,
  );
  const availableMembers = members.filter(
    (member) => member.id !== "aina" && member.acceptsHelpRequests && member.capacity < 80,
  ).length;
  const teamProgress = Math.round(
    assignmentParts.reduce((total, part) => total + part.progress, 0) / assignmentParts.length,
  );
  const approvedParts = assignmentParts.filter((part) => part.status === "Approved").length;
  const selectedReviewPart =
    assignmentParts.find((part) => part.id === reviewPartId) ?? assignmentParts[0]!;

  const openHelpDialog = () => {
    setTaskId("research");
    setSelectedMemberId("faiz");
    setHelpDialogOpen(true);
  };

  const openHelpForPart = (part: AssignmentPart) => {
    const matchingTask = part.id.includes("reference")
      ? "references"
      : part.id.includes("slide")
        ? "slides"
        : "research";
    setTaskId(matchingTask);
    setSelectedMemberId("");
    setHelpDialogOpen(true);
  };

  const openReview = (part: AssignmentPart) => {
    setReviewPartId(part.id);
    setReviewDecision(part.status === "Needs changes" ? "Needs changes" : "Approved");
    setReviewDraft(part.leaderComment ?? "");
    setReviewDialogOpen(true);
  };

  const submitPart = (part: AssignmentPart) => {
    setAssignmentParts((current) =>
      current.map((item) =>
        item.id === part.id
          ? {
              ...item,
              progress: 100,
              status: "Submitted",
              submission: item.submission ?? `${item.title} · latest draft`,
              updated: "Just now",
            }
          : item,
      ),
    );
    toast.success(`${part.title} submitted for review`);
  };

  const saveReview = () => {
    setAssignmentParts((current) =>
      current.map((part) =>
        part.id === selectedReviewPart.id
          ? {
              ...part,
              status: reviewDecision,
              progress: reviewDecision === "Approved" ? 100 : part.progress,
              leaderComment: reviewDraft.trim() || null,
              updated: "Just now",
            }
          : part,
      ),
    );
    setReviewDialogOpen(false);
    toast.success(
      reviewDecision === "Approved" ? "Part approved" : "Revision request sent to the member",
    );
  };

  const copyContributionSummary = async () => {
    const summary = assignmentParts
      .map((part) => {
        const member = members.find((item) => item.id === part.assigneeId);
        return `${member?.name ?? "Member"}: ${part.title} — ${part.status} (${part.progress}%)`;
      })
      .join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      toast.success("Contribution summary copied for the report");
    } catch {
      toast.error("Could not copy the summary");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Mutual support"
        title="Capacity Circle"
        description="Share enough context to coordinate help—without exposing private task details."
        action={
          <Dialog open={circleDialogOpen} onOpenChange={setCircleDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl">
                <CirclePlus className="h-4 w-4" /> New circle
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create a Capacity Circle</DialogTitle>
                <DialogDescription>
                  Create a private group for 2–20 people. Members choose what they share.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="circle-name">Circle name</Label>
                  <Input
                    id="circle-name"
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                    placeholder="e.g. Final Year Project Team"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="circle-limit">Member limit</Label>
                  <Input
                    id="circle-limit"
                    type="number"
                    min={members.length}
                    max={20}
                    value={draftLimit}
                    onChange={(event) => setDraftLimit(Number(event.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Circles support 2–20 people. This demo already has {members.length} members.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/50 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck className="h-4 w-4 text-positive" /> Privacy by invitation
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    New members must accept the invitation and select their own visibility before
                    appearing in matching results.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCircleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  disabled={!draftName.trim() || draftLimit < members.length || draftLimit > 20}
                  onClick={() => {
                    setCircleName(draftName.trim());
                    setCircleLimit(draftLimit);
                    setCircleDialogOpen(false);
                    toast.success(`${draftName.trim()} is ready to invite members`);
                  }}
                >
                  <UsersRound className="h-4 w-4" /> Create circle
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="overflow-hidden rounded-3xl border-primary/20 shadow-lift">
        <CardContent className="grid gap-5 bg-primary p-5 text-primary-foreground sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold">
                {members.length} of {circleLimit} members
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold">
                <LockKeyhole className="h-3.5 w-3.5" /> Invite only
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight">{circleName}</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-primary-foreground/70">
              Capacity is shared for coordination, not comparison. Personal task titles stay private
              unless a member chooses to include them in a help request.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-primary-foreground/10 p-4">
              <p className="text-xs text-primary-foreground/65">Circle capacity</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{averageCapacity}%</p>
              <p className="mt-1 text-[11px] text-primary-foreground/65">Shared members only</p>
            </div>
            <div className="rounded-2xl bg-primary-foreground/10 p-4">
              <p className="text-xs text-primary-foreground/65">Can receive help requests</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{availableMembers}</p>
              <p className="mt-1 text-[11px] text-primary-foreground/65">With capacity below 80%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-2xl border-overload/30 shadow-soft">
        <CardContent className="grid gap-5 bg-overload-soft/45 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-overload text-white">
              <HandHelping className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold">This request would exceed your capacity</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                You are at {currentCapacity}% now. The sponsorship deck would take your week to{" "}
                <strong className="text-overload">{forecastCapacity}%</strong>. Ask for help before
                the work is assigned.
              </p>
            </div>
          </div>
          <Button className="rounded-xl" onClick={openHelpDialog}>
            <BellRing className="h-4 w-4" /> Find someone with room
          </Button>
        </CardContent>
      </Card>

      {lastRequest ? (
        <Card className="rounded-2xl border-positive/40 bg-positive-soft/45 shadow-soft">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-positive text-white">
                <Send className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">Help request sent to {lastRequest.member}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {lastRequest.task} · Nothing moves until they accept.
                </p>
              </div>
            </div>
            <span className="rounded-full border border-warning/40 bg-warning-soft px-3 py-1 text-xs font-semibold text-warning-foreground">
              {lastRequest.status}
            </span>
          </CardContent>
        </Card>
      ) : null}

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight">Assignment Workboard</h2>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                Interactive demo · local data
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              See who owns each part, what has been submitted, and what feedback is still needed.
            </p>
          </div>
          <div className="min-w-44 rounded-xl border border-border bg-card px-4 py-3 shadow-soft">
            <div className="flex items-center justify-between gap-4 text-xs">
              <span className="text-muted-foreground">Team progress</span>
              <strong className="tabular-nums">{teamProgress}%</strong>
            </div>
            <Progress value={teamProgress} className="mt-2 h-2" />
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.55fr)]">
          <Card className="rounded-2xl border-border shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ListChecks className="h-4 w-4" /> Assigned parts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assignmentParts.map((part) => {
                const assignee = members.find((member) => member.id === part.assigneeId);
                const isMine = part.assigneeId === "aina";

                return (
                  <div key={part.id} className="rounded-2xl border border-border bg-background p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{part.title}</p>
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-[10px] font-bold",
                              workStatusClass(part.status),
                            )}
                          >
                            {part.status}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span>
                            {assignee?.name ?? "Unassigned"}
                            {isMine ? " · You" : ""}
                          </span>
                          <span>Due {part.deadline}</span>
                          <span>{part.hours} h</span>
                          <span>+{part.capacityPoints} capacity pts</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                        {part.progress}%
                      </span>
                    </div>
                    <Progress value={part.progress} className="mt-3 h-1.5" />

                    {part.submission || part.leaderComment ? (
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {part.submission ? (
                          <div className="flex items-start gap-2 rounded-xl bg-secondary/60 p-3">
                            <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-positive" />
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Submission
                              </p>
                              <p className="mt-1 text-xs font-medium">{part.submission}</p>
                            </div>
                          </div>
                        ) : null}
                        {part.leaderComment ? (
                          <div className="flex items-start gap-2 rounded-xl bg-secondary/60 p-3">
                            <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0" />
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Leader comment
                              </p>
                              <p className="mt-1 line-clamp-2 text-xs leading-relaxed">
                                {part.leaderComment}
                              </p>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] text-muted-foreground">
                        Updated {part.updated}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {isMine && !["Submitted", "Approved"].includes(part.status) ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 rounded-lg"
                            onClick={() => submitPart(part)}
                          >
                            <Upload className="h-3.5 w-3.5" /> Submit part
                          </Button>
                        ) : null}
                        <Button
                          size="sm"
                          variant={part.status === "Submitted" ? "default" : "outline"}
                          className="h-8 rounded-lg"
                          onClick={() => openReview(part)}
                        >
                          <MessageSquareText className="h-3.5 w-3.5" />
                          {part.status === "Submitted"
                            ? "Review submission"
                            : part.status === "Approved"
                              ? "View review"
                              : "Add comment"}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="h-fit rounded-2xl border-positive/30 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardCheck className="h-4 w-4 text-positive" /> Contribution record
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                A factual activity trail for team check-ins and the assignment report.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <ContributionStat value={assignmentParts.length} label="Assigned" />
                <ContributionStat value={approvedParts} label="Approved" />
                <ContributionStat value={1} label="Helped" />
              </div>
              <div className="space-y-3 border-l border-border pl-4">
                {[
                  "Faiz submitted sponsor and user research",
                  "Aina reviewed the reference list",
                  "Jia updated presentation visuals to 72%",
                ].map((event, index) => (
                  <div key={event} className="relative">
                    <span className="absolute -left-[1.19rem] top-1.5 h-2 w-2 rounded-full bg-positive" />
                    <p className="text-xs font-medium leading-relaxed">{event}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {index === 0 ? "Today, 10:20" : index === 1 ? "Yesterday" : "2 days ago"}
                    </p>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={copyContributionSummary}
              >
                <ClipboardCheck className="h-4 w-4" /> Copy report summary
              </Button>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Records show actions and deliverables, not a score or ranking of people. Members can
                view the same history.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Circle members</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Each card only shows the values that member chose to share.
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => toast.success("Invitation link copied")}
          >
            <UserPlus className="h-4 w-4" /> Invite member
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <Card className="rounded-2xl border-border shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="h-4 w-4" /> What I share with this circle
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Change visibility at any time. These choices affect your card and smart matching.
            </p>
          </CardHeader>
          <CardContent className="space-y-1">
            <SharingRow
              label="Exact capacity percentage"
              description={sharing.exactCapacity ? `${currentCapacity}% is visible` : "Status only"}
              checked={sharing.exactCapacity}
              onCheckedChange={(checked) =>
                setSharing((current) => ({ ...current, exactCapacity: checked }))
              }
            />
            <SharingRow
              label="Available hours"
              description="Share usable time, not calendar details"
              checked={sharing.availableHours}
              onCheckedChange={(checked) =>
                setSharing((current) => ({ ...current, availableHours: checked }))
              }
            />
            <SharingRow
              label="Load categories"
              description="For example, Academic or Society"
              checked={sharing.loadCategories}
              onCheckedChange={(checked) =>
                setSharing((current) => ({ ...current, loadCategories: checked }))
              }
            />
            <SharingRow
              label="Recovery availability"
              description="Never shares personal check-in answers"
              checked={sharing.recoveryStatus}
              onCheckedChange={(checked) =>
                setSharing((current) => ({ ...current, recoveryStatus: checked }))
              }
            />
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-secondary/60 p-3 text-xs leading-relaxed text-muted-foreground">
              <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Task names and personal
              check-in answers are private by default.
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4" /> How Smart Match protects the team
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Checks who opted in to receive requests",
              "Estimates their capacity after taking the task",
              "Prioritises relevant skills and open time",
              "Waits for confirmation before moving any work",
            ].map((step, index) => (
              <div key={step} className="flex items-start gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm text-muted-foreground">{step}</p>
              </div>
            ))}
            <div className="rounded-xl border border-positive/30 bg-positive-soft/50 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="h-4 w-4 text-positive" /> No automatic dumping
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Easey recommends and notifies. The teammate still decides whether to accept, reduce
                or decline the request.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Review assignment part</DialogTitle>
            <DialogDescription>
              Comment on the work itself and make the next action clear. This record is visible to
              the assigned member.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-2xl border border-border bg-secondary/50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{selectedReviewPart.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {members.find((member) => member.id === selectedReviewPart.assigneeId)?.name} ·
                    Due {selectedReviewPart.deadline}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-bold",
                    workStatusClass(selectedReviewPart.status),
                  )}
                >
                  {selectedReviewPart.status}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <FileCheck2 className="h-4 w-4" />
                {selectedReviewPart.submission ?? "No file or link submitted yet"}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review-decision">Review decision</Label>
              <Select
                value={reviewDecision}
                onValueChange={(value) => setReviewDecision(value as "Approved" | "Needs changes")}
              >
                <SelectTrigger id="review-decision" className="h-10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Approved">Approve this part</SelectItem>
                  <SelectItem value="Needs changes">Request changes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leader-comment">Leader comment</Label>
              <Textarea
                id="leader-comment"
                value={reviewDraft}
                onChange={(event) => setReviewDraft(event.target.value)}
                placeholder="Describe what is clear, what should change, and the expected next step."
                className="min-h-28 rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                Keep feedback specific to the deliverable. Avoid ranking or judging the person.
              </p>
            </div>

            {reviewDecision === "Needs changes" ? (
              <div className="rounded-xl border border-warning/40 bg-warning-soft/55 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-warning-foreground">
                  <RotateCcw className="h-4 w-4" /> Check revision capacity first
                </p>
                <p className="mt-1 text-xs leading-relaxed text-warning-foreground">
                  A revision may add about {selectedReviewPart.capacityPoints} capacity points. If
                  the member has no room, split the revision or request help instead of silently
                  extending their load.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 rounded-lg bg-card"
                  onClick={() => {
                    setReviewDialogOpen(false);
                    openHelpForPart(selectedReviewPart);
                  }}
                >
                  <HandHelping className="h-3.5 w-3.5" /> Find revision support
                </Button>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveReview}>
              <MessageSquareText className="h-4 w-4" /> Save review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Find someone with room</DialogTitle>
            <DialogDescription>
              Smart Match checks capacity, skills, visibility and opt-in status before notifying a
              teammate.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Task to share</Label>
                <Select
                  value={taskId}
                  onValueChange={(value) => {
                    setTaskId(value);
                    const task = helpTasks.find((item) => item.id === value) ?? helpTasks[0]!;
                    const best = demoMembers
                      .filter(
                        (member) =>
                          member.id !== "aina" &&
                          member.acceptsHelpRequests &&
                          member.visibility !== "private" &&
                          member.capacity + task.load < 95,
                      )
                      .sort((a, b) => {
                        const scoreA =
                          (task.bestMatches.includes(a.id) ? 40 : 10) + (95 - a.capacity);
                        const scoreB =
                          (task.bestMatches.includes(b.id) ? 40 : 10) + (95 - b.capacity);
                        return scoreB - scoreA;
                      })[0];
                    if (best) setSelectedMemberId(best.id);
                  }}
                >
                  <SelectTrigger className="h-10 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {helpTasks.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-xl border border-border bg-secondary/50 p-3">
                <p className="text-xs text-muted-foreground">Estimated transfer</p>
                <p className="mt-1 text-sm font-semibold">
                  {selectedTask.hours} hours · +{selectedTask.load} capacity points
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">Recommended teammates</p>
                <span className="text-xs text-muted-foreground">Choose one</span>
              </div>
              <div className="mt-3 space-y-3">
                {candidates.map((candidate, index) => {
                  const selected = candidate.id === selectedCandidate?.id;
                  return (
                    <button
                      key={candidate.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setSelectedMemberId(candidate.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card hover:bg-secondary/60",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold",
                          selected ? "bg-primary-foreground/15" : "bg-positive-soft text-positive",
                        )}
                      >
                        {candidate.initials}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">{candidate.name}</span>
                          {index === 0 ? (
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[11px] font-bold",
                                selected
                                  ? "bg-primary-foreground/15"
                                  : "bg-positive-soft text-positive",
                              )}
                            >
                              Best fit
                            </span>
                          ) : null}
                        </span>
                        <span
                          className={cn(
                            "mt-1 block text-xs",
                            selected ? "text-primary-foreground/70" : "text-muted-foreground",
                          )}
                        >
                          {candidate.strengths?.join(" · ") ?? candidate.role}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block text-sm font-bold tabular-nums">
                          {candidate.visibility === "exact"
                            ? `${candidate.capacity}% → ${candidate.after}%`
                            : "Stays below limit"}
                        </span>
                        <span className="mt-1 block text-[11px] opacity-70">after accepting</span>
                      </span>
                      {selected ? <Check className="h-4 w-4 shrink-0" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {protectedMembers.length > 0 ? (
              <div className="flex items-start gap-3 rounded-xl border border-warning/40 bg-warning-soft/60 p-4">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
                <p className="text-xs leading-relaxed text-warning-foreground">
                  {protectedMembers.length} member{protectedMembers.length > 1 ? "s were" : " was"}{" "}
                  protected from this notification because their capacity is near the limit or
                  private.
                </p>
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setHelpDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!selectedCandidate}
              onClick={() => {
                if (!selectedCandidate) return;
                setLastRequest({
                  member: selectedCandidate.name,
                  task: selectedTask.title,
                  status: "Awaiting response",
                });
                setHelpDialogOpen(false);
                toast.success(`Help request sent to ${selectedCandidate.name}`);
              }}
            >
              <BellRing className="h-4 w-4" /> Notify {selectedCandidate?.name ?? "teammate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MemberCard({ member }: { member: CircleMember }) {
  const isPrivate = member.visibility === "private";

  return (
    <Card className="rounded-2xl border-border shadow-soft">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold text-foreground">
              {member.initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{member.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{member.role}</span>
            </span>
          </div>
          {member.acceptsHelpRequests ? (
            <span className="rounded-full bg-positive-soft px-2 py-1 text-[10px] font-bold text-positive">
              Help on
            </span>
          ) : (
            <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-muted-foreground">
              Help off
            </span>
          )}
        </div>

        {isPrivate ? (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-dashed border-border bg-secondary/40 p-4">
            <EyeOff className="h-5 w-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold">Capacity is private</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Not included in Smart Match</p>
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Weekly capacity</p>
                <p className="mt-1 text-xl font-bold tabular-nums">
                  {member.visibility === "exact"
                    ? `${member.capacity}%`
                    : labelFor(member.capacity)}
                </p>
              </div>
              <StatusPill level={levelFor(member.capacity)} label={labelFor(member.capacity)} />
            </div>
            <Progress value={Math.min(member.capacity, 100)} className="mt-3 h-2" />
            <div className="mt-4 flex flex-wrap gap-2">
              {member.availableHours !== null ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium">
                  <Clock3 className="h-3 w-3" /> {member.availableHours} h available
                </span>
              ) : null}
              {member.strengths?.slice(0, 1).map((strength) => (
                <span
                  key={strength}
                  className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium"
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ContributionStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl bg-secondary/60 p-3 text-center">
      <p className="text-xl font-bold tabular-nums">{value}</p>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function workStatusClass(status: WorkStatus) {
  if (status === "Approved") return "bg-positive-soft text-positive";
  if (status === "Submitted") return "bg-primary text-primary-foreground";
  if (status === "Needs changes") return "bg-warning-soft text-warning-foreground";
  return "bg-secondary text-muted-foreground";
}

function SharingRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={label} />
    </div>
  );
}
