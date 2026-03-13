"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleGoogleSuccess = async (credentialResponse: any) => {
		setLoading(true);
		setError(null);
		try {
			await api.loginWithGoogle(credentialResponse.credential);
			toast.success("Successfully logged in!");
			router.push("/map");
		} catch (err: any) {
			setError(err.message || "Authentication failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4">
			<FadeIn className="w-full max-w-md bg-surface border border-white/5 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
				<button
					onClick={() => router.back()}
					className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm"
				>
					<ArrowLeft className="h-4 w-4" /> Back
				</button>

				<h1 className="text-3xl font-bold mb-2">Welcome to WatchWay</h1>
				<p className="text-gray-400 mb-8">
					Sign in to report hazards and track infrastructure fixes.
					Email/Password login is currently disabled for security.
				</p>

				{error && (
					<FadeIn
						duration={0.3}
						className="bg-red-900/20 border border-red-500/50 p-3 rounded-lg text-red-500 text-sm mb-6"
					>
						{error}
					</FadeIn>
				)}

				{loading ? (
					<div className="flex justify-center p-6">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
					</div>
				) : (
					<div className="flex justify-center mb-6">
						<GoogleLogin
							onSuccess={handleGoogleSuccess}
							onError={() => setError("Google login failed")}
							theme="filled_black"
							shape="pill"
							size="large"
							width="300"
						/>
					</div>
				)}
			</FadeIn>
		</div>
	);
}
