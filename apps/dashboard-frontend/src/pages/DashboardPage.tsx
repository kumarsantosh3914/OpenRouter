import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Key } from "lucide-react";

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <DashboardLayout>
            <div className="px-10 py-10">
                <h1 className="text-2xl font-bold tracking-tight mb-1">Overview</h1>
                <p className="text-white/40 text-sm mb-10">Welcome back to your OpenRouter dashboard.</p>

                {/* Stat cards */}
                <div className="grid sm:grid-cols-3 gap-4 mb-10">
                    {[
                        { label: "Credits remaining", value: "1,000", sub: "Free starter credits" },
                        { label: "API Keys", value: "0", sub: "No keys yet" },
                        { label: "Total requests", value: "0", sub: "Last 30 days" },
                    ].map(({ label, value, sub }) => (
                        <div key={label} className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                            <p className="text-xs text-white/40 mb-1">{label}</p>
                            <p className="text-3xl font-bold text-white">{value}</p>
                            <p className="text-xs text-white/30 mt-1">{sub}</p>
                        </div>
                    ))}
                </div>

                {/* Empty state */}
                <div className="rounded-xl border border-dashed border-white/8 bg-white/[0.01] p-12 text-center">
                    <Key className="w-10 h-10 text-white/15 mx-auto mb-4" />
                    <h3 className="text-sm font-medium text-white/50 mb-2">No API keys yet</h3>
                    <p className="text-xs text-white/30 mb-6">Create your first API key to start making requests.</p>
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-sm font-medium transition-colors">
                        Create API Key
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
