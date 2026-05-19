import { NavLink } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext";
import { navItems } from "./navItems";

export default function BottomNav() {
  const { t } = useLocale();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `focus-ring flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-bold transition ${
                  isActive
                    ? "bg-brand-50 text-brand-800 dark:bg-brand-950 dark:text-brand-100"
                    : "text-slate-500 dark:text-slate-400"
                }`
              }
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="max-w-full truncate">{t(item.labelKey)}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
