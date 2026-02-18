"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { ArrowLeft, Search, MapPin, AlertTriangle, Filter, Loader2, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HazardsPage() {
    const router = useRouter();
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [type, setType] = useState("all");
    const [stateFil, setStateFil] = useState("all");

    const fetchReports = async () => {
        setLoading(true);
        try {
            const data = await api.getReports({
                search,
                status,
                hazard_type: type,
                state: stateFil
            });
            setReports(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchReports();
        }, 500);
        return () => clearTimeout(debounce);
    }, [search, status, type, stateFil]);

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-white/5 p-4">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={() => router.back()} className="text-gray-400 hover:text-white flex items-center gap-2">
                            <ArrowLeft className="h-5 w-5" /> Back
                        </button>
                        <h1 className="text-xl font-bold">Hazard Registry</h1>
                        <Link href="/report">
                            <Button size="sm" className="hidden sm:flex">Report New</Button>
                        </Link>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search hazards..."
                                className="w-full bg-surface border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-primary outline-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                            <select
                                className="bg-surface border border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-300 outline-none focus:border-primary"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="unverified">Unverified</option>
                                <option value="verified">Verified</option>
                                <option value="fixed">Fixed</option>
                            </select>

                            <select
                                className="bg-surface border border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-300 outline-none focus:border-primary"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                <option value="Deep Pothole">Potholes</option>
                                <option value="Road Washout / Erosion">Erosion</option>
                                <option value="Bridge Damage">Bridge Damage</option>
                                <option value="Blocked Drainage / Flooding">Flooding</option>
                            </select>

                            <select
                                className="bg-surface border border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-300 outline-none focus:border-primary"
                                value={stateFil}
                                onChange={(e) => setStateFil(e.target.value)}
                            >
                                <option value="all">All States</option>
                                <option value="Abia">Abia</option>
                                <option value="Adamawa">Adamawa</option>
                                <option value="Akwa Ibom">Akwa Ibom</option>
                                <option value="Anambra">Anambra</option>
                                <option value="Bauchi">Bauchi</option>
                                <option value="Bayelsa">Bayelsa</option>
                                <option value="Benue">Benue</option>
                                <option value="Borno">Borno</option>
                                <option value="Cross River">Cross River</option>
                                <option value="Delta">Delta</option>
                                <option value="Ebonyi">Ebonyi</option>
                                <option value="Edo">Edo</option>
                                <option value="Ekiti">Ekiti</option>
                                <option value="Enugu">Enugu</option>
                                <option value="Gombe">Gombe</option>
                                <option value="Imo">Imo</option>
                                <option value="Jigawa">Jigawa</option>
                                <option value="Kaduna">Kaduna</option>
                                <option value="Kano">Kano</option>
                                <option value="Katsina">Katsina</option>
                                <option value="Kebbi">Kebbi</option>
                                <option value="Kogi">Kogi</option>
                                <option value="Kwara">Kwara</option>
                                <option value="Lagos">Lagos</option>
                                <option value="Nasarawa">Nasarawa</option>
                                <option value="Niger">Niger</option>
                                <option value="Ogun">Ogun</option>
                                <option value="Ondo">Ondo</option>
                                <option value="Osun">Osun</option>
                                <option value="Oyo">Oyo</option>
                                <option value="Plateau">Plateau</option>
                                <option value="Rivers">Rivers</option>
                                <option value="Sokoto">Sokoto</option>
                                <option value="Taraba">Taraba</option>
                                <option value="Yobe">Yobe</option>
                                <option value="Zamfara">Zamfara</option>
                                <option value="Abuja">Abuja (FCT)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                        <AlertTriangle className="h-10 w-10 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-400">No hazards found</h3>
                        <p className="text-sm text-gray-600">Try adjusting your filters</p>
                    </div>
                ) : (
                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reports.map((report) => (
                            <StaggerItem key={report.id}>
                                <Link href={`/hazards/${report.id}`}>
                                    <div className="group bg-surface border border-white/5 hover:border-primary/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 cursor-pointer h-full flex flex-col">
                                        <div className="relative h-40 bg-black/50 overflow-hidden">
                                            <div className="absolute top-2 right-2 z-10">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide backdrop-blur-md border ${report.status === 'verified' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                                    report.status === 'fixed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                                    }`}>
                                                    {report.status}
                                                </span>
                                            </div>
                                            {report.live_image_url ? (
                                                <img
                                                    src={report.live_image_url}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-700">
                                                    <AlertTriangle className="h-8 w-8" />
                                                </div>
                                            )}
                                            {/* Jurisdiction Badge */}
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                                                <div className="flex items-center gap-1.5 text-xs text-white/90 font-medium">
                                                    <span className={`w-2 h-2 rounded-full ${report.jurisdiction === 'FEDERAL' ? 'bg-red-500' : 'bg-orange-500'}`} />
                                                    {report.jurisdiction} ROAD
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">{report.title}</h3>
                                            <p className="text-sm text-gray-400 line-clamp-2 min-h-[40px] mb-4">
                                                {report.description}
                                            </p>

                                            <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-3">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {report.state}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(report.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                )}
            </div>
        </div>
    );
}
