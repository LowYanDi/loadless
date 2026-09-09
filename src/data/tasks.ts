import type { LoadLevel } from "@/data/loadless";

export const taskCategories = ["Academic", "Work", "Social", "Physical", "Errands"] as const;
export const taskEfforts = ["Low", "Medium", "High"] as const;

export type TaskCategory = (typeof taskCategories)[number];
export type TaskEffort = (typeof taskEfforts)[number];
export type TaskStatus = "pending" | "done";

export type LoadLessTask = {
  id: string;
  title: string;
  category: TaskCategory;
  deadline: string;
  hours: number;
  effort: TaskEffort;
  status: TaskStatus;
};

export type TaskDraft = Omit<LoadLessTask, "id" | "status">;

export const initialTasks: LoadLessTask[] = [
  {
    id: "data-structures",
    title: "Data Structures assignment 3",
    category: "Academic",
    deadline: "Tuesday, 11:59 PM",
    hours: 5,
    effort: "High",
    status: "pending",
  },
  {
    id: "society-meeting",
    title: "Society sponsorship meeting",
    category: "Social",
    deadline: "Wednesday, 8:00 PM",
    hours: 1.5,
    effort: "Medium",
    status: "pending",
  },
  {
    id: "cafe-shift",
    title: "Café shift",
    category: "Work",
    deadline: "Thursday, 4:00 PM",
    hours: 6,
    effort: "Medium",
    status: "pending",
  },
  {
    id: "group-standup",
    title: "Group project standup",
    category: "Academic",
    deadline: "Friday, 10:00 AM",
    hours: 1,
    effort: "Low",
    status: "pending",
  },
  {
    id: "futsal",
    title: "Futsal with housemates",
    category: "Physical",
    deadline: "Saturday, 5:00 PM",
    hours: 2,
    effort: "Low",
    status: "pending",
  },
];

export function taskImpact(task: Pick<LoadLessTask, "hours" | "effort">): number {
  const effortWeight = { Low: 1, Medium: 1.5, High: 2 }[task.effort];
  return Math.max(1, Math.round(task.hours * effortWeight));
}

export function taskLoadLevel(task: Pick<LoadLessTask, "hours" | "effort">): LoadLevel {
  const impact = taskImpact(task);
  if (impact >= 8) return "overload";
  if (impact >= 4) return "caution";
  return "healthy";
}

export const initialTaskImpact = initialTasks.reduce((total, task) => total + taskImpact(task), 0);
