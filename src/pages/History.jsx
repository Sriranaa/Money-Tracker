import { useState } from "react";
import TransactionCard from "../components/transactions/TransactionCard";
import TransactionFilters from "../components/transactions/TransactionFilters";
import EmptyState from "../components/ui/EmptyState";
import { useLocale } from "../context/LocaleContext";
import { useTransactions } from "../context/TransactionContext";
import { useFilteredTransactions } from "../hooks/useFilteredTransactions";

export default function History() {
  const { t } = useLocale();
  const { transactions } = useTransactions();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const historyItems = useFilteredTransactions(transactions, searchTerm, sortBy, true);

  return (
    <div className="page-shell">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-slate-950 dark:text-white">{t("history")}</h1>
        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{t("completed")} · {t("deleted")} · {t("pending")}</p>
      </div>
      <TransactionFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} sortBy={sortBy} onSortChange={setSortBy} />
      <section className="mt-5">
        {historyItems.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {historyItems.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <EmptyState title={t("noRecords")} />
        )}
      </section>
    </div>
  );
}
