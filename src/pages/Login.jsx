import { Chrome, KeyRound, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FirebaseNotice from "../components/settings/FirebaseNotice";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PasswordInput from "../components/ui/PasswordInput";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LocaleContext";
import { validateLogin } from "../utils/validation";

export default function Login() {
  const { t } = useLocale();
  const { loginEmail, loginGoogle, completeGoogleLink, error, firebaseReady } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: "", password: "" });
  const [googleLink, setGoogleLink] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || "/";

  function updateField(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleEmailLogin(event) {
    event.preventDefault();
    const nextErrors = validateLogin(values, t, "email");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    try {
      await loginEmail(values);
      navigate(from, { replace: true });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      await loginGoogle();
      navigate(from, { replace: true });
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
      navigate(from, { replace: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <FirebaseNotice />
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-950 dark:text-white">{t("login")}</h1>
        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{t("appName")}</p>
      </div>
      {error ? <Alert type="error" className="mb-4">{error}</Alert> : null}
      <form className="grid gap-4" onSubmit={handleEmailLogin}>
        <Input
          label={t("email")}
          type="email"
          autoComplete="email"
          value={values.email}
          error={errors.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
        <PasswordInput
          label={t("password")}
          autoComplete="current-password"
          value={values.password}
          error={errors.password}
          onChange={(event) => updateField("password", event.target.value)}
        />
        <div className="flex justify-end">
          <Link className="text-sm font-bold text-brand-700 hover:text-brand-900 dark:text-brand-200" to="/forgot-password">
            {t("forgotPassword")}
          </Link>
        </div>
        <Button type="submit" icon={LogIn} loading={loading} disabled={!firebaseReady}>
          {t("login")}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        <span className="text-xs font-bold uppercase text-slate-400">{t("or")}</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>
      <Button variant="secondary" icon={Chrome} className="w-full" loading={loading} disabled={!firebaseReady} onClick={handleGoogleLogin}>
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
        {t("newHere")}{" "}
        <Link className="font-black text-brand-700 dark:text-brand-200" to="/register">
          {t("createAccount")}
        </Link>
      </p>
    </Card>
  );
}
