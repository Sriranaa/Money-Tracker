import { useAuth } from "../../context/AuthContext";
import { useLocale } from "../../context/LocaleContext";
import Alert from "../ui/Alert";

export default function FirebaseNotice() {
  const { firebaseReady } = useAuth();
  const { t } = useLocale();
  if (firebaseReady) return null;
  return <Alert className="mb-4">{t("firebaseMissing")}</Alert>;
}
