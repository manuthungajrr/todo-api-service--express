import pool from "../config/db";

//fetches all the tasks for a specific user.

export const getTasks = async (
  userId: number,
  search?: string | null,
  status?: string | null,
  priority?: string | null,
  startDate?: string | null,
  endDate?: string | null,
  page?: number | null,
  limit?: number | null
) => {
  try {
    let query = "SELECT * FROM tasks WHERE user_id = ?";
    const queryParams: (string | number)[] = [userId];

    // Apply filters dynamically
    if (search != undefined) {
      query += " AND title LIKE ?";
      queryParams.push(`%${search}%`);
    }
    if (status != undefined) {
      query += " AND status = ?";
      queryParams.push(status ?? "");
    }
    if (priority != undefined) {
      query += " AND priority = ?";
      queryParams.push(priority ?? "");
    }
    if (startDate != undefined) {
      query += " AND start_date >= ?";
      queryParams.push(startDate ?? "");
    }
    if (endDate != undefined) {
      query += " AND end_date <= ?";
      queryParams.push(endDate ?? "");
    }

    // Fetch total count of tasks (for pagination)
    const countQuery = `SELECT COUNT(*) as total FROM tasks WHERE user_id = ?`;
    const [countResult] = await pool.query(countQuery, [userId]);
    const totalCount = countResult[0].total;

    console.log("page", page);
    console.log("limit", limit);
    let totalPages = 0;

    if (page != undefined && limit != undefined) {
      totalPages = Math.ceil(totalCount / limit);

      const offset = (page - 1) * limit;
      query += " LIMIT ? OFFSET ?";
      queryParams.push(limit, offset);
    }

    console.log("query", query);
    console.log("params", queryParams);

    const [result] = await pool.query(query, queryParams);
    const tasks = result as {
      id: number;
      parent_task_id: number | null;
      parentTask: number | null;
    }[];

    // Fetch parent task details for each task
    for (const task of tasks) {
      if (task.parent_task_id !== null) {
        const [parentTaskResult] = await pool.query(
          "SELECT * FROM tasks WHERE id = ?",
          [task.parent_task_id]
        );
        task.parentTask = parentTaskResult[0] || null;
      }
    }

    return {
      status: 200,
      success: true,
      message: "Results fetched successfully",
      data: tasks,
      pagination: {
        totalRecords: totalCount,
        totalPages: totalPages,
        currentPage: page,
        limit: limit,
      },
    };
  } catch (error) {
    return {
      status: 500,
      success: false,
      message: "Failed to fetch results",
      data: [],
    };
  }
};

export const getTaskById = async (taskId: number) => {
  try {
    // Fetch the task by its ID
    const [result] = await pool.query("SELECT * FROM tasks WHERE id = ?", [
      taskId,
    ]);

    const task = result[0] as {
      id: number;
      parent_task_id: number | null;
      parentTask: number | null;
    }; // Type assertion to handle row as a single task

    if (!task) {
      return {
        status: 404,
        success: false,
        message: "Task not found",
        data: null,
      };
    }

    // Check for parent_task and populate it if not null
    if (task.parent_task_id !== null) {
      // Fetch the parent task details
      const [parentTaskResult] = await pool.query(
        "SELECT * FROM tasks WHERE id = ?",
        [task.parent_task_id]
      );
      const parentTask = parentTaskResult[0]; // Get the first result (parent task)
      task.parentTask = parentTask || null; // If parent task exists, set it, else set null
    }

    // Return the formatted response
    return {
      status: 200,
      success: true,
      message: "Task fetched successfully",
      data: task, // Single task with populated parent_task
    };
  } catch (error) {
    // In case of an error, return a failure response
    return {
      status: 500,
      success: false,
      message: "Failed to fetch task",
      data: null,
    };
  }
};

//create a task for a specific user

export const createTask = async (
  title: string,
  priority: string,
  userId: number,
  recurring: string,
  assignedDate: string,
  parentTaskId: number
) => {
  await pool.query(
    'INSERT INTO tasks (title,priority,user_id,recurring,parent_task_id,assigned_date,status ) VALUES (?, ? , ? , ? , ? , ? ,"pending")',
    [title, priority, userId, recurring, parentTaskId, assignedDate]
  );
};

//update task only lets the user update status for now.

export const updateTask = async (
  taskId: number,
  title: string,
  priority: string,
  userId: number,
  recurring: string,
  assignedDate: string,
  parentTaskId: number
  // status: string,
  // userId: number
) => {
  await pool.query(
    "UPDATE tasks SET title = ?, priority = ?, recurring = ?, parent_task_id = ?, assigned_date = ? WHERE id = ?",
    [title, priority, recurring, parentTaskId, assignedDate, taskId] // Swapped assignedDate and parentTaskId
  );
};

export const markAsDone = async (taskId: number) => {
  console.log("task id", taskId);
  await pool.query("UPDATE tasks SET status = ? WHERE id = ?", [
    "done",
    taskId,
  ]);
};

//Todo better to add a soft delete
export const deleteTask = async (taskId: number) => {
  await pool.query("DELETE FROM tasks WHERE id = ? ", [taskId]);
};
