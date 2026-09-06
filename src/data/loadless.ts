export type LoadLevel = "healthy" | "caution" | "overload";

export const user = {
  name: "Aina",
  role: "University student",
  university: "Universiti Malaya",
  capacity: 82,
  highestDay: "Wednesday",
  status: "Approaching your limit",
};

export const categories = [
  {
    key: "academic",
    label: "Academic",
    value: 88,
    detail: "3 assignments, 2 group projects, 14 contact hours",
  },
  { key: "work", label: "Work", value: 65, detail: "Part-time café shifts, 12 hours a week" },
  { key: "social", label: "Social", value: 72, detail: "Society meetings, family visit on Sunday" },
  {
    key: "physical",
    label: "Physical",
    value: 55,
    detail: "Commuting 6 hours, futsal twice a week",
  },
  { key: "errands", label: "Errands", value: 60, detail: "Groceries, laundry, bank appointment" },
] as const;

export const weeklyLoad = [
  { day: "Mon", full: "Monday", load: 68 },
  { day: "Tue", full: "Tuesday", load: 74 },
  { day: "Wed", full: "Wednesday", load: 94 },
  { day: "Thu", full: "Thursday", load: 71 },
  { day: "Fri", full: "Friday", load: 80 },
  { day: "Sat", full: "Saturday", load: 58 },
  { day: "Sun", full: "Sunday", load: 46 },
];

export const updatedWeeklyLoad = [
  { day: "Mon", full: "Monday", load: 68 },
  { day: "Tue", full: "Tuesday", load: 74 },
  { day: "Wed", full: "Wednesday", load: 89 },
  { day: "Thu", full: "Thursday", load: 71 },
  { day: "Fri", full: "Friday", load: 69 },
  { day: "Sat", full: "Saturday", load: 58 },
  { day: "Sun", full: "Sunday", load: 61 },
];

export const forecastLoad = [
  { day: "Mon", full: "Monday", load: 68, forecast: 72 },
  { day: "Tue", full: "Tuesday", load: 74, forecast: 88 },
  { day: "Wed", full: "Wednesday", load: 94, forecast: 128 },
  { day: "Thu", full: "Thursday", load: 71, forecast: 78 },
  { day: "Fri", full: "Friday", load: 80, forecast: 92 },
  { day: "Sat", full: "Saturday", load: 58, forecast: 62 },
  { day: "Sun", full: "Sunday", load: 46, forecast: 48 },
];

export const scoreFactors = [
  {
    title: "Committed hours",
    body: "Every fixed class, shift and meeting in your week is counted against a 45-hour realistic budget.",
  },
  {
    title: "Mental effort",
    body: "Tasks that need deep focus, such as writing a proposal, weigh more than routine errands.",
  },
  {
    title: "Deadline pressure",
    body: "Work due within 72 hours is weighted higher because you have less room to move it.",
  },
  {
    title: "Recovery time",
    body: "Days with under 7 hours of rest or travel-heavy mornings reduce your usable capacity.",
  },
];

export const upcoming = [
  {
    title: "Data Structures assignment 3",
    category: "Academic",
    when: "Tuesday, 11:59 PM",
    hours: "5 h",
    level: "overload" as LoadLevel,
  },
  {
    title: "Society sponsorship meeting",
    category: "Society",
    when: "Wednesday, 8:00 PM",
    hours: "1.5 h",
    level: "caution" as LoadLevel,
  },
  {
    title: "Café shift",
    category: "Work",
    when: "Thursday, 4:00 PM",
    hours: "6 h",
    level: "caution" as LoadLevel,
  },
  {
    title: "Group project standup",
    category: "Academic",
    when: "Friday, 10:00 AM",
    hours: "1 h",
    level: "healthy" as LoadLevel,
  },
  {
    title: "Futsal with housemates",
    category: "Physical",
    when: "Saturday, 5:00 PM",
    hours: "2 h",
    level: "healthy" as LoadLevel,
  },
];

