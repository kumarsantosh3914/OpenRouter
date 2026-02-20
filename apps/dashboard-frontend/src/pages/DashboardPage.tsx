import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { apiKeysApi } from "@/api/apiKeys";
import { Key, Loader2, Check, Copy } from "lucide-react";

export default function DashboardPage() {
    const { user } = useAuth();
    const [createLoading, setCreateLoading] = useState(false);
    const [revealedKey, setRevealedKey] = useState<string | null>(null);
    const [createError, setCreateError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    async function handleCreateKey() {
        setCreateLoading(true);
        setCreateError(null);
        try {
            const res = await apiKeysApi.create("Default Key");
            setRevealedKey(res.apiKey.apiKey);
        } catch (e: any) {
            setCreateError(e.message || "Failed to create key");
        } finally {
            setCreateLoading(false);
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <DashboardLayout>
            <div className="px-10 py-10">
                <h1 className="text-2xl font-bold tracking-tight mb-1">Overview</h1>
                <p className="text-white/40 text-sm mb-10">Welcome back to your OpenRouter dashboard.</p>

                {/* Success Banner */}
                {revealedKey && (
                    <div className="mb-8 rounded-xl border border-emerald-500/25 bg-emerald-500/5 px-6 py-5">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-emerald-400 mb-1 flex items-center gap-2">
                                    <Check className="w-4 h-4" /> API Key created successfully
                                </p>
                                <p className="text-xs text-white/40 mb-3">
                                    Make sure to copy it now. You won't be able to see it again.
                                </p>
                                <div className="flex items-center gap-3">
                                    <code className="px-3 py-1.5 rounded-lg bg-black/30 border border-white/5 text-sm font-mono text-white/80 break-all">
                                        {revealedKey}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(revealedKey)}
                                        className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors"
                                        title="Copy to clipboard"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => setRevealedKey(null)}
                                className="text-xs text-white/20 hover:text-white/40 transition-colors"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}

                {/* Stat cards */}
                <div className="grid sm:grid-cols-3 gap-4 mb-10">
                    {[
                        { label: "Credits remaining", value: "1,000", sub: "Free starter credits" },
                        { label: "API Keys", value: revealedKey ? "1" : "0", sub: revealedKey ? "1 active key" : "No keys yet" },
                        { label: "Total requests", value: "0", sub: "Last 30 days" },
                    ].map(({ label, value, sub }) => (
                        <div key={label} className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                            <p className="text-xs text-white/40 mb-1">{label}</p>
                            <p className="text-3xl font-bold text-white tabular-nums">{value}</p>
                            <p className="text-xs text-white/30 mt-1">{sub}</p>
                        </div>
                    ))}
                </div>

                {/* Empty state */}
                <div className="rounded-xl border border-dashed border-white/8 bg-white/[0.01] p-12 text-center">
                    <Key className="w-10 h-10 text-white/15 mx-auto mb-4" />
                    <h3 className="text-sm font-medium text-white/50 mb-2">
                        {revealedKey ? "API Key is ready" : "No API keys yet"}
                    </h3>
                    <p className="text-xs text-white/30 mb-6">
                        {revealedKey
                            ? "Your first key is active and ready to use."
                            : "Create your first API key to start making requests."}
                    </p>
                    {createError && (
                        <p className="text-xs text-red-500 mb-4">{createError}</p>
                    )}
                    <button
                        onClick={handleCreateKey}
                        disabled={createLoading || !!revealedKey}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors shadow-lg shadow-violet-500/10"
                    >
                        {createLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating...
                            </>
                        ) : revealedKey ? (
                            <>
                                <Check className="w-4 h-4" />
                                Created
                            </>
                        ) : (
                            "Create API Key"
                        )}
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
