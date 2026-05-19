export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "te", label: "Telugu", nativeLabel: "తెలుగు" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" }
];

export const THEMES = [
  { value: "system", labelKey: "themeSystem" },
  { value: "light", labelKey: "themeLight" },
  { value: "dark", labelKey: "themeDark" }
];

export const TRANSACTION_STATUS = {
  pending: "pending",
  completed: "completed",
  deleted: "deleted"
};

export const TRANSACTION_TYPES = [
  {
    value: "interestLoan",
    labelKey: "interestLoans",
    directions: [
      { value: "outgoing", labelKey: "outgoingLoanGiven" },
      { value: "incoming", labelKey: "incomingLoanTaken" }
    ]
  },
  {
    value: "personalLending",
    labelKey: "personalLending",
    directions: [
      { value: "given", labelKey: "moneyGiven" },
      { value: "taken", labelKey: "moneyTaken" }
    ]
  }
];

export const SORT_OPTIONS = [
  { value: "date", labelKey: "sortDate" },
  { value: "name", labelKey: "sortName" },
  { value: "interest", labelKey: "sortInterest" },
  { value: "pending", labelKey: "sortPending" },
  { value: "completed", labelKey: "sortCompleted" }
];

export const INITIAL_TRANSACTION_FORM = {
  personName: "",
  phone: "",
  amount: "",
  interestRate: "",
  transactionDate: new Date().toISOString().slice(0, 10),
  dueDate: "",
  category: "interestLoan",
  direction: "outgoing",
  reminderSms: true,
  reminderWhatsapp: true,
  paidAmount: "",
  extraBorrowedAmount: "",
  notes: ""
};
