import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
    Zap,
    Copy,
    Check,
    ChevronRight,
    ExternalLink,
    Terminal,
    Key,
    AlertCircle,
    BookOpen,
    Code2,
    Layers,
    Globe,
    ShieldCheck,
    ArrowRight,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Sidebar navigation sections
───────────────────────────────────────────── */
const NAV = [
    {
        group: "Getting Started",
        items: [
            { id: "introduction", label: "Introduction" },
            { id: "quickstart", label: "Quick Start" },
            { id: "authentication", label: "Authentication" },
        ],
    },
    {
        group: "API Reference",
        items: [
            { id: "chat-completions", label: "Chat Completions" },
            { id: "list-models", label: "List Models" },
            { id: "list-providers", label: "List Providers" },
            { id: "api-keys", label: "API Keys" },
        ],
    },
    {
        group: "Concepts",
        items: [
            { id: "credits", label: "Credits & Billing" },
            { id: "errors", label: "Errors" },
            { id: "rate-limits", label: "Rate Limits" },
        ],
    },
    {
        group: "SDKs",
        items: [
            { id: "sdk-node", label: "Node / TypeScript" },
            { id: "sdk-python", label: "Python" },
        ],
    },
];

/* ─────────────────────────────────────────────
   Copy button
───────────────────────────────────────────── */
function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(text).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={copy}
            className="absolute top-3 right-3 p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
            title="Copy"
        >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
    );
}

/* ─────────────────────────────────────────────
   Code block
───────────────────────────────────────────── */
function CodeBlock({
    lang,
    code,
    filename,
}: {
    lang: string;
    code: string;
    filename?: string;
}) {
    return (
        <div className="relative rounded-xl overflow-hidden border border-white/8 bg-[#0d1117] my-4">
            {filename && (
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8 bg-white/[0.02]">
                    <Terminal className="w-3.5 h-3.5 text-white/30" />
                    <span className="text-xs text-white/40 font-mono">{filename}</span>
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/30 uppercase tracking-wide">
                        {lang}
                    </span>
                </div>
            )}
            <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                <code className="text-white/80 font-mono text-[13px]">{code}</code>
            </pre>
            <CopyButton text={code} />
        </div>
    );
}

