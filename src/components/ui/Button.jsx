import { useLocale } from "../../context/LocaleContext";

const variants = {
  primary:
    "bg-brand-600 text-white shadow-lift hover:bg-brand-700 disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-slate-800",
  secondary:
    "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
  ghost: "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 disabled:bg-rose-200 disabled:text-rose-500 dark:disabled:bg-rose-950"
};

const sizes = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-base"
};

export default function Button({
  children,
  as: Component = "button",
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  icon: Icon,
  loading = false,
  ...props
}) {
  const { t } = useLocale();

  return (
    <Component
      type={Component === "button" ? type : undefined}
      className={`focus-ring inline-flex min-w-0 items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
      <span className="min-w-0 truncate">{loading ? t("pleaseWait") : children}</span>
    </Component>
  );
}
