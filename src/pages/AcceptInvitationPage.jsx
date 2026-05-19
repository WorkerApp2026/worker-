import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { supabase } from "../services/supabase/client";
import { getInvitationByToken } from "../services/supabase/invitations";

export default function AcceptInvitationPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [invitation, setInvitation] = useState(null);
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadInvitation();
  }, []);

  async function loadInvitation() {
    try {
      setIsLoading(true);

      const data = await getInvitationByToken(token);

      setInvitation(data);
    } catch (error) {
      setErrorMessage("Einladung wurde nicht gefunden oder ist ungültig.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();

    try {
      setIsRegistering(true);
      setErrorMessage("");
      setSuccessMessage("");

      const { data, error } = await supabase.auth.signUp({
        email: invitation.email,
        password,
      });

      if (error) {
        throw error;
      }

      const user = data.user;

      if (!user) {
        throw new Error("Benutzer konnte nicht erstellt werden.");
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: invitation.email,
          role_level: invitation.role_level,
          role_name: invitation.role_name,
          company_id: invitation.company_id,
        });

      if (profileError) {
        throw profileError;
      }

      const { error: invitationError } = await supabase
        .from("company_invitations")
        .update({
          status: "accepted",
        })
        .eq("id", invitation.id);

      if (invitationError) {
        throw invitationError;
      }

      setSuccessMessage(
        "Registrierung erfolgreich. Du wirst weitergeleitet..."
      );

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsRegistering(false);
    }
  }

  if (isLoading) {
    return (
      <div style={{ padding: "40px", color: "white" }}>
        Lade Einladung...
      </div>
    );
  }

  if (errorMessage && !invitation) {
    return (
      <div style={{ padding: "40px", color: "white" }}>
        <h1>Einladung ungültig</h1>
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
        }}
      >
        <h1>Einladung annehmen</h1>

        <p>Du wurdest eingeladen mit:</p>

        <p>
          <strong>E-Mail:</strong> {invitation.email}
        </p>

        <p>
          <strong>Rolle:</strong> {invitation.role_name}
        </p>

        <p>
          <strong>Level:</strong> {invitation.role_level}
        </p>

        <form
          onSubmit={handleRegister}
          style={{
            marginTop: "30px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <input
            type="password"
            placeholder="Passwort erstellen"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            style={{
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              fontSize: "16px",
            }}
          />

          <button
            type="submit"
            disabled={isRegistering}
            style={{
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              background: "#2563eb",
              color: "white",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            {isRegistering
              ? "Registriere..."
              : "Registrierung abschließen"}
          </button>

          {successMessage && (
            <p style={{ color: "#4ade80" }}>
              {successMessage}
            </p>
          )}

          {errorMessage && invitation && (
            <p style={{ color: "#ef4444" }}>
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}