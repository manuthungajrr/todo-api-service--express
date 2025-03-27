import request from "supertest";
import app from "../server";
import pool from "../config/db";

// Mocking the service methods
jest.mock("../services/taskService", () => ({
  getTasks: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
  markAsDone: jest.fn(),
  getTaskById: jest.fn(),
}));

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  markAsDone,
  getTaskById,
} = require("../services/taskService");

describe("Task Controller", () => {
  beforeAll(() => {
    // Any setup before all tests run
  });

  afterAll(() => {
    // Close DB connection or clean up
    pool.end();
  });

  test("GET /tasks - fetch all tasks", async () => {
    getTasks.mockResolvedValue({
      status: 200,
      success: true,
      message: "Results fetched successfully",
      data: [{ id: 1, title: "Task 1", user_id: 1 }],
    });

    const response = await request(app).get("/tasks?user_id=1");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Results fetched successfully");
    expect(response.body.data).toBeInstanceOf(Array);
  });

  test("GET /tasks/:id - fetch task by ID", async () => {
    getTaskById.mockResolvedValue({
      status: 200,
      success: true,
      message: "Task fetched successfully",
      data: { id: 1, title: "Task 1", user_id: 1 },
    });

    const response = await request(app).get("/tasks/1");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Task fetched successfully");
    expect(response.body.data.id).toBe(1);
  });

  test("POST /tasks - create new task", async () => {
    createTask.mockResolvedValue(null); // Assuming it doesn't return anything on success

    const taskData = {
      title: "New Task",
      priority: "high",
      userId: 1,
      recurring: "no",
      assignedDate: "2025-01-01",
      parentTaskId: null,
    };

    const response = await request(app).post("/tasks").send(taskData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Task Created Successfully");
  });

  test("PUT /tasks/:id - update existing task", async () => {
    updateTask.mockResolvedValue(null); // Assuming it doesn't return anything on success

    const taskData = {
      title: "Updated Task",
      priority: "low",
      userId: 1,
      recurring: "yes",
      assignedDate: "2025-02-01",
      parentTaskId: null,
    };

    const response = await request(app).put("/tasks/1").send(taskData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Task Updated Sucessfully");
  });

  test("PUT /tasks/:id/complete - mark task as done", async () => {
    markAsDone.mockResolvedValue(null); // Assuming it doesn't return anything on success

    const response = await request(app).put("/tasks/1/complete");

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Task Completed Sucessfully");
  });

  test("DELETE /tasks/:id - delete task", async () => {
    deleteTask.mockResolvedValue(null); // Assuming it doesn't return anything on success

    const response = await request(app).delete("/tasks/1");

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Task Deleted Sucessfully");
  });
});
