import { Bell, LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getInitials } from "../../utils/formatters";
import Button from "../ui/Button";
import { useLocale } from "../../context/LocaleContext";

export default function Topbar() {
  const { profile, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useLocale();
  const initials = getInitials(profile?.firstName, profile?.lastName);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-slate-50/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-500 dark:text-slate-400">{t("appName")}</p>
          <p className="truncate text-base font-black text-slate-950 dark:text-white">
            {profile?.firstName ? `${profile.firstName} ${profile.lastName || ""}` : t("dashboard")}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="focus-ring hidden h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 sm:flex"
            aria-label={t("notifications")}
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            aria-label={t("toggleTheme")}
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-sm font-black text-white dark:bg-white dark:text-slate-950">
            {initials}
          </div>
          <Button className="hidden sm:inline-flex" variant="secondary" size="sm" icon={LogOut} onClick={logout}>
            {t("logout")}
          </Button>
        </div>
      </div>
    </header>
  );
}
