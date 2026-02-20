import { useEffect, useState } from "react";
import { paymentsApi, Transaction } from "@/api/payments";
import DashboardLayout from "@/components/DashboardLayout";
import {
    CreditCard,
    Zap,
    Plus,
    TrendingUp,
    Check,
    Loader2,
    AlertCircle,
    ArrowUpRight,
} from "lucide-react";

const ONRAMP_AMOUNT = 1000;

export default function CreditsPage() {
    const [credits, setCredits] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [onramping, setOnramping] = useState(false);
    const [onrampSuccess, setOnrampSuccess] = useState<string | null>(null);

    async function fetchData() {
        try {
            const [balRes, txRes] = await Promise.all([
                paymentsApi.getBalance(),
                paymentsApi.getTransactions(),
            ]);
            setCredits(balRes.credits);
            setTransactions(txRes.transactions);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchData(); }, []);

    async function handleOnramp() {
        setOnramping(true);
        setOnrampSuccess(null);
        setError(null);
        try {
            const res = await paymentsApi.onramp();
            setCredits(res.credits);
            setTransactions((prev) => [res.transaction, ...prev]);
            setOnrampSuccess(`+${res.transaction.amount} credits added`);
            setTimeout(() => setOnrampSuccess(null), 4000);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setOnramping(false);
        }
    }

    return (
        <DashboardLayout>
            <div className="px-8 py-8 max-w-3xl">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Credits</h1>
                    <p className="text-white/40 text-sm mt-1">
                        Credits are deducted when you make API calls. Top up any time.
                    </p>
                </div>

                {/* Balance card */}
                <div className="rounded-2xl border border-white/6 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 p-6 mb-6">
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-2">
                                Available Credits
                            </p>
                            {loading ? (
                                <div className="flex items-center gap-2 text-white/30">
                                    <Loader2 className="w-5 h-5 animate-spin" /> Loading…
                                </div>
                            ) : (
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold text-white tabular-nums">
                                        {credits?.toLocaleString() ?? "—"}
                                    </span>
                                    <span className="text-white/40 text-sm">credits</span>
                                </div>
                            )}
                            <p className="text-xs text-white/30 mt-2">
                                Estimated token value depends on the model. See{" "}
                                <a href="/models" className="text-violet-400 hover:underline">Models page</a>.
                            </p>
                        </div>

                        <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                            <CreditCard className="w-5 h-5 text-violet-400" />
                        </div>
                    </div>

                    {/* Onramp action */}
                    <div className="mt-6 pt-5 border-t border-white/5 flex items-center gap-4 flex-wrap">
                        <button
                            onClick={handleOnramp}
                            disabled={onramping}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                        >
                            {onramping ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                            Add {ONRAMP_AMOUNT.toLocaleString()} credits
                        </button>
                        <span className="text-xs text-white/30">Free demo onramp</span>

                        {onrampSuccess && (
                            <div className="flex items-center gap-1.5 text-sm text-emerald-400">
                                <Check className="w-4 h-4" />
                                {onrampSuccess}
                            </div>
                        )}
                        {error && (
                            <div className="flex items-center gap-1.5 text-sm text-red-400">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                {/* Pricing reference cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { model: "GPT-4o", cost: "~$2.50", unit: "/ 1M input tokens", icon: Zap },
                        { model: "GPT-3.5 Turbo", cost: "~$0.50", unit: "/ 1M input tokens", icon: TrendingUp },
                        { model: "Claude 3.5", cost: "~$3.00", unit: "/ 1M input tokens", icon: ArrowUpRight },
                    ].map(({ model, cost, unit, icon: Icon }) => (
                        <div key={model} className="rounded-xl border border-white/6 bg-white/[0.015] px-4 py-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon className="w-3.5 h-3.5 text-white/30" />
                                <span className="text-xs text-white/40">{model}</span>
                            </div>
                            <p className="text-base font-semibold text-white">{cost}</p>
                            <p className="text-[11px] text-white/30">{unit}</p>
                        </div>
                    ))}
                </div>

                {/* Transaction history */}
                <div>
                    <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-3">
                        Credit History
                    </h2>

                    {loading && (
                        <div className="flex items-center gap-2 text-white/30 py-6">
                            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
                        </div>
                    )}

                    {!loading && transactions.length === 0 && (
                        <div className="text-center py-12 rounded-xl border border-white/5 text-white/25 text-sm">
                            No credit transactions yet. Click "Add credits" to get started.
                        </div>
                    )}

                    {!loading && transactions.length > 0 && (
                        <div className="rounded-xl border border-white/6 overflow-hidden">
                            <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-5 py-3 border-b border-white/5 bg-white/[0.015] text-[11px] font-semibold uppercase tracking-widest text-white/25">
                                <span>#</span>
                                <span>Type</span>
                                <span className="text-right">Amount</span>
                            </div>
                            {transactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="grid grid-cols-[auto_1fr_auto] gap-4 items-center px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors"
                                >
                                    <span className="text-xs text-white/25 font-mono w-8">#{tx.id}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                        <span className="text-sm text-white/60">Credit top-up</span>
                                        <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${tx.status === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                                            {tx.status}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-emerald-400 text-right">
                                        +{tx.amount.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
}
