import { Check, ChevronDown, Globe2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "../../context/LocaleContext";
import { SUPPORTED_LANGUAGES } from "../../utils/constants";

export default function LanguageSwitcher({ className = "" }) {
  const { language, setLanguage, t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const activeLanguage = SUPPORTED_LANGUAGES.find((item) => item.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function chooseLanguage(value) {
    setLanguage(value);
    setIsOpen(false);
  }

  return (
    <div ref={menuRef} className={`relative min-w-0 ${className}`}>
      <button
        type="button"
        className="focus-ring flex min-h-11 w-full min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <Globe2 className="h-4 w-4 shrink-0 text-brand-700 dark:text-brand-100" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-left">{activeLanguage.nativeLabel}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-500 transition dark:text-slate-300 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          role="listbox"
          aria-label={t("language")}
          className="absolute right-0 z-50 mt-2 w-full min-w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-soft dark:border-slate-700 dark:bg-slate-900"
        >
          {SUPPORTED_LANGUAGES.map((item) => {
            const selected = item.code === language;
            return (
              <button
                key={item.code}
                type="button"
                role="option"
                aria-selected={selected}
                className={`focus-ring flex min-h-10 w-full min-w-0 items-center justify-between gap-2 rounded-lg px-3 text-left text-sm font-bold transition ${
                  selected
                    ? "bg-brand-50 text-brand-900 dark:bg-brand-950 dark:text-brand-50"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
                }`}
                onClick={() => chooseLanguage(item.code)}
              >
                <span className="truncate">{item.nativeLabel}</span>
                {selected ? <Check className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
