import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function TermsOfService() {
	return (
		<main className="min-h-screen flex flex-col bg-background text-foreground">
			<Navbar />
			<div className="flex-1 container mx-auto px-4 py-32 max-w-4xl">
				<h1 className="text-4xl md:text-5xl font-bold mb-6">
					Terms of Service
				</h1>
				<p className="text-gray-400 mb-12">Last Updated: March 2026</p>

				<div className="space-y-12 text-gray-300">
					<section>
						<h2 className="text-2xl font-bold text-white mb-4">
							1. Acceptance of Terms
						</h2>
						<p className="leading-relaxed">
							By accessing or using WatchWay.org ("WatchWay",
							"we", "our", "us"), you agree to be bound by these
							Terms of Service. If you do not agree to these
							terms, please do not use our platform.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold text-white mb-4">
							2. User Content and Reporting
						</h2>
						<p className="leading-relaxed mb-4">
							WatchWay relies on crowdsourced data to track and
							monitor infrastructure decay. When submitting a
							report, you agree:
						</p>
						<ul className="list-disc pl-6 space-y-2">
							<li>
								To provide accurate, truthful, and current
								information.
							</li>
							<li>
								Not to upload offensive, inappropriate, or
								irrelevant images.
							</li>
							<li>
								That any data, images, or details submitted
								become part of the public domain database under
								WatchWay’s open-data initiative.
							</li>
							<li>
								You have the necessary rights and permissions to
								share the photos and location data you submit.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold text-white mb-4">
							3. Platform Usage
						</h2>
						<p className="leading-relaxed mb-4">
							Our services are provided on an "AS IS" and "AS
							AVAILABLE" basis. You agree NOT to:
						</p>
						<ul className="list-disc pl-6 space-y-2">
							<li>Use the platform for any unlawful purpose.</li>
							<li>
								Attempt to hack, destabilize, or spam the
								reporting system.
							</li>
							<li>
								Scrape, mine, or exploit our dataset without
								proper attribution to WatchWay.org.
							</li>
							<li>
								Impersonate any government official, WatchWay
								staff, or other users.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold text-white mb-4">
							4. Limitation of Liability
						</h2>
						<p className="leading-relaxed">
							WatchWay acts as an information conduit and is not
							responsible for the actual repair of reported
							hazards. We make no guarantees regarding the
							accuracy, completeness, or timeliness of
							user-generated reports. In no event shall WatchWay
							or its maintainers be liable for any damages arising
							from your use of the site or reliance on the data
							provided.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold text-white mb-4">
							5. Changes to the Terms
						</h2>
						<p className="leading-relaxed">
							We reserve the right to modify these Terms of
							Service at any time. We will notify users of any
							significant changes by updating the "Last Updated"
							date at the top of this page. Your continued use of
							WatchWay following such updates constitutes your
							acceptance of the revised Terms.
						</p>
					</section>
				</div>
			</div>
			<Footer />
		</main>
	);
}
