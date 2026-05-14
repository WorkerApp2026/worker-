import { supabase } from "./client";

export async function uploadTaskImage(taskId, file) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Nicht eingeloggt.");
  }

  const fileExt = file.name.split(".").pop();

  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`;

  const filePath = `${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("task-images")
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("task-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("task_images")
    .insert({
      task_id: taskId,
      user_id: user.id,
      image_url: publicUrl,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getTaskImages(taskId) {
  const { data, error } = await supabase
    .from("task_images")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteTaskImage(imageId) {
  const { error } = await supabase
    .from("task_images")
    .delete()
    .eq("id", imageId);

  if (error) {
    throw new Error(error.message);
  }
}