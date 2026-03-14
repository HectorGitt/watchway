import { Report } from "@/lib/types";
import { AlertTriangle, Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MapSidebarProps {
	reports: Report[];
	onReportClick?: (report: Report) => void;
}

export function MapSidebar({ reports, onReportClick }: MapSidebarProps) {
	const criticalCount = reports.filter((r) => r.severity_level >= 8).length;
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<>
			{/* Mobile Header Bar */}
			<div className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-white/5 shrink-0 z-50 relative">
				<Link href="/" className="flex items-center gap-2 group">
					<span className="text-xl font-bold text-white">
						WatchWay<span className="text-primary">.NG</span>
					</span>
				</Link>

				<button
					className="p-2 text-gray-400 hover:text-white"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
				>
					{isMobileMenuOpen ? (
						<X className="h-6 w-6" />
					) : (
						<Menu className="h-6 w-6" />
					)}
				</button>
			</div>

			{/* Mobile Menu Dropdown */}
			{isMobileMenuOpen && (
				<div className="md:hidden absolute top-[73px] left-0 right-0 bg-[#0a0a0a] border-b border-white/5 p-4 flex flex-col space-y-4 shadow-2xl z-[100]">
					<Link
						href="/"
						onClick={() => setIsMobileMenuOpen(false)}
						className="text-sm font-medium text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
					>
						Home
					</Link>
					<Link
						href="/hazards"
						onClick={() => setIsMobileMenuOpen(false)}
						className="text-sm font-medium text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
					>
						Database
					</Link>
					<Link
						href="/leaderboard"
						onClick={() => setIsMobileMenuOpen(false)}
						className="text-sm font-medium text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
					>
						Leaderboard
					</Link>
					<Link
						href="/profile"
						onClick={() => setIsMobileMenuOpen(false)}
						className="text-sm font-medium text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
					>
						My Profile
					</Link>
				</div>
			)}

			<div className="w-full md:w-96 bg-surface flex-1 md:h-full border-r border-white/5 flex flex-col z-10 glass shrink-0 relative overflow-hidden">
				<div className="p-4 md:p-6 border-b border-white/5 shrink-0 hidden md:block">
					<Link
						href="/"
						className="flex items-center gap-2 mb-6 group"
					>
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
							<AlertTriangle className="h-4 w-4" /> Critical
							Hazards
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
					<Link href="/hazards">
						<Button variant="outline" className="w-full">
							View Database Dashboard
						</Button>
					</Link>
				</div>
			</div>
		</>
	);
}
