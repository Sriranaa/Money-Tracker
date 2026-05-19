import Card from "./Card";

export default function StatCard({ label, value, icon: Icon, tone = "brand" }) {
  const tones = {
    brand: "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-100",
    green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-100",
    orange: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-100",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-100",
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100"
  };

  return (
    <Card className="min-h-32">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 break-words text-2xl font-black text-slate-950 dark:text-white">{value}</p>
        </div>
        {Icon ? (
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        ) : null}
      </div>
    </Card>
  );
}
