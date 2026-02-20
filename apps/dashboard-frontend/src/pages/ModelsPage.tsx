import { useEffect, useState, useMemo } from "react";
import { modelsApi, Model, Provider, ModelProviderMapping } from "@/api/models";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Search,
    ExternalLink,
    Layers,
    Server,
    GitBranch,
    ChevronDown,
    ChevronUp,
    Loader2,
    LayoutGrid,
    List,
} from "lucide-react";

/* ── tab type ── */
type Tab = "models" | "providers" | "mappings";

/* ── small helpers ── */
function Badge({ children, color = "violet" }: { children: React.ReactNode; color?: string }) {
    const cls: Record<string, string> = {
        violet: "bg-violet-500/10 text-violet-300 border-violet-500/20",
        sky: "bg-sky-500/10 text-sky-300 border-sky-500/20",
        emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${cls[color] ?? cls.violet}`}>
            {children}
        </span>
    );
}

function formatCost(cost: number) {
    return `${cost.toLocaleString()} cr / 1M tok`;
}

/* ── stat pill ── */
function Stat({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4 flex flex-col gap-1">
            <span className="text-xs text-white/40">{label}</span>
            <span className="text-2xl font-bold text-white">{value}</span>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════════
   Main component
══════════════════════════════════════════════════════════════════ */
export default function ModelsPage() {
    const [tab, setTab] = useState<Tab>("models");
    const [models, setModels] = useState<Model[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [mappings, setMappings] = useState<ModelProviderMapping[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* search */
    const [query, setQuery] = useState("");
    /* model detail expand */
    const [expandedModel, setExpandedModel] = useState<number | null>(null);
    /* view mode */
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    /* fetch everything once */
    useEffect(() => {
        setLoading(true);
        Promise.all([
            modelsApi.getModels(),
            modelsApi.getProviders(),
            modelsApi.getMappings(),
        ])
            .then(([m, p, mp]) => {
                setModels(m.models);
                setProviders(p.providers);
                setMappings(mp.mappings);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    /* ── filtered data ── */
    const filteredModels = useMemo(
        () =>
            models.filter(
                (m) =>
                    m.name.toLowerCase().includes(query.toLowerCase()) ||
                    m.slug.toLowerCase().includes(query.toLowerCase()) ||
                    m.company.name.toLowerCase().includes(query.toLowerCase())
            ),
        [models, query]
    );

    const filteredProviders = useMemo(
        () =>
            providers.filter(
                (p) =>
                    p.name.toLowerCase().includes(query.toLowerCase()) ||
                    p.website.toLowerCase().includes(query.toLowerCase())
            ),
        [providers, query]
    );

    const filteredMappings = useMemo(
        () =>
            mappings.filter(
                (m) =>
                    m.model.name.toLowerCase().includes(query.toLowerCase()) ||
                    m.provider.name.toLowerCase().includes(query.toLowerCase())
            ),
        [mappings, query]
    );

    /* ── mappings lookup by modelId ── */
    const mappingsByModel = useMemo(() => {
        const map: Record<number, ModelProviderMapping[]> = {};
        for (const mp of mappings) {
            if (!map[mp.model.id]) map[mp.model.id] = [];
            map[mp.model.id].push(mp);
        }
        return map;
    }, [mappings]);

    const tabs: { id: Tab; label: string; icon: React.ElementType; count: number }[] = [
        { id: "models", label: "Models", icon: Layers, count: models.length },
        { id: "providers", label: "Providers", icon: Server, count: providers.length },
        { id: "mappings", label: "Pricing", icon: GitBranch, count: mappings.length },
    ];

    /* ── loading / error ── */
    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-3 text-white/40">
                        <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
                        <span className="text-sm">Loading models…</span>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-8 py-6 text-center max-w-sm">
                        <p className="text-red-400 font-medium mb-1">Failed to load</p>
                        <p className="text-sm text-red-400/70">{error}</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="px-8 py-8 max-w-6xl">

                {/* ── Page header ── */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight mb-1">Model Explorer</h1>
                    <p className="text-sm text-white/40">
                        Browse all available AI models, their providers, and token pricing.
                    </p>
                </div>

                {/* ── Stats row ── */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <Stat label="Total Models" value={models.length} />
                    <Stat label="Providers" value={providers.length} />
                    <Stat label="Provider Mappings" value={mappings.length} />
                </div>

                {/* ── Toolbar: tabs + search + view ── */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                    {/* Tabs */}
                    <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/5">
                        {tabs.map(({ id, label, icon: Icon, count }) => (
                            <button
                                key={id}
                                onClick={() => { setTab(id); setQuery(""); }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === id
                                    ? "bg-violet-600 text-white shadow"
                                    : "text-white/40 hover:text-white/70"
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {label}
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === id ? "bg-white/20" : "bg-white/5"}`}>
                                    {count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={`Search ${tab}…`}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-white/8 bg-white/5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/40 transition-colors"
                        />
                    </div>

                    {/* View toggle — only on models tab */}
                    {tab === "models" && (
                        <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/5">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-violet-600 text-white" : "text-white/30 hover:text-white/60"}`}
                            >
                                <LayoutGrid className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-1.5 rounded transition-colors ${viewMode === "list" ? "bg-violet-600 text-white" : "text-white/30 hover:text-white/60"}`}
                            >
                                <List className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* ═══════════════════════════════════════
          TAB: MODELS
      ════════════════════════════════════════ */}
                {tab === "models" && (
                    <>
                        {filteredModels.length === 0 ? (
                            <EmptyState>No models match "{query}"</EmptyState>
                        ) : viewMode === "grid" ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredModels.map((model) => {
                                    const modelMappings = mappingsByModel[model.id] ?? [];
                                    const isExpanded = expandedModel === model.id;
                                    return (
                                        <div
                                            key={model.id}
                                            className="group rounded-2xl border border-white/5 bg-white/[0.02] hover:border-violet-500/20 hover:bg-white/[0.04] transition-all duration-200 overflow-hidden"
                                        >
                                            <div className="p-5">
                                                {/* Company */}
                                                <Badge color="sky">{model.company.name}</Badge>
                                                {/* Model name */}
                                                <h3 className="mt-3 font-semibold text-white text-sm leading-snug">{model.name}</h3>
                                                <code className="mt-1 block text-[11px] text-white/30 font-mono">{model.slug}</code>

                                                {/* Provider count */}
                                                <div className="mt-4 flex items-center justify-between">
                                                    <span className="text-xs text-white/40">
                                                        {modelMappings.length} provider{modelMappings.length !== 1 ? "s" : ""}
                                                    </span>
                                                    {modelMappings.length > 0 && (
                                                        <button
                                                            onClick={() => setExpandedModel(isExpanded ? null : model.id)}
                                                            className="flex items-center gap-1 text-[11px] text-violet-400 hover:text-violet-300 transition-colors"
                                                        >
                                                            Pricing
                                                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Expanded pricing rows */}
                                            {isExpanded && modelMappings.length > 0 && (
                                                <div className="border-t border-white/5 divide-y divide-white/5">
                                                    {modelMappings.map((mp) => (
                                                        <div key={mp.id} className="px-5 py-3 flex items-center justify-between gap-4">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                                                <span className="text-xs text-white/60 truncate">{mp.provider.name}</span>
                                                            </div>
                                                            <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                                                                <span className="text-[10px] text-white/40">
                                                                    ↑ {mp.inputTokenCost.toLocaleString()} cr
                                                                </span>
                                                                <span className="text-[10px] text-white/40">
                                                                    ↓ {mp.outputTokenCost.toLocaleString()} cr
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* LIST view */
                            <div className="rounded-xl border border-white/5 overflow-hidden divide-y divide-white/5">
                                {filteredModels.map((model) => {
                                    const modelMappings = mappingsByModel[model.id] ?? [];
                                    return (
                                        <div key={model.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.03] transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-sm font-medium text-white">{model.name}</span>
                                                    <Badge color="sky">{model.company.name}</Badge>
                                                </div>
                                                <code className="text-[11px] text-white/30 font-mono">{model.slug}</code>
                                            </div>
                                            <span className="text-xs text-white/35 flex-shrink-0">
                                                {modelMappings.length} provider{modelMappings.length !== 1 ? "s" : ""}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {/* ═══════════════════════════════════════
          TAB: PROVIDERS
      ════════════════════════════════════════ */}
                {tab === "providers" && (
                    <>
                        {filteredProviders.length === 0 ? (
                            <EmptyState>No providers match "{query}"</EmptyState>
                        ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredProviders.map((provider) => {
                                    const providerMappings = mappings.filter((m) => m.provider.id === provider.id);
                                    return (
                                        <div
                                            key={provider.id}
                                            className="group rounded-2xl border border-white/5 bg-white/[0.02] hover:border-violet-500/20 hover:bg-white/[0.04] transition-all duration-200 p-5"
                                        >
                                            {/* Provider icon placeholder */}
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-white/5 flex items-center justify-center mb-4">
                                                <Server className="w-5 h-5 text-violet-400" />
                                            </div>

                                            <h3 className="font-semibold text-white text-sm mb-1">{provider.name}</h3>
                                            <a
                                                href={provider.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs text-white/30 hover:text-violet-400 transition-colors"
                                            >
                                                {provider.website.replace(/^https?:\/\//, "")}
                                                <ExternalLink className="w-3 h-3" />
                                            </a>

                                            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                                <span className="text-xs text-white/40">
                                                    {providerMappings.length} model{providerMappings.length !== 1 ? "s" : ""} supported
                                                </span>
                                                <Badge color="emerald">Active</Badge>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {/* ═══════════════════════════════════════
          TAB: MAPPINGS (PRICING)
      ════════════════════════════════════════ */}
                {tab === "mappings" && (
                    <>
                        {filteredMappings.length === 0 ? (
                            <EmptyState>No mappings match "{query}"</EmptyState>
                        ) : (
                            <div className="rounded-xl border border-white/5 overflow-hidden">
                                {/* Table header */}
                                <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 px-5 py-3 bg-white/[0.02] border-b border-white/5 text-xs font-medium text-white/40 uppercase tracking-wide">
                                    <span>Model</span>
                                    <span>Provider</span>
                                    <span>Input cost</span>
                                    <span>Output cost</span>
                                </div>
                                {/* Rows */}
                                <div className="divide-y divide-white/5">
                                    {filteredMappings.map((mp) => (
                                        <div
                                            key={mp.id}
                                            className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 px-5 py-3.5 items-center hover:bg-white/[0.03] transition-colors"
                                        >
                                            <div>
                                                <div className="text-sm text-white font-medium">{mp.model.name}</div>
                                                <code className="text-[10px] text-white/30 font-mono">{mp.model.slug}</code>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                <span className="text-sm text-white/70">{mp.provider.name}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm text-white/80 font-mono">{formatCost(mp.inputTokenCost)}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm text-white/80 font-mono">{formatCost(mp.outputTokenCost)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}

function EmptyState({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-dashed border-white/8 py-16 text-center">
            <p className="text-sm text-white/30">{children}</p>
        </div>
    );
}
