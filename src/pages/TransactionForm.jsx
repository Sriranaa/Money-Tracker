import { Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FinancialBreakdown from "../components/transactions/FinancialBreakdown";
import ProofUploader from "../components/transactions/ProofUploader";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Textarea from "../components/ui/Textarea";
import Toggle from "../components/ui/Toggle";
import { useLocale } from "../context/LocaleContext";
import { useTransactions } from "../context/TransactionContext";
import { INITIAL_TRANSACTION_FORM, TRANSACTION_TYPES } from "../utils/constants";
import { formatCurrency, formatDateInput } from "../utils/formatters";
import { calculateTransactionFinancials } from "../utils/finance";
import { validateTransaction } from "../utils/validation";

export default function TransactionForm() {
  const { t } = useLocale();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { transactions, createRecord, updateRecord, error } = useTransactions();
  const existingTransaction = transactions.find((item) => item.id === id);
  const [values, setValues] = useState(() => ({
    ...INITIAL_TRANSACTION_FORM,
    ...location.state
  }));
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (existingTransaction) {
      setValues({
        personName: existingTransaction.personName || "",
        phone: existingTransaction.phone || "",
        amount: existingTransaction.amount || "",
        interestRate: existingTransaction.interestRate || "",
        transactionDate: formatDateInput(existingTransaction.transactionDate),
        dueDate: formatDateInput(existingTransaction.dueDate),
        category: existingTransaction.category || "interestLoan",
        direction: existingTransaction.direction || "outgoing",
        reminderSms: Boolean(existingTransaction.reminderSms),
        reminderWhatsapp: Boolean(existingTransaction.reminderWhatsapp),
        paidAmount: existingTransaction.paidAmount || "",
        extraBorrowedAmount: existingTransaction.extraBorrowedAmount || "",
        notes: existingTransaction.notes || "",
        status: existingTransaction.status || "pending"
      });
    }
  }, [existingTransaction]);

  const currentType = useMemo(
    () => TRANSACTION_TYPES.find((item) => item.value === values.category) || TRANSACTION_TYPES[0],
    [values.category]
  );
  const financials = useMemo(() => calculateTransactionFinancials(values), [values]);

  function updateField(name, value) {
    setValues((current) => {
      const next = { ...current, [name]: value };
      if (name === "category") {
        next.direction = TRANSACTION_TYPES.find((item) => item.value === value)?.directions[0].value || "outgoing";
      }
      return next;
    });
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateTransaction(values, t);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    try {
      if (isEditing) {
        await updateRecord(id, values, files, existingTransaction?.proofImages || []);
        navigate(`/transactions/${id}`);
      } else {
        const createdId = await createRecord(values, files);
        navigate(`/transactions/${createdId}`);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-shell">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-slate-950 dark:text-white">{isEditing ? t("editTransaction") : t("addTransaction")}</h1>
        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{t(values.category === "interestLoan" ? "interestLoans" : "personalLending")}</p>
      </div>
      {error ? <Alert type="error" className="mb-4">{error}</Alert> : null}
      <form className="grid gap-5 xl:grid-cols-[1fr_360px]" onSubmit={handleSubmit}>
        <Card className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={t("borrowerLenderName")} value={values.personName} error={errors.personName} onChange={(event) => updateField("personName", event.target.value)} />
            <Input label={t("mobile")} type="tel" value={values.phone} error={errors.phone} onChange={(event) => updateField("phone", event.target.value)} />
            <Input label={t("amount")} type="number" min="0" inputMode="decimal" value={values.amount} error={errors.amount} onChange={(event) => updateField("amount", event.target.value)} />
            <Input label={t("interest")} type="number" min="0" max="100" inputMode="decimal" value={values.interestRate} error={errors.interestRate} onChange={(event) => updateField("interestRate", event.target.value)} />
            <Input label={t("transactionDate")} type="date" value={values.transactionDate} error={errors.transactionDate} onChange={(event) => updateField("transactionDate", event.target.value)} />
            <Input label={t("dueDate")} type="date" value={values.dueDate} error={errors.dueDate} onChange={(event) => updateField("dueDate", event.target.value)} />
            <Select label={t("transactionCategory")} value={values.category} onChange={(event) => updateField("category", event.target.value)}>
              {TRANSACTION_TYPES.map((item) => (
                <option key={item.value} value={item.value}>
                  {t(item.labelKey)}
                </option>
              ))}
            </Select>
            <Select label={t("loanDirection")} value={values.direction} onChange={(event) => updateField("direction", event.target.value)}>
              {currentType.directions.map((item) => (
                <option key={item.value} value={item.value}>
                  {t(item.labelKey)}
                </option>
              ))}
            </Select>
            <Input label={t("paidAmount")} type="number" min="0" value={values.paidAmount} error={errors.paidAmount} onChange={(event) => updateField("paidAmount", event.target.value)} />
            <Input label={t("extraBorrowedAmount")} type="number" min="0" value={values.extraBorrowedAmount} error={errors.extraBorrowedAmount} onChange={(event) => updateField("extraBorrowedAmount", event.target.value)} />
          </div>
          <Textarea label={t("notes")} value={values.notes} onChange={(event) => updateField("notes", event.target.value)} />
          <ProofUploader files={files} setFiles={setFiles} existingImages={existingTransaction?.proofImages || []} />
        </Card>

        <div className="grid h-fit gap-4">
          <Card>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{t("remainingBalance")}</p>
            <p className="mt-2 break-words text-3xl font-black text-slate-950 dark:text-white">{formatCurrency(financials.remainingBalance)}</p>
            <p className="mt-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              {t("accumulatedInterest")}: {formatCurrency(financials.accumulatedInterest)}
            </p>
          </Card>
          <Card>
            <FinancialBreakdown financials={financials} compact />
          </Card>
          <Card className="grid gap-3">
            <Toggle label={t("smsReminder")} checked={values.reminderSms} onChange={(checked) => updateField("reminderSms", checked)} />
            <Toggle label={t("whatsappReminder")} checked={values.reminderWhatsapp} onChange={(checked) => updateField("reminderWhatsapp", checked)} />
          </Card>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <Button type="submit" icon={Save} loading={saving}>
              {isEditing ? t("update") : t("save")}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              {t("cancel")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
