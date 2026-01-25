"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Award, ShieldCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getProfile()
            .then(setUser)
            .catch(() => router.push('/login'))
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur z-50">
                <Link href="/map" className="text-gray-400 hover:text-white">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="font-bold text-lg">My Profile</h1>
                <div className="w-6"></div>
            </div>

            <div className="container mx-auto px-4 pt-8 max-w-2xl">
                <FadeIn>
                    {/* User Card */}
                    <div className="bg-surface border border-white/5 rounded-2xl p-6 mb-8 flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                        <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                            <span className="text-3xl font-bold text-primary">{user.username?.[0]?.toUpperCase() || "U"}</span>
                        </div>

                        {/* Editable Username */}
                        <div className="flex items-center gap-2 mb-1 justify-center relative group">
                            <h2 className="text-2xl font-bold">{user.username || "Citizen"}</h2>
                            <button
                                onClick={() => {
                                    const newName = prompt("Enter new username:", user.username);
                                    if (newName && newName !== user.username) {
                                        api.updateProfile({ username: newName })
                                            .then((updatedUser) => setUser(updatedUser))
                                            .catch((err) => alert(err.message));
                                    }
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-primary transition-all"
                                title="Edit Username"
                            >
                                ✏️
                            </button>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{user.email}</p>

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wide">
                            <ShieldCheck className="h-3 w-3" />
                            {user.is_verified ? "Verified Citizen" : "Unverified"}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-surface p-5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                <Award className="h-4 w-4 text-yellow-500" />
                                Civic Points
                            </div>
                            <p className="text-3xl font-bold text-white">{user.civic_points}</p>
                        </div>
                        <div className="bg-surface p-5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                Reports Submitted
                            </div>
                            <p className="text-3xl font-bold text-white">{user.reports?.length || 0}</p>
                        </div>
                    </div>

                    {/* Report History */}
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Report History
                    </h3>

                    {(!user.reports || user.reports.length === 0) ? (
                        <div className="text-center py-12 text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                            <p>No reports yet. Start checking your roads!</p>
                            <Link href="/report">
                                <Button className="mt-4" variant="outline">Submit First Report</Button>
                            </Link>
                        </div>
                    ) : (
                        <StaggerContainer className="space-y-3">
                            {user.reports.map((report: any) => (
                                <StaggerItem key={report.id}>
                                    <div className="bg-surface p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors flex gap-4">
                                        <div className="h-12 w-12 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                                            {report.live_image_url ? (
                                                <img src={report.live_image_url} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-600">
                                                    <AlertTriangle className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-medium text-white truncate pr-2">{report.title}</h4>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${report.status === 'verified'
                                                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                                    : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {report.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 truncate">{report.address}</p>
                                            <p className="text-[10px] text-gray-600 mt-1">
                                                {new Date(report.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    )}
                </FadeIn>
            </div>
        </div>
    );
}
