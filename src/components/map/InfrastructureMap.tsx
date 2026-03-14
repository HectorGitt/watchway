"use client";

import { useEffect, useState } from "react";
import {
	MapContainer as PacketMap,
	TileLayer,
	Marker,
	Popup,
	useMap,
} from "react-leaflet";
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

const getHazardIconHTML = (title: string, jurisdiction?: string) => {
	// Assuming jurisdiction might still be FEDERAL/STATE from backend, but mapped to Lagos/Ibadan colors.
	// Or if jurisdiction actually comes as 'LAGOS'/'IBADAN', we handle both.
	const isLagos =
		jurisdiction === "FEDERAL" || jurisdiction?.toUpperCase() === "LAGOS";
	const colorClass = isLagos ? "text-red-500" : "text-orange-500";

	// Determine icon based on title (hazard type)
	let iconSvg = "";
	const lowerTitle = title.toLowerCase();

	if (lowerTitle.includes("pothole") || lowerTitle.includes("crater")) {
		// Pothole icon
		iconSvg = `<svg xmlns="http://www.apache.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a4 4 0 0 0 7.33 2.01"/><path d="M21.5 13c-2.4 0-4.5 1.5-5.5 3.5"/><path d="M12 13c-2.4 0-4.5 1.5-5.5 3.5"/><path d="M2.5 13c2.4 0 4.5 1.5 5.5 3.5"/></svg>`;
	} else if (
		lowerTitle.includes("erosion") ||
		lowerTitle.includes("washout")
	) {
		// Erosion icon
		iconSvg = `<svg xmlns="http://www.apache.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="M12 12v8"/><path d="M8 12v8"/><path d="M16 12v8"/></svg>`;
	} else if (lowerTitle.includes("bridge")) {
		// Bridge icon
		iconSvg = `<svg xmlns="http://www.apache.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v6"/><path d="M9 16v6"/><path d="M15 16v6"/><path d="M20 16v6"/><path d="M2 16h20"/><path d="M2 12c4 0 4-4 10-4s6 4 10 4"/></svg>`;
	} else if (lowerTitle.includes("manhole")) {
		// Manhole icon
		iconSvg = `<svg xmlns="http://www.apache.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 22a10 10 0 0 1-10-10"/><circle cx="12" cy="12" r="4"/></svg>`;
	} else if (
		lowerTitle.includes("drainage") ||
		lowerTitle.includes("flood")
	) {
		// Flooding icon
		iconSvg = `<svg xmlns="http://www.apache.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h20"/><path d="M2 22h20"/><path d="M12 14v4"/><path d="M8 14v4"/><path d="M16 14v4"/><path d="M12 8c-2.4 0-4.5 1.5-5.5 3.5"/><path d="M21.5 8c-2.4 0-4.5 1.5-5.5 3.5"/><path d="M2.5 8c2.4 0 4.5 1.5 5.5 3.5"/></svg>`;
	} else if (lowerTitle.includes("pole") || lowerTitle.includes("light")) {
		// Collapsed pole icon
		iconSvg = `<svg xmlns="http://www.apache.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16"/><path d="M12 22V7"/><path d="M12 7l-4-4"/><path d="M12 7l4-4"/><path d="m8 3 8 8"/></svg>`;
	} else {
		// Default hazard (triangle alert)
		iconSvg = `<svg xmlns="http://www.apache.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`;
	}

	return `<div class="${colorClass} drop-shadow-lg flex items-center justify-center">
        ${iconSvg}
    </div>`;
};

// Custom Pins (using CSS classes for colors)
const createIcon = (title: string, jurisdiction?: string) => {
	return L.divIcon({
		className: "custom-icon bg-transparent border-0",
		html: getHazardIconHTML(title, jurisdiction),
		iconSize: [24, 24],
		iconAnchor: [12, 12],
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
			icon={createIcon(report.title, report.jurisdiction)}
			eventHandlers={{
				click: () => {
					map.flyTo([report.location.lat, report.location.lng], 16, {
						duration: 1.5,
					});
				},
			}}
		>
			<Popup className="glass-popup">
				<div className="p-1 min-w-[150px]">
					<span
						className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white mb-2 inline-block ${report.jurisdiction === "FEDERAL" || report.jurisdiction?.toUpperCase() === "LAGOS" ? "bg-red-600" : "bg-orange-500"}`}
					>
						{report.jurisdiction === "FEDERAL"
							? "LAGOS"
							: report.jurisdiction === "STATE"
								? "IBADAN"
								: report.jurisdiction}
					</span>
					<h3 className="font-bold text-white text-sm">
						{report.title}
					</h3>
					<p className="text-xs text-gray-300 my-1">
						{report.description}
					</p>
					<p className="text-[10px] text-gray-500 mb-2">
						{report.location.address}
					</p>

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
const MapController = ({
	focusLocation,
}: {
	focusLocation: { lat: number; lng: number } | null;
}) => {
	const map = useMap();

	useEffect(() => {
		if (focusLocation) {
			map.flyTo([focusLocation.lat, focusLocation.lng], 16, {
				duration: 1.5,
			});
		}
	}, [focusLocation, map]);

	return null;
};

export default function InfrastructureMap({
	reports,
	initialCenter = [6.8, 3.6], // Centered between Lagos and Ibadan
	initialZoom = 9,
	focusLocation = null,
}: MapProps & { focusLocation?: { lat: number; lng: number } | null }) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="w-full h-full bg-surface-highlight animate-pulse flex items-center justify-center text-gray-500">
				Loading Map...
			</div>
		);
	}

	return (
		<PacketMap
			center={initialCenter}
			zoom={initialZoom}
			scrollWheelZoom={true}
			className="w-full h-full z-0"
			style={{ width: "100%", height: "100%" }}
		>
			{/* Customized High-Contrast Dark Mode Map */}
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				className="dark-map-tiles"
			/>

			{reports
				.filter((r) => r.location && r.location.lat && r.location.lng)
				.map((report) => (
					<FlyToMarker key={report.id} report={report} />
				))}
			<MapController focusLocation={focusLocation} />
		</PacketMap>
	);
}
