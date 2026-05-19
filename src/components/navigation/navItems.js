import { Clock3, Home, ListChecks, Settings } from "lucide-react";

export const navItems = [
  { to: "/", labelKey: "home", icon: Home },
  { to: "/records", labelKey: "records", icon: ListChecks },
  { to: "/history", labelKey: "history", icon: Clock3 },
  { to: "/settings", labelKey: "settings", icon: Settings }
];
