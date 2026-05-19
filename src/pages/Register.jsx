import { Chrome, KeyRound, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FirebaseNotice from "../components/settings/FirebaseNotice";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PasswordInput from "../components/ui/PasswordInput";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LocaleContext";
import { validateProfile, validateRegistration } from "../utils/validation";

const initialValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  mobile: "",
  email: "",
  password: ""
};

export default function Register() {
  const { t } = useLocale();
  const { registerEmail, loginGoogle, completeGoogleLink, error, firebaseReady } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [googleLink, setGoogleLink] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function updateField(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  function profileFields() {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label={t("firstName")} value={values.firstName} error={errors.firstName} onChange={(event) => updateField("firstName", event.target.value)} />
        <Input label={t("lastName")} value={values.lastName} error={errors.lastName} onChange={(event) => updateField("lastName", event.target.value)} />
        <Input label={t("dateOfBirth")} type="date" value={values.dateOfBirth} error={errors.dateOfBirth} onChange={(event) => updateField("dateOfBirth", event.target.value)} />
        <Input label={t("mobile")} type="tel" value={values.mobile} error={errors.mobile} onChange={(event) => updateField("mobile", event.target.value)} />
      </div>
    );
  }

  async function handleEmailRegister(event) {
    event.preventDefault();
    const nextErrors = validateRegistration(values, t, "email");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    try {
      await registerEmail(values);
      navigate("/", { replace: true });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleRegister() {
    const nextErrors = validateProfile(values, t);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    try {
      await loginGoogle(values);
      navigate("/", { replace: true });
    } catch (currentError) {
      if (currentError.code === "auth/google-link-password-required") {
        setGoogleLink({ email: currentError.email || "", password: "" });
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteGoogleLink(event) {
    event.preventDefault();
    if (!googleLink.password) {
      setErrors({ googleLinkPassword: t("passwordRequired") });
      return;
    }
    setLoading(true);
    try {
      await completeGoogleLink(googleLink.password);
      navigate("/", { replace: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <FirebaseNotice />
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-950 dark:text-white">{t("register")}</h1>
        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{t("appName")}</p>
      </div>
      {error ? <Alert type="error" className="mb-4">{error}</Alert> : null}
      <form className="grid gap-4" onSubmit={handleEmailRegister}>
        {profileFields()}
        <Input label={t("email")} type="email" value={values.email} error={errors.email} onChange={(event) => updateField("email", event.target.value)} />
        <PasswordInput
          label={t("password")}
          autoComplete="new-password"
          value={values.password}
          error={errors.password}
          onChange={(event) => updateField("password", event.target.value)}
        />
        <Button type="submit" icon={UserPlus} loading={loading} disabled={!firebaseReady}>
          {t("register")}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        <span className="text-xs font-bold uppercase text-slate-400">{t("or")}</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>
      <Button variant="secondary" icon={Chrome} className="w-full" loading={loading} disabled={!firebaseReady} onClick={handleGoogleRegister}>
        {t("googleLogin")}
      </Button>
      {googleLink.email ? (
        <form className="mt-4 grid gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950" onSubmit={handleCompleteGoogleLink}>
          <p className="text-sm font-bold text-amber-800 dark:text-amber-100">
            {t("googleLinkPrompt").replace("{email}", googleLink.email)}
          </p>
          <PasswordInput
            label={t("password")}
            autoComplete="current-password"
            value={googleLink.password}
            error={errors.googleLinkPassword}
            onChange={(event) => {
              setGoogleLink((current) => ({ ...current, password: event.target.value }));
              setErrors((current) => ({ ...current, googleLinkPassword: "" }));
            }}
          />
          <Button type="submit" icon={KeyRound} loading={loading}>
            {t("linkGoogle")}
          </Button>
        </form>
      ) : null}
      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        {t("alreadyHaveAccount")}{" "}
        <Link className="font-black text-brand-700 dark:text-brand-200" to="/login">
          {t("login")}
        </Link>
      </p>
    </Card>
  );
}
