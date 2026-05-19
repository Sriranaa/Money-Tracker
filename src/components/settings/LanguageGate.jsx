import { useState } from "react";
import { brand } from "../../assets/brand";
import { useLocale } from "../../context/LocaleContext";
import { SUPPORTED_LANGUAGES } from "../../utils/constants";
import Button from "../ui/Button";
import Card from "../ui/Card";

export default function LanguageGate() {
  const { language, setLanguage, t } = useLocale();
  const [selected, setSelected] = useState(language);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <Card className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-base font-black text-white">
            {brand.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-black text-slate-950 dark:text-white">{t("appName")}</p>
            <p className="truncate text-sm text-slate-500 dark:text-slate-400">{t("appTagline")}</p>
          </div>
        </div>
        <h1 className="text-2xl font-black text-slate-950 dark:text-white">{t("chooseLanguage")}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{t("chooseLanguageSubtitle")}</p>
        <div className="mt-6 grid gap-3">
          {SUPPORTED_LANGUAGES.map((item) => (
            <button
              key={item.code}
              type="button"
              className={`focus-ring flex min-h-14 items-center justify-between rounded-xl border px-4 text-left transition ${
                selected === item.code
                  ? "border-brand-500 bg-brand-50 text-brand-900 dark:border-brand-400 dark:bg-brand-950 dark:text-brand-50"
                  : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              }`}
              onClick={() => setSelected(item.code)}
            >
              <span className="font-bold">{item.nativeLabel}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">{item.label}</span>
            </button>
          ))}
        </div>
        <Button className="mt-6 w-full" onClick={() => setLanguage(selected)}>
          {t("continue")}
        </Button>
      </Card>
    </div>
  );
}
