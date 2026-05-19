import { Search } from "lucide-react";
import { useLocale } from "../../context/LocaleContext";
import { SORT_OPTIONS } from "../../utils/constants";
import Select from "../ui/Select";

export default function TransactionFilters({ searchTerm, onSearchChange, sortBy, onSortChange }) {
  const { t } = useLocale();

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
      <label className="relative block min-w-0">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("search")}
          className="focus-ring min-h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </label>
      <Select value={sortBy} onChange={(event) => onSortChange(event.target.value)} aria-label={t("sortBy")}>
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {t(option.labelKey)}
          </option>
        ))}
      </Select>
    </div>
  );
}
