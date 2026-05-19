import { useLocale } from "../../context/LocaleContext";
import Badge from "../ui/Badge";

export default function TransactionStatusBadge({ status }) {
  const { t } = useLocale();
  const normalized = status || "pending";
  return <Badge variant={normalized}>{t(normalized)}</Badge>;
}
