import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Zap,
    Check,
    X,
    ArrowRight,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Building2,
    Rocket,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const PLANS = [
    {
        id: "free",
        name: "Starter",
        icon: Rocket,
        price: { monthly: 0, annual: 0 },
        credits: "1,000",
        description: "Perfect for exploring and prototyping.",
        color: "border-white/10",
        badge: null,
        cta: "Start for free",
        ctaLink: "/sign-up",
        ctaStyle: "bg-white/8 hover:bg-white/12 text-white border border-white/10",
        features: [
            "1,000 free credits",
            "Access to all models",
            "3 API keys",
            "Community support",
            "Usage dashboard",
        ],
        missing: ["Custom rate limits", "Priority routing", "SLA guarantee", "Dedicated support"],
    },
    {
        id: "pro",
        name: "Pro",
        icon: Sparkles,
        price: { monthly: 20, annual: 16 },
        credits: "25,000",
        description: "For developers shipping production apps.",
        color: "border-violet-500/40",
        badge: "Most popular",
        cta: "Get started",
        ctaLink: "/sign-up",
        ctaStyle: "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20",
        features: [
            "25,000 credits / mo",
            "Access to all models",
            "Unlimited API keys",
            "Priority email support",
            "Usage analytics",
            "Custom rate limits",
            "Priority model routing",
        ],
        missing: ["SLA guarantee", "Dedicated support"],
    },
    {
        id: "enterprise",
        name: "Enterprise",
        icon: Building2,
        price: { monthly: null, annual: null },
        credits: "Unlimited",
        description: "For teams that need scale, compliance, and SLAs.",
        color: "border-white/10",
        badge: null,
        cta: "Contact us",
        ctaLink: "mailto:enterprise@openrouter.ai",
        ctaStyle: "bg-white/8 hover:bg-white/12 text-white border border-white/10",
        features: [
            "Unlimited credits",
            "All models + private endpoints",
            "Unlimited API keys",
            "Dedicated Slack support",
            "Advanced analytics",
            "Custom rate limits",
            "Priority routing",
            "99.9% SLA guarantee",
            "SSO & audit logs",
        ],
        missing: [],
    },
];

const COMPARISON = [
    { feature: "Free credits", free: "1,000", pro: "25,000 / mo", enterprise: "Unlimited" },
    { feature: "API keys", free: "3", pro: "Unlimited", enterprise: "Unlimited" },
    { feature: "Model access", free: "All models", pro: "All models", enterprise: "All + private" },
    { feature: "Rate limits", free: "60 req / min", pro: "Custom", enterprise: "Custom" },
    { feature: "Priority routing", free: false, pro: true, enterprise: true },
    { feature: "Usage analytics", free: "Basic", pro: "Advanced", enterprise: "Advanced + export" },
    { feature: "Support", free: "Community", pro: "Priority email", enterprise: "Dedicated Slack" },
    { feature: "SLA", free: false, pro: false, enterprise: "99.9%" },
    { feature: "SSO & audit logs", free: false, pro: false, enterprise: true },
];

const FAQS = [
    {
        q: "What are credits?",
        a: "Credits are OpenRouter's billing unit. Token costs are deducted in credits — the exact credit price per 1M tokens is shown on the Models page for each model and provider.",
    },
    {
        q: "Do unused credits roll over?",
        a: "Yes. Pro plan credits accumulate month-over-month with no expiry. Free tier starter credits never expire either.",
    },
    {
        q: "Can I switch plans anytime?",
        a: "Absolutely. Upgrade or downgrade at any time from your dashboard. Prorated credits are applied immediately.",
    },
    {
        q: "Which models are available?",
        a: "All plans include access to models from OpenAI (GPT-4o, GPT-3.5 Turbo), Anthropic (Claude 3.5 Sonnet), Google (Gemini 2.5 Pro), Mistral, and more. Enterprise unlocks private endpoints.",
    },
    {
        q: "Is there a free trial for Pro?",
        a: "Your 1,000 free Starter credits double as your trial. You'll only be charged when you explicitly upgrade to Pro.",
    },
    {
        q: "How does billing work?",
        a: "Pro is billed monthly or annually (20% discount). Credits top up at the start of each billing cycle. Enterprise is quoted based on volume.",
    },
];

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
function CheckIcon() {
    return (
        <span className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
            <Check className="w-3 h-3 text-emerald-400" />
        </span>
    );
}

function XIcon() {
    return (
        <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
            <X className="w-3 h-3 text-white/20" />
        </span>
    );
}

