import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionCard from "../components/transactions/TransactionCard";
import TransactionFilters from "../components/transactions/TransactionFilters";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Tabs from "../components/ui/Tabs";
import { useLocale } from "../context/LocaleContext";
import { useTransactions } from "../context/TransactionContext";
import { useFilteredTransactions } from "../hooks/useFilteredTransactions";
import { TRANSACTION_TYPES } from "../utils/constants";

export default function Records() {
  const { t } = useLocale();
  const { transactions } = useTransactions();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [category, setCategory] = useState("interestLoan");
  const [direction, setDirection] = useState("all");
  const activeTransactions = useFilteredTransactions(transactions, searchTerm, sortBy, false);
  const categoryConfig = TRANSACTION_TYPES.find((item) => item.value === category);

  const visibleTransactions = useMemo(() => {
    return activeTransactions.filter((transaction) => {
      const categoryMatch = transaction.category === category;
      const directionMatch = direction === "all" || transaction.direction === direction;
      return categoryMatch && directionMatch;
    });
  }, [activeTransactions, category, direction]);

  function handleCategoryChange(nextCategory) {
    setCategory(nextCategory);
    setDirection("all");
  }

  return (
    <div className="page-shell">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-black text-slate-950 dark:text-white">{t("records")}</h1>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{t("interestLoans")} · {t("personalLending")}</p>
        </div>
        <Button icon={Plus} onClick={() => navigate("/transactions/new")}>
          {t("addTransaction")}
        </Button>
      </div>

      <div className="grid gap-4">
        <Tabs
          active={category}
          onChange={handleCategoryChange}
          tabs={TRANSACTION_TYPES.map((item) => ({ value: item.value, label: t(item.labelKey) }))}
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            className={`focus-ring shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
              direction === "all"
                ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                : "bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-300"
            }`}
            onClick={() => setDirection("all")}
          >
            {t("all")}
          </button>
          {categoryConfig.directions.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`focus-ring shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                direction === item.value
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-300"
              }`}
              onClick={() => setDirection(item.value)}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </div>
        <TransactionFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} sortBy={sortBy} onSortChange={setSortBy} />
      </div>

      <section className="mt-5">
        {visibleTransactions.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <EmptyState title={t("noRecords")} actionLabel={t("addTransaction")} onAction={() => navigate("/transactions/new")} />
        )}
      </section>
    </div>
  );
}
