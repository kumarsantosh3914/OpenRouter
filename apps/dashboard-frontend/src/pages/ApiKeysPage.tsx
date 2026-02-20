import { useEffect, useState } from "react";
import { apiKeysApi, ApiKey } from "@/api/apiKeys";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Key,
    Plus,
    Copy,
    Check,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Loader2,
    Eye,
    EyeOff,
    AlertCircle,
} from "lucide-react";

/* ── Copy button ── */
function CopyBtn({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            onClick={() => { navigator.clipboard.writeText(text).catch(() => { }); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="p-1.5 rounded-md hover:bg-white/8 text-white/30 hover:text-white/60 transition-colors"
            title="Copy key"
        >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
    );
}

/* ── Masked key display ── */
function KeyDisplay({ value }: { value: string }) {
    const [visible, setVisible] = useState(false);
    if (!value) return <span className="text-xs text-white/20">Empty</span>;
    const masked = value.slice(0, 8) + "••••••••••••••••••••" + value.slice(-4);
    return (
        <div className="flex items-center gap-1">
            <code className="text-xs font-mono text-white/50 tracking-wide">
                {visible ? value : masked}
            </code>
            <button
                onClick={() => setVisible(!visible)}
                className="p-1 rounded hover:bg-white/8 text-white/25 hover:text-white/50 transition-colors ml-1"
                title={visible ? "Hide" : "Show"}
            >
                {visible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
            <CopyBtn text={value} />
        </div>
    );
}

export default function ApiKeysPage() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /* Create modal state */
    const [creating, setCreating] = useState(false);
    const [newName, setNewName] = useState("");
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);
    /* Newly-created key revealed once */
    const [revealedKey, setRevealedKey] = useState<string | null>(null);

    /* Per-row action loading */
    const [toggling, setToggling] = useState<number | null>(null);
    const [deleting, setDeleting] = useState<number | null>(null);

    useEffect(() => {
        apiKeysApi
            .getAll()
            .then((r) => setKeys(r.apiKeys))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    async function handleCreate() {
        if (!newName.trim()) return;
        setCreateLoading(true);
        setCreateError(null);
        try {
            const res = await apiKeysApi.create(newName.trim());
            setKeys((prev) => [res.apiKey, ...prev]);
            setRevealedKey(res.apiKey.apiKey);
            setNewName("");
            setCreating(false);
        } catch (e: any) {
            setCreateError(e.message);
        } finally {
            setCreateLoading(false);
        }
    }

    async function handleToggle(key: ApiKey) {
        setToggling(key.id);
        try {
            const res = await apiKeysApi.updateStatus(key.id, !key.disabled);
            setKeys((prev) => prev.map((k) => (k.id === key.id ? res.apiKey : k)));
        } catch {
            /* silent */
        } finally {
            setToggling(null);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Delete this API key? This action cannot be undone.")) return;
        setDeleting(id);
        try {
            await apiKeysApi.delete(id);
            setKeys((prev) => prev.filter((k) => k.id !== id));
            if (revealedKey) setRevealedKey(null);
        } catch {
            /* silent */
        } finally {
            setDeleting(null);
        }
    }

    return (
        <DashboardLayout>
            <div className="px-8 py-8 max-w-4xl">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">API Keys</h1>
                        <p className="text-white/40 text-sm mt-1">
                            Manage keys used to authenticate your requests.
                        </p>
                    </div>
                    <button
                        onClick={() => { setCreating(true); setCreateError(null); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" /> New key
                    </button>
                </div>

                {/* Revealed key banner */}
                {revealedKey && (
                    <div className="mb-6 rounded-xl border border-emerald-500/25 bg-emerald-500/5 px-5 py-4">
                        <p className="text-xs text-emerald-400 font-semibold mb-1 flex items-center gap-2">
                            <Check className="w-3.5 h-3.5" /> Key created — copy it now, it won't be shown again
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                            <code className="text-sm font-mono text-white/80 break-all">{revealedKey}</code>
                            <CopyBtn text={revealedKey} />
                        </div>
                        <button
                            onClick={() => setRevealedKey(null)}
                            className="mt-3 text-xs text-white/30 hover:text-white/50 transition-colors"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Create modal (inline) */}
                {creating && (
                    <div className="mb-6 rounded-xl border border-white/8 bg-white/[0.02] px-5 py-4">
                        <p className="text-sm font-semibold text-white mb-3">Create a new API key</p>
                        <div className="flex gap-3 items-start">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Key name, e.g. Production"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                                className="flex-1 bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 transition-colors"
                            />
                            <button
                                onClick={handleCreate}
                                disabled={createLoading || !newName.trim()}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                            >
                                {createLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                Create
                            </button>
                            <button
                                onClick={() => setCreating(false)}
                                className="px-4 py-2 rounded-lg border border-white/8 text-sm text-white/40 hover:text-white/70 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                        {createError && (
                            <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> {createError}
                            </p>
                        )}
                    </div>
                )}

                {/* Loading / error */}
                {loading && (
                    <div className="flex items-center justify-center py-20 text-white/30">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading…
                    </div>
                )}
                {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Keys list */}
                {!loading && !error && (
                    <>
                        {keys.length === 0 ? (
                            <div className="text-center py-20 text-white/25">
                                <Key className="w-8 h-8 mx-auto mb-3 opacity-30" />
                                <p className="text-sm">No API keys yet. Create one to get started.</p>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-white/6 overflow-hidden">
                                {/* Table header */}
                                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/5 bg-white/[0.015] text-[11px] font-semibold uppercase tracking-widest text-white/25">
                                    <span>Name / Key</span>
                                    <span className="text-center">Status</span>
                                    <span className="text-center">Created</span>
                                    <span className="text-center">Actions</span>
                                </div>

                                {keys.map((key) => (
                                    <div
                                        key={key.id}
                                        className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors"
                                    >
                                        {/* Name + key */}
                                        <div className="min-w-0">
                                            <p className={`text-sm font-medium mb-1 ${key.disabled ? "text-white/30" : "text-white/80"}`}>
                                                {key.name}
                                            </p>
                                            <KeyDisplay value={key.apiKey} />
                                        </div>

                                        {/* Status badge */}
                                        <div className="flex justify-center">
                                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${key.disabled ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                                                {key.disabled ? "Inactive" : "Active"}
                                            </span>
                                        </div>

                                        {/* Created at */}
                                        <span className="text-xs text-white/30 text-center">
                                            {new Date(key.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </span>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 justify-center">
                                            <button
                                                onClick={() => handleToggle(key)}
                                                disabled={toggling === key.id}
                                                title={key.disabled ? "Enable key" : "Disable key"}
                                                className="p-1.5 rounded-md hover:bg-white/8 text-white/30 hover:text-white/70 disabled:opacity-40 transition-colors"
                                            >
                                                {toggling === key.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : key.disabled ? (
                                                    <ToggleLeft className="w-4 h-4" />
                                                ) : (
                                                    <ToggleRight className="w-4 h-4 text-emerald-400" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(key.id)}
                                                disabled={deleting === key.id}
                                                title="Delete key"
                                                className="p-1.5 rounded-md hover:bg-red-500/10 text-white/30 hover:text-red-400 disabled:opacity-40 transition-colors"
                                            >
                                                {deleting === key.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Footer note */}
                        {keys.length > 0 && (
                            <p className="mt-4 text-xs text-white/25">
                                API keys are shown masked. Use the eye icon to reveal a key.
                            </p>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
