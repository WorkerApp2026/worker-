import { STORAGE_BUCKET } from "../app/constants";
import { buildFilePath } from "../utils/storageHelpers";
import { supabase } from "./supabase/client";

export async function uploadTaskImage({ taskId, file }) {
  const filePath = buildFilePath(taskId, file.name);

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "image/jpeg",
    });

  if (uploadError) {
    return { publicUrl: "", path: "", error: uploadError };
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

  return {
    publicUrl: data?.publicUrl || "",
    path: filePath,
    error: null,
  };
}

export async function createTaskImageRecord(payload) {
  const { data, error } = await supabase
    .from("task_images")
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

export async function getImagesByTaskId(taskId) {
  const { data, error } = await supabase
    .from("task_images")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: false });

  return { data: data || [], error };
}