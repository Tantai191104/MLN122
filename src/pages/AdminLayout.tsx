import AdminSidebar from "@/components/AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-muted/30 p-8">
        <Outlet />
      </main>
    </div>
  );
}
