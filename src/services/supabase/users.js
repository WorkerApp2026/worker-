import { supabase } from "./client";

export async function getCompanyUsers(companyId) {
  if (!companyId) {
    return [];
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, role_name, role_level, company_id")
    .eq("company_id", companyId)
    .order("role_level", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function updateUserRoleLevel(userId, roleLevel) {
  if (!userId) {
    throw new Error("Benutzer-ID fehlt.");
  }

  const level = Number(roleLevel);

  if (level < 1 || level > 10) {
    throw new Error("Level muss zwischen 1 und 10 liegen.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      role_level: level,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}