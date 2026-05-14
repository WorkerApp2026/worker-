import { supabase } from "./client";

export async function getCommentsByTaskId(taskId) {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createComment(taskId, text) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Du bist nicht eingeloggt.");
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      task_id: taskId,
      user_id: user.id,
      text,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteComment(commentId) {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    throw new Error(error.message);
  }
}