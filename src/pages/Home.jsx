import { CheckCircle2, Clock3, IndianRupee, Plus, ReceiptText, WalletCards } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TransactionCard from "../components/transactions/TransactionCard";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import StatCard from "../components/ui/StatCard";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LocaleContext";
import { useTransactions } from "../context/TransactionContext";
import { formatCurrency } from "../utils/formatters";

export default function Home() {
  const { t, language } = useLocale();
  const { profile } = useAuth();
  const { transactions, summary } = useTransactions();
  const navigate = useNavigate();
  const recentTransactions = transactions.filter((item) => item.status !== "deleted").slice(0, 5);
  const dateLocale = language === "hi" ? "hi-IN" : language === "te" ? "te-IN" : "en-IN";

  function goToNewTransaction(category, direction) {
    navigate("/transactions/new", { state: { category, direction } });
  }

  function greetingKey() {
    const hour = new Date().getHours();
    if (hour < 12) return "goodMorning";
    if (hour < 17) return "goodAfternoon";
    return "goodEvening";
  }

  return (
    <div className="page-shell">
      <section className="mb-6">
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
          {new Date().toLocaleDateString(dateLocale, { weekday: "long", day: "2-digit", month: "short" })}
        </p>
        <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">
          {t(greetingKey())}, {profile?.firstName || t("userFallback")} 👋
        </h1>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label={t("totalTransactions")} value={summary.total} icon={ReceiptText} />
        <StatCard label={t("pendingTransactions")} value={summary.pending} icon={Clock3} tone="orange" />
        <StatCard label={t("completedTransactions")} value={summary.completed} icon={CheckCircle2} tone="green" />
        <StatCard label={t("amountToReceive")} value={formatCurrency(summary.amountToReceive)} icon={IndianRupee} tone="brand" />
        <StatCard label={t("amountToPay")} value={formatCurrency(summary.amountToPay)} icon={WalletCards} tone="rose" />
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button size="lg" icon={Plus} onClick={() => goToNewTransaction("interestLoan", "outgoing")}>
          {t("addInterestLoan")}
        </Button>
        <Button size="lg" variant="secondary" icon={Plus} onClick={() => goToNewTransaction("personalLending", "given")}>
          {t("addPersonalLending")}
        </Button>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-black text-slate-950 dark:text-white">{t("recentTransactions")}</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/records")}>
            {t("records")}
          </Button>
        </div>
        {recentTransactions.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recentTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={t("noRecords")}
            description={t("addTransaction")}
            actionLabel={t("addTransaction")}
            onAction={() => navigate("/transactions/new")}
          />
        )}
      </section>
    </div>
  );
}
