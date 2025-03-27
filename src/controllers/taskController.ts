import { Request, Response } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  markAsDone,
  getTaskById,
} from "../services/taskService";

export const fetchTasks = async (req: Request, res: Response) => {
  // res.json({ message: "Static response: Here are the tasks" });
  console.log("fetch Task Res", req.query);
  const tasks = await getTasks(
    Number(req.query.user_id),
    req.query.search ? String(req.query.search) : null,
    req.query.status ? String(req.query.status) : null,
    req.query.priority ? String(req.query.priority) : null,
    req.query.startDate ? String(req.query.startDate) : null,
    req.query.endDate ? String(req.query.endDate) : null,
    req.query.page ? Number(req.query.page) : undefined,
    req.query.limit ? Number(req.query.limit) : undefined
  );
  res.json(tasks);
};

export const fetchTaskById = async (req: Request, res: Response) => {
  // res.json({ message: "Static response: Here are the tasks" });
  const tasks = await getTaskById(Number(req.params.id));
  res.json(tasks);
};

export const createNewTask = async (req: Request, res: Response) => {
  const tasks = await createTask(
    req.body.title,
    req.body.priority,
    req.body.userId,
    req.body.recurring,
    req.body.assignedDate,
    req.body.parentTaskId
  );
  res.status(201).json({ message: "Task Created Successfully" });
};

export const updateExistingTask = async (req: Request, res: Response) => {
  const tasks = await updateTask(
    Number(req.params.id),
    // req.body.status,
    req.body.title,
    req.body.priority,
    req.body.userId,
    req.body.recurring,
    req.body.assignedDate,
    req.body.parentTaskId
  );
  res.status(201).json({ message: "Task Updated Sucessfully" });
};

export const markTaskAsDone = async (req: Request, res: Response) => {
  const tasks = await markAsDone(Number(req.params.id));
  res.status(201).json({ message: "Task Completed Sucessfully" });
};

export const deleteTaskById = async (req: Request, res: Response) => {
  const tasks = await deleteTask(Number(req.params.id));
  res.status(201).json({ message: "Task Deleted Sucessfully" });
};
