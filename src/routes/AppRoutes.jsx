import { Navigate, Route, Routes } from "react-router-dom";
import LanguageGate from "../components/settings/LanguageGate";
import { useLocale } from "../context/LocaleContext";
import AppLayout from "../layouts/AppLayout";
import AuthLayout from "../layouts/AuthLayout";
import ForgotPassword from "../pages/ForgotPassword";
import History from "../pages/History";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Records from "../pages/Records";
import Register from "../pages/Register";
import Settings from "../pages/Settings";
import TransactionDetails from "../pages/TransactionDetails";
import TransactionForm from "../pages/TransactionForm";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  const { isLanguageSelected } = useLocale();

  if (!isLanguageSelected) return <LanguageGate />;

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/records" element={<Records />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/transactions/new" element={<TransactionForm />} />
          <Route path="/transactions/:id" element={<TransactionDetails />} />
          <Route path="/transactions/:id/edit" element={<TransactionForm />} />
        </Route>
      </Route>
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
