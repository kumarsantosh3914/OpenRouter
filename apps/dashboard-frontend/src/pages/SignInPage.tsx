import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { Zap, Loader2 } from "lucide-react";

export default function SignInPage() {
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
            const res = await authApi.signIn({ email, password });
            setUser(res.user);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to sign in");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#080c14] flex items-center justify-center px-4">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-700/15 rounded-full blur-[100px]" />
            </div>

            <div className="relative w-full max-w-sm">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <Zap className="w-4.5 h-4.5 text-white" />
                    </div>
                    <span className="text-white font-semibold text-lg tracking-tight">OpenRouter</span>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur p-8">
                    <h1 className="text-xl font-semibold text-white text-center mb-1">
                        Welcome back
                    </h1>
                    <p className="text-sm text-white/40 text-center mb-8">
                        Sign in to your dashboard
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-white/50 mb-2">
                                Email
                            </label>
                            <input
                                id="signin-email"
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
                                id="signin-password"
                                type="password"
                                required
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-white/8 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                            />
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <button
                            id="signin-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium text-white transition-colors mt-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Sign in
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-white/30 mt-6">
                    Don't have an account?{" "}
                    <Link to="/sign-up" className="text-violet-400 hover:text-violet-300 transition-colors">
                        Sign up free
                    </Link>
                </p>
            </div>
        </div>
    );
}
