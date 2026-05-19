const DAY_IN_MS = 24 * 60 * 60 * 1000;

function toNumber(value) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toDate(value) {
  if (!value) return null;
  if (value?.toDate) return value.toDate();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function startOfLocalDay(value) {
  const date = toDate(value);
  if (!date) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function calculateElapsedDays(transactionDate, asOf = new Date()) {
  const start = startOfLocalDay(transactionDate);
  const end = startOfLocalDay(asOf);
  if (!start || !end) return 0;
  return Math.max(Math.floor((end.getTime() - start.getTime()) / DAY_IN_MS), 0);
}

function getInterestEndDate(transaction, asOf) {
  if (transaction.status === "completed" && transaction.completedAt) return transaction.completedAt;
  if (transaction.status === "deleted" && transaction.deletedAt) return transaction.deletedAt;
  return asOf;
}

export function calculateTransactionFinancials(transaction, asOf = new Date()) {
  const baseAmount = toNumber(transaction.amount);
  const extraBorrowedAmount = toNumber(transaction.extraBorrowedAmount);
  const principalAmount = Math.max(baseAmount + extraBorrowedAmount, 0);
  const monthlyInterestPercent = Math.max(toNumber(transaction.interestRate), 0);
  const paidAmount = Math.max(toNumber(transaction.paidAmount), 0);
  const interestEndDate = getInterestEndDate(transaction, asOf);
  const elapsedDays = calculateElapsedDays(transaction.transactionDate, interestEndDate);
  const monthlyInterestAmount = principalAmount * (monthlyInterestPercent / 100);
  const dailyInterest = monthlyInterestAmount / 30;
  const accumulatedInterest = dailyInterest * elapsedDays;
  const totalPayable = principalAmount + accumulatedInterest;
  const remainingBalance =
    transaction.status === "completed" ? 0 : Math.max(totalPayable - paidAmount, 0);

  return {
    principalAmount,
    monthlyInterestPercent,
    monthlyInterestAmount,
    dailyInterest,
    elapsedDays,
    accumulatedInterest,
    totalPayable,
    paidAmount,
    remainingBalance
  };
}

export function attachFinancials(transaction, asOf = new Date()) {
  const financials = calculateTransactionFinancials(transaction, asOf);
  return {
    ...transaction,
    balance: financials.remainingBalance,
    principalAmount: financials.principalAmount,
    accumulatedInterest: financials.accumulatedInterest,
    totalPayable: financials.totalPayable,
    financials
  };
}