function TableCell({ value }: { value: string | boolean }) {
    if (typeof value === "boolean") {
        return (
            <div className="flex justify-center">
                {value ? <CheckIcon /> : <XIcon />}
            </div>
        );
    }
    return <span className="text-sm text-white/60 text-center block">{value}</span>;
}

function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-white/6 last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left group"
            >
                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{q}</span>
                {open ? (
                    <ChevronUp className="w-4 h-4 text-white/30 flex-shrink-0" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-white/30 flex-shrink-0" />
                )}
            </button>
            {open && (
                <p className="pb-5 text-sm text-white/50 leading-relaxed -mt-2">{a}</p>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────
   Main
───────────────────────────────────────────── */
export default function PricingPage() {
    const [annual, setAnnual] = useState(false);

    return (
        <div className="min-h-screen bg-[#080c14] text-white">

            {/* ── Top nav ── */}
            <header className="fixed top-0 inset-x-0 z-40 h-14 border-b border-white/5 bg-[#080c14]/90 backdrop-blur-md flex items-center px-6 gap-6">
                <Link to="/" className="flex items-center gap-2 mr-4">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-semibold text-sm tracking-tight">OpenRouter</span>
                </Link>
                <nav className="flex items-center gap-5 text-sm text-white/50">
                    <Link to="/" className="hover:text-white/80 transition-colors">Home</Link>
                    <Link to="/docs" className="hover:text-white/80 transition-colors">Docs</Link>
                    <Link to="/models" className="hover:text-white/80 transition-colors">Models</Link>
                    <span className="text-white font-medium">Pricing</span>
                </nav>
                <div className="ml-auto flex items-center gap-3">
                    <Link to="/sign-in" className="text-sm text-white/50 hover:text-white/80 transition-colors">Sign in</Link>
                    <Link
                        to="/sign-up"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-sm font-medium transition-colors"
                    >
                        Get started <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </header>

            <main className="pt-14">

                {/* ══════════════════════════════
            HERO
        ══════════════════════════════ */}
                <section className="relative text-center pt-24 pb-16 px-6 overflow-hidden">
                    {/* Glow */}
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/10 blur-[100px] rounded-full" />
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-xs text-violet-300 mb-6">
                        <Sparkles className="w-3 h-3" />
                        Simple, usage-based pricing
                    </div>

                    <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                        Pay for what you use.<br />Nothing more.
                    </h1>
                    <p className="text-white/50 text-lg max-w-md mx-auto mb-10">
                        Start free with 1,000 credits. Scale as you grow. Every plan includes access to all models.
                    </p>

                    {/* Billing toggle */}
                    <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-white/5 border border-white/8">
                        <button
                            onClick={() => setAnnual(false)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${!annual ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setAnnual(true)}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${annual ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"}`}
                        >
                            Annual
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold">
                                −20%
                            </span>
                        </button>
                    </div>
                </section>

                {/* ══════════════════════════════
            PRICING CARDS
        ══════════════════════════════ */}
                <section className="max-w-5xl mx-auto px-6 pb-20">
                    <div className="grid md:grid-cols-3 gap-6">
                        {PLANS.map((plan) => {
                            const Icon = plan.icon;
                            const price = annual ? plan.price.annual : plan.price.monthly;
                            const isPro = plan.id === "pro";

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative rounded-2xl border ${plan.color} bg-white/[0.02] flex flex-col ${isPro ? "ring-1 ring-violet-500/30 shadow-2xl shadow-violet-500/10" : ""}`}
                                >
                                    {plan.badge && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-violet-600 text-white shadow-lg">
                                                {plan.badge}
                                            </span>
                                        </div>
                                    )}

                                    <div className="p-6 pb-5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isPro ? "bg-violet-500/15" : "bg-white/5"}`}>
                                                <Icon className={`w-4.5 h-4.5 ${isPro ? "text-violet-400" : "text-white/50"}`} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white">{plan.name}</h3>
                                                <p className="text-xs text-white/40">{plan.description}</p>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="mb-5">
                                            {price === null ? (
                                                <div className="text-3xl font-bold text-white">Custom</div>
                                            ) : price === 0 ? (
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-4xl font-bold text-white">Free</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-4xl font-bold text-white">${price}</span>
                                                    <span className="text-sm text-white/40">/ mo</span>
                                                </div>
                                            )}
                                            <p className="text-xs text-white/35 mt-1">
                                                {plan.credits} credits{plan.id !== "enterprise" && " included"}
                                            </p>
                                        </div>

                                        {/* CTA */}
                                        {plan.ctaLink.startsWith("mailto:") ? (
                                            <a
                                                href={plan.ctaLink}
                                                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${plan.ctaStyle}`}
                                            >
                                                {plan.cta}
                                            </a>
                                        ) : (
                                            <Link
                                                to={plan.ctaLink}
                                                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${plan.ctaStyle}`}
                                            >
                                                {plan.cta}
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        )}
                                    </div>

                                    {/* Features */}
                                    <div className="px-6 pb-6 border-t border-white/5 pt-5 flex-1">
                                        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-3">
                                            What's included
                                        </p>
                                        <ul className="space-y-2.5">
                                            {plan.features.map((f) => (
                                                <li key={f} className="flex items-center gap-3 text-sm text-white/65">
                                                    <CheckIcon />
                                                    {f}
                                                </li>
                                            ))}
                                            {plan.missing.map((f) => (
                                                <li key={f} className="flex items-center gap-3 text-sm text-white/20">
                                                    <XIcon />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ══════════════════════════════
            CREDIT CALCULATOR CALLOUT
        ══════════════════════════════ */}
                <section className="max-w-5xl mx-auto px-6 pb-20">
                    <div className="rounded-2xl border border-white/6 bg-gradient-to-r from-violet-500/5 to-indigo-500/5 px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">How much will it cost?</h3>
                            <p className="text-sm text-white/50">
                                GPT-4o costs ~$0.0025 per 1K output tokens. With 25,000 credits you can generate roughly
                                <span className="text-white/80 font-medium"> 10M tokens</span> of output per month.
                            </p>
                        </div>
                        <Link
                            to="/models"
                            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors"
                        >
                            View model pricing <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </section>

                {/* ══════════════════════════════
            COMPARISON TABLE
        ══════════════════════════════ */}
                <section className="max-w-5xl mx-auto px-6 pb-24">
                    <h2 className="text-2xl font-bold text-center mb-10">Compare plans</h2>

                    <div className="rounded-2xl border border-white/6 overflow-hidden">
                        {/* Header */}
                        <div className="grid grid-cols-4 gap-0 border-b border-white/6">
                            <div className="px-6 py-4 bg-white/[0.015]" />
                            {["Starter", "Pro", "Enterprise"].map((p, i) => (
                                <div
                                    key={p}
                                    className={`px-6 py-4 text-center text-sm font-semibold ${i === 1 ? "bg-violet-500/5 border-x border-violet-500/15 text-violet-300" : "bg-white/[0.015] text-white/60"}`}
                                >
                                    {p}
                                </div>
                            ))}
                        </div>

                        {/* Rows */}
                        {COMPARISON.map((row, idx) => (
                            <div
                                key={row.feature}
                                className={`grid grid-cols-4 gap-0 border-b border-white/5 last:border-0 ${idx % 2 === 0 ? "" : "bg-white/[0.01]"}`}
                            >
                                <div className="px-6 py-4 text-sm text-white/55">{row.feature}</div>
                                <div className="px-6 py-4">
                                    <TableCell value={row.free} />
                                </div>
                                <div className="px-6 py-4 bg-violet-500/[0.03] border-x border-violet-500/10">
                                    <TableCell value={row.pro} />
                                </div>
                                <div className="px-6 py-4">
                                    <TableCell value={row.enterprise} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══════════════════════════════
            FAQ
        ══════════════════════════════ */}
                <section className="max-w-2xl mx-auto px-6 pb-24">
                    <h2 className="text-2xl font-bold text-center mb-10">Frequently asked questions</h2>
                    <div className="rounded-2xl border border-white/6 bg-white/[0.015] px-6 divide-y-0">
                        {FAQS.map((faq) => (
                            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                        ))}
                    </div>
                </section>

                {/* ══════════════════════════════
            BOTTOM CTA
        ══════════════════════════════ */}
                <section className="py-24 px-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-violet-600/8 blur-[120px] rounded-full" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3">Start building today</h2>
                    <p className="text-white/50 mb-8 max-w-sm mx-auto">
                        1,000 free credits. No credit card. Access to every model from the start.
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <Link
                            to="/sign-up"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 font-medium transition-colors shadow-lg shadow-violet-500/20"
                        >
                            Create free account <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/docs"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 font-medium transition-colors text-sm"
                        >
                            Read the docs
                        </Link>
                    </div>
                </section>

            </main>

            {/* ── Footer ── */}
            <footer className="border-t border-white/5 py-8 px-6 text-center text-xs text-white/25">
                © {new Date().getFullYear()} OpenRouter. All prices in USD.
            </footer>

        </div>
    );
}
