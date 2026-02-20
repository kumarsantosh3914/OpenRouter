import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
    Zap,
    Shield,
    BarChart3,
    ArrowRight,
    Code2,
    Globe,
    Key,
} from "lucide-react";

const features = [
    {
        icon: Zap,
        title: "Unified AI Gateway",
        description:
            "Access GPT-4, Claude, Gemini, Mistral and dozens more through a single API endpoint.",
    },
    {
        icon: BarChart3,
        title: "Credit-Based Billing",
        description:
            "Pay only for what you use. Top up credits anytime, no subscriptions or hidden fees.",
    },
    {
        icon: Shield,
        title: "Secure API Keys",
        description:
            "Generate scoped API keys, revoke instantly, and monitor usage in real time.",
    },
    {
        icon: Globe,
        title: "Provider Redundancy",
        description:
            "Each model maps to multiple providers. Automatic failover keeps your app online.",
    },
    {
        icon: Code2,
        title: "OpenAI-Compatible",
        description:
            "Drop-in replacement — change one line in your existing code and you're done.",
    },
    {
        icon: Key,
        title: "Per-Key Analytics",
        description:
            "Track token consumption, cost, and latency broken down by each API key.",
    },
];

export default function LandingPage() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#080c14] text-white overflow-x-hidden">
            {/* ── Navbar ── */}
            <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 backdrop-blur-md bg-[#080c14]/80">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-lg tracking-tight">OpenRouter</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-sm text-white/60">
                        <a href="#features" className="hover:text-white transition-colors">Models</a>
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                        <Link to="/docs" className="hover:text-white transition-colors">Docs</Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <Link
                                to="/dashboard"
                                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-sm font-medium transition-colors"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/sign-in"
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white transition-colors"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/sign-up"
                                    className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-sm font-medium transition-colors"
                                >
                                    Get started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* ── Hero ── */}
            <section className="relative pt-40 pb-32 px-6 text-center">
                {/* Background glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-violet-700/20 rounded-full blur-[120px]" />
                </div>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                    Now in open beta · Start free
                </div>

                <h1 className="text-5xl md:text-7xl font-bold leading-[1.08] tracking-tight max-w-3xl mx-auto">
                    One API.{" "}
                    <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        Every AI Model.
                    </span>
                </h1>

                <p className="mt-7 text-lg md:text-xl text-white/50 max-w-xl mx-auto leading-relaxed">
                    Stop juggling API keys from a dozen providers. Route requests to
                    OpenAI, Anthropic, Google, Mistral and more — through one unified
                    endpoint.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/sign-up"
                        className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-medium transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25"
                    >
                        Start building free
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <Link
                        to="/sign-in"
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 font-medium transition-colors"
                    >
                        Sign in to dashboard
                    </Link>
                </div>

                {/* Code snippet */}
                <div className="mt-16 max-w-lg mx-auto text-left rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                        <span className="ml-2 text-xs text-white/30">quickstart.ts</span>
                    </div>
                    <pre className="px-5 py-4 text-sm text-white/70 leading-relaxed overflow-x-auto">
                        <code>
                            <span className="text-violet-400">import</span>{" "}
                            <span className="text-white/90">OpenAI</span>{" "}
                            <span className="text-violet-400">from</span>{" "}
                            <span className="text-emerald-400">"openai"</span>;{"\n\n"}
                            <span className="text-white/40">// Just change the baseURL ↓</span>
                            {"\n"}
                            <span className="text-violet-400">const</span>{" "}
                            <span className="text-white/90">client</span>{" "}
                            <span className="text-white/50">=</span>{" "}
                            <span className="text-violet-400">new</span>{" "}
                            <span className="text-white/90">OpenAI</span>
                            {"({\n"}
                            {"  "}
                            <span className="text-sky-400">baseURL</span>
                            <span className="text-white/50">:</span>{" "}
                            <span className="text-emerald-400">"https://openrouter.ai/api"</span>
                            {",\n"}
                            {"  "}
                            <span className="text-sky-400">apiKey</span>
                            <span className="text-white/50">:</span>{" "}
                            <span className="text-emerald-400">"sk-or-..."</span>
                            {",\n"}{" "} {"});\n"}
                        </code>
                    </pre>
                </div>
            </section>

            {/* ── Features ── */}
            <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Everything you need to ship with AI
                    </h2>
                    <p className="mt-4 text-white/50 max-w-md mx-auto">
                        Built for developers who move fast and need reliability.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map(({ icon: Icon, title, description }) => (
                        <div
                            key={title}
                            className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-violet-500/20 transition-all duration-300"
                        >
                            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                                <Icon className="w-5 h-5 text-violet-400" />
                            </div>
                            <h3 className="font-semibold text-white mb-2">{title}</h3>
                            <p className="text-sm text-white/50 leading-relaxed">{description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto text-center rounded-3xl border border-white/5 bg-gradient-to-b from-violet-900/20 to-indigo-900/10 px-8 py-16 relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-violet-600/10 rounded-full blur-[80px]" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight relative">
                        Start routing requests in minutes
                    </h2>
                    <p className="mt-4 text-white/50 max-w-sm mx-auto relative">
                        Create a free account and get 1 000 credits to explore all models.
                    </p>
                    <Link
                        to="/sign-up"
                        className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-medium transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25 relative"
                    >
                        Create free account <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="border-t border-white/5 py-10 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                        <div className="w-5 h-5 rounded bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                            <Zap className="w-3 h-3 text-white" />
                        </div>
                        OpenRouter © 2025
                    </div>
                    <div className="flex gap-6 text-sm text-white/30">
                        <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
                        <a href="#" className="hover:text-white/60 transition-colors">Docs</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
