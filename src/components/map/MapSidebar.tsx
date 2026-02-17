import { Report } from "@/lib/types";
import { AlertTriangle, Home, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MapSidebarProps {
    reports: Report[];
}

export function MapSidebar({ reports }: MapSidebarProps) {
    // Quick Stats Logic
    const federalCount = reports.filter(r => r.jurisdiction === 'FEDERAL').length;
    const stateCount = reports.filter(r => r.jurisdiction === 'STATE').length;
    const criticalCount = reports.filter(r => r.severity_level >= 8).length;

    return (
        <div className="w-full md:w-96 bg-surface h-full border-r border-white/5 flex flex-col z-10 glass">
            <div className="p-6 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2 mb-6 group">
                    <span className="text-xl font-bold text-white">
                        WatchWay<span className="text-primary">.NG</span>
                    </span>
                </Link>

                <h1 className="text-2xl font-bold mb-2">Live Hazard Map</h1>
                <p className="text-gray-400 text-sm">Real-time infrastructure decay tracking across Nigeria.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 border-b border-white/5">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-red-500 mb-2">
                        <Building2 className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase">Federal</span>
                    </div>
                    <span className="text-2xl font-bold">{federalCount}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-orange-500 mb-2">
                        <Home className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase">State</span>
                    </div>
                    <span className="text-2xl font-bold">{stateCount}</span>
                </div>
            </div>

            <div className="p-4 border-b border-white/5 bg-red-900/10">
                <div className="flex items-center justify-between">
                    <span className="text-red-500 font-bold text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> Critical Hazards
                    </span>
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{criticalCount}</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Recent Reports</h3>
                {reports.map(report => (
                    <div key={report.id} className="p-4 rounded-lg bg-white/5 border border-white/5 hover:border-primary/50 transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${report.jurisdiction === 'FEDERAL' ? 'bg-red-600' : 'bg-orange-500'}`}>
                                {report.jurisdiction}
                            </span>
                            <span className="text-[10px] text-gray-500">{new Date(report.created_at).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{report.title}</h4>
                        <p className="text-xs text-gray-400 line-clamp-2">{report.description}</p>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-white/5">
                <Link href="/report">
                    <Button className="w-full">Report New Hazard</Button>
                </Link>
            </div>
        </div>
    );
}
