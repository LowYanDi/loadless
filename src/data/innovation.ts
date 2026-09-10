export type InnovationFeatureId =
  "domino" | "recovery" | "team" | "patterns" | "assistant" | "challenge";

export const innovationFeatures = [
  {
    id: "domino" as const,
    label: "Domino",
    title: "Domino Effect Forecast",
    description: "See which tasks, buffers and recovery blocks move after one new yes.",
  },
  {
    id: "recovery" as const,
    label: "Recovery",
    title: "Recovery Debt",
    description: "Carry skipped recovery forward instead of pretending every week starts at zero.",
  },
  {
    id: "team" as const,
    label: "Team Ripple",
    title: "Capacity Ripple",
    description: "Check both people's capacity before delegating work.",
  },
  {
    id: "patterns" as const,
    label: "Patterns",
    title: "Relationship-aware Boundaries",
    description:
      "Use request history to suggest a fairer response without judging the relationship.",
  },
  {
    id: "assistant" as const,
    label: "Ask AI",
    title: "Ask Easey",
    description: "Ask questions about the current scenario and receive grounded explanations.",
  },
  {
    id: "challenge" as const,
    label: "Challenge",
    title: "The Cost of Yes",
    description: "A short decision game that teaches capacity-aware choices.",
  },
] satisfies ReadonlyArray<{
  id: InnovationFeatureId;
  label: string;
  title: string;
  description: string;
}>;

export const dominoForecasts = {
  accept: [
    { day: "Wed", current: 94, projected: 128 },
    { day: "Thu", current: 71, projected: 99 },
    { day: "Fri", current: 80, projected: 92 },
    { day: "Sat", current: 58, projected: 70 },
  ],
  reduce: [
    { day: "Wed", current: 94, projected: 98 },
    { day: "Thu", current: 71, projected: 84 },
    { day: "Fri", current: 80, projected: 82 },
    { day: "Sat", current: 58, projected: 61 },
  ],
  decline: [
    { day: "Wed", current: 94, projected: 94 },
    { day: "Thu", current: 71, projected: 71 },
    { day: "Fri", current: 80, projected: 80 },
    { day: "Sat", current: 58, projected: 58 },
  ],
} as const;

export const dominoChains = {
  accept: [
    {
      title: "Wednesday reaches 128%",
      detail: "The sponsorship deck lands on an already crowded class day.",
      status: "Overload",
    },
    {
      title: "Assignment revision moves to Thursday",
      detail: "Three hours of deep work no longer fit before the deadline.",
      status: "+28 points",
    },
    {
      title: "Recovery block is removed",
      detail: "The 6:15 PM reset is the first flexible block to disappear.",
      status: "−45 min",
    },
    {
      title: "Friday begins with recovery debt",
      detail: "The week remains fragile even after the deck is submitted.",
      status: "+1.5 h debt",
    },
  ],
  reduce: [
    {
      title: "Wednesday reaches 98%",
      detail: "A smaller five-slide scope contains most of the immediate impact.",
      status: "At limit",
    },
    {
      title: "Sponsor research moves to Faiz",
      detail: "A separate capacity check confirms the hand-off is realistic.",
      status: "−10 points",
    },
    {
      title: "Recovery block stays protected",
      detail: "The 6:15 PM reset remains visible and cannot be silently reused.",
      status: "Protected",
    },
    {
      title: "Friday keeps a small buffer",
      detail: "Flexible errands can still move if another surprise appears.",
      status: "18% buffer",
    },
  ],
  decline: [
    {
      title: "Wednesday stays at 94%",
      detail: "No new deep-work block is added to the busiest day.",
      status: "Unchanged",
    },
    {
      title: "Assignment revision stays in place",
      detail: "Existing academic work does not spill into Thursday.",
      status: "Protected",
    },
    {
      title: "Recovery block remains available",
      detail: "There is still room to recover after the society meeting.",
      status: "+45 min",
    },
    {
      title: "Friday keeps its original buffer",
      detail: "The next two days remain resilient to unexpected work.",
      status: "20% buffer",
    },
  ],
} as const;

export const recoveryHistory = [
  { week: "W6", debt: 0.5, protected: 4 },
  { week: "W7", debt: 1.5, protected: 3 },
  { week: "W8", debt: 3, protected: 2 },
  { week: "W9", debt: 4.5, protected: 1 },
];

export const missedRecoveryBlocks = [
  { day: "Tuesday", time: "5:30 PM", reason: "Group meeting ran late", amount: 1 },
  { day: "Wednesday", time: "6:15 PM", reason: "Replied to society messages", amount: 0.75 },
  { day: "Friday", time: "8:00 PM", reason: "Assignment revision expanded", amount: 1.5 },
];

