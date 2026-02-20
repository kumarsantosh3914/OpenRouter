import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { Zap, Loader2, Check } from "lucide-react";

const perks = [
    "1 000 free credits on signup",
    "Access to 20+ AI models",
    "Per-key usage analytics",
];

export default function SignUpPage() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await authApi.signUp({ email, password });
            setUser(res.user);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to create account");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#080c14] flex items-center justify-center px-4">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-violet-700/15 rounded-full blur-[120px]" />
            </div>

            <div className="relative w-full max-w-sm">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <Zap className="w-4.5 h-4.5 text-white" />
                    </div>
                    <span className="text-white font-semibold text-lg tracking-tight">OpenRouter</span>
                </div>

                {/* Perks */}
                <div className="flex flex-col gap-2 mb-6">
                    {perks.map((p) => (
                        <div key={p} className="flex items-center gap-2 text-sm text-white/50">
                            <div className="w-4 h-4 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                                <Check className="w-2.5 h-2.5 text-violet-400" />
                            </div>
                            {p}
                        </div>
                    ))}
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur p-8">
                    <h1 className="text-xl font-semibold text-white text-center mb-1">
                        Create your account
                    </h1>
                    <p className="text-sm text-white/40 text-center mb-8">
                        Start routing AI in minutes
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-white/50 mb-2">
                                Email
                            </label>
                            <input
                                id="signup-email"
                                type="email"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full rounded-lg border border-white/8 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-white/50 mb-2">
                                Password
                            </label>
                            <input
                                id="signup-password"
                                type="password"
                                required
                                minLength={8}
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 8 characters"
                                className="w-full rounded-lg border border-white/8 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                            />
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <button
                            id="signup-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium text-white transition-colors mt-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Create free account
                        </button>
                    </form>

                    <p className="text-xs text-white/25 text-center mt-5">
                        By signing up you agree to our{" "}
                        <a href="#" className="underline hover:text-white/40 transition-colors">Terms</a>{" "}
                        and{" "}
                        <a href="#" className="underline hover:text-white/40 transition-colors">Privacy Policy</a>.
                    </p>
                </div>

                <p className="text-center text-sm text-white/30 mt-6">
                    Already have an account?{" "}
                    <Link to="/sign-in" className="text-violet-400 hover:text-violet-300 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
