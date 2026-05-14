import { supabase } from "./supabase/client";

export async function getCommentsByTaskId(taskId) {
  const { data, error } = await supabase
    .from("task_comments")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });

  return { data: data || [], error };
}

export async function createComment(payload) {
  const { data, error } = await supabase
    .from("task_comments")
    .insert([
      {
        ...payload,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  return { data, error };
}