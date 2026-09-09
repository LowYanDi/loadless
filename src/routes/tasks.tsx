import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock3, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/loadless/page-header";
import { StatusPill } from "@/components/loadless/status-pill";
import {
  taskCategories,
  taskEfforts,
  taskImpact,
  taskLoadLevel,
  type LoadLessTask,
  type TaskCategory,
  type TaskDraft,
  type TaskEffort,
} from "@/data/tasks";
import { useLoadLessDemo } from "@/hooks/use-loadless-demo";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — LoadLess" },
      {
        name: "description",
        content: "Add, edit, complete and remove commitments that contribute to weekly capacity.",
      },
    ],
  }),
  component: Tasks,
});

const emptyDraft: TaskDraft = {
  title: "",
  category: "Academic",
  deadline: "Wednesday, 11:59 PM",
  hours: 2,
  effort: "Medium",
};

function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus, taskCapacityAdjustment } =
    useLoadLessDemo();
  const [draft, setDraft] = useState<TaskDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const activeTasks = tasks.filter((task) => task.status === "pending");
  const completedTasks = tasks.filter((task) => task.status === "done");
  const totalHours = useMemo(
    () => activeTasks.reduce((total, task) => total + task.hours, 0),
    [activeTasks],
  );

  const resetForm = () => {
    setDraft(emptyDraft);
    setEditingId(null);
    setError("");
  };

  const submitTask = () => {
    const title = draft.title.trim();
    const deadline = draft.deadline.trim();
    if (!title) {
      setError("Enter a task name before saving.");
      return;
    }
    if (!deadline) {
      setError("Enter a deadline or time window.");
      return;
    }
    if (!Number.isFinite(draft.hours) || draft.hours <= 0 || draft.hours > 24) {
      setError("Estimated duration must be between 0.5 and 24 hours.");
      return;
    }

    const cleanDraft = { ...draft, title, deadline };
    if (editingId) {
      updateTask(editingId, cleanDraft);
      toast.success("Commitment updated");
    } else {
      addTask(cleanDraft);
      toast.success("Commitment added to your week");
    }
    resetForm();
  };

  const editTask = (task: LoadLessTask) => {
    setEditingId(task.id);
    setDraft({
      title: task.title,
      category: task.category,
      deadline: task.deadline,
      hours: task.hours,
      effort: task.effort,
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Planning base"
        title="Your commitments"
        description="Every active commitment contributes to your capacity. Complete, edit or remove one and the dashboard updates automatically."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Active commitments" value={String(activeTasks.length)} />
        <Metric label="Estimated time" value={`${totalHours.toFixed(1)} h`} />
        <Metric
          label="Capacity change"
          value={`${taskCapacityAdjustment > 0 ? "+" : ""}${taskCapacityAdjustment}%`}
        />
      </div>

      <Card className="rounded-2xl border-border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {editingId ? "Edit commitment" : "Add a commitment"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Task name" htmlFor="task-title">
              <Input
                id="task-title"
                value={draft.title}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="e.g. Finish database report"
                className="rounded-xl"
              />
            </Field>

            <Field label="Category">
              <Select
                value={draft.category}
                onValueChange={(value) =>
                  setDraft((current) => ({ ...current, category: value as TaskCategory }))
                }
              >
                <SelectTrigger className="w-full rounded-xl" aria-label="Task category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {taskCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Deadline or time" htmlFor="task-deadline">
              <Input
                id="task-deadline"
                value={draft.deadline}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, deadline: event.target.value }))
                }
                placeholder="e.g. Friday, 5:00 PM"
                className="rounded-xl"
              />
            </Field>

            <Field label="Estimated hours" htmlFor="task-hours">
              <Input
                id="task-hours"
                type="number"
                min="0.5"
                max="24"
                step="0.5"
                value={draft.hours}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, hours: Number(event.target.value) }))
                }
                className="rounded-xl"
              />
            </Field>

            <Field label="Mental effort">
              <Select
                value={draft.effort}
                onValueChange={(value) =>
                  setDraft((current) => ({ ...current, effort: value as TaskEffort }))
                }
              >
                <SelectTrigger className="w-full rounded-xl" aria-label="Mental effort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {taskEfforts.map((effort) => (
                    <SelectItem key={effort} value={effort}>
                      {effort}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="rounded-xl border border-border bg-secondary/60 p-3.5">
              <p className="text-xs font-medium text-muted-foreground">Estimated contribution</p>
              <p className="mt-1 text-lg font-bold tabular-nums">+{taskImpact(draft)} points</p>
            </div>
          </div>

          {error ? (
            <p
              className="rounded-xl border border-overload/30 bg-overload-soft p-3 text-sm text-overload"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button className="rounded-xl" onClick={submitTask}>
              {editingId ? "Save changes" : "Add commitment"}
            </Button>
            {editingId ? (
              <Button variant="ghost" className="rounded-xl" onClick={resetForm}>
                Cancel edit
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <TaskSection
        title="Active commitments"
        empty="No active commitments. Add one above to see its effect on capacity."
        tasks={activeTasks}
        onEdit={editTask}
        onToggle={toggleTaskStatus}
        onDelete={deleteTask}
      />

      {completedTasks.length > 0 ? (
        <TaskSection
          title="Completed"
          empty=""
          tasks={completedTasks}
          onEdit={editTask}
          onToggle={toggleTaskStatus}
          onDelete={deleteTask}
        />
      ) : null}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card className="rounded-2xl border-border shadow-soft">
      <CardContent className="p-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}

function TaskSection({
  title,
  empty,
  tasks,
  onEdit,
  onToggle,
  onDelete,
}: {
  title: string;
  empty: string;
  tasks: LoadLessTask[];
  onEdit: (task: LoadLessTask) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Card className="rounded-2xl border-border shadow-soft">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {empty}
          </div>
        ) : (
          tasks.map((task) => {
            const done = task.status === "done";
            return (
              <div
                key={task.id}
                className={`grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center ${
                  done ? "bg-secondary/50" : "bg-background"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className={`text-sm font-semibold ${done ? "text-muted-foreground line-through" : ""}`}
                    >
                      {task.title}
                    </p>
                    {!done ? (
                      <StatusPill
                        level={taskLoadLevel(task)}
                        label={`+${taskImpact(task)} points`}
                      />
                    ) : null}
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                    {task.category} · {task.deadline} · {task.hours} h · {task.effort} effort
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => onToggle(task.id)}
                  >
                    {done ? (
                      <RotateCcw className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    {done ? "Restore" : "Complete"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl"
                    onClick={() => onEdit(task)}
                    aria-label={`Edit ${task.title}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl text-overload"
                        aria-label={`Delete ${task.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this commitment?</AlertDialogTitle>
                        <AlertDialogDescription>
                          “{task.title}” will be removed and your capacity will be recalculated.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep task</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(task.id)}>
                          Delete task
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
