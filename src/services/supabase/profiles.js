import { supabase } from "./client";

export async function getMyProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Du bist nicht eingeloggt.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createMyProfileIfMissing() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Du bist nicht eingeloggt.");
  }

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existingProfile) {
    return existingProfile;
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      email: user.email,
      role: "worker",
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}