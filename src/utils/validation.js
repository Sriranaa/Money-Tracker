import { calculateTransactionFinancials } from "./finance";

export function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return 0;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
}

export function isAdult(dateOfBirth) {
  return calculateAge(dateOfBirth) >= 18;
}

export function normalizePhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length > 10 && phone.trim().startsWith("+")) return phone.trim();
  if (digits.length > 10) return `+${digits}`;
  return phone.trim();
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

export function validatePassword(password) {
  return String(password || "").length >= 8;
}

export function getPasswordStrength(password) {
  const value = String(password || "");
  let score = 0;

  if (value.length >= 8) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value) || value.length >= 12) score += 1;

  const labelKey = score <= 1 ? "weakPassword" : score === 2 ? "fairPassword" : score === 3 ? "goodPassword" : "strongPassword";
  return { score, labelKey, isStrong: score >= 3 };
}

export function validatePasswordUpdate(values, t) {
  const errors = {};
  if (!values.currentPassword) errors.currentPassword = t("currentPasswordRequired");
  if (!values.newPassword) errors.newPassword = t("passwordRequired");
  if (values.newPassword && !validatePassword(values.newPassword)) errors.newPassword = t("passwordLength");
  if (values.newPassword && !getPasswordStrength(values.newPassword).isStrong) errors.newPassword = t("passwordWeak");
  if (!values.confirmPassword) errors.confirmPassword = t("confirmPasswordRequired");
  if (values.newPassword && values.confirmPassword && values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = t("passwordsMustMatch");
  }
  if (values.currentPassword && values.newPassword && values.currentPassword === values.newPassword) {
    errors.newPassword = t("passwordMustBeDifferent");
  }
  return errors;
}

export function validateSetPassword(values, t) {
  const errors = {};
  if (!values.newPassword) errors.newPassword = t("passwordRequired");
  if (values.newPassword && !validatePassword(values.newPassword)) errors.newPassword = t("passwordLength");
  if (values.newPassword && !getPasswordStrength(values.newPassword).isStrong) errors.newPassword = t("passwordWeak");
  if (!values.confirmPassword) errors.confirmPassword = t("confirmPasswordRequired");
  if (values.newPassword && values.confirmPassword && values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = t("passwordsMustMatch");
  }
  return errors;
}

export function validateProfile(values, t) {
  const errors = {};
  if (!values.firstName?.trim()) errors.firstName = t("firstNameRequired");
  if (!values.lastName?.trim()) errors.lastName = t("lastNameRequired");
  if (!values.dateOfBirth) errors.dateOfBirth = t("dobRequired");
  if (values.dateOfBirth && !isAdult(values.dateOfBirth)) errors.dateOfBirth = t("ageRestriction");
  if (!values.mobile?.trim()) errors.mobile = t("mobileRequired");
  if (values.email && !validateEmail(values.email)) errors.email = t("emailInvalid");
  return errors;
}

export function validateRegistration(values, t, method = "email") {
  const errors = validateProfile(values, t);
  if (method === "email") {
    if (!values.email?.trim()) errors.email = t("emailRequired");
    if (!validateEmail(values.email)) errors.email = t("emailInvalid");
    if (!validatePassword(values.password)) errors.password = t("passwordLength");
  }
  if (method === "phone") {
    if (!values.mobile?.trim()) errors.mobile = t("mobileRequired");
    if (!values.email?.trim()) errors.email = t("emailRequired");
    if (!validateEmail(values.email)) errors.email = t("emailInvalid");
    if (!validatePassword(values.password)) errors.password = t("passwordLength");
  }
  return errors;
}

export function validateLogin(values, t, method = "email") {
  const errors = {};
  if (method === "email") {
    if (!validateEmail(values.email)) errors.email = t("emailInvalid");
    if (!values.password) errors.password = t("passwordRequired");
  }
  if (method === "phone" && !values.mobile?.trim()) errors.mobile = t("mobileRequired");
  return errors;
}

export function validateTransaction(values, t) {
  const errors = {};
  const amount = Number(values.amount);
  const interestRate = Number(values.interestRate || 0);
  const paidAmount = Number(values.paidAmount || 0);
  const extraBorrowedAmount = Number(values.extraBorrowedAmount || 0);

  if (!values.personName?.trim()) errors.personName = t("nameRequired");
  if (!values.phone?.trim()) errors.phone = t("mobileRequired");
  if (!amount || amount <= 0) errors.amount = t("amountRequired");
  if (interestRate < 0 || interestRate > 100) errors.interestRate = t("interestInvalid");
  if (!values.transactionDate) errors.transactionDate = t("transactionDateRequired");
  if (!values.dueDate) errors.dueDate = t("dueDateRequired");
  if (values.transactionDate && values.dueDate && new Date(values.dueDate) < new Date(values.transactionDate)) {
    errors.dueDate = t("dueDateInvalid");
  }
  if (paidAmount < 0) errors.paidAmount = t("amountInvalid");
  if (extraBorrowedAmount < 0) errors.extraBorrowedAmount = t("amountInvalid");

  return errors;
}

export function calculateBalance(values) {
  return calculateTransactionFinancials(values).remainingBalance;
}
