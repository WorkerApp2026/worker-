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

  if (existingProfile?.company_id) {
    return existingProfile;
  }

  const companyName = `${user.email}'s Firma`;

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert({
      name: companyName,
      created_by: user.id,
    })
    .select()
    .single();

  if (companyError) {
    throw new Error(companyError.message);
  }

  if (existingProfile) {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        company_id: company.id,
        full_name: user.email,
        role_name: "Admin",
        role_level: 10,
        role: "admin",
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      email: user.email,
      company_id: company.id,
      full_name: user.email,
      role_name: "Admin",
      role_level: 10,
      role: "admin",
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}