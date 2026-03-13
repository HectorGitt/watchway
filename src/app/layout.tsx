import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

const outfit = Outfit({
	subsets: ["latin"],
	variable: "--font-outfit",
	display: "swap",
});

export const metadata: Metadata = {
	title: "WatchWay Nigeria | Infrastructure Map",
	description:
		"A nationwide crowdsourced registry to document and track the decay of federal and state infrastructure.",
};

import Script from "next/script";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				{/* Google Analytics (gtag.js) */}
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-T7SR7G3ST4"
					strategy="afterInteractive"
				/>
				<Script id="google-analytics" strategy="afterInteractive">
					{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-T7SR7G3ST4');
          `}
				</Script>
			</head>
			<body
				className={`${outfit.variable} antialiased selection:bg-primary selection:text-white`}
			>
				<GoogleOAuthProvider
					clientId={
						process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
						"your-google-client-id"
					}
				>
					{children}
					<Toaster richColors position="top-right" theme="dark" />
				</GoogleOAuthProvider>
			</body>
		</html>
	);
}
