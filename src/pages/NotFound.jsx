import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useLocale } from "../context/LocaleContext";

export default function NotFound() {
  const { t } = useLocale();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <Card className="w-full max-w-md text-center">
        <p className="text-sm font-black text-brand-700 dark:text-brand-200">404</p>
        <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{t("pageNotFound")}</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t("pageNotFoundMessage")}</p>
        <Button as={Link} to="/" className="mt-6 w-full">
          {t("goHome")}
        </Button>
      </Card>
    </div>
  );
}
