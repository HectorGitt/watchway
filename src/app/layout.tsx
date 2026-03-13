import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

const outfit = Outfit({
	subsets: ["latin"],
	variable: "--font-outfit",
	display: "swap",
});

export const viewport: Viewport = {
	themeColor: "#050A18",
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
};

export const metadata: Metadata = {
	title: "WatchWay Nigeria | Infrastructure Map",
	description:
		"A nationwide crowdsourced registry to document and track the decay of federal and state infrastructure.",
	icons: {
		icon: [
			{ url: "/favicon.ico" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
		],
		apple: [{ url: "/apple-touch-icon.png" }],
	},
	manifest: "/site.webmanifest",
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
				{/* PWA Service Worker Registration */}
				<Script id="pwa-register" strategy="afterInteractive">
					{`
                                  if ('serviceWorker' in navigator) {
                                    window.addEventListener('load', function() {
                                      navigator.serviceWorker.register('/sw.js').then(function(registration) {
                                        console.log('ServiceWorker registration successful');
                                      }, function(err) {
                                        console.log('ServiceWorker registration failed: ', err);
                                      });
                                    });
                                  }
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
