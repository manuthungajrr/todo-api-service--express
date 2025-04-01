import express from "express";
import authMiddleWare from "../middlewares/authMiddleWare";
import {
  fetchTasks,
  createNewTask,
  updateExistingTask,
  deleteTaskById,
  markTaskAsDone,
  fetchTaskById,
} from "../controllers/taskController";

const router = express.Router();

router.get("/", fetchTasks);
router.get("/:id", fetchTaskById);
router.post("/", createNewTask);
router.put("/:id", updateExistingTask);
router.put("/:id/complete", markTaskAsDone);
router.delete("/:id", deleteTaskById);

export default router;
