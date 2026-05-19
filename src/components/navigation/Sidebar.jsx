import { NavLink } from "react-router-dom";
import { brand } from "../../assets/brand";
import { useLocale } from "../../context/LocaleContext";
import { navItems } from "./navItems";

export default function Sidebar() {
  const { t } = useLocale();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-950 lg:block">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-base font-black text-white shadow-lift">
          {brand.initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-black text-slate-950 dark:text-white">{brand.name}</p>
          <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">{brand.tagline}</p>
        </div>
      </div>
      <nav className="grid gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `focus-ring flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-bold transition ${
                  isActive
                    ? "bg-brand-50 text-brand-800 dark:bg-brand-950 dark:text-brand-100"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="truncate">{t(item.labelKey)}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
