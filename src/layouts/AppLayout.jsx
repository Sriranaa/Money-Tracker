import { Outlet } from "react-router-dom";
import BottomNav from "../components/navigation/BottomNav";
import Sidebar from "../components/navigation/Sidebar";
import Topbar from "../components/navigation/Topbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar />
      <div className="min-w-0 lg:pl-72">
        <Topbar />
        <main>
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
