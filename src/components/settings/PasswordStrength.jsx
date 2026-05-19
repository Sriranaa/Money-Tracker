import { getPasswordStrength } from "../../utils/validation";
import { useLocale } from "../../context/LocaleContext";

const barColors = ["bg-rose-500", "bg-amber-500", "bg-sky-500", "bg-emerald-500"];

export default function PasswordStrength({ password }) {
  const { t } = useLocale();
  const strength = getPasswordStrength(password);

  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{t("passwordStrength")}</p>
        <p className="text-xs font-black text-slate-700 dark:text-slate-200">{t(strength.labelKey)}</p>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {barColors.map((color, index) => (
          <div
            key={color}
            className={`h-1.5 rounded-full transition ${index < strength.score ? color : "bg-slate-200 dark:bg-slate-800"}`}
          />
        ))}
      </div>
      <p className="mt-2 text-xs font-medium leading-5 text-slate-500 dark:text-slate-400">{t("passwordHint")}</p>
    </div>
  );
}
