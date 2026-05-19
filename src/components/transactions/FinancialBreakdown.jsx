import { useLocale } from "../../context/LocaleContext";
import { formatCurrency } from "../../utils/formatters";

export default function FinancialBreakdown({ financials, compact = false }) {
  const { t } = useLocale();
  const items = [
    { label: t("principalAmount"), value: formatCurrency(financials.principalAmount) },
    { label: t("accumulatedInterest"), value: formatCurrency(financials.accumulatedInterest) },
    { label: t("totalPayable"), value: formatCurrency(financials.totalPayable) },
    { label: t("paidAmount"), value: formatCurrency(financials.paidAmount) },
    { label: t("remainingBalance"), value: formatCurrency(financials.remainingBalance), emphasis: true }
  ];

  return (
    <div className={`grid gap-3 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-5"}`}>
      {items.map((item) => (
        <div
          key={item.label}
          className={`min-w-0 rounded-xl p-4 ${
            item.emphasis
              ? "bg-brand-50 text-brand-900 dark:bg-brand-950 dark:text-brand-50"
              : "bg-slate-50 dark:bg-slate-950"
          }`}
        >
          <p className={`text-xs font-bold uppercase tracking-wide ${item.emphasis ? "text-brand-700 dark:text-brand-100" : "text-slate-400"}`}>
            {item.label}
          </p>
          <p className="mt-1 break-words text-base font-black text-slate-950 dark:text-white">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
