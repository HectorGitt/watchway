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
		loading: () => (
			<div className="w-full h-full bg-surface-highlight animate-pulse flex items-center justify-center text-gray-500">
				Loading Map Engine...
			</div>
		),
	},
);

export default function MapPage() {
	const [reports, setReports] = useState<Report[]>([]);
	const [loading, setLoading] = useState(true);
	const [focusLocation, setFocusLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);

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
		setFocusLocation({
			lat: report.location.lat,
			lng: report.location.lng,
		});
	};

	return (
		<div className="flex flex-col-reverse md:flex-row h-[100dvh] w-screen overflow-hidden bg-background text-foreground">
			{/* Sidebar with Stats */}
			<MapSidebar reports={reports} onReportClick={handleReportClick} />

			{/* Main Map Area */}
			<div className="flex-1 relative h-[65vh] md:h-full">
				<InfrastructureMap
					reports={reports}
					focusLocation={focusLocation}
				/>
			</div>
		</div>
	);
}
