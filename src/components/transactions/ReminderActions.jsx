import { MessageCircle, MessageSquare } from "lucide-react";
import { useLocale } from "../../context/LocaleContext";
import { createSmsLink, createWhatsAppLink } from "../../utils/reminders";
import Button from "../ui/Button";

export default function ReminderActions({ transaction }) {
  const { t } = useLocale();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button as="a" href={createSmsLink(transaction, t)} variant="secondary" icon={MessageSquare} className="w-full">
        {t("smsReminder")}
      </Button>
      <Button as="a" href={createWhatsAppLink(transaction, t)} target="_blank" rel="noreferrer" variant="secondary" icon={MessageCircle} className="w-full">
        {t("whatsappReminder")}
      </Button>
    </div>
  );
}
