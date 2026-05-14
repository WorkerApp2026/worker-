import { supabase } from "./supabase/client";

export async function getTasks(filters = {}) {
  let query = supabase.from("tasks").select("*").order("created_at", { ascending: false });

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.priority) {
    query = query.eq("priority", filters.priority);
  }

  if (filters.assigned_to) {
    query = query.eq("assigned_to", filters.assigned_to);
  }

  const { data, error } = await query;

  if (error) {
    return { data: [], error };
  }

  const search = (filters.search || "").trim().toLowerCase();

  const filteredData = search
    ? (data || []).filter((task) => {
        const haystack = `${task.title || ""} ${task.description || ""}`.toLowerCase();
        return haystack.includes(search);
      })
    : (data || []);

  return { data: filteredData, error: null };
}

export async function getTaskById(taskId) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single();

  return { data, error };
}

export async function createTask(payload) {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("tasks")
    .insert([
      {
        ...payload,
        created_at: now,
        updated_at: now,
      },
    ])
    .select()
    .single();

  return { data, error };
}

export async function updateTask(taskId, payload) {
  const { data, error } = await supabase
    .from("tasks")
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .select()
    .single();

  return { data, error };
}

export async function updateTaskStatus(taskId, status) {
  const { data, error } = await supabase
    .from("tasks")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .select()
    .single();

  return { data, error };
}