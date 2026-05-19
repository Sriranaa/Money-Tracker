const variants = {
  pending: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-200",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
  deleted: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
  neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
};

export default function Badge({ children, variant = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-xs font-bold capitalize ${variants[variant] || variants.neutral} ${className}`}
    >
      <span className="truncate">{children}</span>
    </span>
  );
}
