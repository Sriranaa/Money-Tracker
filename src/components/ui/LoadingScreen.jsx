import { brand } from "../../assets/brand";
import { useLocale } from "../../context/LocaleContext";

export default function LoadingScreen() {
  const { t } = useLocale();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-brand-600 text-lg font-black text-white shadow-lift">
          {brand.initials}
        </div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">{t("loadingApp")}</p>
      </div>
    </div>
  );
}
