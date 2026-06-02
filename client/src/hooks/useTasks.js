import { useState, useEffect, useCallback } from "react";
import * as taskApi from "../api/tasks";

/**
 * useTasks
 *
 * Central hook for all task state and operations.
 * Components just call the returned functions — no direct API calls elsewhere.
 *
 * @param {{ status: string, search: string }} filters
 */
export function useTasks(filters = {}) {
  const [tasks, setTasks] = useState([]);
  const [meta, setMeta] = useState({ totalActive: 0, totalCompleted: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch ────────────────────────────────────────────────────
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await taskApi.fetchTasks(filters);
      setTasks(res.data);
      setMeta(res.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.search]); // re-fetch when filters change

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTasks();
  }, [loadTasks]);

  // ── Create ───────────────────────────────────────────────────
  const addTask = async (body) => {
    const res = await taskApi.createTask(body);
    // Optimistically prepend to the list
    setTasks((prev) => [res.data, ...prev]);
    setMeta((prev) => ({ ...prev, totalActive: prev.totalActive + 1 }));
    return res.data;
  };

  // ── Update ───────────────────────────────────────────────────
  const editTask = async (id, body) => {
    const res = await taskApi.updateTask(id, body);
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? res.data : t))
    );
    return res.data;
  };

  // ── Toggle ───────────────────────────────────────────────────
  const toggleTask = async (id) => {
    const res = await taskApi.toggleTask(id);
    const updated = res.data;
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? updated : t))
    );
    // Update meta counts
    setMeta((prev) => ({
      totalActive: updated.completed
        ? prev.totalActive - 1
        : prev.totalActive + 1,
      totalCompleted: updated.completed
        ? prev.totalCompleted + 1
        : prev.totalCompleted - 1,
    }));
    return updated;
  };

  // ── Delete ───────────────────────────────────────────────────
  const removeTask = async (id) => {
    const task = tasks.find((t) => t._id === id);
    await taskApi.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
    if (task) {
      setMeta((prev) => ({
        totalActive: !task.completed
          ? prev.totalActive - 1
          : prev.totalActive,
        totalCompleted: task.completed
          ? prev.totalCompleted - 1
          : prev.totalCompleted,
      }));
    }
  };

  return {
    tasks,
    meta,
    loading,
    error,
    refetch: loadTasks,
    addTask,
    editTask,
    toggleTask,
    removeTask,
  };
}
