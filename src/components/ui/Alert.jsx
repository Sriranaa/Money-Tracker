export default function Alert({ children, type = "info", className = "" }) {
  const styles =
    type === "error"
      ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200"
      : "border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-900 dark:bg-cyan-950 dark:text-cyan-100";

  return <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${styles} ${className}`}>{children}</div>;
}
