import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function PrivacyPolicy() {
	return (
		<main className="min-h-screen flex flex-col bg-background text-foreground">
			<Navbar />
			<div className="flex-1 container mx-auto px-4 py-32 max-w-4xl">
				<h1 className="text-4xl md:text-5xl font-bold mb-6">
					Privacy Policy
				</h1>
				<p className="text-gray-400 mb-12">Last Updated: March 2024</p>

				<div className="space-y-12 text-gray-300">
					<section>
						<h2 className="text-2xl font-bold text-white mb-4">
							1. Introduction
						</h2>
						<p className="leading-relaxed">
							Welcome to WatchWay Nigeria ("WatchWay", "we",
							"our", "us"). We respect your privacy and are
							committed to protecting your personal data. This
							privacy policy will inform you as to how we look
							after your personal data when you visit our website
							(regardless of where you visit it from) and tell you
							about your privacy rights and how the law protects
							you.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold text-white mb-4">
							2. The Data We Collect
						</h2>
						<p className="leading-relaxed mb-4">
							We may collect, use, store, and transfer different
							kinds of personal data about you which we have
							grouped together as follows:
						</p>
						<ul className="list-disc pl-6 space-y-2">
							<li>
								<strong>Identity Data</strong> includes your
								email address (via Google Single Sign-On). We
								never collect or store your password if you log
								in through Google.
							</li>
							<li>
								<strong>Location Data</strong> includes exact
								GPS coordinates (Latitude and Longitude)
								collected <em>only</em> when you explicitly
								submit or verify a hazard report. We do not
								track your location continuously in the
								background.
							</li>
							<li>
								<strong>Media Data</strong> includes live
								photographs of hazards taken via your device
								camera. Metadata linked to these images may be
								processed to verify the authenticity of the
								report.
							</li>
							<li>
								<strong>Device Data</strong> includes anonymized
								device identifiers used strictly as an
								anti-fraud mechanism to prevent single users
								from verifying their own hazard reports.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold text-white mb-4">
							3. How We Use Your Data
						</h2>
						<p className="leading-relaxed mb-4">
							We will only use your personal data when the law
							allows us to. Most commonly, we will use your
							personal data in the following circumstances:
						</p>
						<ul className="list-disc pl-6 space-y-2">
							<li>
								To crowdsource and verify public infrastructure
								decay across Nigeria.
							</li>
							<li>
								To assign "Civic Points" to your account based
								on your verified contributions to the platform.
							</li>
							<li>
								To broadcast verified hazards to public social
								media accounts (e.g., our automated X/Twitter
								bot) in order to alert relevant government
								agencies and the general public.{" "}
								<strong>Note:</strong> Public social media
								broadcasts only include the hazard location,
								type, and severity. Your personal account
								identity is never broadcast.
							</li>
							<li>
								To secure the platform against sybil attacks
								(e.g., using device IDs to prevent a user from
								voting multiple times).
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold text-white mb-4">
							4. Data Sharing and Third Parties
						</h2>
						<p className="leading-relaxed mb-4">
							Because WatchWay is an open data civic platform,
							hazard reports (including the image of the hazard
							and its coordinates) are publicly visible. However,
							your account details (email and personal identity)
							are strictly restricted and{" "}
							<strong>never sold</strong> to advertisers.
						</p>
						<p className="leading-relaxed">
							We use the following third-party infrastructure:
						</p>
						<ul className="list-disc pl-6 space-y-2 mt-4">
							<li>
								<strong>Google Cloud Storage</strong> to
								securely store photographic evidence.
							</li>
							<li>
								<strong>Supabase</strong> to host our underlying
								PostgreSQL records securely.
							</li>
							<li>
								<strong>X (Twitter) API</strong> strictly as a
								one-way notification broadcast when 3
								independent citizens scientifically verify a
								hazard. We do not read or process your personal
								social media feeds.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold text-white mb-4">
							5. Data Retention
						</h2>
						<p className="leading-relaxed">
							We will only retain your personal data for as long
							as necessary to fulfill the purposes we collected it
							for, including for the purposes of satisfying any
							legal, accounting, or reporting requirements. Public
							hazard photos and geospatial data may be retained
							indefinitely to build a historical record of
							infrastructure decay and repair times.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold text-white mb-4">
							6. Your Legal Rights
						</h2>
						<p className="leading-relaxed">
							Under certain circumstances, you have rights under
							data protection laws in relation to your personal
							data. This includes the right to request access,
							correction, erasure, restriction, transfer, or to
							object to processing.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold text-white mb-4">
							7. Contact Us
						</h2>
						<p className="leading-relaxed">
							If you have any questions about this privacy policy,
							including any requests to exercise your legal
							rights, please contact us at{" "}
							<strong>info@stabilty.com</strong>.
						</p>
					</section>
				</div>
			</div>
			<Footer />
		</main>
	);
}
