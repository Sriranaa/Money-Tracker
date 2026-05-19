import { CheckCircle2, Edit3, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import FinancialBreakdown from "../components/transactions/FinancialBreakdown";
import ReminderActions from "../components/transactions/ReminderActions";
import TransactionStatusBadge from "../components/transactions/TransactionStatusBadge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import { useLocale } from "../context/LocaleContext";
import { useTransactions } from "../context/TransactionContext";
import { TRANSACTION_TYPES } from "../utils/constants";
import { calculateTransactionFinancials } from "../utils/finance";
import { formatCurrency, formatDate } from "../utils/formatters";

export default function TransactionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLocale();
  const { transactions, completeRecord, deleteRecord } = useTransactions();
  const transaction = transactions.find((item) => item.id === id);

  if (!transaction) {
    return (
      <div className="page-shell">
        <EmptyState title={t("noRecords")} actionLabel={t("records")} onAction={() => navigate("/records")} />
      </div>
    );
  }

  const typeLabel = TRANSACTION_TYPES.find((item) => item.value === transaction.category)?.labelKey || "records";
  const directionLabel =
    TRANSACTION_TYPES.flatMap((item) => item.directions).find((item) => item.value === transaction.direction)?.labelKey || "records";
  const financials = transaction.financials || calculateTransactionFinancials(transaction);

  async function handleComplete() {
    await completeRecord(transaction.id, transaction);
  }

  async function handleDelete() {
    if (window.confirm(t("deleteConfirm"))) {
      await deleteRecord(transaction.id, transaction);
      navigate("/records");
    }
  }

  return (
    <div className="page-shell">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2">
            <TransactionStatusBadge status={transaction.status} />
          </div>
          <h1 className="truncate text-2xl font-black text-slate-950 dark:text-white">{transaction.personName}</h1>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            {t(typeLabel)} · {t(directionLabel)}
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <Button variant="secondary" icon={Edit3} onClick={() => navigate(`/transactions/${transaction.id}/edit`)}>
            {t("editTransaction")}
          </Button>
          <Button variant="secondary" icon={CheckCircle2} disabled={transaction.status === "completed"} onClick={handleComplete}>
            {t("markCompleted")}
          </Button>
          <Button variant="danger" icon={Trash2} disabled={transaction.status === "deleted"} onClick={handleDelete}>
            {t("delete")}
          </Button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card className="grid gap-5">
          <FinancialBreakdown financials={financials} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [t("amount"), formatCurrency(transaction.amount)],
              [t("interest"), `${Number(transaction.interestRate || 0)}%`],
              [t("extraBorrowedAmount"), formatCurrency(transaction.extraBorrowedAmount)],
              [t("elapsedDays"), financials.elapsedDays],
              [t("dueDate"), formatDate(transaction.dueDate)],
              [t("transactionDate"), formatDate(transaction.transactionDate)],
              [t("mobile"), transaction.phone]
            ].map(([label, value]) => (
              <div key={label} className="min-w-0 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
                <p className="mt-1 break-words text-base font-black text-slate-950 dark:text-white">{value}</p>
              </div>
            ))}
          </div>
          {transaction.notes ? (
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{t("notes")}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-200">{transaction.notes}</p>
            </div>
          ) : null}
          {transaction.proofImages?.length ? (
            <div>
              <p className="field-label">{t("proofUpload")}</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {transaction.proofImages.map((image) => (
                  <a
                    key={image.url}
                    href={image.url}
                    target="_blank"
                    rel="noreferrer"
                    className="aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <img src={image.url} alt={image.name || t("proofImage")} className="h-full w-full object-cover" />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </Card>

        <div className="grid h-fit gap-4">
          <Card>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{t("remainingBalance")}</p>
            <p className="mt-2 break-words text-3xl font-black text-slate-950 dark:text-white">
              {formatCurrency(financials.remainingBalance)}
            </p>
            <p className="mt-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              {t("accumulatedInterest")}: {formatCurrency(financials.accumulatedInterest)}
            </p>
          </Card>
          <Card className="grid gap-3">
            <ReminderActions transaction={{ ...transaction, balance: financials.remainingBalance }} />
          </Card>
        </div>
      </div>
    </div>
  );
}
