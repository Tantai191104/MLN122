import { Link, useLocation } from "react-router-dom";
import { Users, Home, Info } from "lucide-react"; // Icons

const adminLinks = [
    { to: "/admin", label: "Thống kê người dùng", icon: <Users className="w-5 h-5" /> },
    { to: "/admin/review", label: "Duyệt bài viết", icon: <Info className="w-5 h-5" /> },
    { to: "/", label: "Trang chủ", icon: <Home className="w-5 h-5" /> },
    { to: "/about", label: "Giới thiệu", icon: <Info className="w-5 h-5" /> },
];

export default function AdminSidebar() {
    const location = useLocation();

    return (
        <aside className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Quản lý hệ thống
                </p>
            </div>

            <hr className="border-gray-200 dark:border-gray-700 mb-6" />

            {/* Navigation */}
            <nav className="flex flex-col gap-2">
                {adminLinks.map((link) => {
                    const isActive = location.pathname === link.to;
                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all ${isActive
                                ? "bg-primary text-white shadow-md"
                                : "text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary"
                                }`}
                        >
                            {link.icon}
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer or extra info */}
            <div className="mt-auto text-xs text-gray-400 dark:text-gray-500 pt-6">
                © 2025 My Admin
            </div>
        </aside>
    );
}
