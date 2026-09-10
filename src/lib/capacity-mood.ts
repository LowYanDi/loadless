export type CapacityMood = {
  emoji: string;
  label: string;
  shortLabel: string;
};

export function capacityMood(value: number): CapacityMood {
  if (value > 100) {
    return { emoji: "😭", label: "Your week needs relief", shortLabel: "Needs relief" };
  }

  if (value >= 90) {
    return { emoji: "😟", label: "Very little room left", shortLabel: "Almost full" };
  }

  if (value >= 75) {
    return { emoji: "😮‍💨", label: "A full week — go gently", shortLabel: "Go gently" };
  }

  if (value >= 55) {
    return { emoji: "🙂", label: "Steady, with some room", shortLabel: "Steady" };
  }

  return { emoji: "😊", label: "Plenty of breathing room", shortLabel: "Room to breathe" };
}
