"use client";

import dynamic from "next/dynamic";
import { MOCK_REPORTS } from "@/lib/mock-data";
import { MapSidebar } from "@/components/map/MapSidebar";
import { useMemo } from "react";

// Dynamically import the Map component with no SSR
const InfrastructureMap = dynamic(
    () => import("@/components/map/InfrastructureMap"),
    {
        ssr: false,
        loading: () => <div className="w-full h-full bg-surface-highlight animate-pulse flex items-center justify-center text-gray-500">Loading Map Engine...</div>
    }
);

export default function MapPage() {
    // In a real app, we would fetch fresh reports here
    const reports = useMemo(() => MOCK_REPORTS, []);

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-background text-foreground">
            {/* Sidebar with Stats */}
            <MapSidebar reports={reports} />

            {/* Main Map Area */}
            <div className="flex-1 relative h-full">
                <InfrastructureMap reports={reports} />

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
