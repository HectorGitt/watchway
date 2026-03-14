import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async redirects() {
		return [
			{
				source: "/:path*",
				has: [
					{
						type: "host",
						value: "://stabilty.com",
					},
				],
				destination: "https://watchway.org*",
				permanent: true,
			},
			{
				source: "/:path*",
				has: [
					{
						type: "host",
						value: "watchway.netlify.app",
					},
				],
				destination: "https://watchway.org*",
				permanent: true,
			},
		];
	},
};

module.exports = nextConfig;
