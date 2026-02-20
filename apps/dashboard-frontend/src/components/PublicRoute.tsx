import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface Props {
    children: ReactNode;
}

/**
 * Wraps public pages (/, /sign-in, /sign-up, /pricing, /docs).
 * If the user is already authenticated, redirect them to the dashboard
 * instead of showing the public page.
 */
export default function PublicRoute({ children }: Props) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
            </div>
        );
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}
