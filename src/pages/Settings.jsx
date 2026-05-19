import { KeyRound, Link2, LogOut, Save } from "lucide-react";
import { useEffect, useState } from "react";
import PasswordStrength from "../components/settings/PasswordStrength";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PasswordInput from "../components/ui/PasswordInput";
import Select from "../components/ui/Select";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LocaleContext";
import { useTheme } from "../context/ThemeContext";
import { SUPPORTED_LANGUAGES, THEMES } from "../utils/constants";
import { validatePasswordUpdate, validateProfile, validateSetPassword } from "../utils/validation";

export default function Settings() {
  const { t, language, setLanguage } = useLocale();
  const { theme, setTheme } = useTheme();
  const {
    user,
    profile,
    updateProfileData,
    updateSettingsData,
    changePassword,
    setPassword,
    linkGoogle,
    logout,
    hasPasswordProvider,
    hasGoogleProvider,
    isGoogleOnlyUser,
    error
  } = useAuth();
  const [profileValues, setProfileValues] = useState({ firstName: "", lastName: "", dateOfBirth: "", mobile: "", email: "" });
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordValues, setPasswordValues] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [emailPasswordValues, setEmailPasswordValues] = useState({ newPassword: "", confirmPassword: "" });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [emailPasswordErrors, setEmailPasswordErrors] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setProfileValues({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        dateOfBirth: profile.dateOfBirth || "",
        mobile: profile.mobile || "",
        email: profile.email || user?.email || ""
      });
    }
  }, [profile, user]);

  function updateProfileField(name, value) {
    setProfileValues((current) => ({ ...current, [name]: value }));
    setProfileErrors((current) => ({ ...current, [name]: "" }));
  }

  function updatePasswordField(name, value) {
    setPasswordValues((current) => ({ ...current, [name]: value }));
    setPasswordErrors((current) => ({ ...current, [name]: "" }));
  }

  function updateSetPasswordField(name, value) {
    setEmailPasswordValues((current) => ({ ...current, [name]: value }));
    setEmailPasswordErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleProfileSave(event) {
    event.preventDefault();
    const nextErrors = validateProfile(profileValues, t);
    setProfileErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    try {
      await updateProfileData(profileValues);
      setMessage(t("updated"));
    } finally {
      setSaving(false);
    }
  }

  async function handleLanguageChange(value) {
    setLanguage(value);
    await updateSettingsData({ language: value, theme });
  }

  async function handleThemeChange(value) {
    setTheme(value);
    await updateSettingsData({ language, theme: value });
  }

  async function handleChangePassword(event) {
    event.preventDefault();
    const nextErrors = validatePasswordUpdate(passwordValues, t);
    setPasswordErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    try {
      await changePassword(passwordValues.currentPassword, passwordValues.newPassword);
      setPasswordValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage(t("passwordUpdated"));
    } finally {
      setSaving(false);
    }
  }

  async function handleSetPassword(event) {
    event.preventDefault();
    const nextErrors = validateSetPassword(emailPasswordValues, t);
    setEmailPasswordErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    try {
      await setPassword(emailPasswordValues.newPassword);
      setEmailPasswordValues({ newPassword: "", confirmPassword: "" });
      setMessage(t("passwordSetSuccess"));
    } finally {
      setSaving(false);
    }
  }

  async function handleLinkGoogle() {
    setSaving(true);
    try {
      await linkGoogle();
      setMessage(t("updated"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-shell">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-slate-950 dark:text-white">{t("settings")}</h1>
        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
          {t("profile")} · {t("language")} · {t("theme")}
        </p>
      </div>
      {error ? (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      ) : null}
      {message ? <Alert className="mb-4">{message}</Alert> : null}

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <Card>
          <h2 className="mb-4 text-lg font-black text-slate-950 dark:text-white">{t("profile")}</h2>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleProfileSave}>
            <Input
              label={t("firstName")}
              value={profileValues.firstName}
              error={profileErrors.firstName}
              onChange={(event) => updateProfileField("firstName", event.target.value)}
            />
            <Input
              label={t("lastName")}
              value={profileValues.lastName}
              error={profileErrors.lastName}
              onChange={(event) => updateProfileField("lastName", event.target.value)}
            />
            <Input
              label={t("dateOfBirth")}
              type="date"
              value={profileValues.dateOfBirth}
              error={profileErrors.dateOfBirth}
              onChange={(event) => updateProfileField("dateOfBirth", event.target.value)}
            />
            <Input
              label={t("mobile")}
              type="tel"
              value={profileValues.mobile}
              error={profileErrors.mobile}
              onChange={(event) => updateProfileField("mobile", event.target.value)}
            />
            <Input
              label={t("email")}
              type="email"
              value={profileValues.email}
              error={profileErrors.email}
              onChange={(event) => updateProfileField("email", event.target.value)}
            />
            <div className="flex items-end">
              <Button type="submit" icon={Save} loading={saving} className="w-full">
                {t("save")}
              </Button>
            </div>
          </form>
        </Card>

        <div className="grid h-fit gap-5">
          <Card className="grid gap-4">
            <h2 className="text-lg font-black text-slate-950 dark:text-white">{t("language")}</h2>
            <Select value={language} onChange={(event) => handleLanguageChange(event.target.value)}>
              {SUPPORTED_LANGUAGES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.nativeLabel}
                </option>
              ))}
            </Select>
            <h2 className="text-lg font-black text-slate-950 dark:text-white">{t("theme")}</h2>
            <Select value={theme} onChange={(event) => handleThemeChange(event.target.value)}>
              {THEMES.map((item) => (
                <option key={item.value} value={item.value}>
                  {t(item.labelKey)}
                </option>
              ))}
            </Select>
          </Card>

          {isGoogleOnlyUser ? (
            <Card>
              <div className="mb-4">
                <h2 className="text-lg font-black text-slate-950 dark:text-white">{t("enableEmailPasswordLogin")}</h2>
                <p className="mt-1 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                  {t("enableEmailPasswordSubtitle")}
                </p>
              </div>
              <form className="grid gap-3" onSubmit={handleSetPassword}>
                <PasswordInput
                  label={t("newPassword")}
                  autoComplete="new-password"
                  value={emailPasswordValues.newPassword}
                  error={emailPasswordErrors.newPassword}
                  onChange={(event) => updateSetPasswordField("newPassword", event.target.value)}
                />
                <PasswordInput
                  label={t("confirmPassword")}
                  autoComplete="new-password"
                  value={emailPasswordValues.confirmPassword}
                  error={emailPasswordErrors.confirmPassword}
                  onChange={(event) => updateSetPasswordField("confirmPassword", event.target.value)}
                />
                <PasswordStrength password={emailPasswordValues.newPassword} />
                <Button type="submit" icon={KeyRound} loading={saving}>
                  {t("setPassword")}
                </Button>
              </form>
            </Card>
          ) : null}

          {hasPasswordProvider ? (
            <Card>
              <div className="mb-4">
                <h2 className="text-lg font-black text-slate-950 dark:text-white">{t("changePassword")}</h2>
                <p className="mt-1 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                  {t("changePasswordSubtitle")}
                </p>
              </div>
              <form className="grid gap-3" onSubmit={handleChangePassword}>
                <PasswordInput
                  label={t("currentPassword")}
                  autoComplete="current-password"
                  value={passwordValues.currentPassword}
                  error={passwordErrors.currentPassword}
                  onChange={(event) => updatePasswordField("currentPassword", event.target.value)}
                />
                <PasswordInput
                  label={t("newPassword")}
                  autoComplete="new-password"
                  value={passwordValues.newPassword}
                  error={passwordErrors.newPassword}
                  onChange={(event) => updatePasswordField("newPassword", event.target.value)}
                />
                <PasswordInput
                  label={t("confirmNewPassword")}
                  autoComplete="new-password"
                  value={passwordValues.confirmPassword}
                  error={passwordErrors.confirmPassword}
                  onChange={(event) => updatePasswordField("confirmPassword", event.target.value)}
                />
                <PasswordStrength password={passwordValues.newPassword} />
                <Button type="submit" icon={KeyRound} loading={saving}>
                  {t("changePassword")}
                </Button>
              </form>
            </Card>
          ) : null}

          <Card className="grid gap-3">
            {!hasGoogleProvider ? (
              <Button variant="secondary" icon={Link2} loading={saving} onClick={handleLinkGoogle}>
                {t("linkGoogle")}
              </Button>
            ) : null}
            <Button variant="danger" icon={LogOut} onClick={logout}>
              {t("logout")}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
