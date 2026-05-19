import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";
import { db } from "../firebase/config";
import { uploadProofImages } from "./cloudinaryService";
import { calculateTransactionFinancials } from "../utils/finance";

function requireDb() {
  if (!db) throw new Error("Firebase is not configured.");
  return db;
}

function transactionsRef(uid) {
  return collection(requireDb(), "users", uid, "transactions");
}

function historyRef(uid) {
  return collection(requireDb(), "users", uid, "history");
}

function transactionDoc(uid, id) {
  return doc(requireDb(), "users", uid, "transactions", id);
}

export function subscribeTransactions(uid, callback, onError) {
  const transactionQuery = query(transactionsRef(uid), orderBy("createdAt", "desc"));
  return onSnapshot(
    transactionQuery,
    (snapshot) => {
      callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    },
    onError
  );
}

function toTransactionPayload(values, proofImages = []) {
  const amount = Number(values.amount || 0);
  const interestRate = Number(values.interestRate || 0);
  const paidAmount = Number(values.paidAmount || 0);
  const extraBorrowedAmount = Number(values.extraBorrowedAmount || 0);
  const financials = calculateTransactionFinancials({
    ...values,
    amount,
    interestRate,
    paidAmount,
    extraBorrowedAmount
  });
  return {
    personName: values.personName.trim(),
    phone: values.phone.trim(),
    amount,
    interestRate,
    transactionDate: values.transactionDate,
    dueDate: values.dueDate,
    category: values.category,
    direction: values.direction,
    reminderSms: Boolean(values.reminderSms),
    reminderWhatsapp: Boolean(values.reminderWhatsapp),
    paidAmount,
    extraBorrowedAmount,
    principalAmount: financials.principalAmount,
    accumulatedInterest: financials.accumulatedInterest,
    totalPayable: financials.totalPayable,
    balance: financials.remainingBalance,
    elapsedDays: financials.elapsedDays,
    notes: values.notes?.trim() || "",
    proofImages,
    status: values.status || "pending",
    updatedAt: serverTimestamp()
  };
}

export async function createTransaction(uid, values, files = []) {
  const proofImages = await uploadProofImages(files);
  const payload = {
    ...toTransactionPayload(values, proofImages),
    createdAt: serverTimestamp()
  };
  const created = await addDoc(transactionsRef(uid), payload);
  await addDoc(historyRef(uid), {
    transactionId: created.id,
    action: "created",
    snapshot: payload,
    createdAt: serverTimestamp()
  });
  return created.id;
}

export async function updateTransaction(uid, transactionId, values, files = [], existingProofImages = []) {
  const newProofImages = files.length ? await uploadProofImages(files) : [];
  const proofImages = [...existingProofImages, ...newProofImages].slice(0, 3);
  const payload = toTransactionPayload(values, proofImages);
  const batch = writeBatch(requireDb());
  batch.update(transactionDoc(uid, transactionId), payload);
  batch.set(doc(historyRef(uid)), {
    transactionId,
    action: "updated",
    snapshot: payload,
    createdAt: serverTimestamp()
  });
  await batch.commit();
}

export async function softDeleteTransaction(uid, transactionId, transaction) {
  const payload = {
    status: "deleted",
    deletedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const batch = writeBatch(requireDb());
  batch.update(transactionDoc(uid, transactionId), payload);
  batch.set(doc(historyRef(uid)), {
    transactionId,
    action: "deleted",
    snapshot: { ...transaction, ...payload },
    createdAt: serverTimestamp()
  });
  await batch.commit();
}

export async function completeTransaction(uid, transactionId, transaction) {
  const financials = calculateTransactionFinancials({ ...transaction, status: "pending" });
  const payload = {
    status: "completed",
    paidAmount: financials.totalPayable,
    principalAmount: financials.principalAmount,
    accumulatedInterest: financials.accumulatedInterest,
    totalPayable: financials.totalPayable,
    balance: 0,
    elapsedDays: financials.elapsedDays,
    completedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const batch = writeBatch(requireDb());
  batch.update(transactionDoc(uid, transactionId), payload);
  batch.set(doc(historyRef(uid)), {
    transactionId,
    action: "completed",
    snapshot: { ...transaction, ...payload },
    createdAt: serverTimestamp()
  });
  await batch.commit();
}
