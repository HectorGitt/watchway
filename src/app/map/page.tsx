"use client";

import dynamic from "next/dynamic";
import { api } from "@/lib/api";
import { Report } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MapSidebar } from "@/components/map/MapSidebar";

// Dynamically import the Map component with no SSR
const InfrastructureMap = dynamic(
    () => import("@/components/map/InfrastructureMap"),
    {
        ssr: false,
        loading: () => <div className="w-full h-full bg-surface-highlight animate-pulse flex items-center justify-center text-gray-500">Loading Map Engine...</div>
    }
);

export default function MapPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [focusLocation, setFocusLocation] = useState<{ lat: number, lng: number } | null>(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await api.getReports({});
                setReports(data);
            } catch (error) {
                console.error("Failed to fetch reports:", error);
                toast.error("Failed to load map data");
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleReportClick = (report: any) => {
        setFocusLocation({ lat: report.location.lat, lng: report.location.lng });
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-background text-foreground">
            {/* Sidebar with Stats */}
            <MapSidebar reports={reports} onReportClick={handleReportClick} />

            {/* Main Map Area */}
            <div className="flex-1 relative h-full">
                <InfrastructureMap reports={reports} focusLocation={focusLocation} />

                {/* Floating Legend / Info for Mobile if needed */}
                <div className="absolute bottom-6 right-6 z-[400] bg-surface/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl max-w-xs hidden md:block">
                    <h4 className="font-bold text-xs uppercase text-gray-400 mb-2">Jurisdiction Legend</h4>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-600 border border-white"></div>
                            <span className="text-sm font-medium">Federal Road (FERMA)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500 border border-white"></div>
                            <span className="text-sm font-medium">State Road (Ministry)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
