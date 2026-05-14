import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { isEmail, minLength } from "../../utils/validators";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Input from "../ui/Input";

export default function AuthForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || "/";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!isEmail(form.email)) {
      nextErrors.email = "Bitte eine gültige E-Mail eingeben.";
    }

    if (!minLength(form.password, 6)) {
      nextErrors.password = "Passwort muss mindestens 6 Zeichen haben.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    const result = await signIn(form);

    if (result.error) {
      setSubmitError(result.error.message || "Login fehlgeschlagen.");
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate(redirectTo, { replace: true });
  };

  return (
    <Card title="Anmelden" className="auth-card">
      <form className="form" onSubmit={handleSubmit}>
        <Input
          label="E-Mail"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="name@firma.de"
          error={errors.email}
        />

        <Input
          label="Passwort"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.password}
        />

        {submitError ? <p className="form-error form-error--block">{submitError}</p> : null}

        <Button type="submit" disabled={loading}>
          {loading ? "Melde an..." : "Einloggen"}
        </Button>
      </form>
    </Card>
  );
}