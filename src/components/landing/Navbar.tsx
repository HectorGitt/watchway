"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, User, ShieldCheck, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function Navbar() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			const token = localStorage.getItem("token");
			if (token) {
				setIsLoggedIn(true);
				try {
					const profile = await api.getProfile();
					console.log("Navbar: Profile loaded:", profile);
					if (profile.role === "admin") {
						console.log("Navbar: User is admin");
						setIsAdmin(true);
					} else {
						console.log("Navbar: User is NOT admin", profile.role);
					}
				} catch (e) {
					console.error("Failed to fetch profile", e);
				}
			} else {
				console.log("Navbar: No token found");
			}
		};
		checkAuth();
	}, []);

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
			<div className="container mx-auto px-4 h-20 flex items-center justify-between">
				<Link href="/" className="flex items-center gap-2 group">
					<img
						src="/android-chrome-192x192.png"
						alt="Watchway Logo"
						className="h-8 w-8"
					/>
					<span className="text-2xl font-bold text-white">
						WatchWay<span className="text-primary">.ORG</span>
					</span>
				</Link>

				<div className="hidden md:flex items-center gap-8">
					<Link
						href="/map"
						className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
					>
						Live Map
					</Link>
					<Link
						href="/hazards"
						className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
					>
						Database
					</Link>
					<Link
						href="/leaderboard"
						className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
					>
						Leaderboard
					</Link>
					{isAdmin && (
						<Link
							href="/admin"
							className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
						>
							<ShieldCheck className="h-4 w-4" />
							Admin Panel
						</Link>
					)}
				</div>

				<div className="flex items-center gap-4">
					{isLoggedIn ? (
						<Link href="/profile">
							<Button
								variant="ghost"
								size="sm"
								className="hidden sm:inline-flex gap-2"
							>
								<User className="h-4 w-4" />
								My Profile
							</Button>
						</Link>
					) : (
						<Link href="/login">
							<Button
								variant="ghost"
								size="sm"
								className="hidden sm:inline-flex"
							>
								Sign In
							</Button>
						</Link>
					)}

					<Link href="/report">
						<Button
							size="sm"
							className="shadow-lg shadow-orange-900/20"
						>
							Report Hazard
						</Button>
					</Link>

					{/* Mobile Menu Toggle */}
					<button
						className="md:hidden p-2 text-gray-400 hover:text-white"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					>
						{isMobileMenuOpen ? (
							<X className="h-6 w-6" />
						) : (
							<Menu className="h-6 w-6" />
						)}
					</button>
				</div>
			</div>

			{/* Mobile Menu Dropdown */}
			{isMobileMenuOpen && (
				<div className="md:hidden absolute top-20 left-0 right-0 bg-[#0a0a0a] border-b border-white/5 p-4 flex flex-col space-y-4 shadow-2xl z-50">
					<Link
						href="/map"
						onClick={() => setIsMobileMenuOpen(false)}
						className="text-base font-medium text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5"
					>
						Live Map
					</Link>
					<Link
						href="/hazards"
						onClick={() => setIsMobileMenuOpen(false)}
						className="text-base font-medium text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5"
					>
						Database
					</Link>
					<Link
						href="/leaderboard"
						onClick={() => setIsMobileMenuOpen(false)}
						className="text-base font-medium text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5"
					>
						Leaderboard
					</Link>
					{isAdmin && (
						<Link
							href="/admin"
							onClick={() => setIsMobileMenuOpen(false)}
							className="text-base font-medium text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-white/5 flex items-center gap-2"
						>
							<ShieldCheck className="h-5 w-5" /> Admin Panel
						</Link>
					)}

					<div className="h-px bg-white/10 w-full my-2"></div>

					{isLoggedIn ? (
						<Link
							href="/profile"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							<Button
								variant="outline"
								className="w-full justify-start gap-2"
							>
								<User className="h-4 w-4" /> My Profile
							</Button>
						</Link>
					) : (
						<Link
							href="/login"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							<Button
								variant="outline"
								className="w-full justify-start"
							>
								Sign In
							</Button>
						</Link>
					)}
				</div>
			)}
		</nav>
	);
}
