import axios from "axios";

// Base URL: during dev, Vite proxy forwards /api → localhost:5000
// In production, set VITE_API_URL in your .env
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Response interceptor: unwrap data or throw a clean error ──
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// ── Task API ───────────────────────────────────────────────────

/**
 * Fetch all tasks.
 * @param {{ status?: "all"|"active"|"completed", search?: string }} params
 */
export const fetchTasks = (params = {}) => {
  return api.get("/tasks", { params });
};

/**
 * Create a new task.
 * @param {{ title: string, description?: string, dueDate?: string }} body
 */
export const createTask = (body) => {
  return api.post("/tasks", body);
};

/**
 * Update a task's fields (title, description, dueDate).
 * @param {string} id
 * @param {{ title?: string, description?: string, dueDate?: string }} body
 */
export const updateTask = (id, body) => {
  return api.put(`/tasks/${id}`, body);
};

/**
 * Toggle a task's completed status.
 * @param {string} id
 */
export const toggleTask = (id) => {
  return api.patch(`/tasks/${id}/toggle`);
};

/**
 * Delete a task by id.
 * @param {string} id
 */
export const deleteTask = (id) => {
  return api.delete(`/tasks/${id}`);
};
