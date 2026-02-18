"use client";

import { useEffect, useState } from "react";
import { MapContainer as PacketMap, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Report } from "@/lib/types";

// Fix Leaflet's default icon issue in Next.js
const fixLeafletIcon = () => {
    // We will use custom DivIcons, so this might not be strictly necessary, 
    // but good for fallbacks.
    // L.Icon.Default.mergeOptions({...})
};

interface MapProps {
    reports: Report[];
    initialCenter?: [number, number];
    initialZoom?: number;
}

// Custom Pins (using CSS classes for colors)
const createIcon = (jurisdiction: string) => {
    const colorClass = jurisdiction === 'FEDERAL' ? 'bg-red-600' : 'bg-orange-500';
    return L.divIcon({
        className: 'custom-icon',
        html: `<div class="${colorClass} w-6 h-6 rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
};

// Internal component to handle Map interactions
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FlyToMarker = ({ report }: { report: Report }) => {
    const map = useMap();
    return (
        <Marker
            position={[report.location.lat, report.location.lng]}
            icon={createIcon(report.jurisdiction)}
            eventHandlers={{
                click: () => {
                    map.flyTo([report.location.lat, report.location.lng], 16, {
                        duration: 1.5
                    });
                },
            }}
        >
            <Popup className="glass-popup">
                <div className="p-1 min-w-[150px]">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white mb-2 inline-block ${report.jurisdiction === 'FEDERAL' ? 'bg-red-600' : 'bg-orange-500'}`}>
                        {report.jurisdiction}
                    </span>
                    <h3 className="font-bold text-white text-sm">{report.title}</h3>
                    <p className="text-xs text-gray-300 my-1">{report.description}</p>
                    <p className="text-[10px] text-gray-500 mb-2">{report.location.address}</p>

                    <Link href={`/hazards/${report.id}`} className="block">
                        <div className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-1.5 px-3 rounded text-center transition-colors flex items-center justify-center gap-1">
                            View Details <ArrowRight className="h-3 w-3" />
                        </div>
                    </Link>
                </div>
            </Popup>
        </Marker>
    );
};

// Controller to handle map state changes from outside
const MapController = ({ focusLocation }: { focusLocation: { lat: number, lng: number } | null }) => {
    const map = useMap();

    useEffect(() => {
        if (focusLocation) {
            map.flyTo([focusLocation.lat, focusLocation.lng], 16, {
                duration: 1.5
            });
        }
    }, [focusLocation, map]);

    return null;
};

export default function InfrastructureMap({
    reports,
    initialCenter = [6.5244, 3.3792], // Default to Lagos
    initialZoom = 11,
    focusLocation = null
}: MapProps & { focusLocation?: { lat: number, lng: number } | null }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-full h-full bg-surface-highlight animate-pulse flex items-center justify-center text-gray-500">Loading Map...</div>;
    }

    return (
        <PacketMap
            key={`${initialCenter[0]}-${initialCenter[1]}-${initialZoom}`}
            center={initialCenter}
            zoom={initialZoom}
            scrollWheelZoom={true}
            className="w-full h-full z-0"
            style={{ width: "100%", height: "100%" }}
        >
            {/* Dark Mode Map Style (CartoDB Dark Matter) */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {reports.filter(r => r.location && r.location.lat && r.location.lng).map((report) => (
                <FlyToMarker key={report.id} report={report} />
            ))}
            <MapController focusLocation={focusLocation} />
        </PacketMap>
    );
}
