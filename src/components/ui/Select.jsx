export default function Select({ label, error, children, className = "", ...props }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      {label ? <span className="field-label">{label}</span> : null}
      <select
        className="focus-ring min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-900 outline-none transition dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-950 dark:[&>option]:text-slate-100"
        {...props}
      >
        {children}
      </select>
      {error ? <p className="field-error">{error}</p> : null}
    </label>
  );
}
