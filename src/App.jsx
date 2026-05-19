import { AuthProvider } from "./context/AuthContext.jsx";
import { LocaleProvider } from "./context/LocaleContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { TransactionProvider } from "./context/TransactionContext.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          <TransactionProvider>
            <AppRoutes />
          </TransactionProvider>
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
