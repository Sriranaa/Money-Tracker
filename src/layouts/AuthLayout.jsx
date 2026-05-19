import { Link, Outlet } from "react-router-dom";
import { brand } from "../assets/brand";
import LanguageSwitcher from "../components/settings/LanguageSwitcher";
import { useLocale } from "../context/LocaleContext";

export default function AuthLayout() {
  const { t } = useLocale();
  const featureKeys = ["appFeatureTrack", "appFeatureBorrow", "appFeatureProof", "appFeatureReminders"];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto mb-4 flex w-full max-w-6xl justify-end">
        <LanguageSwitcher className="w-40" />
      </div>
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <section className="hidden min-w-0 lg:block">
            <Link to="/" className="mb-10 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-lg font-black text-white shadow-lift">
                {brand.initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-2xl font-black text-slate-950 dark:text-white">{t("appName")}</p>
                <p className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">{t("appTagline")}</p>
              </div>
            </Link>
            <div className="grid gap-4">
              {featureKeys.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white p-5 text-lg font-black text-slate-900 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                >
                  {t(item)}
                </div>
              ))}
            </div>
          </section>
          <section className="mx-auto w-full max-w-xl min-w-0">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}
