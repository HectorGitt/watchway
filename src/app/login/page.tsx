"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // const [username, setUsername] = useState(""); // Removed
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                await api.login(email, password);
                router.push("/map");
            } else {
                await api.register(email, password);
                // Auto-login disabled because verification is enforced
                setError("Account created! Verify your email before logging in.");
                setIsLogin(true); // Switch to login view
            }
        } catch (err: any) {
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4">
            <FadeIn className="w-full max-w-md bg-surface border border-white/5 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
                <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>

                <h1 className="text-3xl font-bold mb-2">
                    {isLogin ? "Welcome Back" : "Join the Watch"}
                </h1>
                <p className="text-gray-400 mb-8">
                    {isLogin ? "Sign in to verify hazards and track fixes." : "Create an account to become a Coordinator."}
                </p>

                {error && (
                    <FadeIn duration={0.3} className="bg-red-900/20 border border-red-500/50 p-3 rounded-lg text-red-500 text-sm mb-6">
                        {error}
                        {error.includes("not verified") && (
                            <button
                                onClick={async () => {
                                    try {
                                        await api.resendVerification(email);
                                        alert("Verification email sent! Check your inbox.");
                                    } catch (e: any) {
                                        alert(e.message);
                                    }
                                }}
                                className="block mt-2 text-primary hover:underline font-bold"
                            >
                                Resend Verification Email
                            </button>
                        )}
                    </FadeIn>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <StaggerContainer>
                        <StaggerItem>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </StaggerItem>

                        {!isLogin && (
                            // Username field removed as per request. 
                            // It is now auto-generated from email and can be changed in profile.
                            null
                        )}

                        <StaggerItem className="mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </StaggerItem>

                        <StaggerItem className="mt-6">
                            <Button type="submit" disabled={loading} className="w-full" size="lg">
                                {loading ? <Loader2 className="animate-spin" /> : (isLogin ? "Sign In" : "Create Account")}
                            </Button>
                        </StaggerItem>
                    </StaggerContainer>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-primary hover:underline font-bold"
                    >
                        {isLogin ? "Sign Up" : "Log In"}
                    </button>
                </div>
            </FadeIn>
        </div>
    );
}
