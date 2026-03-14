"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/landing/Navbar";

export function SharedNavbar() {
	const pathname = usePathname();

	// Do not show the navigation bar on these specific root routes
	const noNavPaths = ["/login", "/map", "/admin", "/report"];

	// Explicitly check if the current path starts with any of the excluded routes
	const isHidden =
		pathname === null ||
		noNavPaths.some((path) => pathname.startsWith(path));

	if (isHidden) {
		return null;
	}

	return <Navbar />;
}
