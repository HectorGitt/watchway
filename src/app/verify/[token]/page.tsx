"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";
import Link from "next/link";
import { toast } from "sonner";

export default function VerifyPage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage("Invalid verification link.");
            return;
        }

        api.verifyEmail(token)
            .then((res) => {
                setStatus('success');
                setMessage(res.message || "Email verified successfully!");
                toast.success("Verification successful!");
            })
            .catch((err) => {
                setStatus('error');
                setMessage(err.message || "Verification failed. The link may have expired.");
                toast.error(err.message);
            });
    }, [token]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <FadeIn className="w-full max-w-md bg-surface border border-white/5 p-8 rounded-2xl shadow-2xl text-center">

                {status === 'loading' && (
                    <div className="flex flex-col items-center py-8">
                        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                        <h2 className="text-xl font-bold mb-2">Verifying...</h2>
                        <p className="text-gray-400">Please wait while we confirm your identity.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center py-6">
                        <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-500">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-white">Verified!</h2>
                        <p className="text-gray-400 mb-8">{message}</p>

                        <Link href="/login" className="w-full">
                            <Button size="lg" className="w-full text-lg">
                                Continue to Login <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center py-6">
                        <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500">
                            <XCircle className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-white">Verification Failed</h2>
                        <p className="text-gray-400 mb-8">{message}</p>

                        <div className="flex flex-col gap-3 w-full">
                            <Link href="/login">
                                <Button variant="outline" className="w-full">Back to Login</Button>
                            </Link>
                            <p className="text-xs text-gray-500 mt-2">
                                If the link expired, try logging in to request a new one.
                            </p>
                        </div>
                    </div>
                )}
            </FadeIn>
        </div>
    );
}
