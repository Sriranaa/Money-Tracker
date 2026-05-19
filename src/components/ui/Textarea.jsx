export default function Textarea({ label, error, className = "", ...props }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      {label ? <span className="field-label">{label}</span> : null}
      <textarea
        className="focus-ring min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
        {...props}
      />
      {error ? <p className="field-error">{error}</p> : null}
    </label>
  );
}
