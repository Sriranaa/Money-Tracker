import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  completeTransaction,
  createTransaction,
  softDeleteTransaction,
  subscribeTransactions,
  updateTransaction
} from "../services/transactionService";
import { attachFinancials } from "../utils/finance";
import { notifyDueTransactions } from "../utils/reminders";
import { useAuth } from "./AuthContext";
import { useLocale } from "./LocaleContext";

const TransactionContext = createContext(null);

function getSummary(transactions) {
  const activeTransactions = transactions.filter((item) => item.status !== "deleted");
  const pending = activeTransactions.filter((item) => item.status === "pending");
  const completed = activeTransactions.filter((item) => item.status === "completed");
  const receivableDirections = ["outgoing", "given"];
  const payableDirections = ["incoming", "taken"];

  return {
    total: activeTransactions.length,
    pending: pending.length,
    completed: completed.length,
    amountToReceive: pending
      .filter((item) => receivableDirections.includes(item.direction))
      .reduce((sum, item) => sum + Number(item.financials?.remainingBalance || item.balance || 0), 0),
    amountToPay: pending
      .filter((item) => payableDirections.includes(item.direction))
      .reduce((sum, item) => sum + Number(item.financials?.remainingBalance || item.balance || 0), 0)
  };
}

export function TransactionProvider({ children }) {
  const { user, firebaseReady } = useAuth();
  const { t } = useLocale();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !firebaseReady) {
      setTransactions([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    const unsubscribe = subscribeTransactions(
      user.uid,
      (items) => {
        const enrichedItems = items.map((item) => attachFinancials(item));
        setTransactions(enrichedItems);
        setLoading(false);
        notifyDueTransactions(enrichedItems, t);
      },
      (currentError) => {
        setError(currentError.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user, firebaseReady, t]);

  const runAction = useCallback(async (action) => {
    setError("");
    try {
      return await action();
    } catch (currentError) {
      setError(currentError.message);
      throw currentError;
    }
  }, []);

  const value = useMemo(
    () => ({
      transactions,
      loading,
      error,
      summary: getSummary(transactions),
      createRecord: (values, files) => runAction(() => createTransaction(user.uid, values, files)),
      updateRecord: (id, values, files, existingProofImages) =>
        runAction(() => updateTransaction(user.uid, id, values, files, existingProofImages)),
      deleteRecord: (id, transaction) => runAction(() => softDeleteTransaction(user.uid, id, transaction)),
      completeRecord: (id, transaction) => runAction(() => completeTransaction(user.uid, id, transaction))
    }),
    [transactions, loading, error, user, runAction]
  );

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) throw new Error("useTransactions must be used inside TransactionProvider");
  return context;
}
