"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Calendar, ShieldCheck, Share2, AlertTriangle, Loader2, Check } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";
import Link from "next/link";
import { toast } from "sonner";

// ... imports
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";

export default function HazardDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const [report, setReport] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [copied, setCopied] = useState(false);

    // Modal State
    const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
    const [resolveImageUrl, setResolveImageUrl] = useState("");
    const [resolving, setResolving] = useState(false);

    useEffect(() => {
        api.getReport(id).then(setReport).catch(console.error);
        api.getProfile().then(setUser).catch(console.error);
        setLoading(false);
    }, [id]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Link copied to clipboard!");
    };

    const handleVerify = () => {
        setVerifying(true);
        // GPS Check for verification
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            setVerifying(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const updated = await api.verifyReport(id, latitude, longitude);
                    setReport(updated);
                    toast.success("Report verified successfully!");
                } catch (e: any) {
                    toast.error(e.message);
                } finally {
                    setVerifying(false);
                }
            },
            () => {
                toast.error("Unable to retrieve your location for verification");
                setVerifying(false);
            }
        );
    };

    const handleResolve = async () => {
        setResolving(true);
        // Reuse same geolocation flow
        if (user.role === 'coordinator' || user.role === 'admin') {
            try {
                const updated = await api.resolveReport(id, resolveImageUrl);
                setReport(updated);
                toast.success("Marked as Resolved!");
                setIsResolveModalOpen(false);
            } catch (e: any) {
                toast.error(e.message);
            } finally {
                setResolving(false);
            }
        } else {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const updated = await api.resolveReport(id, resolveImageUrl, latitude, longitude);
                        setReport(updated);
                        toast.success("Report submitted!");
                        setIsResolveModalOpen(false);
                    } catch (e: any) {
                        toast.error(e.message);
                    } finally {
                        setResolving(false);
                    }
                },
                () => {
                    toast.error("Location required");
                    setResolving(false);
                },
                { enableHighAccuracy: true }
            );
        }
    };

    if (loading) {
        // ... loading spinner
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
        );
    }

    if (!report) return null;

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Header ... */}
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
                        {/* Image Column ... */}
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
                            {/* Jurisdiction Badge ... */}
                            {/* ... */}
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

                            {/* Actions */}
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
                                        onClick={() => setIsResolveModalOpen(true)}
                                        className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <Check className="h-4 w-4" />
                                        {report.status === 'verified' ? "Report Fix" : "Confirm Fix"}
                                    </Button>
                                </div>
                            )}

                            {/* Verification Action ... */}
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

                            {/* Description ... */}
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
                    </div>
                </FadeIn>

                {/* Resolve Modal */}
                <Modal
                    isOpen={isResolveModalOpen}
                    onClose={() => setIsResolveModalOpen(false)}
                    title={report.status === 'verified' ? "Report a Fix" : "Confirm Resolution"}
                >
                    <div className="space-y-4">
                        <p className="text-sm text-gray-400">
                            {report.status === 'verified'
                                ? "Great news! Please provide a photo URL of the repair to verify it."
                                : "Please confirm that you have visually verified the repairs are complete."}
                        </p>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 uppercase">Evidence Photo URL (Optional)</label>
                            <Input
                                placeholder="https://..."
                                value={resolveImageUrl}
                                onChange={(e) => setResolveImageUrl(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setIsResolveModalOpen(false)}
                                disabled={resolving}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                onClick={handleResolve}
                                disabled={resolving}
                            >
                                {resolving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                                {report.status === 'verified' ? "Submit Fix" : "Confirm Resolved"}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </main>
        </div>
    );
}
