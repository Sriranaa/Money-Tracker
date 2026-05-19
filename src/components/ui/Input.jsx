export default function Input({ label, error, className = "", inputClassName = "", ...props }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      {label ? <span className="field-label">{label}</span> : null}
      <input
        className={`focus-ring min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-900 ${inputClassName}`}
        {...props}
      />
      {error ? <p className="field-error">{error}</p> : null}
    </label>
  );
}
