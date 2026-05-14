import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmail,
  signUpWithEmail,
} from "../services/supabase/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const isLogin = mode === "login";

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");

    const email = formData.email.trim();
    const password = formData.password.trim();

    if (!email || !password) {
      setMessage("Bitte alle Felder ausfüllen.");
      return;
    }

    if (password.length < 6) {
      setMessage("Passwort muss mindestens 6 Zeichen haben.");
      return;
    }

    try {
      setIsLoading(true);

      if (isLogin) {
        await signInWithEmail(email, password);

        setMessage("Login erfolgreich ✔️");

        setTimeout(() => {
          navigate("/");
        }, 800);
      } else {
        await signUpWithEmail(email, password);

        setMessage(
          "Registrierung erfolgreich ✔️ Jetzt einloggen."
        );

        setMode("login");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page-container">
      <div
        className="content-card"
        style={{
          maxWidth: "520px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <h1 className="page-title">
            {isLogin ? "Einloggen" : "Registrieren"}
          </h1>

          <p className="page-description">
            Willkommen bei Worker.
          </p>
        </div>

        {message && (
          <div
            style={{
              marginBottom: "20px",
              padding: "14px",
              borderRadius: "12px",
              background: "#172036",
              border: "1px solid #2f4f88",
              color: "white",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div>
              <label className="form-label">
                E-Mail
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="test@test.de"
              />
            </div>

            <div>
              <label className="form-label">
                Passwort
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Mindestens 6 Zeichen"
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "10px",
              }}
            >
              <button
                type="submit"
                className="task-btn task-btn--primary"
                disabled={isLoading}
              >
                {isLoading
                  ? "Bitte warten..."
                  : isLogin
                  ? "Einloggen"
                  : "Registrieren"}
              </button>

              <button
                type="button"
                className="task-btn"
                onClick={() => {
                  setMessage("");

                  setMode(
                    isLogin ? "register" : "login"
                  );
                }}
              >
                {isLogin
                  ? "Registrieren"
                  : "Zum Login"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}