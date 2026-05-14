import { supabase } from "./client";

export async function getTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
}

export async function getTaskById(taskId) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function createTask(task) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Du bist nicht eingeloggt.");

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: user.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function updateTaskStatus(taskId, status) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", taskId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function deleteTask(taskId) {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) throw new Error(error.message);
}