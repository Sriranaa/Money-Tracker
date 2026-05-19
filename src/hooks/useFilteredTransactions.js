import { useMemo } from "react";

export function useFilteredTransactions(transactions, searchTerm, sortBy, includeDeleted = false) {
  return useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filtered = transactions
      .filter((transaction) => includeDeleted || transaction.status !== "deleted")
      .filter((transaction) => {
        if (!normalizedSearch) return true;
        return (
          transaction.personName?.toLowerCase().includes(normalizedSearch) ||
          transaction.phone?.toLowerCase().includes(normalizedSearch)
        );
      });

    return filtered.sort((a, b) => {
      if (sortBy === "name") return (a.personName || "").localeCompare(b.personName || "");
      if (sortBy === "interest") return Number(b.interestRate || 0) - Number(a.interestRate || 0);
      if (sortBy === "pending") return Number(b.status === "pending") - Number(a.status === "pending");
      if (sortBy === "completed") return Number(b.status === "completed") - Number(a.status === "completed");
      return new Date(b.transactionDate || 0) - new Date(a.transactionDate || 0);
    });
  }, [transactions, searchTerm, sortBy, includeDeleted]);
}