export const demoMessage =
  "Hi Aina, can you prepare the sponsorship deck for our society event by Wednesday? It should take around three hours.";

export const extractedCommitment = {
  task: "Prepare sponsorship deck",
  category: "Society",
  deadline: "Wednesday",
  duration: "3 hours",
  mentalEffort: "High",
  flexibility: "Medium",
  from: "Mei, Society treasurer",
  source: "WhatsApp",
};

export const sandbox = {
  current: 82,
  added: 31,
  forecast: 113,
  status: "Over capacity",
  affectedArea: "Mental load",
  affectedDay: "Wednesday",
};

export const recommendations = [
  {
    id: "scope",
    title: "Reduce the sponsorship deck scope",
    change: "Deliver an outline plus the first five slides instead of the full 18-slide deck.",
    why: "Wednesday is already at 94% load, and the deck is the only item on it with medium flexibility.",
    saving: 12,
  },
  {
    id: "errands",
    title: "Move Friday's flexible errands",
    change: "Shift groceries and the bank appointment to Sunday afternoon.",
    why: "Sunday sits at 46% load, the lowest in your week, and both errands have no fixed deadline.",
    saving: 7,
  },
  {
    id: "delegate",
    title: "Delegate sponsor research",
    change: "Ask Faiz to compile the sponsor contact list and past packages.",
    why: "Research is 60% of the deck's effort and does not depend on your design work.",
    saving: 10,
  },
];

export const boundaryMessages = {
  Friendly:
    "Hi Mei, I can help with the sponsorship deck, but I won't be able to complete the full version by Wednesday. I can prepare the outline and first five slides, while someone else handles the sponsor research. Would that work?",
  Professional:
    "Hi Mei, thank you for thinking of me for the sponsorship deck. I am not able to deliver the complete version by Wednesday given my current coursework. I can prepare the outline and the first five slides by then, provided someone else takes on the sponsor research. Please let me know if that arrangement works.",
  Direct:
    "Hi Mei, I can't finish the full sponsorship deck by Wednesday. I'll do the outline and the first five slides. Someone else needs to handle the sponsor research.",
} as const;

export const afterState = {
  before: 113,
  after: 84,
  reduced: 29,
  status: "Back within a realistic range",
};

export const insights = {
  weeks: [
    { week: "Week 5", capacity: 71, overloadDays: 0 },
    { week: "Week 6", capacity: 76, overloadDays: 1 },
    { week: "Week 7", capacity: 88, overloadDays: 2 },
    { week: "Week 8", capacity: 93, overloadDays: 3 },
    { week: "Week 9", capacity: 82, overloadDays: 1 },
  ],
  categoryTrend: [
    { category: "Academic", lastWeek: 79, thisWeek: 88 },
    { category: "Work", lastWeek: 70, thisWeek: 65 },
    { category: "Social", lastWeek: 61, thisWeek: 72 },
    { category: "Physical", lastWeek: 52, thisWeek: 55 },
    { category: "Errands", lastWeek: 64, thisWeek: 60 },
  ],
  notes: [
    {
      title: "Wednesdays are your pressure point",
      body: "Four of the last five weeks had Wednesday as the highest-load day, driven by evening society meetings after a full class day.",
    },
    {
      title: "Society requests arrive late",
      body: "Society tasks reached you an average of 2.1 days before the deadline, the shortest notice of any category.",
    },
    {
      title: "Saying no worked",
      body: "You declined or rescoped 3 commitments this month and stayed under 90% capacity in 2 of those weeks.",
    },
  ],
};

export function levelFor(value: number): LoadLevel {
  if (value >= 95) return "overload";
  if (value >= 75) return "caution";
  return "healthy";
}

export function labelFor(value: number): string {
  if (value >= 100) return "Over capacity";
  if (value >= 95) return "At your limit";
  if (value >= 75) return "Approaching your limit";
  if (value >= 50) return "Steady week";
  return "Plenty of room";
}
