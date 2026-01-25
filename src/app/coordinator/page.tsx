"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Loader2, hardHat, CheckCircle2, MapPin, Camera, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { toast } from "sonner";

export default function CoordinatorDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [hazards, setHazards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [resolvingId, setResolvingId] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                const profile = await api.getProfile();
                if (profile.role !== "coordinator") {
                    toast.error("Access Denied: Coordinators Only");
                    router.push("/");
                    return;
                }
                setUser(profile);

                // Fetch hazards for their assigned state
                const data = await api.getReports({ state: profile.state_assigned });
                // Filter for un-fixed hazards
                setHazards(data.filter((h: any) => h.status !== 'fixed'));
            } catch (e) {
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [router]);

    const handleResolve = async (id: string) => {
        // In a real app, we'd open a modal to upload an image.
        // For this demo, we'll use a placeholder "Fixed" image.
        const mockAfterImage = "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=2000"; // Smooth road

        setResolvingId(id);
        try {
            await api.resolveHazard(id, mockAfterImage);
            toast.success("Hazard marked as FIXED! Great work.");
            // Remove from list
            setHazards(prev => prev.filter(h => h.id !== id));
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setResolvingId(null);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Dashboard Header */}
            <div className="bg-surface border-b border-white/5 p-6 md:p-10">
                <div className="container mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-primary mb-2">
                            {/* Hardhat icon manual SVG since Lucide might not have it or needs import check */}
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="font-mono text-sm uppercase tracking-wider">Public Works Department</span>
                        </div>
                        <h1 className="text-3xl font-bold">Coordinator Dashboard</h1>
                        <p className="text-gray-400 mt-1">
                            Zone: <span className="text-white font-bold">{user?.state_assigned} State</span>
                        </p>
                    </div>

                    <div className="bg-primary/10 border border-primary/20 rounded-lg px-6 py-3 text-center">
                        <p className="text-xs text-primary/70 uppercase font-bold">Pending Fixes</p>
                        <p className="text-3xl font-bold text-primary">{hazards.length}</p>
                    </div>
                </div>
            </div>

            {/* Task List */}
            <main className="container mx-auto px-4 py-8">
                {hazards.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white">All Clear!</h3>
                        <p className="text-gray-400">No pending hazards in {user?.state_assigned}.</p>
                    </div>
                ) : (
                    <StaggerContainer className="space-y-4">
                        {hazards.map((hazard) => (
                            <StaggerItem key={hazard.id}>
                                <div className="bg-surface border border-white/5 rounded-xl p-4 flex flex-col md:flex-row items-center gap-6 group hover:border-white/10 transition-colors">
                                    {/* Task Image */}
                                    <div className="w-full md:w-32 h-32 md:h-24 rounded-lg bg-black/50 overflow-hidden shrink-0 relative">
                                        {hazard.live_image_url && (
                                            <img src={hazard.live_image_url} className="w-full h-full object-cover" />
                                        )}
                                        <div className="absolute top-2 left-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${hazard.status === 'verified' ? 'bg-green-500 text-black' : 'bg-yellow-500 text-black'
                                                }`}>
                                                {hazard.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Task Info */}
                                    <div className="flex-1 min-w-0 text-center md:text-left">
                                        <h3 className="font-bold text-lg truncate">{hazard.title}</h3>
                                        <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-400 mt-1">
                                            <MapPin className="h-3 w-3" />
                                            {hazard.address}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2 line-clamp-1">{hazard.description}</p>
                                    </div>

                                    {/* Action */}
                                    <div className="shrink-0 w-full md:w-auto">
                                        <Button
                                            size="lg"
                                            className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                                            onClick={() => handleResolve(hazard.id)}
                                            disabled={resolvingId === hazard.id}
                                        >
                                            {resolvingId === hazard.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>Resolve & Close</>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                )}
            </main>
        </div>
    );
}
