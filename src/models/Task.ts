export interface Task {
  id: number;
  title: string;
  status: "pending" | "done";
  priority: "low" | "medium" | "high";
  recurring: "none" | "daily" | "weekly" | "monthly";
  parentTaskId?: number;
  userId: number;
}
