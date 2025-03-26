import pool from "../config/db";

//fetches all the tasks for a specific user.

export const getTasks = async (
  userId: number,
  search?: string | null,
  status?: string | null,
  priority?: string | null,
  startDate?: string | null,
  endDate?: string | null
) => {
  try {
    // Fetch tasks for the user
    let query = "SELECT * FROM tasks WHERE user_id = ?";
    const queryParams: (string | number)[] = [userId];

    // Dynamically add filters based on provided parameters
    if (search != undefined) {
      query += " AND title LIKE ? ";
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

    console.log("query", query);
    console.log("params", queryParams);

    // Execute the query with the dynamically constructed query and parameters
    const [result] = await pool.query(query, queryParams);

    const tasks = result as {
      id: number;
      parent_task_id: number | null;
      parentTask: number | null;
    }[]; // Type assertion to handle rows as an array of tasks

    // Loop through each task to check for parent_task and populate it if not null
    for (const task of tasks) {
      if (task.parent_task_id !== null) {
        // Fetch the parent task details
        const [parentTaskResult] = await pool.query(
          "SELECT * FROM tasks WHERE id = ?",
          [task.parent_task_id]
        );
        const parentTask = parentTaskResult[0]; // Get the first result (parent task)
        task.parentTask = parentTask || null; // If parent task exists, set it, else set null
      }
    }

    // Return the formatted response
    return {
      status: 200,
      success: true,
      message: "Results fetched successfully",
      data: tasks, // Tasks with populated parent_task
    };
  } catch (error) {
    // In case of an error, return a failure response
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
