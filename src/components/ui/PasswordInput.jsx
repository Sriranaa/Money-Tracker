import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import { useLocale } from "../../context/LocaleContext";

export default function PasswordInput({ label, error, className = "", inputClassName = "", ...props }) {
  const { t } = useLocale();
  const generatedId = useId();
  const [isVisible, setIsVisible] = useState(false);
  const inputId = props.id || generatedId;

  return (
    <label className={`block min-w-0 ${className}`} htmlFor={inputId}>
      {label ? <span className="field-label">{label}</span> : null}
      <div className="relative">
        <input
          id={inputId}
          type={isVisible ? "text" : "password"}
          className={`focus-ring min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-900 ${inputClassName}`}
          {...props}
        />
        <button
          type="button"
          className="focus-ring absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label={isVisible ? t("hidePassword") : t("showPassword")}
          onClick={() => setIsVisible((value) => !value)}
        >
          {isVisible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
      {error ? <p className="field-error">{error}</p> : null}
    </label>
  );
}
