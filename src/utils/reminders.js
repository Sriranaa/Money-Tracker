import { formatCurrency, formatDate } from "./formatters";

export function isDueToday(transaction) {
  if (!transaction?.dueDate || transaction.status !== "pending") return false;
  const due = new Date(transaction.dueDate);
  const today = new Date();
  return (
    due.getFullYear() === today.getFullYear() &&
    due.getMonth() === today.getMonth() &&
    due.getDate() === today.getDate()
  );
}

function fillTemplate(template, values) {
  return Object.entries(values).reduce((message, [key, value]) => message.replaceAll(`{${key}}`, value), template);
}

export function buildReminderMessage(transaction, t) {
  const translate = t || ((key) => {
    const fallback = {
      reminderFriend: "friend",
      reminderMessage: "Hi {name}, this is a reminder for {amount}, due on {dueDate}. Please update repayment when possible.",
      reminderMessageWithInterest:
        "Hi {name}, this is a reminder for {amount} with {interest}% interest, due on {dueDate}. Please update repayment when possible."
    };
    return fallback[key] || key;
  });
  const name = transaction.personName || translate("reminderFriend");
  const amount = formatCurrency(transaction.balance || transaction.amount);
  const interest = Number(transaction.interestRate || 0);
  const dueDate = formatDate(transaction.dueDate);
  const template = interest ? translate("reminderMessageWithInterest") : translate("reminderMessage");
  return fillTemplate(template, { name, amount, interest, dueDate });
}

export function createSmsLink(transaction, t) {
  const phone = String(transaction.phone || "").replace(/\D/g, "");
  return `sms:${phone}?&body=${encodeURIComponent(buildReminderMessage(transaction, t))}`;
}

export function createWhatsAppLink(transaction, t) {
  const phone = String(transaction.phone || "").replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(buildReminderMessage(transaction, t))}`;
}

export async function notifyDueTransactions(transactions, t) {
  if (!("Notification" in window)) return;
  const dueTransactions = transactions.filter(isDueToday);
  if (!dueTransactions.length) return;

  const permission = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
  if (permission !== "granted") return;

  dueTransactions.slice(0, 3).forEach((transaction) => {
    new Notification(t ? t("repaymentDueToday") : "Repayment due today", {
      body: buildReminderMessage(transaction, t),
      tag: `transaction-${transaction.id}`
    });
  });
}
