import { supabase } from "./client";

function generateToken() {
  return crypto.randomUUID();
}

export async function createInvitation({
  email,
  roleLevel,
  roleName,
  companyId,
  invitedBy,
}) {
  const token = generateToken();

  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + 7);

  const { data, error } = await supabase
    .from("company_invitations")
    .insert({
      email,
      role_level: roleLevel,
      role_name: roleName,
      company_id: companyId,
      invited_by: invitedBy,
      token,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getInvitationByToken(token) {
  const { data, error } = await supabase
    .from("company_invitations")
    .select("*")
    .eq("token", token)
    .single();

  if (error) {
    throw error;
  }

  return data;
}