/* ─────────────────────────────────────────────
   HTTP method badge
───────────────────────────────────────────── */
function MethodBadge({ method }: { method: "GET" | "POST" | "PUT" | "DELETE" }) {
    const colors: Record<string, string> = {
        GET: "bg-sky-500/15 text-sky-300 border-sky-500/25",
        POST: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
        PUT: "bg-amber-500/15 text-amber-300 border-amber-500/25",
        DELETE: "bg-red-500/15 text-red-300 border-red-500/25",
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold font-mono border ${colors[method]}`}>
            {method}
        </span>
    );
}

/* ─────────────────────────────────────────────
   Endpoint card
───────────────────────────────────────────── */
function Endpoint({
    method,
    path,
    description,
}: {
    method: "GET" | "POST" | "PUT" | "DELETE";
    path: string;
    description: string;
}) {
    return (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-white/6 bg-white/[0.02] my-3">
            <MethodBadge method={method} />
            <div className="min-w-0">
                <code className="text-sm text-white/80 font-mono">{path}</code>
                <p className="text-xs text-white/40 mt-0.5">{description}</p>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Section wrapper
───────────────────────────────────────────── */
function Section({
    id,
    title,
    icon: Icon,
    children,
}: {
    id: string;
    title: string;
    icon?: React.ElementType;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className="mb-16 scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
                {Icon && (
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-violet-400" />
                    </div>
                )}
                <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
            </div>
            {children}
        </section>
    );
}

/* ─────────────────────────────────────────────
   Alert block
───────────────────────────────────────────── */
function Alert({
    type = "info",
    children,
}: {
    type?: "info" | "warning" | "tip";
    children: React.ReactNode;
}) {
    const styles = {
        info: "border-sky-500/25 bg-sky-500/5 text-sky-200",
        warning: "border-amber-500/25 bg-amber-500/5 text-amber-200",
        tip: "border-emerald-500/25 bg-emerald-500/5 text-emerald-200",
    };
    const icons = {
        info: <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-sky-400" />,
        warning: <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />,
        tip: <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />,
    };
    return (
        <div className={`flex gap-3 p-4 rounded-xl border my-4 text-sm leading-relaxed ${styles[type]}`}>
            {icons[type]}
            <span>{children}</span>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Param row
───────────────────────────────────────────── */
function Param({
    name,
    type,
    required,
    description,
}: {
    name: string;
    type: string;
    required?: boolean;
    description: string;
}) {
    return (
        <div className="flex gap-4 py-3 border-b border-white/5 last:border-0">
            <div className="w-44 flex-shrink-0">
                <code className="text-sm text-violet-300 font-mono">{name}</code>
                {required && (
                    <span className="ml-2 text-[10px] text-red-400 font-medium">required</span>
                )}
                <div className="text-[11px] text-white/30 font-mono mt-0.5">{type}</div>
            </div>
            <p className="text-sm text-white/55 leading-relaxed">{description}</p>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Main DocsPage
───────────────────────────────────────────── */
export default function DocsPage() {
    const [activeId, setActiveId] = useState("introduction");
    const observerRef = useRef<IntersectionObserver | null>(null);

    /* Scrollspy */
    useEffect(() => {
        const allIds = NAV.flatMap((g) => g.items.map((i) => i.id));
        observerRef.current = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) setActiveId(e.target.id);
                }
            },
            { rootMargin: "-20% 0% -70% 0%", threshold: 0 }
        );
        allIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observerRef.current?.observe(el);
        });
        return () => observerRef.current?.disconnect();
    }, []);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="min-h-screen bg-[#080c14] text-white">
            {/* Top navbar */}
            <header className="fixed top-0 inset-x-0 z-40 h-14 border-b border-white/5 bg-[#080c14]/90 backdrop-blur-md flex items-center px-6 gap-6">
                <Link to="/" className="flex items-center gap-2 mr-4">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-semibold text-sm tracking-tight">OpenRouter</span>
                </Link>
                <nav className="flex items-center gap-5 text-sm text-white/50">
                    <Link to="/" className="hover:text-white/80 transition-colors">Home</Link>
                    <span className="text-white font-medium">Docs</span>
                    <Link to="/models" className="hover:text-white/80 transition-colors">Models</Link>
                </nav>
                <div className="ml-auto flex items-center gap-3">
                    <Link
                        to="/sign-in"
                        className="text-sm text-white/50 hover:text-white/80 transition-colors"
                    >
                        Sign in
                    </Link>
                    <Link
                        to="/sign-up"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-sm font-medium transition-colors"
                    >
                        Get started <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </header>

            <div className="flex pt-14">
                {/* ── Left sidebar ── */}
                <aside className="fixed left-0 top-14 bottom-0 w-60 border-r border-white/5 overflow-y-auto py-6 px-3">
                    {NAV.map((group) => (
                        <div key={group.group} className="mb-6">
                            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/25">
                                {group.group}
                            </p>
                            {group.items.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollTo(item.id)}
                                    className={`w-full text-left flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${activeId === item.id
                                            ? "bg-violet-500/10 text-violet-300 font-medium"
                                            : "text-white/40 hover:text-white/70 hover:bg-white/5"
                                        }`}
                                >
                                    {activeId === item.id && (
                                        <ChevronRight className="w-3 h-3 flex-shrink-0" />
                                    )}
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    ))}
                </aside>

                {/* ── Main content ── */}
                <main className="ml-60 flex-1 min-w-0">
                    <div className="max-w-3xl mx-auto px-10 py-12">

                        {/* ══════════════ INTRODUCTION ══════════════ */}
                        <Section id="introduction" title="Introduction" icon={BookOpen}>
                            <p className="text-white/60 leading-relaxed mb-4">
                                OpenRouter provides a single, unified API to access AI models from OpenAI, Anthropic, Google,
                                Mistral, and more — using the same OpenAI-compatible interface you already know.
                            </p>
                            <div className="grid sm:grid-cols-3 gap-3 mt-6">
                                {[
                                    { icon: Globe, title: "Unified Endpoint", desc: "One URL for every model" },
                                    { icon: ShieldCheck, title: "Secure by Default", desc: "Per-key scoping & instant revoke" },
                                    { icon: Layers, title: "Credit Billing", desc: "Pay only for what you use" },
                                ].map(({ icon: Icon, title, desc }) => (
                                    <div key={title} className="rounded-xl border border-white/6 bg-white/[0.02] p-4">
                                        <Icon className="w-5 h-5 text-violet-400 mb-2" />
                                        <p className="text-sm font-medium text-white mb-0.5">{title}</p>
                                        <p className="text-xs text-white/40">{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* ══════════════ QUICKSTART ══════════════ */}
                        <Section id="quickstart" title="Quick Start" icon={Terminal}>
                            <p className="text-white/60 leading-relaxed mb-2">
                                Get your first response in under 60 seconds.
                            </p>
                            <Alert type="tip">Sign up for free and get 1,000 starter credits — no credit card required.</Alert>

                            <h3 className="text-sm font-semibold text-white/80 mb-2 mt-5">1. Create an API key</h3>
                            <p className="text-sm text-white/50 mb-2">
                                Head to your{" "}
                                <Link to="/dashboard" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
                                    dashboard
                                </Link>{" "}
                                and generate a key under <strong className="text-white/70">API Keys</strong>.
                            </p>

                            <h3 className="text-sm font-semibold text-white/80 mb-2 mt-5">2. Make your first request</h3>
                            <CodeBlock
                                lang="bash"
                                filename="terminal"
                                code={`curl https://api.openrouter.ai/api/v1/chat/completions \\
  -H "Authorization: Bearer OR-YOUR-API-KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "openai/gpt-4o",
    "messages": [
      { "role": "user", "content": "Hello, world!" }
    ]
  }'`}
                            />

                            <h3 className="text-sm font-semibold text-white/80 mb-2 mt-5">3. Read the response</h3>
                            <CodeBlock
                                lang="json"
                                filename="response.json"
                                code={`{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "model": "openai/gpt-4o",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 9,
    "total_tokens": 19
  }
}`}
                            />
                        </Section>

                        {/* ══════════════ AUTHENTICATION ══════════════ */}
                        <Section id="authentication" title="Authentication" icon={Key}>
                            <p className="text-white/60 leading-relaxed mb-4">
                                All API requests must include your API key in the{" "}
                                <code className="text-violet-300 bg-white/5 px-1.5 py-0.5 rounded text-[13px]">Authorization</code>{" "}
                                header using Bearer authentication.
                            </p>
                            <CodeBlock
                                lang="http"
                                filename="request header"
                                code={`Authorization: Bearer OR-YOUR-API-KEY`}
                            />
                            <Alert type="warning">
                                Never expose your API key in client-side code or public repositories. Use environment variables.
                            </Alert>

                            <h3 className="text-sm font-semibold text-white/80 mb-3 mt-6">Using environment variables</h3>
                            <CodeBlock
                                lang="bash"
                                filename=".env"
                                code={`OPENROUTER_API_KEY=OR-YOUR-API-KEY`}
                            />
                            <CodeBlock
                                lang="typescript"
                                filename="client.ts"
                                code={`const response = await fetch(
  "https://api.openrouter.ai/api/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${process.env.OPENROUTER_API_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: "openai/gpt-4o", messages }),
  }
);`}
                            />
                        </Section>

                        {/* ══════════════ CHAT COMPLETIONS ══════════════ */}
                        <Section id="chat-completions" title="Chat Completions" icon={Code2}>
                            <Endpoint
                                method="POST"
                                path="/api/v1/chat/completions"
                                description="Generate a model response given a list of messages"
                            />
                            <p className="text-sm text-white/55 leading-relaxed mb-4">
                                The primary endpoint. Fully OpenAI-compatible — swap the base URL and your existing OpenAI code works instantly.
                            </p>

                            <h3 className="text-sm font-semibold text-white/70 mb-3">Request body</h3>
                            <div className="rounded-xl border border-white/6 overflow-hidden mb-4">
                                <Param name="model" type="string" required description='Model slug, e.g. "openai/gpt-4o" or "anthropic/claude-3-opus"' />
                                <Param name="messages" type="Message[]" required description="Array of {role, content} objects. Roles: system | user | assistant" />
                                <Param name="stream" type="boolean" description="If true, server-sent events (SSE) are returned for token-by-token streaming." />
                                <Param name="temperature" type="number" description="Sampling temperature between 0 and 2. Higher = more random." />
                                <Param name="max_tokens" type="number" description="Maximum tokens in the completion. Defaults to the model's context limit." />
                                <Param name="top_p" type="number" description="Nucleus sampling. 0.1 means only top 10% probability tokens are sampled." />
                            </div>

                            <h3 className="text-sm font-semibold text-white/70 mb-3">Example — streaming</h3>
                            <CodeBlock
                                lang="typescript"
                                filename="stream.ts"
                                code={`const res = await fetch(
  "https://api.openrouter.ai/api/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${process.env.OPENROUTER_API_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "anthropic/claude-3-5-sonnet",
      stream: true,
      messages: [{ role: "user", content: "Tell me a joke" }],
    }),
  }
);

const reader = res.body!.getReader();
const decoder = new TextDecoder();

for (;;) {
  const { done, value } = await reader.read();
  if (done) break;
  const lines = decoder.decode(value).split("\\n");
  for (const line of lines) {
    if (!line.startsWith("data: ")) continue;
    const json = line.slice(6);
    if (json === "[DONE]") break;
    const delta = JSON.parse(json).choices[0]?.delta?.content ?? "";
    process.stdout.write(delta);
  }
}`}
                            />
                        </Section>

                        {/* ══════════════ LIST MODELS ══════════════ */}
                        <Section id="list-models" title="List Models" icon={Layers}>
                            <Endpoint method="GET" path="/api/v1/models" description="Returns all available models with company info" />
                            <Endpoint method="GET" path="/api/v1/models/providers" description="Returns all AI providers" />
                            <Endpoint method="GET" path="/api/v1/models/mappings" description="Returns model-provider pricing mappings (optional ?modelId=)" />

                            <Alert type="info">These endpoints require a valid session cookie or dashboard login — they are not accessible via API keys alone.</Alert>

                            <CodeBlock
                                lang="json"
                                filename="GET /api/v1/models"
                                code={`{
  "success": true,
  "models": [
    {
      "id": 1,
      "name": "OpenAI: GPT-4o",
      "slug": "openai/gpt-4o",
      "company": {
        "id": 1,
        "name": "OpenAI",
        "website": "https://openai.com"
      }
    }
  ]
}`}
                            />
                        </Section>

                        {/* ══════════════ LIST PROVIDERS ══════════════ */}
                        <Section id="list-providers" title="List Providers">
                            <Endpoint method="GET" path="/api/v1/models/providers" description="Returns all registered AI providers" />
                            <CodeBlock
                                lang="json"
                                filename="GET /api/v1/models/providers"
                                code={`{
  "success": true,
  "providers": [
    { "id": 1, "name": "OpenAI",    "website": "https://openai.com" },
    { "id": 2, "name": "Anthropic", "website": "https://anthropic.com" },
    { "id": 3, "name": "Google API","website": "https://ai.google.dev" }
  ]
}`}
                            />
                        </Section>

                        {/* ══════════════ API KEYS ══════════════ */}
                        <Section id="api-keys" title="API Keys" icon={Key}>
                            <Endpoint method="GET" path="/api/v1/api-keys" description="List all API keys for the authenticated user" />
                            <Endpoint method="POST" path="/api/v1/api-keys" description="Create a new API key" />
                            <Endpoint method="PUT" path="/api/v1/api-keys/:id" description="Update key name or status (active/inactive)" />
                            <Endpoint method="DELETE" path="/api/v1/api-keys/:id" description="Soft-delete an API key" />

                            <h3 className="text-sm font-semibold text-white/70 mb-3 mt-5">Create a key</h3>
                            <CodeBlock
                                lang="bash"
                                filename="terminal"
                                code={`curl -X POST https://api.openrouter.ai/api/v1/api-keys \\
  -H "Cookie: token=<session-token>" \\
  -H "Content-Type: application/json" \\
  -d '{ "name": "Production Key" }'`}
                            />
                            <CodeBlock
                                lang="json"
                                filename="response"
                                code={`{
  "success": true,
  "apiKey": {
    "id": 7,
    "name": "Production Key",
    "key": "OR-abc123...xyz",
    "status": "active",
    "createdAt": "2026-02-20T15:00:00.000Z"
  }
}`}
                            />
                            <Alert type="warning">
                                The full key value is only returned once at creation time. Store it securely — it cannot be retrieved again.
                            </Alert>
                        </Section>

                        {/* ══════════════ CREDITS ══════════════ */}
                        <Section id="credits" title="Credits & Billing" icon={ShieldCheck}>
                            <p className="text-white/60 leading-relaxed mb-4">
                                OpenRouter uses a credit-based billing model. Credits are deducted per token consumed.
                                Pricing is shown per million tokens on the{" "}
                                <Link to="/models" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
                                    Models page
                                </Link>.
                            </p>

                            <div className="rounded-xl border border-white/6 overflow-hidden mb-4">
                                <div className="grid grid-cols-2 gap-4 p-4 bg-white/[0.02] border-b border-white/5 text-xs font-semibold text-white/40 uppercase tracking-wide">
                                    <span>Action</span>
                                    <span>Credit cost</span>
                                </div>
                                {[
                                    ["Input tokens", "Model input price × tokens / 1M"],
                                    ["Output tokens", "Model output price × tokens / 1M"],
                                    ["Sign-up bonus", "1,000 free credits"],
                                    ["Top-up (onramp)", "+1,000 credits / top-up"],
                                ].map(([action, cost]) => (
                                    <div key={action} className="grid grid-cols-2 gap-4 px-4 py-3 border-b border-white/5 last:border-0 text-sm">
                                        <span className="text-white/70">{action}</span>
                                        <span className="text-white/50 font-mono text-xs">{cost}</span>
                                    </div>
                                ))}
                            </div>

                            <h3 className="text-sm font-semibold text-white/70 mb-3 mt-5">Top up credits</h3>
                            <Endpoint method="POST" path="/api/v1/payments/onramp" description="Add 1,000 credits to your account" />
                            <CodeBlock
                                lang="bash"
                                filename="terminal"
                                code={`curl -X POST https://api.openrouter.ai/api/v1/payments/onramp \\
  -H "Cookie: token=<session-token>"`}
                            />
                        </Section>

                        {/* ══════════════ ERRORS ══════════════ */}
                        <Section id="errors" title="Errors" icon={AlertCircle}>
                            <p className="text-white/60 leading-relaxed mb-4">
                                OpenRouter uses standard HTTP status codes. All errors return a JSON body with a{" "}
                                <code className="text-violet-300 bg-white/5 px-1.5 py-0.5 rounded text-[13px]">message</code> field.
                            </p>

                            <div className="rounded-xl border border-white/6 overflow-hidden">
                                <div className="grid grid-cols-[80px_1fr_1fr] gap-4 px-4 py-3 bg-white/[0.02] border-b border-white/5 text-xs font-semibold text-white/40 uppercase tracking-wide">
                                    <span>Code</span>
                                    <span>Name</span>
                                    <span>Meaning</span>
                                </div>
                                {[
                                    ["400", "Bad Request", "Missing or invalid request body"],
                                    ["401", "Unauthorized", "Missing or invalid API key / session"],
                                    ["403", "Forbidden", "Key exists but is revoked or inactive"],
                                    ["404", "Not Found", "Resource does not exist"],
                                    ["429", "Too Many Requests", "Rate limit exceeded"],
                                    ["500", "Internal Server Error", "Something went wrong on our end"],
                                ].map(([code, name, meaning]) => (
                                    <div
                                        key={code}
                                        className="grid grid-cols-[80px_1fr_1fr] gap-4 px-4 py-3 border-b border-white/5 last:border-0 text-sm"
                                    >
                                        <code className="text-red-400 font-mono text-xs">{code}</code>
                                        <span className="text-white/70">{name}</span>
                                        <span className="text-white/45">{meaning}</span>
                                    </div>
                                ))}
                            </div>

                            <CodeBlock
                                lang="json"
                                filename="error body"
                                code={`{
  "success": false,
  "message": "Invalid or expired API key"
}`}
                            />
                        </Section>

                        {/* ══════════════ RATE LIMITS ══════════════ */}
                        <Section id="rate-limits" title="Rate Limits">
                            <p className="text-white/60 leading-relaxed mb-4">
                                Rate limits are applied per API key. When exceeded, the API returns a{" "}
                                <code className="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-[13px]">429</code> status.
                            </p>
                            <div className="rounded-xl border border-white/6 overflow-hidden">
                                {[
                                    ["Free tier", "60 req / min", "10 req / sec"],
                                    ["Paid tier", "600 req / min", "100 req / sec"],
                                ].map(([tier, rpm, rps]) => (
                                    <div
                                        key={tier}
                                        className="grid grid-cols-3 px-4 py-3 border-b border-white/5 last:border-0 text-sm"
                                    >
                                        <span className="text-white/70">{tier}</span>
                                        <span className="text-white/50 font-mono text-xs">{rpm}</span>
                                        <span className="text-white/50 font-mono text-xs">{rps}</span>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* ══════════════ NODE SDK ══════════════ */}
                        <Section id="sdk-node" title="Node / TypeScript" icon={Code2}>
                            <p className="text-sm text-white/55 mb-4">
                                OpenRouter is OpenAI-compatible. Use the official{" "}
                                <a
                                    href="https://www.npmjs.com/package/openai"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-violet-400 hover:text-violet-300 underline underline-offset-2 inline-flex items-center gap-1"
                                >
                                    openai <ExternalLink className="w-3 h-3" />
                                </a>{" "}
                                package — just change the baseURL.
                            </p>
                            <CodeBlock
                                lang="bash"
                                filename="terminal"
                                code={`npm install openai`}
                            />
                            <CodeBlock
                                lang="typescript"
                                filename="openrouter.ts"
                                code={`import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://api.openrouter.ai/api/v1",
});

const completion = await client.chat.completions.create({
  model: "openai/gpt-4o",
  messages: [{ role: "user", content: "Hello!" }],
});

console.log(completion.choices[0].message.content);`}
                            />
                        </Section>

                        {/* ══════════════ PYTHON SDK ══════════════ */}
                        <Section id="sdk-python" title="Python">
                            <p className="text-sm text-white/55 mb-4">
                                Same pattern — use the official{" "}
                                <a
                                    href="https://pypi.org/project/openai/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-violet-400 hover:text-violet-300 underline underline-offset-2 inline-flex items-center gap-1"
                                >
                                    openai <ExternalLink className="w-3 h-3" />
                                </a>{" "}
                                Python library with a custom base URL.
                            </p>
                            <CodeBlock
                                lang="bash"
                                filename="terminal"
                                code={`pip install openai`}
                            />
                            <CodeBlock
                                lang="python"
                                filename="openrouter.py"
                                code={`import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://api.openrouter.ai/api/v1",
)

completion = client.chat.completions.create(
    model="anthropic/claude-3-5-sonnet",
    messages=[{"role": "user", "content": "Hello!"}],
)

print(completion.choices[0].message.content)`}
                            />
                        </Section>

                        {/* Footer CTA */}
                        <div className="mt-6 mb-16 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 p-8 text-center">
                            <h3 className="text-lg font-bold text-white mb-2">Ready to build?</h3>
                            <p className="text-sm text-white/50 mb-5">Get 1,000 free credits, no credit card needed.</p>
                            <Link
                                to="/sign-up"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-medium text-sm transition-colors"
                            >
                                Start for free <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
