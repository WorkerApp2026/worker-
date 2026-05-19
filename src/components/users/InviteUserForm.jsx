import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { createMyProfileIfMissing } from "../../services/supabase/profiles";
import { createInvitation } from "../../services/supabase/invitations";

export default function InviteUserForm() {
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [roleLevel, setRoleLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function getRoleName(level) {
    const numericLevel = Number(level);

    if (numericLevel >= 10) return "Super Admin";
    if (numericLevel >= 8) return "Admin";
    if (numericLevel >= 5) return "Manager";

    return "Mitarbeiter";
  }

  async function handleInvite(event) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setSuccessMessage("");
      setInviteLink("");
      setErrorMessage("");

      const profile = await createMyProfileIfMissing();

      if (!profile?.company_id) {
        throw new Error("Keine Firma gefunden.");
      }

      const invitation = await createInvitation({
        email,
        roleLevel: Number(roleLevel),
        roleName: getRoleName(roleLevel),
        companyId: profile.company_id,
        invitedBy: user.id,
      });

      const link = `${window.location.origin}/invite/${invitation.token}`;

      setSuccessMessage("Einladung erfolgreich erstellt.");
      setInviteLink(link);
      setEmail("");
      setRoleLevel(1);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="content-card">
      <h2>Mitarbeiter einladen</h2>

      <form
        onSubmit={handleInvite}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="auth-input"
        />

        <select
          value={roleLevel}
          onChange={(event) => setRoleLevel(event.target.value)}
          className="auth-input"
        >
          <option value={1}>Mitarbeiter (Level 1)</option>
          <option value={2}>Standard (Level 2)</option>
          <option value={5}>Manager (Level 5)</option>
          <option value={8}>Admin (Level 8)</option>
          <option value={10}>Super Admin (Level 10)</option>
        </select>

        <button type="submit" disabled={isLoading} className="auth-button">
          {isLoading ? "Erstelle Einladung..." : "Einladung erstellen"}
        </button>

        {successMessage && (
          <p style={{ color: "#4ade80" }}>{successMessage}</p>
        )}

        {inviteLink && (
          <div
            style={{
              padding: "14px",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.04)",
              color: "white",
              wordBreak: "break-all",
            }}
          >
            <strong>Einladungslink:</strong>
            <br />
            {inviteLink}
          </div>
        )}

        {errorMessage && <p style={{ color: "#ef4444" }}>{errorMessage}</p>}
      </form>
    </div>
  );
}