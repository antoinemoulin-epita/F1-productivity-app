/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: ["@untitledui/icons"],
    },
    async redirects() {
        return [
            {
                source: "/dashboard",
                destination: "/overview",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