export const teammates = [
  {
    id: "faiz",
    name: "Faiz",
    role: "Sponsor research",
    capacity: 58,
    added: 13,
    note: "Two open focus blocks before Wednesday",
  },
  {
    id: "mei",
    name: "Mei",
    role: "Society coordination",
    capacity: 87,
    added: 12,
    note: "Already coordinating the venue and budget",
  },
  {
    id: "daniel",
    name: "Daniel",
    role: "Past sponsor list",
    capacity: 76,
    added: 16,
    note: "Available Tuesday, but the task is less familiar",
  },
] as const;

export const relationshipHistory = [
  { request: "Sponsor follow-up", decision: "Accepted", capacity: 91, date: "2 Sep" },
  { request: "Event poster edits", decision: "Accepted", capacity: 88, date: "27 Aug" },
  { request: "Vendor comparison", decision: "Accepted", capacity: 93, date: "19 Aug" },
  { request: "Meeting notes", decision: "Accepted", capacity: 86, date: "12 Aug" },
];

export const relationshipMessages = {
  smaller:
    "Hi Mei, I want to support the event, but I cannot take the full deck this week. I can prepare the outline and first five slides if the sponsor research is shared with Faiz. Would that work?",
  delay:
    "Hi Mei, I need to check two academic deadlines before committing. I can confirm by tomorrow at 12 PM, so you still have time to make another plan if needed.",
  decline:
    "Hi Mei, I cannot take on the sponsorship deck by Wednesday without affecting existing deadlines. I need to decline this one, but I can share my previous slide template to help the next person start.",
} as const;

export type ChallengeOption = {
  id: string;
  label: string;
  points: number;
  impact: string;
  feedback: string;
};

export type ChallengeRound = {
  title: string;
  context: string;
  question: string;
  options: ChallengeOption[];
};

export const challengeRounds: ChallengeRound[] = [
  {
    title: "The Wednesday request",
    context: "Your week is at 86%. Mei asks for a three-hour deck by Wednesday.",
    question: "What should you do first?",
    options: [
      {
        id: "simulate",
        label: "Check its impact before replying",
        points: 20,
        impact: "86% → 117% forecast",
        feedback: "Strong choice. You made the hidden cost visible before making a promise.",
      },
      {
        id: "accept",
        label: "Accept immediately",
        points: 0,
        impact: "Wednesday reaches 126%",
        feedback: "The quick yes creates a deadline collision and removes your recovery block.",
      },
      {
        id: "ignore",
        label: "Leave the message unread",
        points: 5,
        impact: "Decision delayed without a plan",
        feedback: "Delay can help, but only when you set a clear time to decide.",
      },
    ],
  },
  {
    title: "The fair delegation",
    context: "Research can be delegated. Faiz is at 58%; Mei is at 87% capacity.",
    question: "Which action protects the whole team?",
    options: [
      {
        id: "faiz",
        label: "Ask Faiz, then wait for confirmation",
        points: 20,
        impact: "Faiz: 58% → 71%",
        feedback: "Good. The hand-off is visible, realistic and still requires consent.",
      },
      {
        id: "mei",
        label: "Send it back to Mei",
        points: 5,
        impact: "Mei: 87% → 99%",
        feedback: "Your load improves, but the team becomes overloaded elsewhere.",
      },
      {
        id: "assign",
        label: "Assign Faiz without asking",
        points: 8,
        impact: "Capacity fits, consent missing",
        feedback: "Capacity is only one part of delegation. The other person must confirm.",
      },
    ],
  },
  {
    title: "The disappearing recovery block",
    context: "You skipped three recovery blocks and have accumulated 4.5 hours of recovery debt.",
    question: "What is the most resilient next step?",
    options: [
      {
        id: "protect",
        label: "Protect the next block before adding work",
        points: 20,
        impact: "Debt begins falling to 3.5 h",
        feedback: "Exactly. Recovery becomes a protected commitment, not leftover time.",
      },
      {
        id: "weekend",
        label: "Wait and recover everything Sunday",
        points: 6,
        impact: "Debt continues through Friday",
        feedback: "A distant recovery plan does not protect the overloaded days in between.",
      },
      {
        id: "coffee",
        label: "Use caffeine and keep working",
        points: 0,
        impact: "No capacity is recovered",
        feedback: "That may delay tiredness, but it does not create time or reduce commitments.",
      },
    ],
  },
];
