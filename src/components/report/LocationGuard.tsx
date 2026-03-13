"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface LocationGuardProps {
	onLocationAcquired: (coords: { lat: number; lng: number }) => void;
	children: React.ReactNode;
}

export function LocationGuard({
	onLocationAcquired,
	children,
}: LocationGuardProps) {
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error" | "outside_region"
	>("idle");
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
	const [waitlistEmail, setWaitlistEmail] = useState("");
	const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);

	const isLagos = (lat: number, lng: number) =>
		lat >= 6.3 && lat <= 6.8 && lng >= 3.0 && lng <= 4.0;
	const isIbadan = (lat: number, lng: number) =>
		lat >= 7.15 && lat <= 7.6 && lng >= 3.6 && lng <= 4.15;

	const requestLocation = () => {
		setStatus("loading");
		setErrorMsg(null);

		if (!navigator.geolocation) {
			setErrorMsg("Geolocation is not supported by your browser.");
			setStatus("error");
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const lat = position.coords.latitude;
				const lng = position.coords.longitude;

				if (isLagos(lat, lng) || isIbadan(lat, lng)) {
					onLocationAcquired({ lat, lng });
					setStatus("success");
				} else {
					setStatus("outside_region");
				}
			},
			(err) => {
				console.error("Geo Error:", err);
				setErrorMsg("Weak GPS Signal. Please move outdoors.");
				setStatus("error");
			},
			{ enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
		);
	};

	if (status === "success") {
		return <>{children}</>;
	}

	if (status === "outside_region") {
		return (
			<div className="p-8 text-center bg-surface border border-white/5 rounded-2xl">
				<div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
					<MapPin className="h-8 w-8" />
				</div>
				<h3 className="text-xl font-bold mb-2">
					Coming Soon to Your State!
				</h3>
				<p className="text-gray-400 mb-2 font-semibold">
					Watchway is currently live only in Lagos and Ibadan.
				</p>
				<p className="text-gray-500 text-sm mb-6">
					Join the waitlist to be notified first when we expand to
					your region.
				</p>
				{waitlistSubmitted ? (
					<div className="bg-green-500/10 text-green-500 p-4 rounded-lg border border-green-500/20">
						<p className="font-bold">You're on the list!</p>
						<p className="text-sm mt-1">
							We'll email you when Watchway arrives in your area.
						</p>
					</div>
				) : (
					<form
						onSubmit={async (e) => {
							e.preventDefault();
							setIsSubmittingWaitlist(true);
							try {
								await api.joinWaitlist(waitlistEmail);
								setWaitlistSubmitted(true);
							} catch (err) {
								setErrorMsg(
									"Failed to join waitlist. Please try again.",
								);
							} finally {
								setIsSubmittingWaitlist(false);
							}
						}}
						className="space-y-4"
					>
						<input
							type="email"
							required
							value={waitlistEmail}
							onChange={(e) => setWaitlistEmail(e.target.value)}
							placeholder="Enter your email address"
							className="w-full bg-surface-highlight border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
						/>
						<Button
							type="submit"
							size="lg"
							className="w-full"
							disabled={isSubmittingWaitlist}
						>
							{isSubmittingWaitlist
								? "Joining..."
								: "Join Waitlist"}
						</Button>
					</form>
				)}
			</div>
		);
	}

	return (
		<div className="p-8 text-center bg-surface border border-white/5 rounded-2xl">
			<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
				<MapPin className="h-8 w-8" />
			</div>

			<h3 className="text-xl font-bold mb-2">Location Required</h3>
			<p className="text-gray-400 mb-6">
				The "Trust Protocol" requires exact GPS coordinates to verify
				your report.
			</p>

			{errorMsg && (
				<p className="text-red-500 bg-red-900/10 p-3 rounded-lg mb-4 text-sm font-medium">
					{errorMsg}
				</p>
			)}

			<Button
				onClick={requestLocation}
				disabled={status === "loading"}
				size="lg"
				className="w-full"
			>
				{status === "loading" ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Acquiring Satellite Fix...
					</>
				) : (
					"Enable Location Access"
				)}
			</Button>
		</div>
	);
}
