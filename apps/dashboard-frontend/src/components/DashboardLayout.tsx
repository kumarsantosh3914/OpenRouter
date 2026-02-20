import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
    Zap,
    Key,
    CreditCard,
    BarChart3,
    Layers,
    LogOut,
} from "lucide-react";

const navItems = [
    { icon: BarChart3, label: "Overview", to: "/dashboard" },
    { icon: Layers, label: "Models", to: "/models" },
    { icon: Key, label: "API Keys", to: "/api-keys" },
    { icon: CreditCard, label: "Credits", to: "/credits" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const location = useLocation();

    return (
        <div className="min-h-screen bg-[#080c14] text-white flex">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-60 border-r border-white/5 bg-[#0b0f1a] flex flex-col">
                <div className="flex items-center gap-2 px-6 h-16 border-b border-white/5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-semibold text-sm tracking-tight">OpenRouter</span>
                </div>

                <nav className="flex-1 px-3 py-6 space-y-1">
                    {navItems.map(({ icon: Icon, label, to }) => {
                        const active = location.pathname === to;
                        return (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active
                                        ? "bg-violet-500/10 text-violet-300"
                                        : "text-white/40 hover:text-white/70 hover:bg-white/5"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-3 py-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/40">
                        <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs text-violet-400 font-medium">
                            {user?.id}
                        </div>
                        <span className="flex-1 truncate">User #{user?.id}</span>
                        <LogOut className="w-3.5 h-3.5" />
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="pl-60 flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
