export default function Tabs({ tabs, active, onChange, className = "" }) {
  return (
    <div className={`grid gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800 ${className}`} style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          className={`focus-ring min-h-10 rounded-lg px-3 text-sm font-bold transition ${
            active === tab.value
              ? "bg-white text-brand-700 shadow-sm dark:bg-slate-950 dark:text-brand-100"
              : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
          }`}
          onClick={() => onChange(tab.value)}
        >
          <span className="block truncate">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
