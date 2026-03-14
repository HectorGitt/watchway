import Link from "next/link";

export function Footer() {
	return (
		<footer className="py-12 border-t border-white/5 bg-surface text-center md:text-left">
			<div className="container mx-auto px-4">
				<div className="grid md:grid-cols-4 gap-8 mb-8">
					<div>
						<div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
							<img
								src="/android-chrome-192x192.png"
								alt="Watchway Logo"
								className="h-6 w-6"
							/>
							<span className="text-xl font-bold text-white block">
								WatchWay
								<span className="text-primary">.ORG</span>
							</span>
						</div>
						<p className="text-gray-500 text-sm">
							Documenting the decay. Demanding the fix. A national
							crowdsourced initiative.
						</p>
					</div>
					{/* Links could go here */}
				</div>
				<div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
					<p className="text-gray-600 text-sm">
						© {new Date().getFullYear()} WatchWay Nigeria. Open Data
						for Public Good.
					</p>
					<div className="flex gap-4 mt-4 md:mt-0">
						<Link
							href="/privacy"
							className="text-gray-600 hover:text-white text-sm"
						>
							Privacy
						</Link>
						<a
							href="#"
							className="text-gray-600 hover:text-white text-sm"
						>
							Terms
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
