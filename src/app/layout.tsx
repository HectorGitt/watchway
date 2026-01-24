import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WatchWay Nigeria | Infrastructure Map",
  description: "A nationwide crowdsourced registry to document and track the decay of federal and state infrastructure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased selection:bg-primary selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
