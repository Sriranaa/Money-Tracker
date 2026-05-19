import { Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import FirebaseNotice from "../components/settings/FirebaseNotice";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LocaleContext";
import { validateEmail } from "../utils/validation";

export default function ForgotPassword() {
  const { t } = useLocale();
  const { sendPasswordReset, error, firebaseReady } = useAuth();
  const [values, setValues] = useState({ email: "" });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function updateField(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleEmailReset(event) {
    event.preventDefault();
    if (!validateEmail(values.email)) {
      setErrors({ email: t("emailInvalid") });
      return;
    }
    setLoading(true);
    try {
      await sendPasswordReset(values.email);
      setMessage(t("passwordResetSent"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <FirebaseNotice />
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-950 dark:text-white">{t("forgotPassword")}</h1>
        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{t("resetPassword")}</p>
      </div>
      {error ? <Alert type="error" className="mb-4">{error}</Alert> : null}
      {message ? <Alert className="mb-4">{message}</Alert> : null}
      <form className="grid gap-4" onSubmit={handleEmailReset}>
        <Input label={t("email")} type="email" value={values.email} error={errors.email} onChange={(event) => updateField("email", event.target.value)} />
        <Button type="submit" icon={Mail} loading={loading} disabled={!firebaseReady}>
          {t("resetPassword")}
        </Button>
      </form>
      <Link className="mt-6 block text-center text-sm font-black text-brand-700 dark:text-brand-200" to="/login">
        {t("login")}
      </Link>
    </Card>
  );
}
