import { Report } from "@/lib/types";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MapSidebarProps {
	reports: Report[];
	onReportClick?: (report: Report) => void;
}

export function MapSidebar({ reports, onReportClick }: MapSidebarProps) {
	const criticalCount = reports.filter((r) => r.severity_level >= 8).length;

	return (
		<div className="w-full md:w-96 bg-surface h-[35vh] md:h-full border-r border-white/5 flex flex-col z-10 glass shrink-0">
			<div className="p-4 md:p-6 border-b border-white/5 shrink-0 hidden md:block">
				<Link href="/" className="flex items-center gap-2 mb-6 group">
					<span className="text-xl font-bold text-white">
						WatchWay<span className="text-primary">.NG</span>
					</span>
				</Link>

				<h1 className="text-2xl font-bold mb-2">Live Hazard Map</h1>
				<p className="text-gray-400 text-sm">
					Real-time infrastructure decay tracking across Nigeria.
				</p>
			</div>

			<div className="p-4 border-b border-white/5 bg-red-900/10">
				<div className="flex items-center justify-between">
					<span className="text-red-500 font-bold text-sm flex items-center gap-2">
						<AlertTriangle className="h-4 w-4" /> Critical Hazards
					</span>
					<span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
						{criticalCount}
					</span>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				<h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
					Recent Reports
				</h3>
				{reports.map((report) => (
					<div
						key={report.id}
						onClick={() => {
							if (
								report.location &&
								report.location.lat &&
								report.location.lng
							) {
								onReportClick?.(report);
							}
						}}
						className="p-4 rounded-lg bg-white/5 border border-white/5 hover:border-primary/50 transition-all cursor-pointer group hover:bg-white/10"
					>
						<div className="flex justify-between items-start mb-2">
							<span
								className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${report.jurisdiction === "FEDERAL" || report.jurisdiction?.toUpperCase() === "LAGOS" ? "bg-red-600" : "bg-orange-500"}`}
							>
								{report.jurisdiction === "FEDERAL"
									? "LAGOS"
									: report.jurisdiction === "STATE"
										? "IBADAN"
										: report.jurisdiction}
							</span>
							<span className="text-[10px] text-gray-500">
								{new Date(
									report.created_at,
								).toLocaleDateString()}
							</span>
						</div>
						<h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">
							{report.title}
						</h4>
						<p className="text-xs text-gray-400 line-clamp-2">
							{report.description}
						</p>
					</div>
				))}
			</div>

			<div className="p-4 border-t border-white/5 space-y-3">
				<Link href="/report">
					<Button className="w-full">Report New Hazard</Button>
				</Link>
				<Link href="/leaderboard">
					<Button variant="outline" className="w-full">
						View Database Dashboard
					</Button>
				</Link>
			</div>
		</div>
	);
}
