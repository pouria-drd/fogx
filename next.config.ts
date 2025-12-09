import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
	basePath: basePath,

	output: "standalone",

	typedRoutes: true,

	reactCompiler: true,

	cacheComponents: false,

	reactStrictMode: process.env.NODE_ENV === "development",

	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "127.0.0.1",
			},
			{
				protocol: "https",
				hostname: "localhost",
			},
		],
	},
};

export default nextConfig;
