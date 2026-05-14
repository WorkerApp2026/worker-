import { useCallback, useEffect, useState } from "react";
import {
  createTask,
  getTaskById,
  getTasks,
  updateTask,
  updateTaskStatus,
} from "../services/taskService";

export default function useTasks(initialFilters = {}) {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async (nextFilters = filters) => {
    setLoading(true);
    setError("");

    const result = await getTasks(nextFilters);

    if (result.error) {
      setError(result.error.message || "Aufgaben konnten nicht geladen werden.");
      setTasks([]);
    } else {
      setTasks(result.data || []);
    }

    setLoading(false);
  }, [filters]);

  const loadTask = useCallback(async (taskId) => {
    setLoading(true);
    setError("");

    const result = await getTaskById(taskId);

    if (result.error) {
      setError(result.error.message || "Aufgabe konnte nicht geladen werden.");
      setTask(null);
    } else {
      setTask(result.data || null);
    }

    setLoading(false);
  }, []);

  const submitTask = async (payload) => {
    const result = await createTask(payload);
    if (!result.error) {
      await loadTasks();
    }
    return result;
  };

  const saveTask = async (taskId, payload) => {
    const result = await updateTask(taskId, payload);
    if (!result.error) {
      await loadTask(taskId);
      await loadTasks();
    }
    return result;
  };

  const saveTaskStatus = async (taskId, status) => {
    const result = await updateTaskStatus(taskId, status);
    if (!result.error) {
      await loadTask(taskId);
      await loadTasks();
    }
    return result;
  };

  useEffect(() => {
    loadTasks(filters);
  }, [filters, loadTasks]);

  return {
    tasks,
    task,
    loading,
    error,
    filters,
    setFilters,
    loadTasks,
    loadTask,
    submitTask,
    saveTask,
    saveTaskStatus,
  };
}