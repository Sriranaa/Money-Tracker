import { ArrowDownLeft, ArrowUpRight, CalendarDays, Percent } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext";
import { calculateTransactionFinancials } from "../../utils/finance";
import { formatCurrency, formatDate } from "../../utils/formatters";
import Card from "../ui/Card";
import TransactionStatusBadge from "./TransactionStatusBadge";

const incomingDirections = ["incoming", "taken"];

export default function TransactionCard({ transaction }) {
  const { t } = useLocale();
  const isPayable = incomingDirections.includes(transaction.direction);
  const DirectionIcon = isPayable ? ArrowDownLeft : ArrowUpRight;
  const financials = transaction.financials || calculateTransactionFinancials(transaction);

  return (
    <Link to={`/transactions/${transaction.id}`} className="block min-w-0">
      <Card className="group h-full transition hover:-translate-y-0.5 hover:shadow-lift">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                isPayable
                  ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200"
                  : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200"
              }`}
            >
              <DirectionIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-black text-slate-950 dark:text-white">{transaction.personName}</p>
              <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">{transaction.phone}</p>
            </div>
          </div>
          <TransactionStatusBadge status={transaction.status} />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{t("remaining")}</p>
            <p className="mt-1 truncate text-lg font-black text-slate-950 dark:text-white">
              {formatCurrency(financials.remainingBalance)}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{t("interestLabel")}</p>
            <p className="mt-1 flex items-center gap-1 truncate text-sm font-bold text-slate-700 dark:text-slate-200">
              <Percent className="h-4 w-4 shrink-0" aria-hidden="true" />
              {Number(transaction.interestRate || 0)}%
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
          <span className="truncate">
            {t("interestLabel")}: {formatCurrency(financials.accumulatedInterest)}
          </span>
          <span className="truncate text-right">
            {t("totalLabel")}: {formatCurrency(financials.totalPayable)}
          </span>
        </div>
        <div className="mt-4 flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-950 dark:text-slate-300">
          <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{formatDate(transaction.dueDate)}</span>
        </div>
      </Card>
    </Link>
  );
}
