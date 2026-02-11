"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Calendar, ShieldCheck, Share2, AlertTriangle, Loader2, Check } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";
import Link from "next/link";
import { toast } from "sonner";

export default function HazardDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [report, setReport] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!id) return;

        // Parallel fetch
        const fetchData = async () => {
            try {
                const reportData = await api.getReport(id);
                setReport(reportData);

                // Try fetching user (might fail if not logged in)
                try {
                    const userData = await api.getProfile();
                    setUser(userData);
                } catch (e) {
                    // Not logged in, that's fine
                }
            } catch (error) {
                toast.error("Hazard not found");
                router.push("/hazards");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, router]);

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleVerify = async () => {
        if (!user) {
            toast.error("Please login to verify hazards");
            router.push("/login");
            return;
        }

        setVerifying(true);

        // Coordinator/Admin bypasses location check
        if (user.role === 'coordinator' || user.role === 'admin') {
            try {
                const updatedReport = await api.verifyReport(id);
                setReport(updatedReport);
                toast.success("Hazard verified (Remote Override)!");
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setVerifying(false);
            }
            return;
        }

        // Citizen Flow: Get Location
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            setVerifying(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const updatedReport = await api.verifyReport(id, latitude, longitude);
                    setReport(updatedReport);
                    toast.success("Hazard verified! +1 Civic Point");
                } catch (error: any) {
                    toast.error(error.message);
                } finally {
                    setVerifying(false);
                }
            },
            (error) => {
                toast.error("Location access denied. You must be at the location to verify.");
                setVerifying(false);
            },
            { enableHighAccuracy: true }
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
        );
    }

    if (!report) return null;

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-white/5 p-4">
                <div className="container mx-auto px-4 max-w-4xl flex items-center justify-between">
                    <Link href="/hazards" className="text-gray-400 hover:text-white flex items-center gap-2">
                        <ArrowLeft className="h-5 w-5" /> Back to Registry
                    </Link>
                    <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
                        {copied ? "Copied" : "Share"}
                    </Button>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <FadeIn>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Image Column */}
                        <div className="space-y-4">
                            <div className="rounded-2xl overflow-hidden border border-white/10 relative aspect-[4/3] bg-black/50">
                                {report.live_image_url ? (
                                    <img src={report.live_image_url} className="w-full h-full object-cover" alt="Hazard" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-600">
                                        <AlertTriangle className="h-12 w-12" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-xl shadow-lg ${report.status === 'verified' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                        report.status === 'fixed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                        }`}>
                                        {report.status}
                                    </span>
                                </div>
                            </div>

                            {/* Jurisdiction Badge */}
                            <div className="bg-surface border border-white/5 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${report.jurisdiction === 'FEDERAL' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Jurisdiction</p>
                                        <p className="font-bold">{report.jurisdiction} GOVERNMENT</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Column */}
                        <div className="space-y-6">
                            <h1 className="text-3xl font-bold mb-2">{report.title}</h1>
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <MapPin className="h-4 w-4 text-primary" />
                                {report.address}
                            </div>
                            {report.address}
                        </div>

                        {/* Resolve Action (Fix Handling) */}
                        {user && (report.status === 'verified' || report.status === 'fix_pending') && (
                            <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                                <h3 className="font-bold text-blue-400 mb-2">
                                    {report.status === 'verified' ? "Is this fixed?" : "Confirm the Fix"}
                                </h3>
                                <p className="text-xs text-blue-300/70 mb-3">
                                    {report.status === 'verified'
                                        ? "If repairs are complete, submit a photo to start the resolution process."
                                        : "A fix has been reported. Verify it to mark as Resolved."}
                                </p>
                                <Button
                                    onClick={() => {
                                        // TODO: Logic for image upload would go here. 
                                        // For MVP, if Coordinator, instant resolve. If Citizen, prompt.
                                        // Simplified: Prompt for image URL or just confirm if coord.
                                        const afterImage = prompt("Enter URL of fixed image (or leave empty if just confirming):");
                                        if (afterImage === null) return; // Cancelled

                                        // Reuse same geolocation flow
                                        if (user.role === 'coordinator' || user.role === 'admin') {
                                            api.resolveReport(id, afterImage || "")
                                                .then(updated => {
                                                    setReport(updated);
                                                    toast.success("Marked as Resolved!");
                                                })
                                                .catch(e => toast.error(e.message));
                                        } else {
                                            navigator.geolocation.getCurrentPosition(
                                                async (position) => {
                                                    try {
                                                        const { latitude, longitude } = position.coords;
                                                        const updated = await api.resolveReport(id, afterImage || "", latitude, longitude);
                                                        setReport(updated);
                                                        toast.success("Report submitted!");
                                                    } catch (e: any) {
                                                        toast.error(e.message);
                                                    }
                                                },
                                                () => toast.error("Location required"),
                                                { enableHighAccuracy: true }
                                            );
                                        }
                                    }}
                                    className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <Check className="h-4 w-4" />
                                    {report.status === 'verified' ? "Report Fix" : "Confirm Fix"}
                                </Button>
                            </div>
                        )}

                        {/* Verification Action */}
                        {user && report.status === 'unverified' && (
                            user.id === report.reporter_id ? (
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                                    <p className="text-gray-400 text-sm">You reported this hazard. <span className="text-primary">Thanks for your contribution!</span></p>
                                </div>
                            ) : (
                                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-primary">Can you see this hazard?</h3>
                                        <p className="text-xs text-primary/70">Verify it to help us confirm priority.</p>
                                    </div>
                                    <Button onClick={handleVerify} disabled={verifying} className="gap-2">
                                        {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                        Verify Now
                                    </Button>
                                </div>
                            )
                        )}

                        <div className="bg-surface border border-white/5 rounded-xl p-6">
                            <h3 className="font-bold text-gray-300 mb-3">Description</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {report.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-surface border border-white/5 rounded-xl p-4">
                                <p className="text-xs text-gray-500 mb-1">Reported On</p>
                                <div className="flex items-center gap-2 text-white">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    {new Date(report.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="bg-surface border border-white/5 rounded-xl p-4">
                                <p className="text-xs text-gray-500 mb-1">State</p>
                                <div className="flex items-center gap-2 text-white">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    {report.state}
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </main>
        </div >
    );
}
