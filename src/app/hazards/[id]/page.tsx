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
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!id) return;
        api.getReport(id)
            .then(setReport)
            .catch(() => {
                toast.error("Hazard not found");
                router.push("/hazards");
            })
            .finally(() => setLoading(false));
    }, [id, router]);

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        });
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
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{report.title}</h1>
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    {report.address}
                                </div>
                            </div>

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
            </main>
        </div>
    );
}
